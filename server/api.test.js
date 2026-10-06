const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

const Project = sequelize.define('Project', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
});

app.get('/api/projects', async (req, res) => {
  try {
    const data = await Project.findAll({ order: [['id', 'DESC']] });
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    let { title, description, status } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Project Title is required!' });
    }
    const newProject = await Project.create({
      title: title.trim(),
      description: description ? String(description).trim() : '',
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

describe('Day 36 Backend Unit & Integration Tests', () => {
  let createdProjectId;

  test('POST /api/projects - Should reject empty title validation', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ title: '   ', description: 'Test' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/projects - Should successfully create a new project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ title: 'Automated Test Project', description: 'Testing Day 36', status: 'active' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Automated Test Project');
    createdProjectId = res.body.data.id;
  });

  test('GET /api/projects - Should retrieve list of projects', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('DELETE /api/projects/:id - Should delete existing project', async () => {
    const res = await request(app).delete(`/api/projects/${createdProjectId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});