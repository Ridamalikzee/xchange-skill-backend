export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/signup',
      handler: 'auth.signup',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/local',
      handler: 'auth.login',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/login',
      handler: 'auth.login',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/forgot-password',
      handler: 'auth.forgotPassword',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/reset-password',
      handler: 'auth.resetPassword',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/auth/me',
      handler: 'auth.getCurrentUser',
      config: {
        policies: [],
        auth: { scope: [] },
      },
    },
  ],
};
