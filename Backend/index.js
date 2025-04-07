const express = require('express');
const { sequelize, users } = require("./models/index"); // Sequelize instance import
const userRoutes = require("./routes/userRoutes");
const addRoutes = require("./routes/addRoutes");
const excerciseRoutes = require("./routes/excerciseRoutes")
const workoutRoutes = require("./routes/workoutRoutes")
const workoutDayRoutes = require("./routes/workoutdayRoutes")
const userWorkoutRoutes = require("./routes/user/userWorkoutRoutes")
const workoutScheduleRoutes = require("./routes/user/workoutScheduleRoutes")
const workoutHistoryRoutes = require("./routes/user/userWorkoutHistoryRoutes")
const userRecordsRoutes = require("./routes/user/userRecordsRoutes")
const userMeasurementsRoutes = require("./routes/user/userMeasurementsRoutes")

const path = require("path");
const cors = require("cors");
const app = express();
const bcrypt = require('bcrypt')


// Synchronize the models with the database
sequelize.sync({ force: 0})// Use 'false' to prevent dropping tables
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
app.use('/api', addRoutes, excerciseRoutes, workoutRoutes, workoutDayRoutes, userWorkoutRoutes, workoutScheduleRoutes, workoutHistoryRoutes, userRecordsRoutes, userMeasurementsRoutes)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const createUser = async () => {
  let foundAdmin = await users.findOne({
      where: {
          role: "admin"
      } 
  })
  

  if (!foundAdmin) {
      const hashpassword = await bcrypt.hash("password", 8);
      await users.create({
          email: "admin@gmail.com",
          password: hashpassword,
          role: "admin"
      })
      console.log("created successfully")
  } else {
      console.log("already seeeded")
  }
}
createUser()

// Use the PORT value from the .env file or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { 
    console.log(`Server is running at http://localhost:${PORT}`);
});
