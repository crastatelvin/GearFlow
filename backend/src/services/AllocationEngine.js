/**
 * GearFlow Smart Allocation Engine
 * Autonomously matches leads to the best available mechanics.
 */

class AllocationEngine {
  constructor() {
    this.DEFAULT_RADIUS_KM = 5;
    this.REALLOCATION_TIMEOUT_MS = 60000; // 1 minute
  }

  /**
   * Finds the best mechanic for a new lead
   */
  async findOptimalMechanic(leadLocation, mechanics) {
    console.log(`[ALLOCATION] Searching for mechanics within ${this.DEFAULT_RADIUS_KM}km of lead...`);

    const availableMechanics = mechanics.filter(m => m.status === 'AVAILABLE');
    
    if (availableMechanics.length === 0) {
      console.log(`[ALLOCATION] No available mechanics found.`);
      return null;
    }

    // Sort by distance and then by rating (AI Weighted Ranking)
    const rankedMechanics = availableMechanics
      .map(m => ({
        ...m,
        distance: this.calculateDistance(leadLocation, m.location),
        score: this.calculateAIScore(m)
      }))
      .filter(m => m.distance <= this.DEFAULT_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance || b.score - a.score);

    if (rankedMechanics.length === 0) {
      console.log(`[ALLOCATION] No mechanics within radius.`);
      return null;
    }

    const primaryTarget = rankedMechanics[0];
    console.log(`[ALLOCATION] Optimal Mechanic Found: ${primaryTarget.name} (${primaryTarget.distance.toFixed(2)}km away)`);
    
    return primaryTarget;
  }

  /**
   * Simple Euclidean distance for simulation (to be replaced by Google Distance Matrix API)
   */
  calculateDistance(loc1, loc2) {
    const latDiff = loc1.lat - loc2.lat;
    const lngDiff = loc1.lng - loc2.lng;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Approx conversion to KM
  }

  /**
   * AI Weighting: Priority = (Rating * 0.7) + (Experience_Weight * 0.3)
   */
  calculateAIScore(mechanic) {
    return (mechanic.rating * 0.7) + ((mechanic.jobs_completed / 100) * 0.3);
  }

  /**
   * Handles reallocation if a mechanic rejects or times out
   */
  async reallocate(leadId, currentMechanicId, mechanics) {
    console.log(`[ALLOCATION] Reallocating lead ${leadId} away from ${currentMechanicId}...`);
    // Logic to pick the next best from the ranked list
  }
}

export default new AllocationEngine();
