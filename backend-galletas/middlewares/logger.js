module.exports = function logger(req, res, next) {
  const now = new Date();
  const dateStr = now.toLocaleString();
  console.log(`${req.method} ${req.originalUrl} ${dateStr}`);
  next();
};
