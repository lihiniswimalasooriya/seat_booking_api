const jwt = require('jsonwebtoken');

const authenticate = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: Token not provided' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

module.exports = { authenticate };
