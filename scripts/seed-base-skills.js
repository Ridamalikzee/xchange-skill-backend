'use strict';

let strapi;

const baseSkillsData = {
  'Cognitive': [
    'Problem Solving',
    'Critical Thinking',
    'Data Analysis',
    'Research',
    'Strategic Planning',
  ],
  'Technical': [
    'Web Development',
    'Mobile Development',
    'Software Development',
    'Database Design',
    'DevOps',
    'Cloud Computing',
  ],
  'Interpersonal': [
    'Public Speaking',
    'Leadership',
    'Team Collaboration',
    'Mentoring',
    'Negotiation',
  ],
  'Personal': [
    'Writing',
    'Photography',
    'Graphic Design',
    'Video Editing',
    'Music Production',
  ],
  'Organizational': [
    'Project Management',
    'Budget Planning',
    'Quality Assurance',
    'Documentation',
    'Process Improvement',
  ],
  'Digital': [
    'Social Media Marketing',
    'SEO',
    'Content Creation',
    'Email Marketing',
    'Analytics',
  ],
  'Language': [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
  ],
};

async function seedBaseSkills() {
  console.log('Starting base skills seed...');

  const categories = await strapi.db.query('api::category.category').findMany();
  const categoryMap = {};
  categories.forEach((c) => {
    categoryMap[c.name] = c.id;
  });

  // helper that ensures category exists, creating it if needed
  async function ensureCategory(name) {
    if (categoryMap[name]) return categoryMap[name];
    const created = await strapi.entityService.create('api::category.category', {
      data: { name },
    });
    categoryMap[name] = created.id;
    return created.id;
  }

  let createdCount = 0;
  for (const [categoryName, skills] of Object.entries(baseSkillsData)) {
    let categoryId = categoryMap[categoryName];
    if (!categoryId) {
      // attempt to create missing category
      console.log(`📁 Creating missing category "${categoryName}"`);
      categoryId = await ensureCategory(categoryName);
    }

    for (const skillName of skills) {
      const existing = await strapi.db.query('api::base-skill.base-skill').findOne({
        where: { name: skillName },
      });
      if (!existing) {
        await strapi.entityService.create('api::base-skill.base-skill', {
          data: { name: skillName, category: categoryId },
        });
        createdCount++;
        console.log(`✓ Created base skill: ${skillName}`);
      } else {
        console.log(`~ Already exists: ${skillName}`);
      }
    }
  }

  console.log(`\n✅ Base skills seeding completed. ${createdCount} created.`);
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  strapi = app;
  app.log.level = 'error';

  await seedBaseSkills();
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
