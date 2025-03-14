const express = require('express');
const { sequelize } = require("./models/index"); // Sequelize instance import
const userRoutes = require("./routes/userRoutes");
const addRoutes = require("./routes/addRoutes");
const excerciseRoutes = require("./routes/excerciseRoutes")
const workoutRoutes = require("./routes/workoutRoutes")
const path = require("path");
const cors = require("cors");
const app = express();


// Synchronize the models with the database
sequelize.sync({ force:0}) // Use 'false' to prevent dropping tables
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing the database:', error);
  });

app.use(cors());
// Middleware for handling JSON and URL-encoded data
// Using these middlewares ensures that your Express application can handle and parse both JSON and URL-encoded data from incoming requests.
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads parse the form data


app.use('/auth', userRoutes)
app.use('/api', addRoutes, excerciseRoutes, workoutRoutes)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use the PORT value from the .env file or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { 
    console.log(`Server is running at http://localhost:${PORT}`);
});
