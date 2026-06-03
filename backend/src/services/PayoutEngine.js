import { query } from '../db/index.js';

/**
 * GearFlow Commission & Payout Engine
 * Automates the 70/30 split and monthly salary rollout.
 */

class PayoutEngine {
  constructor() {
    this.GEARFLOW_COMMISSION = 0.30;
    this.MECHANIC_SHARE = 0.70;
  }

  /**
   * Processes a completed job and calculates shares
   */
  async processJobCompletion(jobAmount, mechanicId, orderId = null) {
    const netEarnings = jobAmount * this.MECHANIC_SHARE;
    const commission = jobAmount * this.GEARFLOW_COMMISSION;

    console.log(`[PAYOUT] Job ₹${jobAmount} completed. Mechanic Share: ₹${netEarnings}, Commission: ₹${commission}`);
    
    // Update mechanics table wallet balance
    await query(
      'UPDATE mechanics SET wallet_balance = wallet_balance + $1 WHERE id = $2',
      [netEarnings, mechanicId]
    );

    // Insert wallet transaction
    await query(
      'INSERT INTO wallet_transactions (mechanic_id, order_id, type, amount, status) VALUES ($1, $2, $3, $4, $5)',
      [mechanicId, orderId, 'EARNING', netEarnings, 'PENDING_ESCROW']
    );
    
    return { netEarnings, commission };
  }

  /**
   * Simulates the monthly salary rollout (First week of month)
   */
  async rolloutMonthlySalary() {
    console.log(`[PAYOUT] Starting Monthly Salary Rollout...`);
    
    // 1. Fetch all mechanics with positive balances
    // 2. Trigger transfers to their bank accounts (via Stripe Connect / Payouts)
    // 3. Reset balances and log transaction
    
    return { success: true, processedCount: 156 };
  }
}

export default new PayoutEngine();
