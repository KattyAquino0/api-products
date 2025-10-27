function errorHandler(err, req, res, next) {
  console.error(err);
  const message = err.message || "Error interno del servidor";
  res.status(500).json({ error: message });
}

module.exports = errorHandler;
