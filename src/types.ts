export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'renter' | 'owner' | 'both' | 'admin';
  avatar: string;
  city: string;
  rating: number;
  total_rentals: number;
  is_verified: number;
  kyc_status: string;
  created_at?: string;
}

export interface Product {
  id: string;
  owner_id: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  description: string;
  specs: string; // JSON
  daily_price: number;
  deposit: number;
  condition_score: number;
  condition_notes: string;
  images: string; // JSON array
  serial_number: string;
  authenticity_status: 'LOW_RISK' | 'VERIFIED' | 'HIGH_RISK';
  authenticity_notes: string;
  location: string;
  is_available: number;
  owner_name?: string;
  owner_avatar?: string;
  owner_rating?: number;
  owner_city?: string;
  owner_phone?: string;
  created_at?: string;
}

export interface RentalRequest {
  id: string;
  renter_id: string;
  raw_prompt: string;
  category: string;
  purpose: string;
  specs_needed: string; // JSON
  budget_daily: number;
  start_date: string;
  end_date: string;
  duration_days: number;
  location: string;
  delivery_required: number;
  status: 'OPEN' | 'OFFERS_RECEIVED' | 'ACCEPTED' | 'COMPLETED';
  ai_structured_data: string; // JSON
  renter_name?: string;
  renter_avatar?: string;
  renter_rating?: number;
  renter_phone?: string;
  offer_count?: number;
  created_at?: string;
}

export interface RequestOffer {
  id: string;
  request_id: string;
  owner_id: string;
  product_id: string;
  offered_price: number;
  deposit: number;
  accessories: string; // JSON array
  delivery_option: 'PLATFORM_DELIVERY' | 'SELF_PICKUP';
  notes: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  ai_suitability_score: number;
  ai_suitability_reasons: string; // JSON array
  product_title?: string;
  product_images?: string;
  condition_score?: number;
  owner_name?: string;
  owner_avatar?: string;
  owner_rating?: number;
  created_at?: string;
}

export interface Rental {
  id: string;
  request_id?: string;
  offer_id?: string;
  product_id: string;
  renter_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  rental_days: number;
  daily_rate: number;
  rental_total: number;
  deposit_amount: number;
  delivery_fee: number;
  platform_fee: number;
  total_amount: number;
  payment_status: 'PENDING' | 'BUFFERED' | 'OWNER_RELEASED' | 'REFUNDED';
  deposit_status: 'HELD' | 'RELEASED' | 'DISPUTED' | 'DEDUCTED';
  rental_status: 'AGREEMENT_PENDING' | 'BUFFERED' | 'DISPATCHED' | 'ACTIVE' | 'RETURNING' | 'COMPLETED' | 'DISPUTED';
  handover_otp: string;
  return_otp: string;
  product_title?: string;
  brand?: string;
  model?: string;
  product_images?: string;
  condition_score?: number;
  renter_name?: string;
  renter_avatar?: string;
  renter_phone?: string;
  owner_name?: string;
  owner_avatar?: string;
  owner_phone?: string;
  logistics_status?: string;
  driver_name?: string;
  estimated_mins?: number;
  created_at?: string;
}

export interface RentalAgreement {
  id: string;
  rental_id: string;
  terms_text: string;
  renter_signed_at: string;
  owner_signed_at: string;
  contract_hash: string;
  created_at?: string;
}

export interface LogisticsOrder {
  id: string;
  rental_id: string;
  provider_name: string;
  driver_name: string;
  driver_phone: string;
  driver_vehicle: string;
  driver_vehicle_num: string;
  pickup_address: string;
  drop_address: string;
  status: 'REQUESTED' | 'DRIVER_ASSIGNED' | 'ARRIVING_PICKUP' | 'PICKED_UP' | 'IN_TRANSIT' | 'NEAR_DESTINATION' | 'DELIVERED' | 'OTP_CONFIRMED' | 'COMPLETED';
  pickup_condition_score: number;
  pickup_photos: string;
  delivery_photos?: string;
  current_lat: number;
  current_lng: number;
  estimated_mins: number;
  otp_code: string;
  stages?: Array<{ id: string; label: string; desc: string }>;
  currentStageIndex?: number;
  progressPercent?: number;
  isCompleted?: boolean;
}

export interface ConditionInspection {
  id: string;
  rental_id: string;
  stage: 'INITIAL_LISTING' | 'LOGISTICS_PICKUP' | 'DELIVERY_HANDOVER' | 'POST_RETURN';
  condition_score: number;
  detected_anomalies: string;
  photos: string;
  ai_analysis_summary: string;
  created_at?: string;
}

export interface Dispute {
  id: string;
  rental_id: string;
  initiator_id: string;
  claim_type: string;
  description: string;
  evidence_photos: string;
  ai_damage_assessment: string;
  deduction_requested: number;
  deduction_approved: number;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
  resolution_notes?: string;
  created_at?: string;
}

export interface Message {
  id: string;
  rental_id?: string;
  request_id?: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  timestamp: string;
  sender_name?: string;
  sender_avatar?: string;
}

export interface DemandStat {
  category: string;
  search_count: number;
  request_count: number;
  avg_budget: number;
  trend_growth_percent: number;
}
