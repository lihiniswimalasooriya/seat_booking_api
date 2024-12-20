const jwt = require('jsonwebtoken');

const authenticate = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    if (roles.length && !roles.includes(user.role)) return res.status(403).json({ message: 'Access Denied' });
    req.user = user;
    next();
  });
};

module.exports = { authenticate };
