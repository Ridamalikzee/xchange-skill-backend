const { createStrapi } = require('@strapi/strapi');

(async () => {
  try {
    const app = createStrapi();
    await app.load();
    console.log('Content types:', Object.keys(app.contentTypes));
    process.exit(0);
  } catch (err) {
    console.error('error loading strapi', err);
    process.exit(1);
  }
})();