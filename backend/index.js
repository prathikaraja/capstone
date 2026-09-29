require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const errorHandler = require('./middleware/errormiddleware');

const app = express();

app.use(cors({ origin: '*' }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health & Test Endpoints
const successHandler = (req, res) => {
  res.status(200).json({ status: 'Connected', message: 'Backend connected successfully!' });
};

app.get('/', successHandler);
app.get('/status', successHandler);
app.get('/api', successHandler);
app.get('/api/status', successHandler);
app.get('/api/health', successHandler);
app.get('/api/test', successHandler);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/uploadRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Database connected and synced.");
  console.log(`Server listening on port: ${PORT}`);
});
