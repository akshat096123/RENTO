import { db } from './db.js';

export interface PaymentBreakdown {
  rentalTotal: number;
  depositAmount: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
}

export class RentoEscrowService {
  /**
   * Calculate precise financial breakdown for a rental
   */
  static calculateBreakdown(dailyRate: number, rentalDays: number, deposit: number, deliveryRequired: boolean = true): PaymentBreakdown {
    const rentalTotal = Math.round(dailyRate * rentalDays);
    const deliveryFee = deliveryRequired ? 350 : 0;
    const platformFee = Math.round(rentalTotal * 0.10); // 10% platform fee
    const totalAmount = rentalTotal + deposit + deliveryFee + platformFee;

    return {
      rentalTotal,
      depositAmount: deposit,
      deliveryFee,
      platformFee,
      totalAmount
    };
  }

  /**
   * Release rental payment to owner when delivery OTP milestone is completed
   * Security deposit remains protected in escrow
   */
  static releaseOwnerPayoutUponDelivery(rentalId: string) {
    const rental = db.prepare('SELECT * FROM rentals WHERE id = ?').get(rentalId) as any;
    if (!rental) throw new Error('Rental not found');

    if (rental.payment_status === 'OWNER_RELEASED') {
      return { success: true, message: 'Owner funds already released' };
    }

    db.prepare(`
      UPDATE rentals 
      SET payment_status = 'OWNER_RELEASED', 
          rental_status = 'ACTIVE' 
      WHERE id = ?
    `).run(rentalId);

    // Update owner total rentals stats
    db.prepare(`
      UPDATE users 
      SET total_rentals = total_rentals + 1 
      WHERE id = ?
    `).run(rental.owner_id);

    return {
      success: true,
      rentalId,
      releasedToOwner: rental.rental_total,
      releasedToLogistics: rental.delivery_fee,
      rentoCommission: rental.platform_fee,
      depositRemainingInEscrow: rental.deposit_amount,
      status: 'ACTIVE_RENTAL'
    };
  }

  /**
   * Release security deposit back to renter after safe return
   */
  static releaseSecurityDeposit(rentalId: string) {
    const rental = db.prepare('SELECT * FROM rentals WHERE id = ?').get(rentalId) as any;
    if (!rental) throw new Error('Rental not found');

    db.prepare(`
      UPDATE rentals 
      SET deposit_status = 'RELEASED', 
          rental_status = 'COMPLETED' 
      WHERE id = ?
    `).run(rentalId);

    return {
      success: true,
      rentalId,
      refundedDeposit: rental.deposit_amount,
      status: 'COMPLETED'
    };
  }

  /**
   * Handle damage claim deduction from deposit
   */
  static deductDepositForDamage(rentalId: string, deductionAmount: number, reason: string) {
    const rental = db.prepare('SELECT * FROM rentals WHERE id = ?').get(rentalId) as any;
    if (!rental) throw new Error('Rental not found');

    const cappedDeduction = Math.min(rental.deposit_amount, deductionAmount);
    const refundRemaining = rental.deposit_amount - cappedDeduction;

    db.prepare(`
      UPDATE rentals 
      SET deposit_status = 'DEDUCTED', 
          rental_status = 'COMPLETED' 
      WHERE id = ?
    `).run(rentalId);

    return {
      success: true,
      rentalId,
      deductedToOwner: cappedDeduction,
      refundedToRenter: refundRemaining,
      reason
    };
  }
}
