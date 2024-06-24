const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./public/routes/authRoutes');
app.use('/auth', authRoutes);

// Database connection
const { poolPromise } = require('./dbConfig');
poolPromise.then(pool => {
  console.log('Database connected successfully.');
}).catch(err => {
  console.error('Database connection failed:', err);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
