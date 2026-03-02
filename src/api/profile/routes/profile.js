module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/signup',
      handler: 'profile.signup',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
