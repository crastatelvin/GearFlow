import { query } from '../db/index.js';

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
        distance: this.calculateDistance(leadLocation, m.location || { lat: m.current_lat, lng: m.current_lng }),
        score: this.calculateAIScore(m)
      }))
      .filter(m => m.distance <= this.DEFAULT_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance || b.score - a.score);

    if (rankedMechanics.length === 0) {
      console.log(`[ALLOCATION] No mechanics within radius.`);
      return null;
    }

    const primaryTarget = rankedMechanics[0];
    console.log(`[ALLOCATION] Optimal Mechanic Found: ${primaryTarget.name || primaryTarget.full_name} (${primaryTarget.distance.toFixed(2)}km away)`);
    
    return primaryTarget;
  }

  /**
   * Simple Euclidean distance for simulation (to be replaced by Google Distance Matrix API)
   */
  calculateDistance(loc1, loc2) {
    if (!loc1 || !loc2) return 999;
    const latDiff = loc1.lat - loc2.lat;
    const lngDiff = loc1.lng - loc2.lng;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Approx conversion to KM
  }

  /**
   * AI Weighting: Priority = (Rating * 0.7) + (Experience_Weight * 0.3)
   */
  calculateAIScore(mechanic) {
    const rating = mechanic.rating || mechanic.average_rating || 5.0;
    const jobsCompleted = mechanic.jobs_completed || 0;
    return (rating * 0.7) + ((jobsCompleted / 100) * 0.3);
  }

  /**
   * Handles reallocation if a mechanic rejects or times out
   */
  async reallocate(leadId, currentMechanicId, mechanics) {
    console.log(`[ALLOCATION] Reallocating lead ${leadId} away from ${currentMechanicId}...`);
    
    // Filter out the current mechanic who rejected/timed out
    const remainingMechanics = mechanics.filter(m => m.id !== currentMechanicId);
    
    // Fetch lead location from DB
    let leadLocation = { lat: 28.6139, lng: 77.2090 }; // Default delhi coordinates
    try {
      const leadResult = await query('SELECT location_lat, location_lng FROM orders WHERE id = $1', [leadId]);
      if (leadResult.rows.length > 0) {
        leadLocation = {
          lat: leadResult.rows[0].location_lat,
          lng: leadResult.rows[0].location_lng
        };
      }
    } catch (e) {
      console.error("[ALLOCATION] Failed to fetch lead location, using default coords", e);
    }

    const nextBest = await this.findOptimalMechanic(leadLocation, remainingMechanics);
    if (!nextBest) {
      console.log(`[ALLOCATION] Reallocation failed: No alternative mechanics available.`);
      // Update order status back to AWAITING_MECHANIC
      await query(
        'UPDATE orders SET status = $1, mechanic_id = NULL, mechanic_name = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['AWAITING_MECHANIC', leadId]
      );
      return null;
    }

    // Update order with new mechanic details
    await query(
      'UPDATE orders SET mechanic_id = $1, mechanic_name = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [nextBest.id, nextBest.full_name || nextBest.name, 'DISPATCHED', leadId]
    );

    console.log(`[ALLOCATION] Lead ${leadId} successfully reallocated to ${nextBest.full_name || nextBest.name}`);
    return nextBest;
  }
}

export default new AllocationEngine();
