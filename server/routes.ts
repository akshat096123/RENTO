import express from 'express';
import { db } from './db.js';
import { RentoAIEngine } from './ai.js';
import { RentoEscrowService } from './escrow.js';
import { RentoLogisticsService } from './logistics.js';

export const router = express.Router();

/**
 * -------------------------------------------------------------
 * 1. USERS & PERSONAS
 * -------------------------------------------------------------
 */
router.get('/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users ORDER BY id ASC').all();
  res.json(users);
});

router.get('/users/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.post('/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user) {
    // If exact email not found, search by name prefix or pick first matching
    user = db.prepare('SELECT * FROM users WHERE email LIKE ? OR name LIKE ? LIMIT 1').get(`%${email}%`, `%${email}%`) as any;
  }
  if (!user) {
    // Default to Aarav if not found
    user = db.prepare('SELECT * FROM users WHERE id = ?').get('usr_aarav') as any;
  }
  res.json({ user, token: 'rento_session_' + Date.now() });
});

router.post('/auth/signup', (req, res) => {
  const { name, email, role = 'renter' } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  
  const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.json({ user: existing, token: 'rento_session_' + Date.now() });
  }

  const id = 'usr_' + Date.now();
  db.prepare(`
    INSERT INTO users (id, name, email, phone, role, avatar, city, rating, total_rentals, is_verified, kyc_status)
    VALUES (?, ?, ?, '+91 98765 00000', ?, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'Delhi NCR', 5.0, 0, 1, 'VERIFIED')
  `).run(id, name, email, role);

  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  res.json({ user: newUser, token: 'rento_session_' + Date.now() });
});

/**
 * -------------------------------------------------------------
 * 2. PRODUCTS CATALOG & LISTINGS
 * -------------------------------------------------------------
 */
router.get('/products', (req, res) => {
  const { category, search, maxPrice } = req.query;
  let query = 'SELECT p.*, u.name as owner_name, u.avatar as owner_avatar, u.rating as owner_rating FROM products p JOIN users u ON p.owner_id = u.id WHERE p.is_available = 1';
  const params: any[] = [];

  if (category && category !== 'All') {
    const catStr = String(category).trim();
    query += " AND (p.category LIKE ? OR ? LIKE '%' || p.category || '%' OR p.title LIKE ?)";
    params.push(`%${catStr}%`, catStr, `%${catStr}%`);
  }

  if (maxPrice) {
    query += ' AND p.daily_price <= ?';
    params.push(Number(maxPrice));
  }

  if (search) {
    query += ' AND (p.title LIKE ? OR p.brand LIKE ? OR p.model LIKE ? OR p.description LIKE ?)';
    const searchWildcard = `%${search}%`;
    params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard);
  }

  query += ' ORDER BY p.condition_score DESC, p.created_at DESC';

  const products = db.prepare(query).all(...params);
  res.json(products);
});

router.get('/products/:id', (req, res) => {
  const product = db.prepare(`
    SELECT p.*, u.name as owner_name, u.avatar as owner_avatar, u.rating as owner_rating, u.city as owner_city, u.phone as owner_phone
    FROM products p 
    JOIN users u ON p.owner_id = u.id 
    WHERE p.id = ?
  `).get(req.params.id);

  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/products', (req, res) => {
  const {
    owner_id = 'usr_bob',
    title,
    brand,
    model,
    category,
    description,
    specs,
    daily_price,
    deposit,
    images,
    serial_number,
    location = 'Delhi NCR'
  } = req.body;

  // Run AI Inspection on the title / image
  const aiInspection = RentoAIEngine.inspectProductImage(title || model || '', category);

  const id = 'prod_' + Date.now();
  db.prepare(`
    INSERT INTO products (
      id, owner_id, title, brand, model, category, description, specs, daily_price, deposit,
      condition_score, condition_notes, images, serial_number, authenticity_status, authenticity_notes, location
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    owner_id,
    title || `${aiInspection.detectedBrand} ${aiInspection.detectedModel}`,
    brand || aiInspection.detectedBrand,
    model || aiInspection.detectedModel,
    category || aiInspection.detectedCategory,
    description || `Verified rental listing in ${location}. Inspected by RENTO AI.`,
    JSON.stringify(specs || { inspectedBy: 'RENTO Vision AI' }),
    daily_price || aiInspection.recommendedPriceRange.sweetSpot,
    deposit || aiInspection.recommendedPriceRange.deposit,
    aiInspection.conditionScore,
    aiInspection.conditionNotes,
    JSON.stringify(images || ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80']),
    serial_number || `SN-${(brand || 'RENTO').toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
    aiInspection.authenticityStatus,
    aiInspection.authenticityNotes,
    location
  );

  const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.status(201).json({ product: created, aiInspection });
});

/**
 * -------------------------------------------------------------
 * 3. DEMAND-FIRST ENGINE: RENTAL REQUESTS & SMART DISTRIBUTION
 * -------------------------------------------------------------
 */
router.get('/requests', (req, res) => {
  const { renter_id, status } = req.query;
  let query = `
    SELECT r.*, u.name as renter_name, u.avatar as renter_avatar, u.rating as renter_rating,
    (SELECT COUNT(*) FROM request_offers WHERE request_id = r.id) as offer_count
    FROM rental_requests r
    JOIN users u ON r.renter_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (renter_id) {
    query += ' AND r.renter_id = ?';
    params.push(renter_id);
  }

  if (status) {
    query += ' AND r.status = ?';
    params.push(status);
  }

  query += ' ORDER BY r.created_at DESC';
  const requests = db.prepare(query).all(...params);
  res.json(requests);
});

router.get('/requests/:id', (req, res) => {
  const request = db.prepare(`
    SELECT r.*, u.name as renter_name, u.avatar as renter_avatar, u.phone as renter_phone
    FROM rental_requests r
    JOIN users u ON r.renter_id = u.id
    WHERE r.id = ?
  `).get(req.params.id);

  if (!request) return res.status(404).json({ error: 'Request not found' });

  const offers = db.prepare(`
    SELECT o.*, p.title as product_title, p.images as product_images, p.condition_score,
           u.name as owner_name, u.avatar as owner_avatar, u.rating as owner_rating
    FROM request_offers o
    JOIN products p ON o.product_id = p.id
    JOIN users u ON o.owner_id = u.id
    WHERE o.request_id = ?
    ORDER BY o.ai_suitability_score DESC
  `).all(req.params.id);

  res.json({ request, offers });
});

router.post('/requests', (req, res) => {
  const {
    renter_id = 'usr_alice',
    raw_prompt,
    category: manualCategory,
    budget_daily: manualBudget,
    duration_days: manualDays,
    location = 'Delhi NCR, India',
    start_date = '2026-10-10',
    end_date = '2026-10-13'
  } = req.body;

  // Execute AI Requirement Understanding
  const aiStructured = RentoAIEngine.parseRequirement(raw_prompt || manualCategory || 'Camera');

  const finalCategory = manualCategory || aiStructured.category;
  const finalBudget = manualBudget ? Number(manualBudget) : aiStructured.budgetDaily;
  const finalDays = manualDays ? Number(manualDays) : aiStructured.durationDays;

  const id = 'req_' + Date.now();
  db.prepare(`
    INSERT INTO rental_requests (
      id, renter_id, raw_prompt, category, purpose, specs_needed, budget_daily,
      start_date, end_date, duration_days, location, delivery_required, status, ai_structured_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    renter_id,
    raw_prompt || `Request for ${finalCategory}`,
    finalCategory,
    aiStructured.purpose,
    JSON.stringify(aiStructured.specsNeeded),
    finalBudget,
    start_date,
    end_date,
    finalDays,
    location,
    1,
    'OPEN',
    JSON.stringify(aiStructured)
  );

  // Update demand statistics
  db.prepare(`
    INSERT INTO demand_stats (category, search_count, request_count, avg_budget, trend_growth_percent)
    VALUES (?, 1, 1, ?, 25.0)
    ON CONFLICT(category) DO UPDATE SET
      request_count = request_count + 1,
      avg_budget = (avg_budget + excluded.avg_budget) / 2,
      trend_growth_percent = trend_growth_percent + 2.5,
      last_updated = CURRENT_TIMESTAMP
  `).run(finalCategory, finalBudget);

  const created = db.prepare('SELECT * FROM rental_requests WHERE id = ?').get(id);
  res.status(201).json({ request: created, aiStructured });
});

/**
 * -------------------------------------------------------------
 * 4. SUPPLIER OFFERS & AI SUITABILITY SCORING
 * -------------------------------------------------------------
 */
router.post('/requests/:id/offers', (req, res) => {
  const requestId = req.params.id;
  const {
    owner_id = 'usr_bob',
    product_id,
    offered_price,
    deposit,
    accessories = [],
    delivery_option = 'PLATFORM_DELIVERY',
    notes = 'Available with instant delivery'
  } = req.body;

  const request = db.prepare('SELECT * FROM rental_requests WHERE id = ?').get(requestId) as any;
  if (!request) return res.status(404).json({ error: 'Request not found' });

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id) as any;
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const offerPrice = offered_price ? Number(offered_price) : product.daily_price;
  const offerDeposit = deposit ? Number(deposit) : product.deposit;

  // Calculate AI Suitability Score (0-100%)
  const suitability = RentoAIEngine.calculateSuitability(request, product, {
    offered_price: offerPrice,
    accessories
  });

  const offerId = 'off_' + Date.now();
  db.prepare(`
    INSERT INTO request_offers (
      id, request_id, owner_id, product_id, offered_price, deposit, accessories,
      delivery_option, notes, status, ai_suitability_score, ai_suitability_reasons
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    offerId,
    requestId,
    owner_id,
    product_id,
    offerPrice,
    offerDeposit,
    JSON.stringify(accessories),
    delivery_option,
    notes,
    'PENDING',
    suitability.score,
    JSON.stringify(suitability.pros)
  );

  // Update request status to OFFERS_RECEIVED
  db.prepare("UPDATE rental_requests SET status = 'OFFERS_RECEIVED' WHERE id = ?").run(requestId);

  const createdOffer = db.prepare('SELECT * FROM request_offers WHERE id = ?').get(offerId);
  res.status(201).json({ offer: createdOffer, suitability });
});

/**
 * -------------------------------------------------------------
 * 5. OFFER ACCEPTANCE, DIGITAL AGREEMENT & ESCROW PAYMENT
 * -------------------------------------------------------------
 */
router.post('/offers/:id/accept', (req, res) => {
  const offerId = req.params.id;
  const offer = db.prepare('SELECT * FROM request_offers WHERE id = ?').get(offerId) as any;
  if (!offer) return res.status(404).json({ error: 'Offer not found' });

  const request = db.prepare('SELECT * FROM rental_requests WHERE id = ?').get(offer.request_id) as any;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(offer.product_id) as any;
  const owner = db.prepare('SELECT * FROM users WHERE id = ?').get(offer.owner_id) as any;
  const renter = db.prepare('SELECT * FROM users WHERE id = ?').get(request.renter_id) as any;

  // Mark offer ACCEPTED
  db.prepare("UPDATE request_offers SET status = 'ACCEPTED' WHERE id = ?").run(offerId);
  // Mark request ACCEPTED
  db.prepare("UPDATE rental_requests SET status = 'ACCEPTED' WHERE id = ?").run(offer.request_id);

  // Financial Breakdown for Escrow Buffer
  const rentalDays = request.duration_days || 3;
  const breakdown = RentoEscrowService.calculateBreakdown(offer.offered_price, rentalDays, offer.deposit, true);

  const rentalId = 'rnt_' + Date.now();
  const handoverOtp = String(Math.floor(1000 + Math.random() * 9000));
  const returnOtp = String(Math.floor(1000 + Math.random() * 9000));

  // Create Rental Record with status BUFFERED
  db.prepare(`
    INSERT INTO rentals (
      id, request_id, offer_id, product_id, renter_id, owner_id, start_date, end_date,
      rental_days, daily_rate, rental_total, deposit_amount, delivery_fee, platform_fee,
      total_amount, payment_status, deposit_status, rental_status, handover_otp, return_otp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    rentalId,
    request.id,
    offer.id,
    product.id,
    renter.id,
    owner.id,
    request.start_date,
    request.end_date,
    rentalDays,
    offer.offered_price,
    breakdown.rentalTotal,
    breakdown.depositAmount,
    breakdown.deliveryFee,
    breakdown.platformFee,
    breakdown.totalAmount,
    'BUFFERED',
    'HELD',
    'DISPATCHED',
    handoverOtp,
    returnOtp
  );

  // Generate Digital Rental Agreement
  const agreementId = 'agr_' + Date.now();
  const termsText = `RENTO DIGITAL RENTAL AGREEMENT
Product: ${product.title} (Brand: ${product.brand}, Model: ${product.model}, SN: ${product.serial_number || 'N/A'})
Renter: ${renter.name} (${renter.phone})
Owner / Supplier: ${owner.name} (${owner.phone})
Rental Duration: ${rentalDays} Days (${request.start_date} to ${request.end_date})
Daily Rate: ₹${offer.offered_price} | Total Rental: ₹${breakdown.rentalTotal}
Security Deposit: ₹${breakdown.depositAmount} (Securely protected in RENTO Escrow Buffer)
Delivery Method: Third-Party Porter Logistics Express (₹${breakdown.deliveryFee})
RENTO Platform Commission: 10% (₹${breakdown.platformFee})
Total Escrow Buffer: ₹${breakdown.totalAmount}

LEGAL RESPONSIBILITIES & TERMS:
1. Product condition has been pre-inspected by RENTO AI (Certified score: ${product.condition_score}/100).
2. Payment is buffered and protected. Rental fee is eligible for owner release ONLY upon renter OTP verification.
3. Renter shall maintain reasonable care. Normal cosmetic wear is expected. Major damage will be arbitrated via RENTO AI Condition Comparison.
4. Security deposit will be refunded in full upon verified safe return inspection.`;

  db.prepare(`
    INSERT INTO rental_agreements (id, rental_id, terms_text, renter_signed_at, owner_signed_at, contract_hash)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
  `).run(
    agreementId,
    rentalId,
    termsText,
    'SHA256:' + Math.random().toString(36).substring(2) + Date.now().toString(36)
  );

  // Initialize Logistics Order (Porter Partner Express)
  const logisticsId = 'log_' + Date.now();
  db.prepare(`
    INSERT INTO logistics_orders (
      id, rental_id, provider_name, driver_name, driver_phone, driver_vehicle,
      driver_vehicle_num, pickup_address, drop_address, status, pickup_condition_score,
      pickup_photos, current_lat, current_lng, estimated_mins, otp_code
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    logisticsId,
    rentalId,
    'Porter Partner Express',
    'Charlie Kumar',
    '+91 99887 76655',
    'Tata Ace EV Electric Carrier',
    'DL 1C AA 4492',
    `${product.location}, New Delhi`,
    request.location,
    'DRIVER_ASSIGNED',
    product.condition_score,
    product.images,
    28.6139,
    77.2090,
    45,
    handoverOtp
  );

  // Pre-rental inspection log
  db.prepare(`
    INSERT INTO condition_inspections (id, rental_id, stage, condition_score, detected_anomalies, photos, ai_analysis_summary)
    VALUES (?, ?, 'INITIAL_LISTING', ?, ?, ?, ?)
  `).run(
    'insp_' + Date.now(),
    rentalId,
    product.condition_score,
    JSON.stringify(['No cracks detected', 'Optics clean', 'Mechanical parts verified']),
    product.images,
    `AI Inspection Passed (${product.condition_score}/100). Authenticity: ${product.authenticity_status}.`
  );

  res.json({
    success: true,
    rentalId,
    agreementId,
    logisticsId,
    breakdown,
    handoverOtp,
    message: 'Offer accepted! Rental created, digital agreement signed, and payment placed into secure Escrow Buffer.'
  });
});

/**
 * -------------------------------------------------------------
 * 6. RENTALS & DASHBOARDS
 * -------------------------------------------------------------
 */
router.get('/rentals', (req, res) => {
  const { renter_id, owner_id } = req.query;
  let query = `
    SELECT r.*, p.title as product_title, p.brand, p.model, p.images as product_images,
           p.condition_score,
           u_renter.name as renter_name, u_renter.avatar as renter_avatar,
           u_owner.name as owner_name, u_owner.avatar as owner_avatar,
           lo.status as logistics_status, lo.driver_name, lo.estimated_mins
    FROM rentals r
    JOIN products p ON r.product_id = p.id
    JOIN users u_renter ON r.renter_id = u_renter.id
    JOIN users u_owner ON r.owner_id = u_owner.id
    LEFT JOIN logistics_orders lo ON r.id = lo.rental_id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (renter_id) {
    query += ' AND r.renter_id = ?';
    params.push(renter_id);
  }

  if (owner_id) {
    query += ' AND r.owner_id = ?';
    params.push(owner_id);
  }

  query += ' ORDER BY r.created_at DESC';
  const rentals = db.prepare(query).all(...params);
  res.json(rentals);
});

router.get('/rentals/:id', (req, res) => {
  const rental = db.prepare(`
    SELECT r.*, p.title as product_title, p.brand, p.model, p.images as product_images,
           p.condition_score as original_condition_score, p.specs as product_specs, p.location as product_location,
           u_renter.name as renter_name, u_renter.avatar as renter_avatar, u_renter.phone as renter_phone,
           u_owner.name as owner_name, u_owner.avatar as owner_avatar, u_owner.phone as owner_phone
    FROM rentals r
    JOIN products p ON r.product_id = p.id
    JOIN users u_renter ON r.renter_id = u_renter.id
    JOIN users u_owner ON r.owner_id = u_owner.id
    WHERE r.id = ?
  `).get(req.params.id) as any;

  if (!rental) return res.status(404).json({ error: 'Rental not found' });

  const agreement = db.prepare('SELECT * FROM rental_agreements WHERE rental_id = ?').get(rental.id);
  const logistics = RentoLogisticsService.getLogisticsStatus(rental.id);
  const inspections = db.prepare('SELECT * FROM condition_inspections WHERE rental_id = ? ORDER BY created_at ASC').all(rental.id);
  const dispute = db.prepare('SELECT * FROM disputes WHERE rental_id = ?').get(rental.id);

  res.json({
    rental,
    agreement,
    logistics,
    inspections,
    dispute
  });
});

/**
 * -------------------------------------------------------------
 * 7. LOGISTICS PROGRESS & OTP HANDOVER
 * -------------------------------------------------------------
 */
router.post('/rentals/:id/logistics/progress', (req, res) => {
  try {
    const updated = RentoLogisticsService.progressLogisticsOrder(req.params.id, req.body.status);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/rentals/:id/logistics/verify-otp', (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.status(400).json({ error: 'OTP is required' });

  const result = RentoLogisticsService.verifyHandoverOTP(req.params.id, otp);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

/**
 * -------------------------------------------------------------
 * 8. RENTAL EXTENSION & RETURN WORKFLOW
 * -------------------------------------------------------------
 */
router.post('/rentals/:id/extend', (req, res) => {
  const { additional_days = 1 } = req.body;
  const rental = db.prepare('SELECT * FROM rentals WHERE id = ?').get(req.params.id) as any;
  if (!rental) return res.status(404).json({ error: 'Rental not found' });

  const addDays = Number(additional_days);
  const extraCost = Math.round(rental.daily_rate * addDays);

  db.prepare(`
    UPDATE rentals 
    SET rental_days = rental_days + ?,
        rental_total = rental_total + ?,
        total_amount = total_amount + ?
    WHERE id = ?
  `).run(addDays, extraCost, extraCost, req.params.id);

  res.json({
    success: true,
    addedDays: addDays,
    extraCost,
    message: `Rental successfully extended by ${addDays} day(s) for ₹${extraCost}.`
  });
});

router.post('/rentals/:id/return', (req, res) => {
  const { returnNotes = 'Product returned in pristine working order', returnPhotos = [] } = req.body;
  const rental = db.prepare('SELECT * FROM rentals WHERE id = ?').get(req.params.id) as any;
  if (!rental) return res.status(404).json({ error: 'Rental not found' });

  // Fetch pre-rental condition
  const preInspection = db.prepare(`
    SELECT * FROM condition_inspections 
    WHERE rental_id = ? AND stage IN ('INITIAL_LISTING', 'LOGISTICS_PICKUP') 
    ORDER BY created_at DESC LIMIT 1
  `).get(rental.id) as any;

  const preScore = preInspection ? preInspection.condition_score : 95;

  // Run AI Condition Comparison
  const aiComparison = RentoAIEngine.compareReturnCondition(preScore, returnPhotos.length, returnNotes);

  // Store post-return inspection record
  db.prepare(`
    INSERT INTO condition_inspections (id, rental_id, stage, condition_score, detected_anomalies, photos, ai_analysis_summary)
    VALUES (?, ?, 'POST_RETURN', ?, ?, ?, ?)
  `).run(
    'insp_post_' + Date.now(),
    rental.id,
    aiComparison.postRentalScore,
    JSON.stringify(aiComparison.anomalies),
    JSON.stringify(returnPhotos.length > 0 ? returnPhotos : ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80']),
    aiComparison.recommendation
  );

  if (aiComparison.status === 'CLEAN_RETURN') {
    // Release security deposit in full
    RentoEscrowService.releaseSecurityDeposit(rental.id);
    return res.json({
      success: true,
      conditionStatus: 'CLEAN_RETURN',
      aiComparison,
      message: 'Return verified by AI! Deposit of ₹' + rental.deposit_amount + ' has been released back to your account.'
    });
  } else {
    // Flag for review / dispute
    db.prepare("UPDATE rentals SET deposit_status = 'DISPUTED', rental_status = 'DISPUTED' WHERE id = ?").run(rental.id);
    return res.json({
      success: true,
      conditionStatus: aiComparison.status,
      aiComparison,
      message: 'AI detected a condition variance. Security deposit remains held in Escrow for Dispute Locker review.'
    });
  }
});

/**
 * -------------------------------------------------------------
 * 9. DISPUTE LOCKER & REVIEWS
 * -------------------------------------------------------------
 */
router.post('/rentals/:id/dispute', (req, res) => {
  const {
    initiator_id = 'usr_bob',
    claim_type = 'DAMAGE',
    description,
    deduction_requested = 1500,
    evidence_photos = []
  } = req.body;

  const id = 'disp_' + Date.now();
  db.prepare(`
    INSERT INTO disputes (
      id, rental_id, initiator_id, claim_type, description, evidence_photos,
      ai_damage_assessment, deduction_requested, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')
  `).run(
    id,
    req.params.id,
    initiator_id,
    claim_type,
    description,
    JSON.stringify(evidence_photos),
    'AI Assessment: Claim filed with photographic comparison. Estimated repair / depreciation valuation: ₹' + deduction_requested,
    Number(deduction_requested)
  );

  db.prepare("UPDATE rentals SET deposit_status = 'DISPUTED', rental_status = 'DISPUTED' WHERE id = ?").run(req.params.id);

  res.json({ success: true, disputeId: id, message: 'Dispute opened in Dispute Locker.' });
});

router.post('/rentals/:id/dispute/resolve', (req, res) => {
  const { deductionApproved = 1000, resolutionNotes = 'Mutual settlement agreed' } = req.body;

  db.prepare(`
    UPDATE disputes
    SET status = 'RESOLVED', deduction_approved = ?, resolutionNotes = ?
    WHERE rental_id = ?
  `).run(Number(deductionApproved), resolutionNotes, req.params.id);

  const escrowResult = RentoEscrowService.deductDepositForDamage(req.params.id, Number(deductionApproved), resolutionNotes);

  res.json({ success: true, escrowResult });
});

router.post('/rentals/:id/review', (req, res) => {
  const { reviewer_id, reviewee_id, rating, comment, review_type } = req.body;

  const id = 'rev_' + Date.now();
  db.prepare(`
    INSERT INTO reviews (id, rental_id, reviewer_id, reviewee_id, rating, comment, review_type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.params.id, reviewer_id, reviewee_id, Number(rating), comment, review_type);

  // Update reviewee rating average
  const avg = db.prepare('SELECT AVG(rating) as avg_rating FROM reviews WHERE reviewee_id = ?').get(reviewee_id) as any;
  if (avg && avg.avg_rating) {
    db.prepare('UPDATE users SET rating = ? WHERE id = ?').run(Math.round(avg.avg_rating * 10) / 10, reviewee_id);
  }

  res.json({ success: true, reviewId: id });
});

/**
 * -------------------------------------------------------------
 * 10. AI DIRECT ENDPOINTS & ASSISTANT
 * -------------------------------------------------------------
 */
router.post('/ai/parse-requirement', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
  const result = RentoAIEngine.parseRequirement(prompt);
  res.json(result);
});

router.post('/ai/inspect-image', (req, res) => {
  const { name, category } = req.body;
  const result = RentoAIEngine.inspectProductImage(name || 'Camera', category);
  res.json(result);
});

router.post('/ai/chat', (req, res) => {
  const { message } = req.body;
  const answer = RentoAIEngine.askRentoAI(message || '');
  res.json(answer);
});

router.get('/ai/demand-insights', (req, res) => {
  const stats = db.prepare('SELECT * FROM demand_stats ORDER BY search_count DESC').all();
  res.json({
    marketOverview: 'AI Demand Engine: 42% spike in creative production and event rentals across Delhi NCR this week.',
    topCategories: stats
  });
});

/**
 * -------------------------------------------------------------
 * 11. IN-APP MESSAGES
 * -------------------------------------------------------------
 */
router.get('/messages', (req, res) => {
  const { rental_id, request_id } = req.query;
  let query = 'SELECT m.*, u.name as sender_name, u.avatar as sender_avatar FROM messages m JOIN users u ON m.sender_id = u.id WHERE 1=1';
  const params: any[] = [];

  if (rental_id) {
    query += ' AND m.rental_id = ?';
    params.push(rental_id);
  }
  if (request_id) {
    query += ' AND m.request_id = ?';
    params.push(request_id);
  }

  query += ' ORDER BY m.timestamp ASC';
  const msgs = db.prepare(query).all(...params);
  res.json(msgs);
});

router.post('/messages', (req, res) => {
  const { rental_id, request_id, sender_id, receiver_id, message } = req.body;
  const id = 'msg_' + Date.now();
  db.prepare(`
    INSERT INTO messages (id, rental_id, request_id, sender_id, receiver_id, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, rental_id || null, request_id || null, sender_id, receiver_id, message);

  const created = db.prepare('SELECT m.*, u.name as sender_name, u.avatar as sender_avatar FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.id = ?').get(id);
  res.status(201).json(created);
});
