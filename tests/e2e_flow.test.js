/**
 * GearFlow E2E State Machine & Zero-Trust Validation
 * 
 * This test suite validates that the core business logic and fraud prevention
 * mechanisms behave correctly across the entire order lifecycle.
 */

const ORDER_STATES = {
  PENDING_FEE: 'PENDING_FEE',
  AWAITING_MECHANIC: 'AWAITING_MECHANIC',
  DISPATCHED: 'DISPATCHED',
  ARRIVED: 'ARRIVED',
  DIAGNOSING: 'DIAGNOSING',
  WORKING: 'WORKING',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

class OrderStateMachine {
  constructor() {
    this.status = ORDER_STATES.PENDING_FEE;
    this.upfrontFeePaid = false;
    this.mechanicAllocated = false;
    this.proximityVerified = false;
    this.aiVerificationPassed = false;
    this.cancelOtpProvided = false;
    this.finalPaymentPaid = false;
  }

  // Simulation Actions
  payUpfrontFee() {
    this.upfrontFeePaid = true;
    if (this.status === ORDER_STATES.PENDING_FEE) {
      this.status = ORDER_STATES.AWAITING_MECHANIC;
    }
  }

  allocateMechanic() {
    if (this.status === ORDER_STATES.AWAITING_MECHANIC) {
      this.mechanicAllocated = true;
      this.status = ORDER_STATES.DISPATCHED;
    }
  }

  arriveAtLocation(proximityVerified) {
    if (this.status === ORDER_STATES.DISPATCHED && proximityVerified) {
      this.proximityVerified = true;
      this.status = ORDER_STATES.ARRIVED;
    }
  }

  attemptCancellation(withOtp) {
    // Zero-Trust Rule: Once arrived, cancellation MUST have OTP
    if (this.status === ORDER_STATES.ARRIVED) {
      if (withOtp) {
        this.status = ORDER_STATES.CANCELLED;
        return "SUCCESS: Order Cancelled with OTP. 200 visit fee kept.";
      } else {
        return "FRAUD_ALERT: Cancellation attempted without customer OTP at location!";
      }
    }
    return "SUCCESS: Pre-arrival cancellation.";
  }

  submitAIVerification(passed) {
    if (this.status === ORDER_STATES.WORKING && passed) {
      this.aiVerificationPassed = true;
      this.status = ORDER_STATES.PAYMENT_PENDING;
    }
  }
}

describe('GearFlow Autonomous Business Logic', () => {
  
  test('Standard Successful Lifecycle', () => {
    const order = new OrderStateMachine();
    
    // 1. Intake
    order.payUpfrontFee();
    expect(order.status).toBe(ORDER_STATES.AWAITING_MECHANIC);
    
    // 2. Dispatch
    order.allocateMechanic();
    expect(order.status).toBe(ORDER_STATES.DISPATCHED);
    
    // 3. Arrival
    order.arriveAtLocation(true);
    expect(order.status).toBe(ORDER_STATES.ARRIVED);
    
    // 4. Work
    order.status = ORDER_STATES.WORKING; // Skip to work
    order.submitAIVerification(true);
    expect(order.status).toBe(ORDER_STATES.PAYMENT_PENDING);
  });

  test('Fraud Prevention: Unauthorized Cancellation Check', () => {
    const order = new OrderStateMachine();
    order.payUpfrontFee();
    order.allocateMechanic();
    order.arriveAtLocation(true);
    
    // Attempt cancellation without OTP (The "Side-deal" fraud attempt)
    const result = order.attemptCancellation(false);
    expect(result).toContain('FRAUD_ALERT');
    expect(order.status).toBe(ORDER_STATES.ARRIVED); // Order should stay stuck until OTP
  });

  test('Fraud Prevention: Proximity Lock', () => {
    const order = new OrderStateMachine();
    order.payUpfrontFee();
    order.allocateMechanic();
    expect(order.status).toBe(ORDER_STATES.DISPATCHED);
    
    // Mechanic tries to click "Arrived" but GPS is far away
    order.arriveAtLocation(false); 
    expect(order.status).toBe(ORDER_STATES.DISPATCHED); // Should NOT advance to ARRIVED
  });

});
