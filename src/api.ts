import {
  User,
  Product,
  RentalRequest,
  RequestOffer,
  Rental,
  LogisticsOrder,
  ConditionInspection,
  Dispute,
  Message,
  DemandStat
} from './types';

const API_BASE = '/api';

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchProducts(category?: string, search?: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);
  const res = await fetch(`${API_BASE}/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function createProduct(data: Partial<Product>): Promise<{ product: Product; aiInspection: any }> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to add product');
  return res.json();
}

export async function fetchRequests(renter_id?: string): Promise<RentalRequest[]> {
  const params = new URLSearchParams();
  if (renter_id) params.append('renter_id', renter_id);
  const res = await fetch(`${API_BASE}/requests?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

export async function fetchRequest(id: string): Promise<{ request: RentalRequest; offers: RequestOffer[] }> {
  const res = await fetch(`${API_BASE}/requests/${id}`);
  if (!res.ok) throw new Error('Failed to fetch request');
  return res.json();
}

export async function createRequest(data: {
  renter_id: string;
  raw_prompt: string;
  category?: string;
  budget_daily?: number;
  duration_days?: number;
  location?: string;
}): Promise<{ request: RentalRequest; aiStructured: any }> {
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create rental request');
  return res.json();
}

export async function submitOffer(requestId: string, data: {
  owner_id: string;
  product_id: string;
  offered_price: number;
  deposit: number;
  accessories?: string[];
  notes?: string;
}): Promise<{ offer: RequestOffer; suitability: any }> {
  const res = await fetch(`${API_BASE}/requests/${requestId}/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit offer');
  return res.json();
}

export async function acceptOffer(offerId: string): Promise<{
  success: boolean;
  rentalId: string;
  agreementId: string;
  logisticsId: string;
  breakdown: any;
  handoverOtp: string;
  message: string;
}> {
  const res = await fetch(`${API_BASE}/offers/${offerId}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to accept offer');
  return res.json();
}

export async function fetchRentals(renter_id?: string, owner_id?: string): Promise<Rental[]> {
  const params = new URLSearchParams();
  if (renter_id) params.append('renter_id', renter_id);
  if (owner_id) params.append('owner_id', owner_id);
  const res = await fetch(`${API_BASE}/rentals?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch rentals');
  return res.json();
}

export async function fetchRental(id: string): Promise<{
  rental: Rental;
  agreement: any;
  logistics: LogisticsOrder;
  inspections: ConditionInspection[];
  dispute?: Dispute;
}> {
  const res = await fetch(`${API_BASE}/rentals/${id}`);
  if (!res.ok) throw new Error('Failed to fetch rental');
  return res.json();
}

export async function progressLogistics(rentalId: string, status?: string): Promise<LogisticsOrder> {
  const res = await fetch(`${API_BASE}/rentals/${rentalId}/logistics/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to progress delivery');
  return res.json();
}

export async function verifyLogisticsOtp(rentalId: string, otp: string): Promise<{ success: boolean; message: string; status: string }> {
  const res = await fetch(`${API_BASE}/rentals/${rentalId}/logistics/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'OTP verification failed');
  }
  return res.json();
}

export async function extendRental(rentalId: string, additional_days: number): Promise<any> {
  const res = await fetch(`${API_BASE}/rentals/${rentalId}/extend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ additional_days })
  });
  if (!res.ok) throw new Error('Failed to extend rental');
  return res.json();
}

export async function returnRental(rentalId: string, data: { returnNotes: string; returnPhotos?: string[] }): Promise<any> {
  const res = await fetch(`${API_BASE}/rentals/${rentalId}/return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit return');
  return res.json();
}

export async function openDispute(rentalId: string, data: {
  initiator_id: string;
  claim_type: string;
  description: string;
  deduction_requested: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/rentals/${rentalId}/dispute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to open dispute');
  return res.json();
}

export async function resolveDispute(rentalId: string, data: { deductionApproved: number; resolutionNotes: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/rentals/${rentalId}/dispute/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to resolve dispute');
  return res.json();
}

export async function submitReview(rentalId: string, data: {
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  review_type: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/rentals/${rentalId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return res.json();
}

export async function parseRequirementAI(prompt: string): Promise<any> {
  const res = await fetch(`${API_BASE}/ai/parse-requirement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error('Failed to parse requirement');
  return res.json();
}

export async function askRentoAI(message: string): Promise<{ reply: string; suggestions?: string[] }> {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error('Failed to ask AI');
  return res.json();
}

export async function fetchDemandInsights(): Promise<{ marketOverview: string; topCategories: DemandStat[] }> {
  const res = await fetch(`${API_BASE}/ai/demand-insights`);
  if (!res.ok) throw new Error('Failed to fetch demand insights');
  return res.json();
}

export async function fetchMessages(rental_id?: string, request_id?: string): Promise<Message[]> {
  const params = new URLSearchParams();
  if (rental_id) params.append('rental_id', rental_id);
  if (request_id) params.append('request_id', request_id);
  const res = await fetch(`${API_BASE}/messages?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function sendMessage(data: {
  rental_id?: string;
  request_id?: string;
  sender_id: string;
  receiver_id: string;
  message: string;
}): Promise<Message> {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}
