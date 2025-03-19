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
// db.goals = require("./Goal")(sequelize, Sequelize);  
// db.tracks = require("./ProgressTracking")(sequelize, Sequelize);  
// db.userGoals= require("./UserGoal")(sequelize, Sequelize);  
// db.workoutLog = require("./WorkoutLog")(sequelize, Sequelize);  
db.workout = require("./Workout")(sequelize, Sequelize);  
db.workoutdayExcercise = require("./WorkoutDayExcercise")(sequelize, Sequelize);
db.excercise = require("./Excercise")(sequelize, Sequelize);
db.workoutday = require("./WorkoutDay")(sequelize, Sequelize);
// db.notification = require("./Notification")(sequelize, Sequelize);
db.contact = require("./Contact")(sequelize, Sequelize);

db.workout.hasMany(db.workoutday, { as: 'days' });
db.workoutday.belongsTo(db.workout);

// WorkoutDay to Exercise Relationship (Many-to-Many)
db.workoutday.belongsToMany(db.excercise, {
    through: db.workoutdayExcercise,
    foreignKey: 'workoutdayId',
    as: 'excercises'  // Maintaining "excercise" spelling
});

db.excercise.belongsToMany(db.workoutday, {
    through: db.workoutdayExcercise,
    foreignKey: 'excerciseId',
    as: 'workoutDays'
});



// Export db object to use models and associations in other parts of the application
module.exports = db;
