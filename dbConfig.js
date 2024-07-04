require("dotenv").config();
module.exports = {
  user: process.env.DB_USER, // Replace with your SQL Server login username
  password: process.env.DB_PASSWORD, // Replace with your SQL Server login password
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE, //replace with database name
  trustServerCertificate: true,
  options: {
    port: parseInt(process.env.DB_PORT, 10),
    encrypt: true,
    connectionTimeout: 60000,
  },
};
