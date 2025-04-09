import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';

const userWorkoutHistorySlice = createSlice({
    name: 'userWorkoutHistory',
    initialState: {
        data: {
            historyEntries: [],
            activeWorkoutsHistory: [],
            allHistory: []
        },
        status: null,
        error: null,
        token: null
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setToken(state, action) {
            state.token = action.payload;
        },
        setHistoryEntries(state, action) {
            state.data.historyEntries = action.payload;
        },
        setActiveWorkoutsHistory(state, action) {
            state.data.activeWorkoutsHistory = action.payload;
        },
        setAllHistory(state, action) {
            state.data.allHistory = action.payload;
        }
    }
});

// Export action creators
export const {
    setStatus,
    setError,
    setToken,
    setHistoryEntries,
    setActiveWorkoutsHistory,
    setAllHistory
} = userWorkoutHistorySlice.actions;

export default userWorkoutHistorySlice.reducer;

// Thunk functions
export function fetchWorkoutHistory() {
    return async function fetchWorkoutHistoryThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            dispatch(setToken(token));

            const response = await API.get('/api/getUserWorkoutHistories',
                 {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Response from API:", response.data);

            if (response.status === 200) {
                dispatch(setHistoryEntries(response.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            let errorMessage = "Failed to fetch workout history";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setError(errorMessage));
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}

export function fetchActiveWorkoutsWithHistory() {
    return async function fetchActiveWorkoutsWithHistoryThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            dispatch(setToken(token));

            const response = await API.get('/api/getActiveUserWorkouts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                // Format the workout data with history information
                
                dispatch(setActiveWorkoutsHistory(response.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            let errorMessage = "Failed to fetch active workouts with history";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setError(errorMessage));
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}

export function fetchAllHistory() {
    return async function fetchAllHistoryThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            dispatch(setToken(token));

            const response = await API.get('/api/findAllHistory', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                // Format the workout data with history information
                dispatch(setAllHistory(response.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            let errorMessage = "Failed to fetch active workouts with history";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setError(errorMessage));
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}


