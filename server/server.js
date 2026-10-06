const sequelize = require('./config/db');

sequelize.sync({ alter: true })
  .then(() => console.log('Database & tables connected!'))
  .catch((err) => console.error('Database connection error:', err));