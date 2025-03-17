import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';

const workoutSlice = createSlice({
    name: 'workout',
    initialState: {
        data: [], //It holds object alright
        data1: null,
        token: null,
        status: null //We will see about this
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload //Status is a network status it could be either success or pending or faliure
        },
        setWorkout(state, action) {
            state.data = action.payload
        },
        setWorkout1(state, action) {
            state.data1 = action.payload
        },
        setToken(state, action) {
            state.token = action.payload
        }
    }
});

//Step 2: Now Action
export const { setStatus, setWorkout, setWorkout1, setToken } = workoutSlice.actions;
export default workoutSlice.reducer


export function addWorkout(data) {
    return async function addWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.post('api/createWorkout', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'Authorization': localStorage.getItem(token)
                }
            })
            if (response.status === 201) {
                dispatch(setWorkout1(response.data.data))
                console.log(response.data.data)
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }))
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";


            if (error.response) {
                // Server responded with an error status (e.g., 400, 409)
                errorMessage = error.response.data.message || "Workout Creaion Failed";
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

export function fetchWorkouts() {
    return async function fetchWorkoutsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            // http://localhost:3001/api/getExcercises
            const response = await API.get('api/getAllWorkout')
            if (response.status === 200) {
                const workout= response.data?.data || [];

                if (workout.length > 0) {
                    dispatch(setWorkout(workout));
                    console.log(workout)
                    dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfull" }))
                }
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



export function searchWorkouts(query) {
    return async function searchWorkoutsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get(`api/getAllWorkouts/search?query=${encodeURIComponent(query)}`);

            if (response.status === 200 && response.data?.data?.length > 0) {
                dispatch(setWorkout(response.data.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfull" }))
            } else {
                dispatch(setWorkout([])); // Clear previous data if no results found
                dispatch(setStatus(STATUSES.ERROR));
            }
        } catch (error) {
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
    };
}



export function fetchWorkout(id) {
    return async function fetchWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.get(`api/getWorkout/${id}`)
            if (response.status === 200) {
                dispatch(setWorkout1(response.data.data))
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfull" }))
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


    export function updateWorkout(data) {
        return async function updateWorkoutThunk(dispatch) {
            dispatch(setStatus(STATUSES.LOADING));
            
            console.log(data)
            
    
            try {
                const response = await API.patch('api/updateWorkout', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // 'Authorization': localStorage.getItem(token) // If needed, uncomment
                    }
                });
    
                if (response.status === 200) {
                    dispatch(setStatus({
                        status: STATUSES.SUCCESS,
                        message: response.data.message || "Workout updated successfully"
                    }));
                }
            } catch (error) {
                let errorMessage = "An unexpected error occurred.";
                if (error.response) {
                    errorMessage = error.response.data.message || "Exercise update failed.";
                } else if (error.request) {
                    errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
                } else {
                    errorMessage = error.message;
                }
                dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
            }
        }
    }
    

    export function deleteWorkout(id) {
        return async function deleteWorkoutThunk(dispatch, getState) {
            dispatch(setStatus(STATUSES.LOADING))
            try {
                const response = await API.delete(`api/deleteWorkout/${id}`);
                if (response.status === 200) {
                    const currentData = getState().excercise.data;
                    const newData = currentData.filter(ex => ex.id !== id);
                    dispatch(setWorkout(newData));
                    dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfully deleted" }));
                }
            } catch (error) {
                dispatch(setStatus({ status: STATUSES.ERROR, message: "Deletion failed" }));
            }
        }
    }
    



