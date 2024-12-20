const express = require('express');
const { authenticate } = require('../middlewares/auth');
const router = express.Router();

router.get('/', authenticate(['admin', 'operator']), (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.role}` });
});

module.exports = router;
