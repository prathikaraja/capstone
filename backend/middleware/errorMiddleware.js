const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[ERROR] \({new Date().toISOString()} -\){req.method} \({req.originalUrl}:\){err.message}`);

  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
