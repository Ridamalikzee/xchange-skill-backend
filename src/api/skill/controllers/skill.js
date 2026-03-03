'use strict';

/**
 * skill controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::skill.skill', ({ strapi }) => ({
  // Override find to populate categories
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: { category: true } };
    return await super.find(ctx);
  },

  // Override findOne to populate categories
  async findOne(ctx) {
    ctx.query = { ...ctx.query, populate: { category: true } };
    return await super.findOne(ctx);
  },

  // Override create to attach current user
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to create a skill');
    }
    ctx.request.body.data.user = user.id;
    return await super.create(ctx);
  },

  // Override update to check ownership
  async update(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }
    const existing = await strapi.entityService.findOne('api::skill.skill', id);
    if (!existing) {
      return ctx.notFound('Skill not found');
    }
    if (existing.user?.id !== user.id) {
      return ctx.forbidden('You can only modify your own skills');
    }
    return await super.update(ctx);
  },

  // Override delete to check ownership and service requests
  async delete(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }
    const existing = await strapi.entityService.findOne('api::skill.skill', id, {
      populate: { serviceRequests: true },
    });
    if (!existing) {
      return ctx.notFound('Skill not found');
    }
    if (existing.user?.id !== user.id) {
      return ctx.forbidden('You can only delete your own skills');
    }
    if (existing.serviceRequests && existing.serviceRequests.length > 0) {
      return ctx.badRequest('Cannot delete skill with active service requests');
    }
    return await super.delete(ctx);
  },

  // Get current user's skills
  async findMySkills(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }
    const skills = await strapi.entityService.findMany('api::skill.skill', {
      filters: { user: user.id },
      populate: { category: true },
    });
    return { data: skills };
  },

  // Approve a pending skill
  async approve(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }
    const skill = await strapi.entityService.findOne('api::skill.skill', id, {
      populate: { user: true, category: true },
    });
    if (!skill) {
      return ctx.notFound('Skill not found');
    }
    if (skill.status !== 'pending') {
      return ctx.badRequest('Only pending skills can be approved');
    }
    const updated = await strapi.entityService.update('api::skill.skill', id, {
      data: { status: 'approved' },
    });
    return { data: updated };
  },

  // Reject a pending skill
  async reject(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }
    const { reason } = ctx.request.body;
    const skill = await strapi.entityService.findOne('api::skill.skill', id, {
      populate: { user: true },
    });
    if (!skill) {
      return ctx.notFound('Skill not found');
    }
    if (skill.status !== 'pending') {
      return ctx.badRequest('Only pending skills can be rejected');
    }
    const updated = await strapi.entityService.update('api::skill.skill', id, {
      data: {
        status: 'rejected',
        rejectionReason: reason || 'No reason provided',
      },
    });
    return { data: updated };
  },
}));
