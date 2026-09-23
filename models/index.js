const errorHandler = require('./middleware/errorMiddleware');
const sequelize = require('../config/db');
const User = require('./user');
const Project = require('./project');
const Task = require('./task');

// Relationships Setup
// 1. User -> Projects (1:N)
User.hasMany(Project, { foreignKey: 'ownerId', as: 'projects', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// 2. Project -> Tasks (1:N)
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// 3. User -> Tasks as Assignee (1:N)
User.hasMany(Task, { foreignKey: 'assigneeId', as: 'assignedTasks', onDelete: 'SET NULL' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });

module.exports = {
  sequelize,
  User,
  Project,
  Task,
};
