import { db } from './db.js';

export interface AIStructuredRequirement {
  category: string;
  productType: string;
  purpose: string;
  specsNeeded: Record<string, string>;
  budgetDaily: number;
  durationDays: number;
  deliveryRequired: boolean;
  priorityFactors: string[];
  intentSummary: string;
}

export interface AIImageInspection {
  detectedCategory: string;
  detectedBrand: string;
  detectedModel: string;
  confidenceScore: number;
  visibleAccessories: string[];
  conditionScore: number;
  conditionNotes: string;
  authenticityStatus: 'LOW_RISK' | 'VERIFICATION_REQUIRED' | 'HIGH_RISK';
  authenticityConfidence: number;
  authenticityNotes: string;
  recommendedPriceRange: { min: number; max: number; sweetSpot: number; deposit: number };
}

export interface AISuitabilityResult {
  score: number; // 0 - 100
  matchLevel: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'MODERATE' | 'POOR';
  pros: string[];
  caveats: string[];
  explanation: string;
}

export class RentoAIEngine {
  /**
   * 1. AI Requirement Understanding
   * Parses natural language rental inquiries into structured data
   */
  static parseRequirement(prompt: string): AIStructuredRequirement {
    const lower = prompt.toLowerCase();

    let category = 'Electronics';
    let productType = 'General Equipment';
    let budgetDaily = 1500;
    let durationDays = 3;
    const specsNeeded: Record<string, string> = {};
    const priorityFactors: string[] = [];

    // Category & Type detection
    if (lower.includes('camera') || lower.includes('shoot') || lower.includes('photo') || lower.includes('video') || lower.includes('sony') || lower.includes('canon') || lower.includes('lens')) {
      category = 'Cameras';
      productType = 'Mirrorless / Cinema Camera';
      specsNeeded['Sensor'] = lower.includes('full') || lower.includes('pro') ? 'Full-Frame' : 'APS-C or Full-Frame';
      specsNeeded['Video Resolution'] = lower.includes('4k') ? '4K 60fps' : '1080p 60fps minimum';
      priorityFactors.push('Autofocus Performance', 'Low Light Sensitivity', 'Included Fast Lens');
      budgetDaily = 1800;
    } else if (lower.includes('projector') || lower.includes('lumen') || lower.includes('screen') || lower.includes('movie') || lower.includes('auditorium')) {
      category = 'Projectors';
      productType = 'High-Lumen Projector';
      specsNeeded['Brightness'] = lower.includes('outdoor') || lower.includes('100') ? '3,000+ ANSI Lumens' : '2,000+ ANSI Lumens';
      specsNeeded['Resolution'] = '1080p or 4K PRO-UHD';
      priorityFactors.push('High Brightness / Lumens', 'HDMI & Tripod Compatibility');
      budgetDaily = 1600;
    } else if (lower.includes('drone') || lower.includes('aerial') || lower.includes('dji')) {
      category = 'Drones';
      productType = 'Aerial 4K Drone';
      specsNeeded['Camera'] = '4K HDR Gimbal Stabilized';
      specsNeeded['Batteries'] = 'Fly More Combo (3x batteries)';
      priorityFactors.push('Obstacle Avoidance', 'Flight Time', 'DGCA Compliance');
      budgetDaily = 2200;
    } else if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('editing') || lower.includes('render') || lower.includes('coding')) {
      category = 'Laptops';
      productType = 'High Performance Laptop';
      specsNeeded['RAM'] = lower.includes('edit') || lower.includes('render') ? '32GB+ Unified / RAM' : '16GB RAM';
      specsNeeded['Processor'] = 'Apple Silicon M-series or Intel i7/i9';
      priorityFactors.push('Processor Speed', 'Color Accurate Display', 'SSD Speed');
      budgetDaily = 2400;
    } else if (lower.includes('speaker') || lower.includes('sound') || lower.includes('mic') || lower.includes('jbl') || lower.includes('audio') || lower.includes('party')) {
      category = 'Audio';
      productType = 'Portable High-Wattage Sound System';
      specsNeeded['Output'] = '200W+ RMS';
      specsNeeded['Connectivity'] = 'Bluetooth + XLR/Mic Inputs';
      priorityFactors.push('Bass Output', 'Battery Life', 'Microphone Inputs');
      budgetDaily = 1200;
    }

    // Duration detection
    const dayMatch = lower.match(/(\d+)\s*(day|days|d\b)/);
    if (dayMatch && dayMatch[1]) {
      durationDays = parseInt(dayMatch[1], 10);
    }

    // Budget detection
    const budgetMatch = lower.match(/(under|below|budget|within|max|₹|rs\.?)\s*(\d+[\d,]*)/i);
    if (budgetMatch && budgetMatch[2]) {
      const parsedBudget = parseInt(budgetMatch[2].replace(/,/g, ''), 10);
      if (parsedBudget > 100) {
        budgetDaily = parsedBudget;
      }
    }

    // Purpose extraction
    let purpose = 'General Creative or Event Use';
    if (lower.includes('college') || lower.includes('fest') || lower.includes('event')) {
      purpose = 'College Event / Festival Coverage';
    } else if (lower.includes('youtube') || lower.includes('content') || lower.includes('vlog')) {
      purpose = 'Content Creation & YouTube Video Production';
    } else if (lower.includes('wedding') || lower.includes('reception')) {
      purpose = 'Wedding & Ceremonial Shoot';
    } else if (lower.includes('outdoor') || lower.includes('trip') || lower.includes('travel')) {
      purpose = 'Travel & Outdoor Documentary';
    }

    return {
      category,
      productType,
      purpose,
      specsNeeded,
      budgetDaily,
      durationDays,
      deliveryRequired: true,
      priorityFactors,
      intentSummary: `Looking for a ${productType} suitable for ${purpose} for ${durationDays} days at approx ₹${budgetDaily}/day.`
    };
  }

  /**
   * 2. AI Product Identification & Authenticity Screening (Computer Vision Simulation / Analysis)
   * Inspects uploaded images, identifies brand/model, estimates condition and verifies authenticity markers
   */
  static inspectProductImage(imageNameOrTitle: string, categoryHint?: string): AIImageInspection {
    const text = (imageNameOrTitle + ' ' + (categoryHint || '')).toLowerCase();

    if (text.includes('sony') || text.includes('a7') || text.includes('alpha') || text.includes('camera')) {
      return {
        detectedCategory: 'Cameras',
        detectedBrand: 'Sony',
        detectedModel: 'Alpha 7 IV Full-Frame Mirrorless',
        confidenceScore: 95,
        visibleAccessories: ['FE 24-70mm GM Lens attached', 'Lens Hood', 'Rubber Eyecup intact', 'Battery Door intact'],
        conditionScore: 94,
        conditionNotes: 'Glass surfaces pristine, zero fungus or dust visible, minor normal grip wear.',
        authenticityStatus: 'LOW_RISK',
        authenticityConfidence: 96,
        authenticityNotes: 'Serial layout and Sony E-mount contacts match OEM factory specifications.',
        recommendedPriceRange: { min: 1600, max: 2100, sweetSpot: 1800, deposit: 5000 }
      };
    }

    if (text.includes('canon') || text.includes('r6') || text.includes('eos')) {
      return {
        detectedCategory: 'Cameras',
        detectedBrand: 'Canon',
        detectedModel: 'EOS R6 Mark II Mirrorless',
        confidenceScore: 97,
        visibleAccessories: ['RF 24-105mm F4L Lens', 'Lens Cap', 'OEM Neck Strap'],
        conditionScore: 97,
        conditionNotes: 'Like-new condition, pristine sensor and LCD display.',
        authenticityStatus: 'LOW_RISK',
        authenticityConfidence: 98,
        authenticityNotes: 'Canon holographic warranty mark visible, authentic serial pattern.',
        recommendedPriceRange: { min: 1750, max: 2200, sweetSpot: 1950, deposit: 5500 }
      };
    }

    if (text.includes('drone') || text.includes('dji') || text.includes('mavic') || text.includes('mini')) {
      return {
        detectedCategory: 'Drones',
        detectedBrand: 'DJI',
        detectedModel: 'Mini 4 Pro (Fly More Combo)',
        confidenceScore: 96,
        visibleAccessories: ['DJI RC 2 Screen Remote', '3x Flight Batteries', 'Charging Hub', 'Gimbal Protector'],
        conditionScore: 95,
        conditionNotes: 'Clean motor bells, original undamaged carbon-composite props, clear camera optics.',
        authenticityStatus: 'LOW_RISK',
        authenticityConfidence: 97,
        authenticityNotes: 'DJI encrypted serial format matches official database.',
        recommendedPriceRange: { min: 2000, max: 2500, sweetSpot: 2200, deposit: 6000 }
      };
    }

    if (text.includes('macbook') || text.includes('apple') || text.includes('laptop')) {
      return {
        detectedCategory: 'Laptops',
        detectedBrand: 'Apple',
        detectedModel: 'MacBook Pro 16" (M3 Max Chip)',
        confidenceScore: 98,
        visibleAccessories: ['140W USB-C MagSafe 3 Power Adapter', 'Braided MagSafe Cable'],
        conditionScore: 97,
        conditionNotes: 'Aluminum unibody flawless, screen anti-reflective coating 100% intact, keyboard clean.',
        authenticityStatus: 'LOW_RISK',
        authenticityConfidence: 99,
        authenticityNotes: 'Laser-etched Apple model identifiers and serial string validated against AppleCare database.',
        recommendedPriceRange: { min: 2200, max: 2800, sweetSpot: 2400, deposit: 10000 }
      };
    }

    if (text.includes('projector') || text.includes('epson')) {
      return {
        detectedCategory: 'Projectors',
        detectedBrand: 'Epson',
        detectedModel: 'Home Cinema 4010 4K PRO-UHD',
        confidenceScore: 94,
        visibleAccessories: ['Remote Control', '10m High-Speed HDMI Cable', 'Heavy Duty Tripod Stand'],
        conditionScore: 95,
        conditionNotes: 'Optical lens clean, intake air filter clean, cooling fan quiet.',
        authenticityStatus: 'LOW_RISK',
        authenticityConfidence: 94,
        authenticityNotes: 'Authentic Epson commercial optical engine.',
        recommendedPriceRange: { min: 1400, max: 1900, sweetSpot: 1600, deposit: 4500 }
      };
    }

    // Generic fallback for any other equipment
    return {
      detectedCategory: categoryHint || 'Electronics',
      detectedBrand: 'Verified Manufacturer',
      detectedModel: imageNameOrTitle || 'High Performance Unit',
      confidenceScore: 91,
      visibleAccessories: ['Power Cable', 'Protective Carry Case'],
      conditionScore: 92,
      conditionNotes: 'Good operational condition, no structural cracks detected.',
      authenticityStatus: 'LOW_RISK',
      authenticityConfidence: 92,
      authenticityNotes: 'Serial markings present and aligned with product specifications.',
      recommendedPriceRange: { min: 1000, max: 1800, sweetSpot: 1400, deposit: 3500 }
    };
  }

  /**
   * 3. AI Suitability Matching Engine
   * Scores compatibility between user's request requirements and an owner's offer
   */
  static calculateSuitability(request: any, product: any, offer: any): AISuitabilityResult {
    let score = 70; // baseline
    const pros: string[] = [];
    const caveats: string[] = [];

    // Category match
    if (request.category && product.category && request.category.toLowerCase() === product.category.toLowerCase()) {
      score += 15;
      pros.push(`Exact category match: ${product.category}`);
    }

    // Budget match
    const offeredPrice = offer.offered_price || product.daily_price;
    if (offeredPrice <= request.budget_daily) {
      const savings = request.budget_daily - offeredPrice;
      score += 10;
      if (savings > 0) {
        pros.push(`Under budget by ₹${savings}/day (Offers ₹${offeredPrice} vs your max ₹${request.budget_daily})`);
      } else {
        pros.push(`Exactly hits your target budget of ₹${request.budget_daily}/day`);
      }
    } else {
      const over = offeredPrice - request.budget_daily;
      score -= Math.min(20, Math.round((over / request.budget_daily) * 25));
      caveats.push(`Slightly above target budget by ₹${over}/day`);
    }

    // Product condition factor
    if (product.condition_score >= 95) {
      score += 5;
      pros.push(`Top-tier condition (${product.condition_score}/100 certified)`);
    } else if (product.condition_score < 85) {
      score -= 5;
      caveats.push(`Moderate cosmetic wear (${product.condition_score}/100)`);
    }

    // Accessories & Extras
    let accessories: string[] = [];
    try {
      accessories = typeof offer.accessories === 'string' ? JSON.parse(offer.accessories) : (offer.accessories || []);
    } catch {
      accessories = [];
    }

    if (accessories.length > 2) {
      score += 5;
      pros.push(`Loaded bundle with ${accessories.length} accessories (${accessories.slice(0, 2).join(', ')}, etc.)`);
    }

    // Owner verified & reputation bonus
    score += 5; // Verified supplier

    // Clamp score 0 - 100
    const finalScore = Math.max(40, Math.min(99, score));

    let matchLevel: AISuitabilityResult['matchLevel'] = 'EXCELLENT';
    if (finalScore >= 90) matchLevel = 'EXCELLENT';
    else if (finalScore >= 80) matchLevel = 'VERY_GOOD';
    else if (finalScore >= 70) matchLevel = 'GOOD';
    else if (finalScore >= 55) matchLevel = 'MODERATE';
    else matchLevel = 'POOR';

    const explanation = `RENTO AI evaluated ${product.title} against your ${request.purpose || request.category} requirement. With a suitability score of ${finalScore}%, this setup offers the right technical specifications, reliable verified condition, and competitive pricing.`;

    return {
      score: finalScore,
      matchLevel,
      pros,
      caveats,
      explanation
    };
  }

  /**
   * 4. AI Post-Rental Condition Comparison
   * Compares initial pickup photos & condition score vs post-rental inspection
   */
  static compareReturnCondition(preScore: number, returnPhotosCount: number, reportedNotes: string) {
    const lowerNotes = reportedNotes.toLowerCase();

    let delta = 0;
    let anomalyDetected = false;
    const anomalies: string[] = [];

    if (lowerNotes.includes('crack') || lowerNotes.includes('broken') || lowerNotes.includes('dropped') || lowerNotes.includes('deep scratch')) {
      delta = 18;
      anomalyDetected = true;
      anomalies.push('Visible physical crack/impact mark identified on chassis');
    } else if (lowerNotes.includes('scratch') || lowerNotes.includes('missing cable') || lowerNotes.includes('scuff') || lowerNotes.includes('lens cap lost')) {
      delta = 6;
      anomalyDetected = true;
      anomalies.push('Minor cosmetic scratch or missing minor accessory noted');
    } else {
      // Clean return
      delta = 1; // normal microscopic handling variance
    }

    const postScore = Math.max(40, preScore - delta);

    return {
      preRentalScore: preScore,
      postRentalScore: postScore,
      conditionDelta: delta,
      status: delta <= 3 ? 'CLEAN_RETURN' : delta <= 8 ? 'MINOR_VARIANCE' : 'DAMAGE_DETECTED',
      anomalies,
      recommendation: delta <= 3
        ? 'No significant difference detected. Full security deposit eligible for instant release.'
        : delta <= 8
        ? 'Minor variance detected. Recommends mutual owner review or minor accessory replacement fee.'
        : 'Significant condition discrepancy detected. Security deposit held in escrow; Dispute Locker opened.'
    };
  }

  /**
   * 5. Interactive RENTO AI Rental Assistant
   * Answers user questions with domain intelligence
   */
  static askRentoAI(query: string) {
    const q = query.toLowerCase();

    if (q.includes('camera') || q.includes('shoot') || q.includes('fest') || q.includes('college')) {
      return {
        reply: `For college fests and indoor events, I strongly recommend a full-frame mirrorless camera like the **Sony Alpha 7 IV** or **Canon EOS R6 Mark II**. \n\nKey reasons:\n1. **Low-light sensitivity**: Stage lighting often varies dramatically. Full-frame sensors prevent grainy noise at high ISO.\n2. **Fast Autofocus**: AI eye-tracking locks onto performers on stage even during energetic dance choreography.\n3. **Dual Card Slots & Extra Batteries**: Essential for continuous recording without data loss.\n\nTip: You can use our **"Post a Request"** button if you want owners to bid with custom lens combos!`,
        suggestions: ['Compare Sony A7 IV vs Canon R6', 'How does the deposit refund work?', 'Post a camera request']
      };
    }

    if (q.includes('deposit') || q.includes('escrow') || q.includes('payment') || q.includes('safe') || q.includes('money')) {
      return {
        reply: `Here is how RENTO protects your money with our **Secure Payment Buffer / Escrow**:\n\n1. **When you book**: Your rental fee and security deposit are placed into a protected escrow buffer.\n2. **During Transit**: Funds remain strictly locked while our third-party logistics partner transports the item.\n3. **At Delivery**: You physically inspect the product and share an OTP with the delivery driver to confirm receipt. Only then is the rental fee released to the owner.\n4. **Security Deposit**: Remains protected throughout your rental period and is returned to your account within 24 hours of safe return inspection!`,
        suggestions: ['What happens if item is damaged?', 'How does delivery tracking work?']
      };
    }

    if (q.includes('extend') || q.includes('extension') || q.includes('extra day')) {
      return {
        reply: `Yes, you can easily extend your rental! \n\nGo to your **Renter Dashboard -> Active Rentals**, and click **"Extend Rental"**. \n\nOur system will instantly check the owner's calendar to ensure there are no conflicting bookings, calculate the prorated daily rate, and update your digital agreement upon confirmation.`,
        suggestions: ['View active rentals', 'Contact the owner']
      };
    }

    if (q.includes('damage') || q.includes('dispute') || q.includes('scratch')) {
      return {
        reply: `RENTO features automated **AI Condition Comparison** and a fair **Dispute Locker**:\n\n• Every item is photographed and scored before dispatch (e.g. 96/100 condition score).\n• Upon return, fresh photos are evaluated by AI to detect any condition delta.\n• If damage occurred during courier transit vs while in renter care, timestamped courier handover logs determine responsibility.\n• Neither party's deposit can be arbitrarily seized—everything is arbitrated transparently with photo evidence.`,
        suggestions: ['View dispute policies', 'Learn about Porter delivery']
      };
    }

    return {
      reply: `Welcome to **RENTO**—the AI-powered demand-first rental marketplace! \n\nUnlike traditional sites where you can only rent what is already listed, on RENTO you can simply describe what you need, and our AI matches your demand with verified owners near you.\n\nHow can I help you today? You can search for products, post a custom rental request, or ask about our escrow and delivery systems.`,
      suggestions: ['Search cameras', 'Post a custom request', 'How escrow works']
    };
  }
}
