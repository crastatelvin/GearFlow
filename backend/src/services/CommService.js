/**
 * GearFlow Communication Service
 * Handles WhatsApp, SMS, and Email integrations.
 * Ready for Twilio / Interakt / SendGrid.
 */

class CommService {
  constructor() {
    this.useMock = process.env.COMM_PROVIDER === 'MOCK' || true;
  }

  /**
   * Sends a 4-digit OTP for Lead Verification
   */
  async sendOTP(to, channel = 'whatsapp') {
    const otp = Math.floor(1000 + Math.random() * 9000);
    
    if (this.useMock) {
      console.log(`[COMM_MOCK] Sending OTP ${otp} to ${to} via ${channel}`);
      return { success: true, otp }; // In production, don't return OTP, verify via DB
    }

    // TODO: Implement Twilio / Interakt API call here
    // return await twilio.messages.create({ ... });
  }

  /**
   * Sends Booking Confirmation with Live Tracking Link
   */
  async sendBookingConfirmation(to, bookingId, trackingLink) {
    const message = `GearFlow: Your booking ${bookingId} is confirmed! Track your mechanic here: ${trackingLink}`;
    
    if (this.useMock) {
      console.log(`[COMM_MOCK] Sending Confirmation to ${to}: ${message}`);
      return { success: true };
    }

    // TODO: Implement WhatsApp Template Message here
  }

  /**
   * Notifies customer that Mechanic has arrived
   */
  async notifyArrival(to, otp) {
    const message = `GearFlow: Your mechanic has arrived. Please provide this OTP to start work: ${otp}`;
    
    if (this.useMock) {
      console.log(`[COMM_MOCK] Arrival Notification to ${to}: ${message}`);
      return { success: true };
    }
  }
}

export default new CommService();
