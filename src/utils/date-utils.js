'use strict';

/**
 * Date Utilities
 */

module.exports = {
  /**
   * Get the current date in ISO format
   * @returns {string} ISO date string
   */
  getCurrentDateISO() {
    return new Date().toISOString();
  },

  /**
   * Check if a date is in the past
   * @param {string|Date} date - Date to check
   * @returns {boolean} True if date is in the past
   */
  isInPast(date) {
    return new Date(date) < new Date();
  },

  /**
   * Add days to a date
   * @param {Date} date - Base date
   * @param {number} days - Number of days to add
   * @returns {Date} New date
   */
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  /**
   * Get difference between two dates in days
   * @param {Date} date1 - First date
   * @param {Date} date2 - Second date
   * @returns {number} Difference in days
   */
  getDaysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
  },
};
