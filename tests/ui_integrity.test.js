/**
 * GearFlow UI Integrity & Component State Validation
 */

const COMPONENT_STATES = {
  MODAL_CLOSED: 'CLOSED',
  MODAL_OPEN: 'OPEN',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS'
};

class UIStateManager {
  constructor() {
    this.bookingModal = COMPONENT_STATES.MODAL_CLOSED;
    this.chatbot = COMPONENT_STATES.MODAL_CLOSED;
    this.locationCaptured = false;
    this.formValid = false;
  }

  openBooking() {
    this.bookingModal = COMPONENT_STATES.MODAL_OPEN;
  }

  captureLocation() {
    if (this.bookingModal === COMPONENT_STATES.MODAL_OPEN) {
      this.locationCaptured = true;
    }
  }

  validateForm(name, phone, vehicle) {
    this.formValid = !!(name && phone && vehicle);
  }

  submitBooking() {
    if (this.formValid && this.locationCaptured) {
      this.bookingModal = COMPONENT_STATES.PROCESSING;
      return true;
    }
    return false;
  }
}

describe('GearFlow UI State Logic', () => {
  
  test('Booking Modal Workflow Integrity', () => {
    const ui = new UIStateManager();
    
    ui.openBooking();
    expect(ui.bookingModal).toBe(COMPONENT_STATES.MODAL_OPEN);
    
    ui.validateForm('Test User', '1234567890', 'Classic 350');
    expect(ui.formValid).toBe(true);
    
    // Attempt submit without location
    const failSubmit = ui.submitBooking();
    expect(failSubmit).toBe(false);
    expect(ui.bookingModal).toBe(COMPONENT_STATES.MODAL_OPEN);
    
    ui.captureLocation();
    const successSubmit = ui.submitBooking();
    expect(successSubmit).toBe(true);
    expect(ui.bookingModal).toBe(COMPONENT_STATES.PROCESSING);
  });

});
