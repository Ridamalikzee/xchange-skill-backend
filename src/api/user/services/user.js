'use strict';

/**
 * user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user.user', ({ strapi }) => ({
  // Custom service methods
  async getUserWithRelations(id) {
    return await strapi.db.query('api::user.user').findOne({
      where: { id },
      populate: ['profile', 'skills', 'role'],
    });
  },

  async updateUserProfile(id, data) {
    return await strapi.db.query('api::user.user').update({
      where: { id },
      data,
    });
  },
}));
