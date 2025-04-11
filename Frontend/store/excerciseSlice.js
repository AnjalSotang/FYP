import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';

const excerciseSlice = createSlice({
    name: 'excercise',
    initialState: {
        data: [], //It holds object alright
        excerciseMetrics: null,
        token: null,
        status: null //We will see about this
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload //Status is a network status it could be either success or pending or faliure
        },
        setExcercise(state, action) {
            state.data = action.payload
        },
        setToken(state, action) {
            state.token = action.payload
        },
        setExcerciseMetrics(state, action) {
            state.excerciseMetrics = action.payload
        }
    }
});

//Step 2: Now Action
export const { setStatus, setExcercise, setToken, setExcerciseMetrics } = excerciseSlice.actions;
export default excerciseSlice.reducer


export function addExcercise(data) {
    return async function addExcerciseThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.post('api/addExercise', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'Authorization': localStorage.getItem(token)
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

export function fetchExcercises() {
    return async function fetchExcercisesThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            // http://localhost:3001/api/getExcercises
            const response = await API.get('api/getExcercises');
            if (response.status === 200) {
                const workout= response.data?.data || [];

                if (workout.length > 0) {
                    dispatch(setExcercise(workout));
                    console.log(workout)
                    dispatch(setStatus({ status: STATUSES.SUCCESS }))
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

export function fetchExcerciseMetrics() {
    return async function fetchExcerciseMetricsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get('api/admin/excercises/metrics');

            if (response.status === 200) {
                const metrics = response.data;
                console.log(metrics)

                if (metrics) {
                    dispatch(setExcerciseMetrics(metrics));
                    dispatch(setStatus({ status: STATUSES.SUCCESS }));
                } else {
                    dispatch(setExcerciseMetrics(null)); // or {} if your reducer expects an object
                    dispatch(setStatus({ status: STATUSES.SUCCESS, message: "No user metrics found" }));
                }
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch user metrics.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}

export function searchExercises(query) {
    return async function searchExercisesThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get(`api/getExcercises/search?query=${encodeURIComponent(query)}`);

            if (response.status === 200 && response.data?.data?.length > 0) {
                dispatch(setExcercise(response.data.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfull" }))
            } else {
                dispatch(setExcercise([])); // Clear previous data if no results found
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



export function fetchExcercise(id) {
    return async function fetchExcerciseThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.get(`api/getExcercise/${id}`)
            if (response.status === 200) {
                dispatch(setExcercise(response.data.data))
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


    // export function editExcercise(id, token)  
    export function updateExcercise(data){
        return async function updateExcerciseThunk(dispatch){
            dispatch(setStatus(STATUSES.LOADING))
           try{
            const response = await API.patch('api/updateExcercise',data,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'Authorization': localStorage.getItem(token)
                }
            })


            if(response.status === 200){
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }))
            }
           }
           catch(error){
            let errorMessage = "An unexpected error occurred.";


            if (error.response) {
                // Server responded with an error status (e.g., 400, 409)
                errorMessage = error.response.data.message || "Update fAILED";
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

    export function deleteExcercise(id) {
        return async function deleteExcerciseThunk(dispatch, getState) {
            dispatch(setStatus(STATUSES.LOADING))
            try {
                const response = await API.delete(`api/deleteExcercise/${id}`);
                if (response.status === 200) {
                    const currentData = getState().excercise.data;
                    const newData = currentData.filter(ex => ex.id !== id);~
                    dispatch(setExcercise(newData));
                    dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfully deleted" }));
                }
            } catch (error) {
                let errorMessage = "An unexpected error occurred.";
    
                if (error.response) {
                    errorMessage = error.response.data.message || "Failed to delete exercise.";
                } else if (error.request) {
                    errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
                } else {
                    errorMessage = error.message;
                }
    
                dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
            }
        }
    }
    

    export function toggleExerciseActive(id, isActive) {
        return async function toggleExerciseActiveThunk(dispatch) {
            dispatch(setStatus(STATUSES.LOADING));
    
            try {
                const response = await API.patch(`api/toggleExcerciseActive/${id}`, { isActive }); // Send isActive in body
    
                if (response.status === 200) {
                    dispatch(setExcercise(response.data.data)); // Update Redux state
                    dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfull" }))
                }
            } catch (error) {
                let errorMessage = "An unexpected error occurred.";
    
                if (error.response) {
                    errorMessage = error.response.data.message || "Failed to update exercise.";
                } else if (error.request) {
                    errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
                } else {
                    errorMessage = error.message;
                }
    
                dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
            }
        };
    }
    



