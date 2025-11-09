import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';
import { fetchNotifications, fetchUnreadCount } from './adminNotficationSlice';

// Initial state
const initialState = {
    data: [], // List of all workouts
    popularData: [], // Popular workouts
    workoutMetrics: null, // Metrics for reporting
    selectedDate: new Date().toISOString(),
    currentWorkout: null, // Single workout (renamed from data1 for clarity)
    token: null,
    status: null // Network status (loading, success, error)
};

// Helper functions
const handleApiError = (error) => {
    let errorMessage = "An unexpected error occurred.";

    if (error.response) {
        // Server responded with an error status
        errorMessage = error.response.data.message || "Operation failed";
    } else if (error.request) {
        // Request made but no response received
        errorMessage = "Cannot connect to the server. Please check your internet connection.";
    } else {
        // Other errors
        errorMessage = error.message;
    }

    return { status: STATUSES.ERROR, message: errorMessage };
};

// Create slice
const workoutSlice = createSlice({
    name: 'workout',
    initialState,
    reducers: {
        setStatus(state, action) {
            state.status = action.payload;
        },
        setWorkouts(state, action) {
            state.data = action.payload;
        },
        setPopularWorkouts(state, action) {
            state.popularData = action.payload;
        },
        setCurrentWorkout(state, action) {
            state.currentWorkout = action.payload;
        },
        setWorkoutMetrics(state, action) {
            state.workoutMetrics = action.payload;
        },
        setToken(state, action) {
            state.token = action.payload;
        },
        updateWorkoutDayInState(state, action) {
            const updatedDay = action.payload;
            if (state.currentWorkout?.days) {
                state.currentWorkout.days = state.currentWorkout.days.map(day =>
                    day.id === updatedDay.id ? { ...day, ...updatedDay } : day
                );
            }
        }
    }
});

// Export actions
export const {
    setStatus,
    setWorkouts,
    setPopularWorkouts,
    setWorkoutMetrics,
    setCurrentWorkout,
    setToken,
    updateWorkoutDayInState
} = workoutSlice.actions;

export default workoutSlice.reducer;

// Thunk actions
export function addWorkout(data) {
    return async function addWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        try {
            const token = localStorage.getItem('token');

            const response = await API.post('api/admin/workout', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                console.log(response.data.data);
                dispatch(setCurrentWorkout(response.data.data));

                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Workout added successfully" }));
             

                // Refresh notifications
                dispatch(fetchNotifications());
                dispatch(fetchUnreadCount());
            }
        } catch (error) {
            dispatch(setStatus(handleApiError(error)));
        }
    };
}

export function fetchWorkouts() {
    return async function fetchWorkoutsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        try {


            const response = await API.get('api/getAllWorkout');

            if (response.status === 200) {
                const workouts = response.data?.data || [];
                console.log(workouts);

                dispatch(setWorkouts(workouts));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            dispatch(setStatus(handleApiError(error)));
        }
    };
}

export function fetchPopularWorkouts() {
    return async function fetchPopularWorkoutsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        try {
            const token = localStorage.getItem('token');
            const response = await API.get('api/admin/workout/popular',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                const workouts = response.data?.data || [];

                dispatch(setPopularWorkouts(workouts));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            dispatch(setStatus(handleApiError(error)));
        }
    };
}

export function fetchWorkoutMetrics() {
    return async function fetchWorkoutMetricsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        try {
            const token = localStorage.getItem('token');
            const response = await API.get('api/admin/workout/metrics',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                const metrics = response.data;

                dispatch(setWorkoutMetrics(metrics));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            dispatch(setStatus(handleApiError(error)));
        }
    };
}

export function searchWorkouts(query, level) {
    return async function searchWorkoutsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        try {
            const response = await API.get(
                `api/getAllWorkouts/search?query=${encodeURIComponent(query)}&level=${encodeURIComponent(level)}`
            );

            if (response.status === 200) {
                const workouts = response.data?.data || [];
                dispatch(setWorkouts(workouts));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            dispatch(setWorkouts([])); // Clear data on error
            dispatch(setStatus(handleApiError(error)));
        }
    };
}

export function fetchWorkout(id) {
    return async function fetchWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        try {
            const response = await API.get(`api/getWorkout/${id}`);

            if (response.status === 200) {
                dispatch(setCurrentWorkout(response.data.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            dispatch(setStatus(handleApiError(error)));
        }
    };
}

export function updateWorkout(data) {
    return async function updateWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        console.log(data)

        try {
            const token = localStorage.getItem('token');

            const response = await API.patch('api/admin/workout', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                console.log(response.data.message);
                // In updateWorkout
                dispatch(setStatus({
                    status: STATUSES.SUCCESS,
                    message: response.data.message,
                    source: "updateWorkout" // Add this to track where the status came from
                }));
                // Optionally refresh the workout list
                // dispatch(fetchWorkouts());
            }
        } catch (error) {
            dispatch(setStatus(handleApiError(error)));
        }
    };
}

export function deleteWorkout(id) {
    return async function deleteWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            const response = await API.delete(`api/admin/workout/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                dispatch(setStatus({
                    status: STATUSES.SUCCESS,
                    message: response.data.message || "Workout deleted successfully"
                }));
                dispatch(fetchWorkouts());
            }
        } catch (error) {
            dispatch(setStatus(handleApiError(error)));
        }
    };
}

export function updateWorkoutDay({ id, dayName }) {
    return async function updateWorkoutDayThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        console.log(dayName)

        try {
            const token = localStorage.getItem('token');
            const response = await API.patch(`api/updateWorkoutDay/${id}`, { dayName },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                const updatedDay = response.data.data;
                dispatch(updateWorkoutDayInState(updatedDay));
                dispatch(setStatus({
                    status: STATUSES.SUCCESS,
                    message: response.data.message || "Workout day updated successfully"
                }));
            }
        } catch (error) {
            dispatch(setStatus(handleApiError(error)));
        }
    };
}