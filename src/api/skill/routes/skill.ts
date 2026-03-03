/**
 * skill router
 */

/**
 * skill router
 *
 * Custom file defines the full CRUD endpoints plus extra actions.
 * Uses controller functions exported in ../controllers/skill.js.
 */

module.exports = {
  routes: [
    // standard collection routes
    {
      method: 'GET',
      path: '/skills',
      handler: 'api::skill.skill.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/skills/:id',
      handler: 'api::skill.skill.findOne',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/skills',
      handler: 'api::skill.skill.create',
      config: {},
    },
    {
      method: 'PUT',
      path: '/skills/:id',
      handler: 'api::skill.skill.update',
      config: {},
    },
    {
      method: 'DELETE',
      path: '/skills/:id',
      handler: 'api::skill.skill.delete',
      config: {},
    },
    // additional custom routes
    {
      method: 'GET',
      path: '/skills/me',
      handler: 'api::skill.skill.findMySkills',
      config: {},
    },
    {
      method: 'PUT',
      path: '/skills/:id/approve',
      handler: 'api::skill.skill.approve',
      config: {},
    },
    {
      method: 'PUT',
      path: '/skills/:id/reject',
      handler: 'api::skill.skill.reject',
      config: {},
    },
  ],
};
