const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware example
const logger = require('./middleware/logger');
app.use(logger);

// Middleware to parse JSON request body
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello SP MySQL Node backend world.');
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
