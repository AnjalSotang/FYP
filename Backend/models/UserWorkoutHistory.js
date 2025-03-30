// module.exports = (sequelize, Sequelize) => {
//     const UserWorkoutHistory = sequelize.define("UserWorkoutHistory", {
//         date: {
//             type: Sequelize.DATE,
//             allowNull: false,
//             defaultValue: Sequelize.NOW,
//           },
//           dayCompleted: {
//             type: Sequelize.INTEGER,
//           },
//           duration: {
//             type: Sequelize.INTEGER, // in minutes
//           },
//           caloriesBurned: {
//             type: Sequelize.INTEGER,
//           },
//           notes: {
//             type: Sequelize.TEXT,
//           },
//           rating: {
//             type: Sequelize.INTEGER, // user rating of the workout (1-5)
//           }
//     }, { timestamps: true });

//     return UserWorkoutHistory;
// };
