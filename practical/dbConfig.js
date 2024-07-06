require("dotenv").config();

module.exports = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  trustServerCertificate: process.env.TRUSTSERVERCERTIFICATE === "true",
  options: {
    port: parseInt(process.env.PORT) || 1433,
    connectionTimeout: parseInt(process.env.CONNECTIONTIMEOUT) || 60000,
  },
};
