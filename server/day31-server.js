require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// 1. Security Headers (Requirement 3)
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Payload size limit to prevent DoS

// 2. Rate Limiting to prevent brute force / DDoS (Requirement 4)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// 3. Database Setup & Index Optimization (Requirement 1)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const Project = sequelize.define('Project', {
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.STRING 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'active' 
  }
}, {
  indexes: [
    { fields: ['status'] }, // Faster search by status
    { fields: ['createdAt'] } // Fast sorting index
  ]
});

sequelize.sync().then(() => {
  console.log('SQLite Database Connected & Optimized!');
});

// 4. In-Memory Caching Mechanism for frequently accessed data (Requirement 2)
let projectsCache = null;
let cacheLastUpdated = null;
const CACHE_TTL_MS = 60 * 1000; // Cache valid for 60 seconds

// GET Projects with In-Memory Caching & Limit (Requirement 1 & 2)
app.get('/api/projects', async (req, res) => {
  try {
    const now = Date.now();
    if (projectsCache && (now - cacheLastUpdated < CACHE_TTL_MS)) {
      return res.json({ success: true, data: projectsCache, source: 'cache' });
    }

    const data = await Project.findAll({
      attributes: ['id', 'title', 'description', 'status', 'createdAt'], // Selective column fetch
      order: [['id', 'DESC']],
      limit: 50 // Query optimization
    });

    projectsCache = data;
    cacheLastUpdated = now;
    res.json({ success: true, data, source: 'database' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST Project (Invalidates Cache)
app.post('/api/projects', async (req, res) => {
  try {
    let { title, description, status } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Project Title is required!' });
    }

    const cleanTitle = title.trim();
    const cleanDesc = description ? String(description).trim() : '';
    const allowed = ['active', 'completed', 'archived'];
    const cleanStatus = allowed.includes(status) ? status : 'active';

    const newProject = await Project.create({
      title: cleanTitle,
      description: cleanDesc,
      status: cleanStatus
    });

    projectsCache = null; // Clear cache on new write
    res.status(201).json({ success: true, data: newProject });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE Project (Invalidates Cache)
app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.destroy({ where: { id: req.params.id } });
    projectsCache = null; // Clear cache on delete
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Optimized and Secure Server running on port ${PORT}`);
});