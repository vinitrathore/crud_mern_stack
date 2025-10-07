const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} -- ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  next();
};

module.exports = logger;
