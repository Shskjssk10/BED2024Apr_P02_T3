const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const authRoutes = require('./public/routes/authRoutes.js');
const { poolPromise } = require('./dbConfig.js'); 

require('dotenv').config();

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
poolPromise
  .then((pool) => {
    // Successful connection
    console.log('Database connected successfully.');

    // Routes
    app.use('/auth', authRoutes);

    // Example route
    app.get('/', (req, res) => {
      res.send('Server is running.');
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    // Failed to connect to database
    console.error('Database connection failed: ', err);
    process.exit(1); // Exit the process if unable to connect to the database
  });
