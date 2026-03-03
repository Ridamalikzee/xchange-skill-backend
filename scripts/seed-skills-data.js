'use strict';

const fs = require('fs');

let strapi;

const skillsData = [
  {
    category: 'Cognitive / Intellectual Skills',
    skills: [
      'Critical thinking',
      'Problem-solving',
      'Decision-making',
      'Analytical reasoning',
      'Creativity',
    ],
  },
  {
    category: 'Technical / Hard Skills',
    skills: [
      'C++ Programming',
      'Python Programming',
      'JavaScript Programming',
      'Data analysis',
      'Graphic design',
      'Accounting',
      'Machine operation',
    ],
  },
  {
    category: 'Interpersonal / People Skills',
    skills: [
      'Communication',
      'Teamwork',
      'Leadership',
      'Conflict resolution',
    ],
  },
  {
    category: 'Personal / Self-Management Skills',
    skills: [
      'Time management',
      'Adaptability',
      'Self-motivation',
      'Stress management',
      'Responsibility',
    ],
  },
  {
    category: 'Organizational / Management Skills',
    skills: [
      'Project management',
      'Strategic planning',
      'Delegation',
      'Budgeting',
      'Goal setting',
    ],
  },
  {
    category: 'Digital / IT Skills',
    skills: [
      'Microsoft Office',
      'Google Workspace',
      'Social media management',
      'Web development',
      'Cybersecurity basics',
      'Cloud computing',
    ],
  },
  {
    category: 'Language / Communication Skills',
    skills: [
      'Public speaking',
      'Writing and editing',
      'Active listening',
      'Multilingualism',
      'Negotiation',
    ],
  },
];

async function seedSkillsData() {
  console.log('Starting skills and categories seed...');

  try {
    // Create categories and their skills
    for (const categoryData of skillsData) {
      // Find or create category
      let category = await strapi.db
        .query('api::category.category')
        .findOne({ where: { name: categoryData.category } });

      if (!category) {
        console.log(`Creating category: ${categoryData.category}`);
        category = await strapi.db.query('api::category.category').create({
          data: {
            name: categoryData.category,
            description: `${categoryData.category} - skills related to ${categoryData.category.toLowerCase()}`,
          },
        });
      }

      // Create skills under this category
      for (const skillName of categoryData.skills) {
        const existing = await strapi.db.query('api::skill.skill').findOne({
          where: { title: skillName },
        });

        if (!existing) {
          console.log(`Creating skill: ${skillName} under ${categoryData.category}`);
          await strapi.db.query('api::skill.skill').create({
            data: {
              title: skillName,
              description: `Learn and master ${skillName}`,
              category: category.id,
              status: 'pending',
            },
          });
        } else {
          console.log(`Skill already exists: ${skillName}`);
        }
      }
    }

    console.log('✓ Skills and categories seed completed successfully!');
  } catch (error) {
    console.error('Error seeding skills data:', error);
    throw error;
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  strapi = app;
  app.log.level = 'error';

  await seedSkillsData();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
