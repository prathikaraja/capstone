require('dotenv').config();
const { sequelize, User, Project, Task } = require('./models');

const seedDatabase = async () => {
  try {
    console.log('Syncing database...');
    await sequelize.sync({ force: true }); // Fresh tables create aagum

    console.log('Seeding initial data...');

    // 1. Create Demo User
    const demoUser = await User.create({
      name: 'Demo Admin',
      email: 'admin@capstone.local',
      password: 'Password123!',
      role: 'admin',
    });

    // 2. Create Demo Project
    const demoProject = await Project.create({
      title: 'SaaS Capstone MVP',
      description: 'Building full-stack SaaS product tracking and delivery boards.',
      status: 'active',
      ownerId: demoUser.id,
    });

    // 3. Create Demo Tasks
    await Task.bulkCreate([
      {
        title: 'Setup Database Schemas',
        description: 'Design User, Project, and Task relational models.',
        status: 'done',
        priority: 'high',
        projectId: demoProject.id,
        assigneeId: demoUser.id,
      },
      {
        title: 'Develop REST CRUD Endpoints',
        description: 'Build Express routes and controllers for projects and tasks.',
        status: 'in-progress',
        priority: 'high',
        projectId: demoProject.id,
        assigneeId: demoUser.id,
      },
      {
        title: 'Connect Kanban Frontend Board',
        description: 'Build React UI components for drag-drop and task status.',
        status: 'todo',
        priority: 'medium',
        projectId: demoProject.id,
        assigneeId: demoUser.id,
      },
    ]);

    console.log('Database seeded successfully with sample data!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();