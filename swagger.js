const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Output file for the spec
const routes = ["./app.js"]; // Path to your API route files

const doc = {
  info: {
    title: "BED Assignment API",
    description: "This is the API docuemntation for our BED assignment",
  },
  host: "localhost:8080", // Replace with your actual host if needed
};

swaggerAutogen(outputFile, routes, doc);
