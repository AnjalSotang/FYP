const express = require('express');
const app = express();
const { sequelize, users } = require("./models/index");
const bcrypt = require('bcrypt');
const path = require("path");
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);  // Create HTTP server with Express app
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const socketService = require('./services/socketService');

// Import routes
const userRoutes = require("./routes/userRoutes");
const addRoutes = require("./routes/addRoutes");
const excerciseRoutes = require("./routes/excerciseRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const workoutDayRoutes = require("./routes/workoutdayRoutes");
const userWorkoutRoutes = require("./routes/user/userWorkoutRoutes");
const workoutScheduleRoutes = require("./routes/user/workoutScheduleRoutes");
const workoutHistoryRoutes = require("./routes/user/userWorkoutHistoryRoutes");
const userRecordsRoutes = require("./routes/user/userRecordsRoutes");
const userMeasurementsRoutes = require("./routes/user/userMeasurementsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminUserRoutes = require("./routes/admin/userRoutes");

// Initialize the notification scheduler
const setupNotificationScheduler = require('./services/notificationSchedulers');

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/auth', userRoutes);
app.use('/api', 
  addRoutes, 
  excerciseRoutes, 
  workoutRoutes, 
  workoutDayRoutes, 
  userWorkoutRoutes, 
  workoutScheduleRoutes, 
  workoutHistoryRoutes, 
  userRecordsRoutes, 
  userMeasurementsRoutes,
  notificationRoutes,
  adminUserRoutes
);

// Synchronize database
sequelize.sync({ force: 0 })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing the database:', error);
  });

// Create admin user if not exists
const createUser = async () => {
  let foundAdmin = await users.findOne({
    where: { role: "admin" } 
  });

  if (!foundAdmin) {
    const hashpassword = await bcrypt.hash("password", 8);
    await users.create({
      email: "admin@gmail.com",
      password: hashpassword,
      role: "admin"
    });
    console.log("Admin user created successfully");
  } else {
    console.log("Admin user already exists");
  }
};
createUser();

// Setup Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected to notification service');
  
  socket.on('authenticate', (userId) => {
    console.log("Socket connected:", userId);
    socket.join(`user-${userId}`);
    console.log(`User ${userId} authenticated for notifications`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected from notification service');
  });
});

// Start the notification scheduler
// setupNotificationScheduler();

// Make io available for other modules
app.set('io', io);
// Also initialize it in the socket service
socketService.initialize(io);

// Use the PORT value from the .env file or default to 3000
const PORT = process.env.PORT || 3000;

// Start server - IMPORTANT: Use server.listen instead of app.listen
server.listen(PORT, () => { 
  console.log(`Server is running at http://localhost:${PORT}`);
});