const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

// Security Headers check (Requirement 4)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// Database Index optimization (Requirement 5)
const Project = sequelize.define('Project', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, {
  indexes: [{ fields: ['status'] }]
});

// Optimized GET Query with limit
app.get('/api/projects', async (req, res) => {
  try {
    const data = await Project.findAll({
      order: [['id', 'DESC']],
      limit: 50
    });
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST endpoint with sanitization & security check
app.post('/api/projects', async (req, res) => {
  try {
    let { title, description, status } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Project Title is required!' });
    }
    const cleanTitle = title.trim();
    const cleanDesc = description ? String(description).trim() : '';
    const newProject = await Project.create({
      title: cleanTitle,
      description: cleanDesc,
      status: status || 'active'
    });
    res.status(201).json({ success: true, data: newProject });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Day 37: End-to-End Critical User Flow', () => {
  let createdProjectId;

  test('E2E Flow 1: Security Headers Verification', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
  });

  test('E2E Flow 2: Complete User Journey (Create -> Retrieve -> Delete)', async () => {
    // 1. User submits project
    const createRes = await request(app)
      .post('/api/projects')
      .send({
        title: 'E2E Capstone Launch',
        description: 'End to end flow verification test',
        status: 'active'
      });
    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.data.title).toBe('E2E Capstone Launch');
    createdProjectId = createRes.body.data.id;

    // 2. User views updated project list
    const getRes = await request(app).get('/api/projects');
    expect(getRes.statusCode).toBe(200);
    const item = getRes.body.data.find(p => p.id === createdProjectId);
    expect(item).toBeDefined();

    // 3. User deletes project
    const deleteRes = await request(app).delete(`/api/projects/${createdProjectId}`);
    expect(deleteRes.statusCode).toBe(200);

    // 4. Verify project is removed
    const verifyRes = await request(app).get('/api/projects');
    const removedItem = verifyRes.body.data.find(p => p.id === createdProjectId);
    expect(removedItem).toBeUndefined();
  });
});