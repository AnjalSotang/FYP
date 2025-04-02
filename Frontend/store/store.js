import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import excerciseSlice from './excerciseSlice'
import workoutSlice from './workoutSlice'
// import workoutExcerciseSlice from './workoutExcerciseSlice'
import workoutDaySlice from './workoutDaySlice'
import userWorkoutSlice from './userWorkoutSlice'
import userWorkoutSlice2 from './userWorkoutSlice2'
import workoutScheduleSlice from './workoutScheduleSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        excercise: excerciseSlice,
        workout: workoutSlice,
        // workoutExercise: workoutExcerciseSlice,
        workoutDaySlice: workoutDaySlice,
        userWorkout: userWorkoutSlice,
        userWorkout2: userWorkoutSlice2,
        workoutSchedule: workoutScheduleSlice,
    
    }
})

export default store;