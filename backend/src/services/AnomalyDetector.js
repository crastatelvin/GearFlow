/**
 * GearFlow AI Anomaly Detector
 * Monitors operations in real-time to flag unusual behavior.
 */

class AnomalyDetector {
  constructor() {
    this.SPEED_THRESHOLD_KMH = 60; // Max reasonable city speed for a bike
    this.STUCK_THRESHOLD_MINS = 15; // Flag if stationary for 15 mins during dispatch
    this.WRONG_DIRECTION_ANGLE = 90; // Flag if moving >90 degrees away from target
  }

  /**
   * Analyzes mechanic movement compared to customer target
   */
  async analyzeMovement(mechanicId, currentLoc, targetLoc, lastLoc, lastTimestamp) {
    const alerts = [];

    // 1. Check for "Stuck in Traffic / Not Moving"
    if (this.isStruck(currentLoc, lastLoc, lastTimestamp)) {
      alerts.push({
        type: 'STUCK_IN_TRANSIT',
        severity: 'MEDIUM',
        message: `Mechanic ${mechanicId} hasn't moved in ${this.STUCK_THRESHOLD_MINS} mins.`
      });
    }

    // 2. Check for "Wrong Direction" (Simple vector math)
    if (this.isWrongDirection(currentLoc, lastLoc, targetLoc)) {
      alerts.push({
        type: 'WRONG_DIRECTION',
        severity: 'HIGH',
        message: `Mechanic ${mechanicId} is moving away from the customer location.`
      });
    }

    return alerts;
  }

  isStruck(currentLoc, lastLoc, lastTimestamp) {
    if (!lastLoc) return false;
    const distance = this.calculateDistance(currentLoc, lastLoc);
    const timeDiffMins = (Date.now() - lastTimestamp) / 60000;
    
    return distance < 0.1 && timeDiffMins > this.STUCK_THRESHOLD_MINS;
  }

  isWrongDirection(currentLoc, lastLoc, targetLoc) {
    if (!lastLoc) return false;
    
    // Vector from last to target
    const vTarget = { x: targetLoc.lng - lastLoc.lng, y: targetLoc.lat - lastLoc.lat };
    // Vector from last to current
    const vCurrent = { x: currentLoc.lng - lastLoc.lng, y: currentLoc.lat - lastLoc.lat };

    // Calculate dot product to check angle
    const dotProduct = (vTarget.x * vCurrent.x) + (vTarget.y * vCurrent.y);
    const magTarget = Math.sqrt(vTarget.x ** 2 + vTarget.y ** 2);
    const magCurrent = Math.sqrt(vCurrent.x ** 2 + vCurrent.y ** 2);
    
    if (magTarget === 0 || magCurrent === 0) return false;
    
    const cosTheta = dotProduct / (magTarget * magCurrent);
    const angle = Math.acos(cosTheta) * (180 / Math.PI);

    return angle > this.WRONG_DIRECTION_ANGLE;
  }

  calculateDistance(loc1, loc2) {
    const latDiff = loc1.lat - loc2.lat;
    const lngDiff = loc1.lng - loc2.lng;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
  }
}

export default new AnomalyDetector();
