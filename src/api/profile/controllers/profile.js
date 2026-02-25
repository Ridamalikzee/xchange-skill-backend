'use strict';

/**
 * profile controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::profile.profile', ({ strapi }) => ({
  // Custom controller methods
  async signup(ctx) {
    const { email, password, ...profileData } = ctx.request.body;
    if (!email || !password) {
      return ctx.badRequest('Email and password are required');
    }
    // 1. Create user in users-permissions plugin
    const user = await strapi.plugins['users-permissions'].services.user.add({
      email,
      password,
      username: email,
      confirmed: true,
      blocked: false,
    });
    // 2. Create profile and link to user
    const profile = await strapi.entityService.create('api::profile.profile', {
      data: {
        ...profileData,
        user: user.id,
      },
    });
    // 3. Return created user and profile
    ctx.send({ user, profile });
  },
}));
