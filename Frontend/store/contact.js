import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';

const excerciseSlice = createSlice({
    name: 'excercise',
    initialState: {
        status: null //We will see about this
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload //Status is a network status it could be either success or pending or faliure
        },
    }
});

//Step 2: Now Action
export const { setStatus } = excerciseSlice.actions;
export default excerciseSlice.reducer


export function addExcercise(data) {
    return async function addExcerciseThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const token = localStorage.getItem('token');

            const response = await API.post('api/admin/excercise', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                   'Authorization': `Bearer ${token}`
                }
            })
            if (response.status === 201) {
                dispatch(setExcercise(response.data.data))
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }))
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";


            if (error.response) {
                // Server responded with an error status (e.g., 400, 409)
                errorMessage = error.response.data.message || "Registration failed.";
            } else if (error.request) {
                // Request was made but no response (backend is down or network issue)
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                // Other unexpected errors (e.g., something wrong with frontend code)
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}