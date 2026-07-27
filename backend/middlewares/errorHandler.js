export default function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Don’t leak stack traces in production
  res.status(status).json({
    success: false,
    message,
  });
}

