/**
 * GearFlow Payment Service
 * Handles Stripe / Razorpay integrations and Payout calculations.
 */

class PaymentService {
  constructor() {
    this.useMock = process.env.PAYMENT_PROVIDER === 'MOCK' || true;
  }

  /**
   * Generates a payment link for the 200 Booking Fee or Final Bill
   */
  async createPaymentLink(amount, orderId, type = 'BOOKING') {
    const mockLink = `https://payments.gearflow.ai/pay/${orderId}?amount=${amount}`;
    
    if (this.useMock) {
      console.log(`[PAYMENT_MOCK] Created ${type} link for Order ${orderId}: ${mockLink}`);
      return { success: true, link: mockLink };
    }

    // TODO: Implement Stripe Checkout Session here
    // const session = await stripe.checkout.sessions.create({ ... });
    // return session.url;
  }

  /**
   * Calculates the 70/30 split and updates wallets
   */
  async processSplit(totalAmount, mechanicId) {
    const mechanicShare = totalAmount * 0.70;
    const companyShare = totalAmount * 0.30;
    
    console.log(`[PAYMENT_LOGIC] Processing 70/30 Split: Mechanic(₹${mechanicShare}), GearFlow(₹${companyShare})`);
    
    // TODO: DB logic to update mechanic_wallets table
    return { mechanicShare, companyShare };
  }

  /**
   * Verifies if a payment was successful (Webhook Simulator)
   */
  async verifyPayment(transactionId) {
    // In production, this would be triggered by a Stripe Webhook
    return { status: 'COMPLETED', timestamp: new Date() };
  }
}

export default new PaymentService();
