'use strict';

/**
 * Credit Calculator Utility
 * Handles credit calculation logic for skill exchanges
 */

module.exports = {
  /**
   * Calculate credits for a service request based on difficulty and duration
   * @param {string} skillLevel - beginner, intermediate, advanced, expert
   * @param {number} durationMinutes - Duration in minutes
   * @returns {number} Credits required
   */
  calculateCreditsRequired(skillLevel, durationMinutes) {
    const baseCredits = {
      beginner: 5,
      intermediate: 10,
      advanced: 15,
      expert: 25,
    };

    const creditsPerHour = baseCredits[skillLevel] || 10;
    const durationHours = durationMinutes / 60;

    return Math.ceil(creditsPerHour * durationHours);
  },

  /**
   * Award credits to a user for completing a service
   * @param {number} baseCredits - Base credits earned
   * @param {number} rating - User rating (1-5)
   * @returns {number} Total credits awarded
   */
  awardCredits(baseCredits, rating) {
    const bonus = (rating / 5) * 0.2; // Up to 20% bonus
    return Math.ceil(baseCredits * (1 + bonus));
  },

  /**
   * Deduct credits from user account
   * @param {number} currentCredits - Current balance
   * @param {number} creditsToDeduct - Amount to deduct
   * @returns {Object} New balance and success status
   */
  deductCredits(currentCredits, creditsToDeduct) {
    if (currentCredits < creditsToDeduct) {
      return {
        success: false,
        message: 'Insufficient credits',
        newBalance: currentCredits,
      };
    }

    return {
      success: true,
      newBalance: currentCredits - creditsToDeduct,
    };
  },
};
