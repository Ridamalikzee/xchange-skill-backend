'use strict';

let strapi; // will be assigned when the app is loaded

async function seedApp() {
  const shouldImportSeedData = await isFirstRun();

  if (shouldImportSeedData) {
    try {
      console.log('Setting up Strapi with basic permissions...');
      await setPublicPermissions({
        skill: ['find', 'findOne'],
        'base-skill': ['find'],
        'service-request': ['find', 'findOne'],
        category: ['find', 'findOne'],
        role: ['find', 'findOne'],
        profile: ['find', 'findOne'],
        review: ['find', 'findOne'],
        chat: ['find', 'findOne'],
        message: ['find', 'findOne'],
      });
      console.log('✓ Seed setup complete - Strapi ready!');
    } catch (error) {
      console.log('Could not set up permissions');
      console.error(error);
    }
  } else {
    console.log('✓ Already initialized. Strapi ready!');
    // ensure base-skill permission exists even on subsequent runs
    try {
      await setPublicPermissions({ 'base-skill': ['find'] });
      console.log('✓ Ensured base-skill permission exists');
    } catch (error) {
      console.log('Failed to ensure base-skill permission', error);
    }
  }
}

async function isFirstRun() {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'type',
    name: 'setup',
  });
  const initHasRun = await pluginStore.get({ key: 'initHasRun' });
  await pluginStore.set({ key: 'initHasRun', value: true });
  return !initHasRun;
}

async function setPublicPermissions(newPermissions) {
  // Find the ID of the public role
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'public',
    },
  });

  // also fetch authenticated role so we can grant additional rights
  const authRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'authenticated',
    },
  });

  // Create the new permissions and link them to the public role
  const allPermissionsToCreate = [];
  Object.keys(newPermissions).map((controller) => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map((action) => {
      return strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });

  // additionally give authenticated users CRUD on skills (and ability to fetch their own)
  if (authRole) {
    ['find', 'findOne', 'create', 'update', 'delete', 'me'].forEach((action) => {
      allPermissionsToCreate.push(
        strapi.db.query('plugin::users-permissions.permission').create({
          data: {
            action: `api::skill.skill.${action}`,
            role: authRole.id,
          },
        })
      );
    });
  }

  await Promise.all(allPermissionsToCreate);
}

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  // make the loaded instance available to helper functions
  strapi = app;

  app.log.level = 'error';

  await seedApp();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
