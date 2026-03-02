'use strict';

/**
 * Response Utilities
 * Helper functions for consistent API responses
 */

module.exports = {
  /**
   * Success response formatter
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   * @returns {Object} Formatted response
   */
  successResponse(data, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  },

  /**
   * Error response formatter
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {any} error - Error details
   * @returns {Object} Formatted response
   */
  errorResponse(message = 'Error', statusCode = 500, error = null) {
    return {
      success: false,
      statusCode,
      message,
      error,
    };
  },

  /**
   * Paginated response formatter
   * @param {any[]} data - Array of items
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total items count
   * @returns {Object} Formatted paginated response
   */
  paginatedResponse(data, page, limit, total) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },
};
