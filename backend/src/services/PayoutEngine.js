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
   * Processes the weekly/monthly salary rollout
   */
  async rolloutMonthlySalary() {
    console.log(`[PAYOUT] Starting Salary Rollout...`);
    
    try {
      // 1. Fetch all mechanics with positive balances
      const result = await query('SELECT id, wallet_balance FROM mechanics WHERE wallet_balance > 0');
      const mechanics = result.rows;
      let processedCount = 0;

      for (const mechanic of mechanics) {
        const amount = mechanic.wallet_balance;

        // 2. Log transaction in wallet_transactions table
        await query(
          'INSERT INTO wallet_transactions (mechanic_id, type, amount, status) VALUES ($1, $2, $3, $4)',
          [mechanic.id, 'PAYOUT', amount, 'PAID_OUT']
        );

        // 3. Reset wallet balance in mechanics table
        await query(
          'UPDATE mechanics SET wallet_balance = 0.00 WHERE id = $1',
          [mechanic.id]
        );

        processedCount++;
      }

      console.log(`[PAYOUT] Rollout completed successfully. Processed ${processedCount} mechanics.`);
      return { success: true, processedCount };
    } catch (error) {
      console.error('[PAYOUT] Rollout failed:', error);
      throw error;
    }
  }
}

export default new PayoutEngine();
