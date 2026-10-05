import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'rento.db');
export const db = new Database(dbPath);

// Enable WAL mode and foreign keys for high performance and integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // Ensure uploads directory exists
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Schema creation
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'both', -- 'renter', 'owner', 'both', 'admin'
      avatar TEXT,
      city TEXT NOT NULL DEFAULT 'Delhi NCR',
      rating REAL DEFAULT 5.0,
      total_rentals INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 1,
      kyc_status TEXT DEFAULT 'VERIFIED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      specs TEXT, -- JSON
      daily_price REAL NOT NULL,
      deposit REAL NOT NULL,
      condition_score INTEGER DEFAULT 95,
      condition_notes TEXT,
      images TEXT, -- JSON array of image URLs
      serial_number TEXT,
      authenticity_status TEXT DEFAULT 'LOW_RISK', -- 'LOW_RISK', 'VERIFIED', 'HIGH_RISK'
      authenticity_notes TEXT,
      location TEXT NOT NULL,
      is_available INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS rental_requests (
      id TEXT PRIMARY KEY,
      renter_id TEXT NOT NULL,
      raw_prompt TEXT NOT NULL,
      category TEXT NOT NULL,
      purpose TEXT,
      specs_needed TEXT, -- JSON
      budget_daily REAL NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      duration_days INTEGER NOT NULL,
      location TEXT NOT NULL,
      delivery_required INTEGER DEFAULT 1,
      status TEXT DEFAULT 'OPEN', -- 'OPEN', 'OFFERS_RECEIVED', 'ACCEPTED', 'COMPLETED'
      ai_structured_data TEXT, -- JSON
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (renter_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS request_offers (
      id TEXT PRIMARY KEY,
      request_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      offered_price REAL NOT NULL,
      deposit REAL NOT NULL,
      accessories TEXT, -- JSON array
      delivery_option TEXT DEFAULT 'PLATFORM_DELIVERY', -- 'PLATFORM_DELIVERY', 'SELF_PICKUP'
      notes TEXT,
      status TEXT DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'REJECTED'
      ai_suitability_score INTEGER DEFAULT 90,
      ai_suitability_reasons TEXT, -- JSON array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (request_id) REFERENCES rental_requests(id),
      FOREIGN KEY (owner_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS rentals (
      id TEXT PRIMARY KEY,
      request_id TEXT,
      offer_id TEXT,
      product_id TEXT NOT NULL,
      renter_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      rental_days INTEGER NOT NULL,
      daily_rate REAL NOT NULL,
      rental_total REAL NOT NULL,
      deposit_amount REAL NOT NULL,
      delivery_fee REAL DEFAULT 350,
      platform_fee REAL NOT NULL,
      total_amount REAL NOT NULL,
      payment_status TEXT DEFAULT 'BUFFERED', -- 'PENDING', 'BUFFERED', 'OWNER_RELEASED', 'REFUNDED'
      deposit_status TEXT DEFAULT 'HELD', -- 'HELD', 'RELEASED', 'DISPUTED', 'DEDUCTED'
      rental_status TEXT DEFAULT 'BUFFERED', -- 'AGREEMENT_PENDING', 'BUFFERED', 'DISPATCHED', 'ACTIVE', 'RETURNING', 'COMPLETED', 'DISPUTED'
      handover_otp TEXT NOT NULL,
      return_otp TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (renter_id) REFERENCES users(id),
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS rental_agreements (
      id TEXT PRIMARY KEY,
      rental_id TEXT UNIQUE NOT NULL,
      terms_text TEXT NOT NULL,
      renter_signed_at DATETIME,
      owner_signed_at DATETIME,
      contract_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rental_id) REFERENCES rentals(id)
    );

    CREATE TABLE IF NOT EXISTS logistics_orders (
      id TEXT PRIMARY KEY,
      rental_id TEXT UNIQUE NOT NULL,
      provider_name TEXT DEFAULT 'Porter Partner Express',
      driver_name TEXT NOT NULL,
      driver_phone TEXT NOT NULL,
      driver_vehicle TEXT NOT NULL,
      driver_vehicle_num TEXT NOT NULL,
      pickup_address TEXT NOT NULL,
      drop_address TEXT NOT NULL,
      status TEXT DEFAULT 'REQUESTED', 
      -- 'REQUESTED', 'DRIVER_ASSIGNED', 'ARRIVING_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'NEAR_DESTINATION', 'DELIVERED', 'OTP_CONFIRMED', 'COMPLETED'
      pickup_condition_score INTEGER DEFAULT 95,
      pickup_photos TEXT, -- JSON
      delivery_photos TEXT, -- JSON
      current_lat REAL DEFAULT 28.6139,
      current_lng REAL DEFAULT 77.2090,
      estimated_mins INTEGER DEFAULT 45,
      otp_code TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rental_id) REFERENCES rentals(id)
    );

    CREATE TABLE IF NOT EXISTS condition_inspections (
      id TEXT PRIMARY KEY,
      rental_id TEXT NOT NULL,
      stage TEXT NOT NULL, -- 'INITIAL_LISTING', 'LOGISTICS_PICKUP', 'DELIVERY_HANDOVER', 'POST_RETURN'
      condition_score INTEGER NOT NULL,
      detected_anomalies TEXT, -- JSON array
      photos TEXT, -- JSON array
      ai_analysis_summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rental_id) REFERENCES rentals(id)
    );

    CREATE TABLE IF NOT EXISTS disputes (
      id TEXT PRIMARY KEY,
      rental_id TEXT UNIQUE NOT NULL,
      initiator_id TEXT NOT NULL,
      claim_type TEXT NOT NULL, -- 'DAMAGE', 'MISSING_ACCESSORY', 'LATE_RETURN', 'DEFECTIVE_PRODUCT'
      description TEXT NOT NULL,
      evidence_photos TEXT, -- JSON array
      ai_damage_assessment TEXT,
      deduction_requested REAL NOT NULL,
      deduction_approved REAL DEFAULT 0,
      status TEXT DEFAULT 'OPEN', -- 'OPEN', 'UNDER_REVIEW', 'RESOLVED'
      resolution_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rental_id) REFERENCES rentals(id),
      FOREIGN KEY (initiator_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      rental_id TEXT,
      request_id TEXT,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      rental_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      reviewee_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      review_type TEXT NOT NULL, -- 'RENTER_TO_OWNER', 'OWNER_TO_RENTER'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rental_id) REFERENCES rentals(id),
      FOREIGN KEY (reviewer_id) REFERENCES users(id),
      FOREIGN KEY (reviewee_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS demand_stats (
      category TEXT PRIMARY KEY,
      search_count INTEGER DEFAULT 0,
      request_count INTEGER DEFAULT 0,
      avg_budget REAL DEFAULT 0,
      trend_growth_percent REAL DEFAULT 15.0,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedDataIfEmpty();
}

function seedDataIfEmpty() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) return;

  console.log('Seeding initial RENTO data...');

  // 1. Seed Users (Alice Renter, Bob Pro Owner, Charlie Delivery Driver, David Store Owner)
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, phone, role, avatar, city, rating, total_rentals, is_verified, kyc_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'usr_alice',
    'Alice Sharma',
    'alice@college.edu',
    '+91 98765 43210',
    'renter',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'Delhi NCR',
    4.9,
    14,
    1,
    'VERIFIED'
  );

  insertUser.run(
    'usr_bob',
    'Bob Mehta (Pro Cine Gear)',
    'bob@cinestudio.in',
    '+91 98111 22334',
    'owner',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'Delhi NCR',
    4.95,
    98,
    1,
    'VERIFIED'
  );

  insertUser.run(
    'usr_charlie',
    'Charlie Kumar (Logistics Partner)',
    'charlie@porterfast.com',
    '+91 99887 76655',
    'both',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'Delhi NCR',
    4.88,
    210,
    1,
    'VERIFIED'
  );

  insertUser.run(
    'usr_david',
    'David Wilson (TechRentals Co.)',
    'david@techrentals.io',
    '+91 97766 55443',
    'owner',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    'Delhi NCR',
    4.92,
    76,
    1,
    'VERIFIED'
  );

  insertUser.run(
    'usr_aarav',
    'Aarav Sharma',
    'aarav@rento.in',
    '+91 98765 11223',
    'both',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    'Delhi NCR',
    4.95,
    24,
    1,
    'VERIFIED'
  );

  insertUser.run(
    'usr_priya',
    'Priya Mehta',
    'priya@rento.in',
    '+91 98111 44556',
    'renter',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'Delhi NCR',
    4.9,
    12,
    1,
    'VERIFIED'
  );

  insertUser.run(
    'usr_kiran',
    'Kiran Patel',
    'kiran@rento.in',
    '+91 99887 33221',
    'owner',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    'Delhi NCR',
    4.88,
    45,
    1,
    'VERIFIED'
  );

  // 2. Seed Products
  const insertProduct = db.prepare(`
    INSERT INTO products (id, owner_id, title, brand, model, category, description, specs, daily_price, deposit, condition_score, condition_notes, images, serial_number, authenticity_status, authenticity_notes, location, is_available)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProduct.run(
    'prod_sony_a7iv',
    'usr_bob',
    'Sony Alpha 7 IV Full-Frame Mirrorless + 24-70mm GM Lens',
    'Sony',
    'Alpha 7 IV',
    'Cameras',
    'Pro grade 33MP full-frame hybrid camera with 4K 60p 10-bit video, pristine sensor, 2 extra batteries and 128GB V90 SD card included.',
    JSON.stringify({ sensor: '33MP Full-Frame', video: '4K 60p 10-bit', autofocus: 'AI Real-time Eye AF', mounts: 'Sony E-mount' }),
    1800,
    5000,
    96,
    'Sensor clean, minor body scuff near strap ring, lenses spotless.',
    JSON.stringify([
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80'
    ]),
    'SN-SONY-7489211',
    'LOW_RISK',
    'Serial number verified with Sony India database. Authentic retail unit.',
    'South Extension, New Delhi',
    1
  );

  insertProduct.run(
    'prod_canon_r6',
    'usr_bob',
    'Canon EOS R6 Mark II + RF 24-105mm f/4L IS USM',
    'Canon',
    'EOS R6 Mark II',
    'Cameras',
    'Versatile 24.2MP full-frame camera with 40 fps continuous shooting, 4K 60p oversampled, 8-stop IBIS stabilization.',
    JSON.stringify({ sensor: '24.2MP CMOS', video: '6K oversampled 4K 60p', stabilization: '8-stop In-Body IS' }),
    1950,
    5500,
    98,
    'Flawless condition, zero scratches on glass or LCD, shutter count 4,200.',
    JSON.stringify([
      'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=800&auto=format&fit=crop&q=80'
    ]),
    'SN-CANON-9832101',
    'LOW_RISK',
    'Official Canon warranty card verified.',
    'Lajpat Nagar, New Delhi',
    1
  );

  insertProduct.run(
    'prod_dji_drone',
    'usr_david',
    'DJI Mini 4 Pro Fly More Combo (4K/60fps HDR Drone)',
    'DJI',
    'Mini 4 Pro',
    'Drones',
    'Ultralight foldable drone (<249g), omnidirectional obstacle sensing, 20km FHD transmission, 3x Intelligent Flight Batteries, RC 2 screen controller.',
    JSON.stringify({ weight: '249g', camera: '4K/60fps HDR, True Vertical Shooting', battery_life: '34 mins x 3', controller: 'DJI RC 2' }),
    2200,
    6000,
    94,
    'Propellers clean, gimbal calibrated, battery cycles under 15 each.',
    JSON.stringify([
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80'
    ]),
    'SN-DJI-4892019',
    'LOW_RISK',
    'DJI Care Refresh active and serial verified.',
    'Cyber City, Gurugram',
    1
  );

  insertProduct.run(
    'prod_macbook_m3',
    'usr_david',
    'Apple MacBook Pro 16" (M3 Max, 36GB RAM, 1TB SSD)',
    'Apple',
    'MacBook Pro 16',
    'Laptops',
    'Beast workstation for 4K/8K video editing, 3D rendering in Blender/Cinema4D, and heavy software development. Liquid Retina XDR display.',
    JSON.stringify({ chip: 'Apple M3 Max 14-core', memory: '36GB Unified', storage: '1TB Superfast SSD', display: '16.2" Mini-LED 120Hz' }),
    2400,
    10000,
    97,
    'Pristine battery health 99%, MagSafe charger and protective hardshell included.',
    JSON.stringify([
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    ]),
    'SN-APL-C02GH911M',
    'LOW_RISK',
    'AppleCare+ coverage verified via Apple serial checker.',
    'Noida Sector 62',
    1
  );

  insertProduct.run(
    'prod_epson_projector',
    'usr_bob',
    'Epson Pro Cinema 4K Home Theater Projector (3,000 Lumens)',
    'Epson',
    'Home Cinema 4010',
    'Projectors',
    'Ultra-bright 3,000 ANSI lumens 4K PRO-UHD projector with motorized lens shift, HDMI 2.0, perfect for college auditoriums and outdoor events up to 200 people.',
    JSON.stringify({ brightness: '3,000 Lumens', resolution: '4K PRO-UHD', throw_ratio: '1.35 - 2.84:1', lamp_hours: '320 / 5,000' }),
    1600,
    4500,
    95,
    'Lamp usage low, lens clear, comes with HDMI 10m cable & heavy duty tripod stand.',
    JSON.stringify([
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80'
    ]),
    'SN-EPS-4921948',
    'LOW_RISK',
    'Epson official invoice verified.',
    'Hauz Khas, New Delhi',
    1
  );

  insertProduct.run(
    'prod_jbl_partybox',
    'usr_david',
    'JBL PartyBox 310 Portable Bluetooth Party Speaker (240W)',
    'JBL',
    'PartyBox 310',
    'Audio',
    'Dazzling dynamic light sync, 240 watts of powerful JBL Pro Sound, 18-hour battery, wheels & handle for easy transport, dual mic/guitar inputs.',
    JSON.stringify({ power: '240W RMS', battery: '18 hours', features: 'IPX4 splashproof, Dual mic inputs, RGB light show' }),
    1200,
    3000,
    93,
    'Great bass output, exterior has slight wheel scuffs from normal use, functions 100%.',
    JSON.stringify([
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    ]),
    'SN-JBL-1029384',
    'LOW_RISK',
    'Verified JBL Harman device.',
    'Indirapuram, Ghaziabad',
    1
  );

  insertProduct.run(
    'item_van',
    'usr_kiran',
    'Mahindra Marazzo Car for Daily Rental',
    'Mahindra',
    'Marazzo M6+ 7-Seater',
    'Vehicles',
    'Spacious 7-seater diesel MPV with captain seats, dual AC, Bluetooth infotainment, sanitized interior. Available for self-drive or with verified chauffeur in Gurugram & South Delhi.',
    JSON.stringify({ Seating: '7 Seater', Fuel: 'Diesel', Transmission: '6-Speed Manual', Mileage: '17.3 kmpl' }),
    3000,
    8000,
    98,
    'Full service completed, zero dent, sanitized cabin, commercial transport permit verified.',
    JSON.stringify(['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80']),
    'SN-MAH-291048',
    'LOW_RISK',
    'Commercial registration and insurance valid until 2028.',
    'Gurugram & South Delhi (Instant Pick)',
    1
  );

  insertProduct.run(
    'item_medical',
    'usr_kiran',
    'Double Bottle Suction Machine',
    'Yuyue Medical',
    '7A-23D Heavy Duty',
    'Appliances',
    'Hospital-grade dual bottle suction unit with oil-free lubrication pump, overflow protection device, and high vacuum capacity. Ideal for home patient care.',
    JSON.stringify({ PumpingSpeed: '>= 20L/min', BottleCapacity: '2500ml x 2', Power: '180VA' }),
    1500,
    3000,
    100,
    'Hospital-grade autoclaved, sterile suction catheters provided, certified functional calibration.',
    JSON.stringify(['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80']),
    'SN-YUY-583921',
    'LOW_RISK',
    'ISO 13485 medical device certificate verified.',
    'Free Delivery in Noida / Ghaziabad',
    1
  );

  insertProduct.run(
    'item_sofa',
    'usr_aarav',
    'Emerald Green Cushioned Sofa',
    'Urban Living',
    'Velvet Chesterfield 3-Seater',
    'Furniture',
    'Luxurious emerald green velvet 3-seater sofa with deep tufting, solid teak wood frame, and high-density foam cushioning. Perfect for event staging or home upgrade.',
    JSON.stringify({ Dimensions: '84 x 36 x 32 inches', Fabric: 'Premium Velvet', Frame: 'Teak Wood' }),
    3000,
    6000,
    97,
    'Deep shampoo sanitized, zero stains, pristine wooden legs.',
    JSON.stringify(['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80']),
    'SN-SOF-849102',
    'LOW_RISK',
    'Owner purchase invoice verified.',
    'Deep Sanitized • Delhi NCR',
    1
  );

  insertProduct.run(
    'item_projector',
    'usr_bob',
    'Projector on Rent in Delhi NCR',
    'Optoma',
    'HD146X High Lumen Projector',
    'Projectors',
    '3600 ANSI lumens 1080p cinematic projector with low 16ms input lag, HDMI 2.0, includes 100-inch pull-up screen and adjustable floor stand.',
    JSON.stringify({ Lumens: '3600 ANSI', Resolution: '1080p FHD', Screen: '100-inch Collapsible' }),
    1200,
    4000,
    96,
    'Bright lamp with under 200 hours, crisp contrast, tested HDMI cables.',
    JSON.stringify(['https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80']),
    'SN-OPT-391029',
    'LOW_RISK',
    'Optoma India authorized retail invoice verified.',
    '3200 Lumens • Connaught Place, NCR',
    1
  );

  insertProduct.run(
    'item_karaoke',
    'usr_bob',
    'Karaoke Machine in Delhi NCR',
    'SingTech',
    'K-Party 500W',
    'Audio',
    'Complete party karaoke rig with 50,000+ preloaded Bollywood and international tracks, 2 UHF cordless microphones, digital echo mixer, and Bluetooth sync.',
    JSON.stringify({ Tracks: '50,000+ Hindi & Eng', Mics: '2 Wireless UHF', Output: '500W RMS' }),
    1500,
    3500,
    95,
    'Both microphones tested for zero distortion up to 30 meters, quick plug-and-play HDMI output.',
    JSON.stringify(['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80']),
    'SN-SNG-938102',
    'LOW_RISK',
    'Full licensed karaoke database verified.',
    'Includes 2 Cordless Mics • Plug & Play',
    1
  );

  insertProduct.run(
    'item_pa',
    'usr_bob',
    'PA System on Rent in Delhi NCR',
    'Yamaha',
    'StagePas 1K Dual Rig',
    'Audio',
    '2000W RMS high-definition live sound column system with built-in 5-channel digital mixer, SPX digital reverb, and Bluetooth audio. Covers up to 400 guests.',
    JSON.stringify({ Power: '2000W RMS', Audience: 'Up to 400 guests', Mixer: 'Yamaha 5-Channel SPX' }),
    2500,
    6000,
    98,
    'Calibrated acoustic response, pristine speaker cones, includes all XLR cables.',
    JSON.stringify(['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80']),
    'SN-YAM-492019',
    'LOW_RISK',
    'Yamaha Music India genuine warranty registration.',
    '2000W RMS • Covers up to 400 guests',
    1
  );

  insertProduct.run(
    'item_ringlight',
    'usr_aarav',
    'Digitek LED Ring Light for Daily Rental',
    'Digitek',
    'DRL-18H Bi-Color',
    'Cameras',
    '18-inch professional bi-color LED ring light with adjustable color temperature (3200K - 5600K), smartphone mount, wireless remote, and 7-foot heavy duty tripod.',
    JSON.stringify({ Diameter: '18 inches', CCT: '3200K - 5600K', Power: '55W High CRI' }),
    200,
    800,
    95,
    'All LED diodes functioning, smooth stepless dimming, tripod locking collar sturdy.',
    JSON.stringify(['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80']),
    'SN-DIG-294810',
    'LOW_RISK',
    'Digitek India invoice verified.',
    'Includes Remote + Tripod Stand',
    1
  );

  // 3. Seed Sample Demand Request ("Demand Creates Supply" showcase)
  const insertRequest = db.prepare(`
    INSERT INTO rental_requests (id, renter_id, raw_prompt, category, purpose, specs_needed, budget_daily, start_date, end_date, duration_days, location, delivery_required, status, ai_structured_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertRequest.run(
    'req_student_fest',
    'usr_alice',
    'Need a 4K camera with great low-light performance and portrait lens for 3 days college cultural fest. Budget under ₹2,000/day.',
    'Cameras',
    'College Cultural Festival Photography & Low-light Stage Performances',
    JSON.stringify({ resolution: '4K video', low_light: 'Excellent ISO range', lens: 'Fast aperture portrait lens', duration: '3 days' }),
    2000,
    '2026-10-12',
    '2026-10-15',
    3,
    'Delhi University North Campus, New Delhi',
    1,
    'OFFERS_RECEIVED',
    JSON.stringify({
      category: 'Cameras',
      intent: 'Event & Low-Light Photography',
      recommendedBrands: ['Sony', 'Canon'],
      criticalFactors: ['Low Light Sensitivity', 'Fast Autofocus', 'Included Zoom/Portrait Lens'],
      marketRateAvg: 1850
    })
  );

  // 4. Seed Offer on the Request with AI Suitability Score
  const insertOffer = db.prepare(`
    INSERT INTO request_offers (id, request_id, owner_id, product_id, offered_price, deposit, accessories, delivery_option, notes, status, ai_suitability_score, ai_suitability_reasons)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertOffer.run(
    'off_bob_sony',
    'req_student_fest',
    'usr_bob',
    'prod_sony_a7iv',
    1800,
    5000,
    JSON.stringify(['Sony 24-70mm GM Lens', '2x Extra NP-FZ100 Batteries', 'Dual Charger', '128GB V90 SD Card', 'Camera Bag']),
    'PLATFORM_DELIVERY',
    'Available for all 3 days of your fest. Includes extra batteries so you can shoot stage events all night without pausing.',
    'PENDING',
    96,
    JSON.stringify([
      'Outstanding low-light capability (BIONZ XR + 33MP sensor)',
      'Includes high-end 24-70mm f/2.8 GM lens ideal for stage portraits',
      'Within user budget (₹1,800/day vs ₹2,000/day target)',
      'Owner is located 6km away with 4.95 star rating'
    ])
  );

  insertOffer.run(
    'off_bob_canon',
    'req_student_fest',
    'usr_bob',
    'prod_canon_r6',
    1950,
    5500,
    JSON.stringify(['Canon RF 24-105mm Lens', '2x Batteries', 'Fast SD Card', 'Strap & Bag']),
    'PLATFORM_DELIVERY',
    'High speed 40fps and 8-stop IBIS stabilization makes it effortless for fast dance performances.',
    'PENDING',
    92,
    JSON.stringify([
      'Superb autofocus tracking for moving dancers',
      'Excellent 4K 60p oversampled video for recording performances',
      'Fits inside user budget limit'
    ])
  );

  // 5. Seed a Live Active Rental with Porter-like Logistics Progression
  const insertRental = db.prepare(`
    INSERT INTO rentals (id, request_id, offer_id, product_id, renter_id, owner_id, start_date, end_date, rental_days, daily_rate, rental_total, deposit_amount, delivery_fee, platform_fee, total_amount, payment_status, deposit_status, rental_status, handover_otp, return_otp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertRental.run(
    'rnt_demo_active',
    'req_student_fest',
    'off_bob_sony',
    'prod_sony_a7iv',
    'usr_alice',
    'usr_bob',
    '2026-10-06',
    '2026-10-09',
    3,
    1800,
    5400, // 3 * 1800
    5000, // deposit
    350,  // delivery fee
    540,  // 10% platform fee
    11290, // total buffered
    'BUFFERED',
    'HELD',
    'DISPATCHED',
    '7492',
    '3819'
  );

  // Seed Agreement
  const insertAgreement = db.prepare(`
    INSERT INTO rental_agreements (id, rental_id, terms_text, renter_signed_at, owner_signed_at, contract_hash)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertAgreement.run(
    'agr_demo_active',
    'rnt_demo_active',
    `RENTO DIGITAL RENTAL AGREEMENT
Product: Sony Alpha 7 IV + 24-70mm GM Lens (SN: SN-SONY-7489211)
Renter: Alice Sharma (usr_alice)
Owner: Bob Mehta (usr_bob)
Rental Period: 06 Oct 2026 to 09 Oct 2026 (3 Days)
Daily Rate: ₹1,800 | Total Rental: ₹5,400
Security Deposit: ₹5,000 (Protected in RENTO Escrow Buffer)
Delivery Method: Third-Party Porter Logistics (₹350)
Platform Commission: 10% (₹540)
Terms & Conditions:
1. Renter agrees to inspect product condition upon delivery and verify using OTP.
2. Payment remains buffered in Escrow until verified delivery.
3. Security deposit is released within 24 hours of safe return inspection.
4. Any transit or physical damage is arbitrated through RENTO AI Condition Comparison & Dispute Locker.`,
    '2026-10-05 10:15:00',
    '2026-10-05 10:12:00',
    'SHA256:d83bf91104e1a7b8e5c89f2a0149e872d82910fa'
  );

  // Seed Logistics Order
  const insertLogistics = db.prepare(`
    INSERT INTO logistics_orders (id, rental_id, provider_name, driver_name, driver_phone, driver_vehicle, driver_vehicle_num, pickup_address, drop_address, status, pickup_condition_score, pickup_photos, current_lat, current_lng, estimated_mins, otp_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertLogistics.run(
    'log_demo_active',
    'rnt_demo_active',
    'Porter Express Logistics',
    'Charlie Kumar',
    '+91 99887 76655',
    'Tata Ace EV / Delivery Van',
    'DL 1C AA 4492',
    'CineStudio, South Extension Part 2, New Delhi',
    'Hostel 4, Delhi University North Campus, New Delhi',
    'IN_TRANSIT',
    96,
    JSON.stringify([
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'
    ]),
    28.6692,
    77.2144,
    18,
    '7492'
  );

  // Seed Pre-rental Condition Inspection
  const insertInspection = db.prepare(`
    INSERT INTO condition_inspections (id, rental_id, stage, condition_score, detected_anomalies, photos, ai_analysis_summary)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertInspection.run(
    'insp_pre_demo',
    'rnt_demo_active',
    'LOGISTICS_PICKUP',
    96,
    JSON.stringify(['No lens element scratches', 'Sensor flawless', 'Minor 2mm paint wear near strap hook']),
    JSON.stringify(['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80']),
    'AI Vision Verification: 96/100 condition. All mechanical buttons responsive, glass surface clean.'
  );

  // Seed Demand Trends
  const insertDemand = db.prepare(`
    INSERT INTO demand_stats (category, search_count, request_count, avg_budget, trend_growth_percent)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertDemand.run('Cameras', 142, 38, 1850, 42.5);
  insertDemand.run('Projectors', 98, 27, 1600, 31.0);
  insertDemand.run('Laptops', 85, 19, 2300, 24.8);
  insertDemand.run('Drones', 64, 15, 2100, 56.2);
  insertDemand.run('Audio', 110, 32, 1250, 18.4);

  // Seed In-app Chat Messages
  const insertMsg = db.prepare(`
    INSERT INTO messages (id, rental_id, request_id, sender_id, receiver_id, message, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertMsg.run(
    'msg_1',
    'rnt_demo_active',
    'req_student_fest',
    'usr_alice',
    'usr_bob',
    'Hi Bob! Does the package include the fast memory card?',
    '2026-10-05 10:18:00'
  );

  insertMsg.run(
    'msg_2',
    'rnt_demo_active',
    'req_student_fest',
    'usr_bob',
    'usr_alice',
    'Yes Alice, I packed a 128GB Sony Tough V90 card and an extra battery so you can record 4K without stopping!',
    '2026-10-05 10:20:00'
  );

  console.log('Seeding completed successfully!');
}
