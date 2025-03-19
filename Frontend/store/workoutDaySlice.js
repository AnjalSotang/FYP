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

export const { setStatus, setWorkoutDays, deleteWorkoutDay } = workoutDaySlice.actions;
export default workoutDaySlice.reducer;

export function createWorkoutDay(id, dayName) {
    return async function createWorkoutDayThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            console.log(id)
            console.log(dayName)
            const response = await API.post(`api/createWorkoutDay/${id}`, {dayName});
            if (response.status === 200) {
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

