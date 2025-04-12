import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import excerciseSlice from './excerciseSlice'
import workoutSlice from './workoutSlice'
// import workoutExcerciseSlice from './workoutExcerciseSlice'
import workoutDaySlice from './workoutDaySlice'
import userWorkoutSlice from './userWorkoutSlice'
import userWorkoutSlice2 from './userWorkoutSlice2'
import workoutScheduleSlice from './workoutScheduleSlice'
import userWorkoutHistorySlice from './userWorkoutHistorySlice'
import personalRecordSlice from './personalRecordsSlice'
import measurementSlice from './measurementSlice'
import adminUsersSlice from './adminUsersSlice'
import adminNotificationSlice from './adminNotficationSlice'

{/* <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50"> */}

const store = configureStore({
    reducer: {
        auth: authSlice,
        excercise: excerciseSlice,
        workout: workoutSlice, 
        workoutDaySlice: workoutDaySlice,
        userWorkout: userWorkoutSlice,
        userWorkout2: userWorkoutSlice2,
        workoutSchedule: workoutScheduleSlice,
        userWorkoutHistory: userWorkoutHistorySlice,
        personalRecord: personalRecordSlice,
        measurement: measurementSlice,
        adminUsers: adminUsersSlice,
        adminNotification: adminNotificationSlice
    }
})

export default store;