import { db } from './db.js';
import { RentoEscrowService } from './escrow.js';

export const LOGISTICS_STAGES = [
  { id: 'REQUESTED', label: 'Delivery Requested', desc: 'Logistics booking created in Porter partner network' },
  { id: 'DRIVER_ASSIGNED', label: 'Driver Assigned', desc: 'Verified driver and vehicle assigned to order' },
  { id: 'ARRIVING_PICKUP', label: 'Arriving at Pickup', desc: 'Driver en route to supplier location' },
  { id: 'PICKED_UP', label: 'Product Picked Up', desc: 'Pre-dispatch inspection and condition verified' },
  { id: 'IN_TRANSIT', label: 'In Transit', desc: 'Package safely in transit via express partner' },
  { id: 'NEAR_DESTINATION', label: 'Near Destination', desc: 'Driver is within 1.5 km of delivery address' },
  { id: 'DELIVERED', label: 'Delivered to Doorstep', desc: 'Driver has arrived at destination' },
  { id: 'OTP_CONFIRMED', label: 'OTP Handover Verified', desc: 'Renter inspected item and confirmed OTP' },
  { id: 'COMPLETED', label: 'Delivery Completed', desc: 'Milestone verified, rental begins, payment released' }
] as const;

export class RentoLogisticsService {
  /**
   * Advance the logistics order to the next stage or a specific stage
   */
  static progressLogisticsOrder(rentalId: string, targetStatus?: string) {
    const order = db.prepare('SELECT * FROM logistics_orders WHERE rental_id = ?').get(rentalId) as any;
    if (!order) throw new Error('Logistics order not found');

    const currentIndex = LOGISTICS_STAGES.findIndex(s => s.id === order.status);
    let nextStageId = targetStatus;

    if (!nextStageId) {
      if (currentIndex < LOGISTICS_STAGES.length - 1) {
        nextStageId = LOGISTICS_STAGES[currentIndex + 1].id;
      } else {
        nextStageId = 'COMPLETED';
      }
    }

    // Adjust coordinates and ETA based on stage
    let lat = order.current_lat;
    let lng = order.current_lng;
    let mins = order.estimated_mins;

    if (nextStageId === 'DRIVER_ASSIGNED') {
      mins = 45;
    } else if (nextStageId === 'ARRIVING_PICKUP') {
      mins = 35;
      lat = 28.5700;
      lng = 77.2200;
    } else if (nextStageId === 'PICKED_UP') {
      mins = 25;
      lat = 28.5800;
      lng = 77.2250;
    } else if (nextStageId === 'IN_TRANSIT') {
      mins = 15;
      lat = 28.6400;
      lng = 77.2150;
    } else if (nextStageId === 'NEAR_DESTINATION') {
      mins = 5;
      lat = 28.6850;
      lng = 77.2100;
    } else if (nextStageId === 'DELIVERED' || nextStageId === 'OTP_CONFIRMED' || nextStageId === 'COMPLETED') {
      mins = 0;
      lat = 28.6900;
      lng = 77.2080;
    }

    db.prepare(`
      UPDATE logistics_orders
      SET status = ?, current_lat = ?, current_lng = ?, estimated_mins = ?, updated_at = CURRENT_TIMESTAMP
      WHERE rental_id = ?
    `).run(nextStageId, lat, lng, mins, rentalId);

    // If reached COMPLETED or OTP_CONFIRMED, trigger escrow release
    if (nextStageId === 'OTP_CONFIRMED' || nextStageId === 'COMPLETED') {
      RentoEscrowService.releaseOwnerPayoutUponDelivery(rentalId);
    }

    return this.getLogisticsStatus(rentalId);
  }

  /**
   * Verify renter handover OTP to complete delivery
   */
  static verifyHandoverOTP(rentalId: string, inputOtp: string) {
    const order = db.prepare('SELECT * FROM logistics_orders WHERE rental_id = ?').get(rentalId) as any;
    if (!order) throw new Error('Logistics order not found');

    if (order.otp_code.trim() !== inputOtp.trim()) {
      return { success: false, message: `Invalid OTP. Please check the 4-digit code provided on your dashboard.` };
    }

    // Progress to OTP_CONFIRMED then COMPLETED
    this.progressLogisticsOrder(rentalId, 'OTP_CONFIRMED');
    this.progressLogisticsOrder(rentalId, 'COMPLETED');

    return {
      success: true,
      message: 'Delivery verified successfully! Owner payment released from escrow buffer.',
      status: 'COMPLETED'
    };
  }

  /**
   * Get formatted logistics tracking data
   */
  static getLogisticsStatus(rentalId: string) {
    const order = db.prepare('SELECT * FROM logistics_orders WHERE rental_id = ?').get(rentalId) as any;
    if (!order) return null;

    const currentStageIndex = LOGISTICS_STAGES.findIndex(s => s.id === order.status);
    const progressPercent = Math.round(((currentStageIndex + 1) / LOGISTICS_STAGES.length) * 100);

    return {
      ...order,
      stages: LOGISTICS_STAGES,
      currentStageIndex,
      progressPercent,
      isCompleted: order.status === 'COMPLETED' || order.status === 'OTP_CONFIRMED'
    };
  }
}
