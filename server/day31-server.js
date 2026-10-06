const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

// Step 1: Database Setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Step 1: Schema Definition with Index for performance
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
    { fields: ['status'] } // Step 5: Index optimization
  ]
});

sequelize.sync().then(() => {
  console.log('SQLite Database Connected & Schema Synced!');
});

// Step 5: Optimized Query with limit (Fast performance)
app.get('/api/projects', async (req, res) => {
  try {
    const data = await Project.findAll({
      order: [['id', 'DESC']],
      limit: 50 // Query optimization (loads faster)
    });
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Step 3: Data Validation and Sanitization
app.post('/api/projects', async (req, res) => {
  try {
    let { title, description, status } = req.body;

    // 1. Validation: Title illana reject pannum
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Project Title is required!' });
    }

    // 2. Sanitization: Space trim panni clean pannum
    const cleanTitle = title.trim();
    const cleanDesc = description ? String(description).trim() : '';
    const allowedStatuses = ['active', 'completed', 'archived'];
    const cleanStatus = allowedStatuses.includes(status) ? status : 'active';

    const newProject = await Project.create({
      title: cleanTitle,
      description: cleanDesc,
      status: cleanStatus
    });

    res.status(201).json({ success: true, data: newProject });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Delete endpoint
app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});