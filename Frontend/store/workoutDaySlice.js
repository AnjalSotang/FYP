import { createSlice } from "@reduxjs/toolkit";
import STATUSES from "../src/globals/status/statuses";
import API from "../src/http";

const workoutDaySlice = createSlice({
    name: "workoutDay",
    initialState: {
        data: [], // List of workout days
        status: null
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload;
        },
        setWorkoutDays(state, action) {
            state.data = action.payload;
        } 
    }
});

export const { setStatus, setWorkoutDays } = workoutDaySlice.actions;
export default workoutDaySlice.reducer;

export function createWorkoutDay(id, dayName) {
    return async function createWorkoutDayThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            console.log(id)
            console.log(dayName)
            const response = await API.post(`api/createWorkoutDay/${id}`, {dayName});
            if (response.status === 201) {
                dispatch(setWorkoutDays(response.data));
                dispatch(setStatus(STATUSES.SUCCESS));
            }
        } catch (error) {
            dispatch(setStatus({ status: STATUSES.ERROR, message: "Failed to create workout day" }));
        }
    };
}

export function updateWorkoutDay({id, dayName}) {
    return async function updateWorkoutDayThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            console.log(id)
            console.log(dayName)
            const response = await API.patch(`api/updateWorkoutDay/${id}`, {dayName});
            if (response.status === 200) {
                dispatch(setWorkoutDays(response.data));
                dispatch(setStatus(STATUSES.SUCCESS));
            }
        } catch (error) {
            dispatch(setStatus({ status: STATUSES.ERROR, message: "Failed to create workout day" }));
        }
    };
}

export function deleteWorkoutDay(dayId) {
    return async function deleteWorkoutDayThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            console.log(dayId)
            console.log(`Request URL: http://localhost:3001/api/deleteWorkoutDay/${dayId}`);
            const response = await API.delete(`api/deleteWorkoutDay/${dayId}`);
            if (response.status === 200) {  
                dispatch(setWorkoutDays(response.data));
                dispatch(setStatus(STATUSES.SUCCESS));
            }
        } catch (error) {
            dispatch(setStatus({ status: STATUSES.ERROR, message: "Failed to delete workout day" }));
        }
    };
}

export function addExcerciseToWorkoutDay(excerciseData) {
    return async function addExcerciseToWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        console.log(excerciseData)
        try {
            // Send the exercise data along with the dayId in the request
            const response = await API.post(
                `api/addExcerciseToWorkoutDay/${excerciseData.dayId}`, 
                {
                    excerciseId: excerciseData.excerciseId,  // Ensure the payload includes the necessary fields
                    sets: excerciseData.sets,
                    reps: excerciseData.reps,
                    rest_time: excerciseData.rest_time,
                }
            );

            if (response.status === 201) {
                // Dispatch a success action with the updated workout days
                dispatch(setWorkoutDays(response.data));
                dispatch(setStatus(STATUSES.SUCCESS));
            } else {
                // Handle unsuccessful response (if needed)
                dispatch(setStatus({ status: STATUSES.ERROR, message: "Failed to add exercise to workout day" }));
            }
        } catch (error) {
            // Handle errors (e.g., network errors, server errors)
            dispatch(setStatus({ status: STATUSES.ERROR, message: error.message || "Failed to add exercise to workout day" }));
        }
    };
}


export function updateExcerciseInWorkoutDay(excerciseData) {
    return async function updateExcerciseToWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        console.log(excerciseData)
        try {
            // Send the exercise data along with the dayId in the request
            const response = await API.post(
                `api/workoutday/${excerciseData.dayId}/exercise/${excerciseData.excerciseId}`,
                {
                    sets: excerciseData.sets,
                    reps: excerciseData.reps,
                    rest_time: excerciseData.rest_time,
                }
            );

            if (response.status === 200) {
                // Dispatch a success action with the updated workout days
                dispatch(setWorkoutDays(response.data));
                dispatch(setStatus(STATUSES.SUCCESS));
            } else {
                // Handle unsuccessful response (if needed)
                dispatch(setStatus({ status: STATUSES.ERROR, message: "Failed to add exercise to workout day" }));
            }
        } catch (error) {
            // Handle errors (e.g., network errors, server errors)
            dispatch(setStatus({ status: STATUSES.ERROR, message: error.message || "Failed to add exercise to workout day" }));
        }
    };
}





