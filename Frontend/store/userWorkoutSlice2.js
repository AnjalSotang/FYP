import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';
import { Clock } from 'lucide-react';

const workoutSlice = createSlice({
    name: 'userWorkouts2',
    initialState: {
        data: {
            activeWorkouts: [],
            completedWorkouts: [],
            selectedWorkout: null,
            activeWorkouts1: [],
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
        setActiveWorkouts(state, action) {
            state.data.activeWorkouts = action.payload;

            // Select first workout if none is selected or selected one is no longer available
            if (!state.data.selectedWorkout && action.payload.length > 0) {
                state.data.selectedWorkout = action.payload[0];
            } else if (state.data.selectedWorkout) {
                const stillExists = action.payload.find(workout => workout.id === state.data.selectedWorkout.id);
                if (!stillExists && action.payload.length > 0) {
                    state.data.selectedWorkout = action.payload[0];
                } else if (stillExists) {
                    // Update selected workout with latest data
                    state.data.selectedWorkout = action.payload.find(workout => workout.id === state.data.selectedWorkout.id);
                }
            }
        },
        setActiveWorkouts1(state, action) {
            state.data.activeWorkouts1 = action.payload;
        },
        setCompletedWorkouts(state, action) {
            state.data.completedWorkouts = action.payload;
        },
        selectWorkout(state, action) {
            state.data.selectedWorkout = state.data.activeWorkouts.find(workout => workout.id === action.payload) || null;
        },
        addWorkout(state, action) {
            state.data.activeWorkouts.push(action.payload);
            if (!state.data.selectedWorkout) {
                state.data.selectedWorkout = action.payload;
            }
        },
        removeWorkout(state, action) {
            state.data.activeWorkouts = state.data.activeWorkouts.filter(workout => workout.id !== action.payload);
            // If the deleted workout was selected, select another one
            if (state.data.selectedWorkout && state.data.selectedWorkout.id === action.payload) {
                state.data.selectedWorkout = state.data.activeWorkouts.length > 0 ? state.data.activeWorkouts[0] : null;
            }
        },
        updateWorkout(state, action) {
            const { id, progress, completedWorkouts, nextWorkout, streak } = action.payload;
            const workout = state.data.activeWorkouts.find(w => w.id === id);
            if (workout) {
                workout.progress = progress;
                workout.completedWorkouts = completedWorkouts;
                workout.nextWorkout = nextWorkout;
                workout.streak = streak;
                workout.lastCompleted = "Today";

                // Add to history if duration is provided
                if (action.payload.duration) {
                    const today = new Date();
                    const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    workout.history = [
                        {
                            date: formattedDate,
                            completed: true,
                            duration: action.payload.duration
                        },
                        ...workout.history.slice(0, 6) // Keep last 7 days
                    ];
                }

                // Update selected workout if it's the one that was completed
                if (state.data.selectedWorkout && state.data.selectedWorkout.id === id) {
                    state.data.selectedWorkout = workout;
                }
            }
        }
    }
});

// Export action creators
export const {
    setStatus,
    setError,
    setToken,
    setActiveWorkouts,
    setActiveWorkouts1,
    setCompletedWorkouts,
    selectWorkout,
    addWorkout,
    removeWorkout,
    updateWorkout
} = workoutSlice.actions;

export default workoutSlice.reducer;

// Thunk functions
export function fetchActiveWorkouts() {
    return async function fetchActiveWorkoutsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            setToken(token);
            console.log("Authorization Header:", `Bearer ${token}`); // Log the token being sent

            const response = await API.get('/api/getActiveWorkouts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Response from API:", response); // Log the response

            if (response.status === 200) {
                dispatch(setActiveWorkouts(response.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            let errorMessage = "Failed to fetch active workouts";

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

// Thunk functions
export function fetchActiveWorkout(id) {
    return async function fetchActiveWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const userid = parseInt(id, 10); // Convert id to an integer
            console.log(userid);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            setToken(token);
            console.log("Authorization Header:", `Bearer ${token}`); // Log the token being sent

            const response = await API.get(`/api/getUserWorkout/${userid}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            console.log("Response from API:", response.data); // Log the response

            if (response.status === 200) {
                console.log(response.data);
                dispatch(setActiveWorkouts1(response.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            let errorMessage = "Failed to fetch active workouts";

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


export function fetchCompletedWorkouts() {
    return async function fetchCompletedWorkoutsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            const response = await API.get('/api/getCompletedWorkouts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });;
            if (response.status === 200) {
                dispatch(setCompletedWorkouts(response.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            let errorMessage = "Failed to fetch completed workouts";

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

export function addWorkoutPlan(workoutId) {
    return async function addWorkoutPlanThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            const response = await API.post('/api/addWorkoutPlanToActive', { workoutId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200 || response.status === 201) {
                dispatch(addWorkout(response.data.userWorkout));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Workout plan added successfully" }));
            }
        } catch (error) {
            let errorMessage = "Failed to add workout plan";

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

export function deleteWorkoutPlan(id) {
    return async function deleteWorkoutPlanThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
              throw new Error("No token found in localStorage.");
            }
      
            console.log("Token before request:", token);
            setToken(token);
      
            // Perform the delete API request
            const response = await API.delete(
              `api/deleteUserWorkout/${id}`, // API endpoint for deleting the workout
              {
                headers: { 
                  'Authorization': `Bearer ${token}`
                }
              }
            );
      
            if (response.status === 200) {
                dispatch(removeWorkout(id));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Workout plan deleted successfully" }));
            }
        } catch (error) {
            let errorMessage = "Failed to delete workout plan";

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

// export function completeWorkoutDay({ id, duration }) {
//     return async function completeWorkoutDayThunk(dispatch) {
//         dispatch(setStatus(STATUSES.LOADING));
//         try {
//             console.log(id, duration);
//             const token = localStorage.getItem('token');

//             const response = await API.post(`/api/completeWorkoutDay/${id}`,{ duration },{
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             console.log("Response from API:", response);
            
//             if (response.status === 200) {
//                 dispatch(updateWorkout({ id, ...response.data, duration }));
//                 dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Workout day completed successfully" }));
//             }
//         } catch (error) {
//             let errorMessage = "Failed to complete workout day";

//             if (error.response) {
//                 errorMessage = error.response.data.message || errorMessage;
//             } else if (error.request) {
//                 errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
//             } else {
//                 errorMessage = error.message;
//             }

//             dispatch(setError(errorMessage));
//             dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
//         }
//     };
// }

export function completeWorkoutDay({ id, duration }) {
    return async function completeWorkoutDayThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');

            const response = await API.post(`/api/completeWorkoutDay/${id}`, { duration }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.status === 200) {
                dispatch(updateWorkout({ id, ...response.data, duration }));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Workout day completed successfully" }));
                return response.data; // Return the data so it can be accessed by the component
            }
        } catch (error) {
            let errorMessage = "Failed to complete workout day";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setError(errorMessage));
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
            throw error; // Re-throw the error
        }
    };
}

export function restartWorkout(id) {
    return async function restartWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            console.log(token)

            const response = await API.patch(`/api/restartWorkout/${id}`,{},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Response from API:", response);

            if (response.status === 201) {
                dispatch(addWorkout(response.data.userWorkout));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Workout restarted successfully" }));
                dispatch(fetchActiveWorkout(id))
            }
        } catch (error) {
            let errorMessage = "Failed to restart workout";

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