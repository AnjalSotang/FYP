import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import excerciseSlice from './excerciseSlice'
import workoutSlice from './workoutSlice'
// import workoutExcerciseSlice from './workoutExcerciseSlice'
import workoutDaySlice from './workoutDaySlice'
import userWorkoutSlice from './userWorkoutSlice'
import workoutScheduleSlice from './workoutScheduleSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        excercise: excerciseSlice,
        workout: workoutSlice,
        // workoutExercise: workoutExcerciseSlice,
        workoutDaySlice: workoutDaySlice,
        userWorkout: userWorkoutSlice,
        workoutSchedule: workoutScheduleSlice,
    
    }
})

export default store;