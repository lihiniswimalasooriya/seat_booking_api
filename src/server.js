const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB } = require('./config');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);


connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
