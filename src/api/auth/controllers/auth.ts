/**
 * A set of functions called "actions" for `auth`
 */

export default {
  // Signup endpoint
  async signup(ctx) {
    try {
      console.log(ctx?.request?.body, 'ctx.request');
      
      const { email, password, firstName, lastName, username } = ctx.request.body;
      // use global strapi instance (ctx.strapi is not set in controllers)
      const strapi = global.strapi;
      debugger
      // Validate required fields
      if (!email || !password) {
        return ctx.badRequest('Email and password are required');
      }

      // Check if user already exists
      const existingUser = await strapi
        .db.query('plugin::users-permissions.user')
        .findOne({
          where: { email },
        });

      if (existingUser) {
        return ctx.badRequest('Email already registered');
      }

      // Create user via users-permissions plugin
      const plugin = strapi.plugin('users-permissions');
      const userService = plugin.service('user');

      const user = await userService.add({
        username: username || email.split('@')[0],
        email,
        password,
        firstName: firstName || '',
        lastName: lastName || '',
        confirmed: false,
      });

      // Generate JWT token
      const token = strapi
        .plugin('users-permissions')
        .service('jwt')
        .issue({ id: user.id });

      ctx.send({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          jwt: token,
        },
      });
    } catch (err) {
      ctx.badRequest(err.message || 'Signup failed');
    }
  },

  // Login endpoint
  async login(ctx) {
    try {
      const { identifier, password, email } = ctx.request.body;
      const strapi = global.strapi;
      const loginIdentifier = email || identifier;

      if (!loginIdentifier || !password) {
        return ctx.badRequest('Email/identifier and password are required');
      }

      // Find user
      const user = await strapi
        .db.query('plugin::users-permissions.user')
        .findOne({
          where: {
            $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
          },
        });

      if (!user) {
        return ctx.badRequest('Invalid credentials');
      }

      // Check password
      const valid = await strapi
        .plugin('users-permissions')
        .service('user')
        .validatePassword(password, user.password);

      if (!valid) {
        return ctx.badRequest('Invalid credentials');
      }

      // Generate token
      const token = strapi
        .plugin('users-permissions')
        .service('jwt')
        .issue({ id: user.id });

      ctx.send({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          jwt: token,
        },
      });
    } catch (err) {
      ctx.badRequest(err.message || 'Login failed');
    }
  },

  // Forgot password endpoint
  async forgotPassword(ctx) {
    try {
      const { email } = ctx.request.body;
      const strapi = global.strapi;

      if (!email) {
        return ctx.badRequest('Email is required');
      }

      // Find user
      const user = await strapi
        .db.query('plugin::users-permissions.user')
        .findOne({
          where: { email },
        });

      if (!user) {
        // Don't reveal if user exists for security
        return ctx.send({
          success: true,
          message: 'If email exists, reset link will be sent',
        });
      }

      // Generate reset token (valid for 1 hour)
      const resetToken = strapi
        .plugin('users-permissions')
        .service('jwt')
        .issue({ id: user.id, type: 'reset' });

      // Store reset token in user profile
      await strapi
        .db.query('plugin::users-permissions.user')
        .update({
          where: { id: user.id },
          data: {
            resetToken,
            resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour
          },
        });

      // Send email (implement email service)
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

      // TODO: Implement email sending
      console.log(`Password reset link: ${resetLink}`);

      ctx.send({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (err) {
      ctx.badRequest(err.message || 'Forgot password failed');
    }
  },

  // Reset password endpoint
  async resetPassword(ctx) {
    try {
      const { token, password, code } = ctx.request.body;
      const strapi = global.strapi;
      const resetToken = token || code;

      if (!resetToken || !password) {
        return ctx.badRequest('Token and password are required');
      }

      // Verify token
      let decoded;
      try {
        decoded = strapi
          .plugin('users-permissions')
          .service('jwt')
          .verify(resetToken);
      } catch (err) {
        return ctx.badRequest('Invalid or expired reset token');
      }

      // Find user
      const user = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: decoded.id },
        });

      if (!user || !user.resetToken || user.resetToken !== resetToken) {
        return ctx.badRequest('Invalid reset token');
      }

      // Check expiration
      if (new Date() > new Date(user.resetTokenExpiry)) {
        return ctx.badRequest('Reset token has expired');
      }

      // Hash and update password
      const passwordHash = await strapi
        .plugin('users-permissions')
        .service('user')
        .hashPassword(password);

      await strapi
        .query('plugin::users-permissions.user')
        .update({
          where: { id: user.id },
          data: {
            password: passwordHash,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });

      ctx.send({
        success: true,
        message: 'Password reset successful',
      });
    } catch (err) {
      ctx.badRequest(err.message || 'Reset password failed');
    }
  },

  // Get current user
  async getCurrentUser(ctx) {
    try {
      const { strapi } = ctx;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Not authenticated');
      }

      ctx.send({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      });
    } catch (err) {
      ctx.badRequest(err.message || 'Failed to get user');
    }
  },
};
