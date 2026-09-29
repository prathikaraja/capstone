require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const errorHandler = require('./middleware/errormiddleware');

const app = express();

// 1. HTTP Request Logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/uploadRoutes'));

// 2. Intentional Trigger Route for Error Handling & Logging Test
app.get('/api/trigger-error', (req, res, next) => {
  const err = new Error('Explicit test error for centralized logging system.');
  err.statusCode = 400;
  next(err);
});

// 3. Centralized Error Handling Middleware (Always at the end)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Database connected and synced.");
  console.log(`Server listening on port: ${PORT}`);
});
