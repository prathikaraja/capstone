const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Day 2 Test Endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend server is running smoothly!',
  });
});

// Database Sync & Server Start
sequelize.sync({ alter: true }).then(() => {
  console.log('Database connected and synced.');
  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
}).catch((err) => {
  console.error('Database connection error:', err);
});