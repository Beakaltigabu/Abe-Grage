// Import the express module
const express = require('express');
// Import the dotenv module and call the config method to load the environment variables
require('dotenv').config();
// Import the sanitizer module
const sanitize = require('sanitize');
// Import the CORS module
const cors = require('cors');
// Set up the CORS options to allow requests from our front-end
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
};

// Create a variable to hold our port number
const port = process.env.PORT;
// Import the router
const router = require('./routes');
// Create the webserver
const app = express();
// Add the CORS middleware
app.use(cors(corsOptions));
// Add the express.json middleware to the application
app.use(express.json());
// Add the sanitizer to the express middleware
app.use(sanitize.middleware);
// Add the routes to the application as middleware
app.use(router);


//Order Routes
const ordersRoute=require('./routes/order.routes')
app.use('/api/orders', ordersRoute);


/*
const {pool}=('./config/db.config.js')
// Function to check the database connection
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully!");
    connection.release();
    // Release the connection back to the pool
  } catch (error) {
    console.error("Database connection failed:", error.message);
    // Optionally, you might want to exit the process if the connection fails
    process.exit(1);
  }
}

 */

// Start the webserver
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
// Export the webserver for use in the application
module.exports = app;
