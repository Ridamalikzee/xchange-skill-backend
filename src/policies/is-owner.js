'use strict';

/**
 * is-owner policy - Verify user is the owner of a resource
 */

module.exports = (policyContext, config, { strapi }) => {
  return async (ctx, next) => {
    const { id } = ctx.params;
    const { user } = ctx.state;

    if (!user) {
      return ctx.forbidden('Unauthorized');
    }

    const entity = await strapi.db.query(config.model).findOne({
      where: { id },
    });

    if (!entity) {
      return ctx.notFound('Entity not found');
    }

    if (entity.userId !== user.id) {
      return ctx.forbidden('You do not have permission to access this resource');
    }

    return next();
  };
};
