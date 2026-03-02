'use strict';

/**
 * is-not-blocked policy - Verify user is not blocked
 */

module.exports = (policyContext, config, { strapi }) => {
  return async (ctx, next) => {
    const { user } = ctx.state;

    if (!user) {
      return ctx.forbidden('Unauthorized');
    }

    const blocked = await strapi.db.query('api::block.block').findOne({
      where: {
        blocked: user.id,
      },
    });

    if (blocked) {
      return ctx.forbidden('You are blocked from this action');
    }

    return next();
  };
};
