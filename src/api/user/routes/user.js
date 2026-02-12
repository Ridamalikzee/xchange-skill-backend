'use strict';

/**
 * user route
 */

const { createCoreRoute } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/users/:id/profile',
      handler: 'api::user.user.getUserProfile',
      config: { policies: [] },
    },
  ],
};
