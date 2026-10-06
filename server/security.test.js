const request = require('supertest');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(helmet());
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 2, // Allow only 2 calls to test rate limiter easily
  message: { error: 'Rate limit exceeded' }
}));

app.get('/api/test', (req, res) => res.json({ ok: true }));

describe('Day 39: Security & Vulnerability Tests', () => {
  test('Security Headers present (XSS & Clickjacking protection)', async () => {
    const res = await request(app).get('/api/test');
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['strict-transport-security']).toBeDefined();
  });

  test('Rate Limiter blocks excessive requests (DDoS protection)', async () => {
    await request(app).get('/api/test');
    await request(app).get('/api/test');
    const blockedRes = await request(app).get('/api/test');
    expect(blockedRes.statusCode).toBe(429); // 429 Too Many Requests
  });
});