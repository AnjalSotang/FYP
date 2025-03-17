import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';

const workoutExerciseSlice = createSlice({
    name: 'workoutExercise',
    initialState: {
        exercises: [],
        status: null
    },
    reducers: {
        setStatus1(state, action) {
            state.status = action.payload;
        },
        setWorkoutExercises(state, action) {
            state.exercises = action.payload;
        },
        addWorkoutExercise(state, action) {
            state.exercises.push(action.payload);
        }
    }
});

// Export actions and reducer
export const { setStatus1, setWorkoutExercises, addWorkoutExercise } = workoutExerciseSlice.actions;
export default workoutExerciseSlice.reducer;

// Thunk to add an exercise to a workout
export function addExerciseToWorkout(excerciseData) {
    return async function addExerciseToWorkoutThunk(dispatch) {
        dispatch(setStatus1(STATUSES.LOADING));
        console.log(excerciseData)
        try {
            console.log(excerciseData)
            const response = await API.post('api/addExcerciseToWorkout', excerciseData);
            console.log("API Response:", response); 
            console.log(excerciseData)

            if (response.status === 201) {
                dispatch(addWorkoutExercise(response.data.data));

                dispatch(setStatus1({ status: STATUSES.SUCCESS, message: response.data.message }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.response) errorMessage = error.response.data.message || "Failed to add exercise.";
            else if (error.request) errorMessage = "Cannot connect to the server.";
            else errorMessage = error.message;

            dispatch(setStatus1({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}
