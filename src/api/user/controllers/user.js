'use strict';

/**
 * user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user.user', ({ strapi }) => ({
  // Custom controller methods
  async getUserProfile(ctx) {
    try {
      const { id } = ctx.params;
      const user = await strapi.db.query('api::user.user').findOne({
        where: { id },
      });
      
      if (!user) {
        ctx.status = 404;
        ctx.body = { error: 'User not found' };
        return;
      }
      
      ctx.body = { data: user };
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },
}));
