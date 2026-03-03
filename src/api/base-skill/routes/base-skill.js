/**
 * base-skill router
 */

'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/base-skills',
      handler: 'base-skill.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/base-skills/:id',
      handler: 'base-skill.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/base-skills',
      handler: 'base-skill.create',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'PUT',
      path: '/base-skills/:id',
      handler: 'base-skill.update',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'DELETE',
      path: '/base-skills/:id',
      handler: 'base-skill.delete',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
  ],
};
