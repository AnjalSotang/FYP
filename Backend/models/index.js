const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env file

// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.DB_DBNAME,       // Database name
    process.env.DB_USERNAME,     // Username
    process.env.DB_PASSWORD,     // Password
    {
        host: process.env.DB_HOST, // Host
        dialect: process.env.DB_DIALECT, // Database dialect
    }
);

// Function to authenticate the connection
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// Call the authentication and sync function
initializeDatabase();

// Export the sequelize instance for use in other files
const db = { sequelize, Sequelize };

// Import models (ensure models are correctly defined in './auth' and './profile')
db.users = require("./Users")(sequelize, Sequelize);  
db.goals = require("./Goal")(sequelize, Sequelize);  
db.tracks = require("./ProgressTracking")(sequelize, Sequelize);  
db.userGoals= require("./UserGoal")(sequelize, Sequelize);  
db.workoutLog = require("./WorkoutLog")(sequelize, Sequelize);  
db.workout = require("./Workout")(sequelize, Sequelize);  
db.workoutExcercise = require("./workoutExcercise")(sequelize, Sequelize);
db.excercise = require("./Excercise")(sequelize, Sequelize);
db.notification = require("./Notification")(sequelize, Sequelize);
db.contact = require("./Contact")(sequelize, Sequelize);

// Workout-Excercise Relationship
db.workoutExcercise.belongsTo(db.excercise)
db.workout.hasMany(db.workoutExcercise)
db.workoutExcercise.belongsTo(db.workout)
db.excercise.hasMany(db.workoutExcercise)


// User-Goal Relationship
db.users.hasMany(db.userGoals)
db.userGoals.belongsTo(db.users)

db.goals.hasMany(db.userGoals)
db.userGoals.belongsTo(db.goals)

// User-WorkoutLog Relationship
db.users.hasMany(db.workoutLog)
db.workoutLog.belongsTo(db.users)

db.workout.hasMany(db.workoutLog)
db.workoutLog.belongsTo(db.workout)

// User-Progress Tracking
db.users.hasMany(db.tracks)
db.tracks.belongsTo(db.users)

//User - Notification
db.notification.hasMany(db.users)
db.users.belongsTo(db.notification)


// Export db object to use models and associations in other parts of the application
module.exports = db;
