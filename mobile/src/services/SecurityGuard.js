/**
 * GearFlow Security Guard
 * Handles native security checks like Root detection, Emulator detection, and SIM validation.
 * In production, use libraries like 'jail-monkey' and 'react-native-device-info'.
 */

class SecurityGuard {
  constructor() {
    this.isEmulator = false;
    this.isRooted = false;
    this.hasSim = true;
  }

  /**
   * Performs a full security sweep of the device
   */
  async performSecurityAudit() {
    console.log('[SECURITY] Starting device audit...');
    
    // 1. Emulator Check
    if (this.detectEmulator()) {
      return { 
        secure: false, 
        reason: 'VIRTUAL_DEVICE_DETECTED', 
        message: 'GearFlow does not allow virtual devices. Please use a real mobile device.' 
      };
    }

    // 2. Root Check
    if (this.detectRoot()) {
      return { 
        secure: false, 
        reason: 'DEVICE_ROOTED', 
        message: 'Your device appears to be rooted. For security reasons, GearFlow cannot run on rooted devices.' 
      };
    }

    // 3. SIM Validation
    if (!this.hasSim) {
      return { 
        secure: false, 
        reason: 'NO_SIM_CARD', 
        message: 'No active SIM card detected. GearFlow requires a registered SIM to function.' 
      };
    }

    console.log('[SECURITY] Device audit passed. Zero-trust established.');
    return { secure: true };
  }

  detectEmulator() {
    // Production: return await DeviceInfo.isEmulator();
    return this.isEmulator; 
  }

  detectRoot() {
    // Production: return JailMonkey.isJailBroken();
    return this.isRooted;
  }

  setSimStatus(status) {
    this.hasSim = status;
  }
}

export default new SecurityGuard();
