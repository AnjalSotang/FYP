import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import excerciseSlice from './excerciseSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        excercise: excerciseSlice
    }
})

export default store;