import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import excerciseSlice from './excerciseSlice'
import workoutSlice from './workoutSlice'
import workoutExcerciseSlice from './workoutExcerciseSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        excercise: excerciseSlice,
        workout: workoutSlice,
        workoutExercise: workoutExcerciseSlice
    }
})

export default store;