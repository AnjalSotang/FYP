import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';


const recentActivitiesSlice = createSlice({
    name: 'recentActivities',
    initialState: {
        data: [], // It holds notification objects
        status: null, // Network status (success, pending, failure)
        error: null,
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload // Status is a network status it could be either success or pending or failure
        },
        setRecentActivities(state, action) {
            state.data = action.payload
        },
        setError(state, action) {
            state.error = action.payload;
        }
    }
});

// Action creators
export const { 
    setStatus, 
    setError,
    setRecentActivities
} = recentActivitiesSlice.actions;

export default recentActivitiesSlice.reducer;

// Thunk for fetching notifications
export function fetchRecentActivities() {
    return async function fetchRecentActivitiesThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            const response = await API.get('api/admin/activities',
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Fixed: Using token correctly
                    }
            });
            if (response.status === 200) {
                const activities = response.data.activities;
                console.log(activities);
                dispatch(setRecentActivities(activities));
                dispatch(setStatus(STATUSES.SUCCESS));
            }
        }
        catch (error) {
            let errorMessage = "Failed to fetch recent activities.";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setError(errorMessage));
        }
    }
}