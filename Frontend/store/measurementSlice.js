import { createSlice } from '@reduxjs/toolkit';
// Remember to add this import at the top of the file
import API from '../src/http';

// Define STATUSES here in case it's not correctly imported
const STATUSES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

const measurementSlice = createSlice({
    name: 'measurements', // Changed from 'measurement' to 'measurements' to match the state selector
    initialState: {
        data: [], //It holds object alright
        token: null,
        status: null //We will see about this
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload //Status is a network status it could be either success or pending or failure
        },
        setMeasurement(state, action) {
            state.data = action.payload,
            state.lastUpdated = Date.now() // Update timestamp when data changes
        },
        setToken(state, action) {
            state.token = action.payload
        },
        // Add a new reducer to handle measurement updates without full refetch
        addMeasurementToState(state, action) {
            // Add new measurement to state without refetching everything
            state.data.push(action.payload);
        },
        updateMeasurementInState(state, action) {
            // Update a specific measurement in state without refetching
            const index = state.data.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.data[index] = action.payload;
            }
        }
    }
});

//Step 2: Now Action
export const { 
    setStatus, 
    setMeasurement, 
    setToken, 
    addMeasurementToState, 
    updateMeasurementInState 
} = measurementSlice.actions;

export default measurementSlice.reducer

export function addMeasurement(measurementData) {
    return async function addPersonalRecordThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))       
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            const response = await API.post('api/Measurements', measurementData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.status === 201) {
                // Instead of refetching all measurements, just add the new one to state
                if (Array.isArray(response.data.data)) {
                    dispatch(setMeasurement(response.data.data));
                } else {
                    // Add the single new measurement to the existing data
                    dispatch(addMeasurementToState(response.data.data));
                }
                
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }));
                // Removed fetchMeasurements() call to prevent race condition
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                // Server responded with an error status (e.g., 400, 409)
                errorMessage = error.response.data.message || "Personal Records Addition failed.";
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

export function fetchMeasurements() {
    return async function fetchMeasurementsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            const response = await API.get('api/Measurements', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const records = response.data.data;

                if (records && records.length > 0) {
                    dispatch(setMeasurement(records));
                    dispatch(setStatus({ status: STATUSES.SUCCESS }));
                } else {
                    dispatch(setMeasurement([]));
                    // Don't set error for empty records, just success with empty array
                    dispatch(setStatus({ status: STATUSES.SUCCESS, message: "No records found." }));
                }
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                // Server responded with an error status (e.g., 400, 409)
                errorMessage = error.response.data.message || "Failed to load Body Measurements.";
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

export function updateMeasurement(measurementData) {
    return async function updateMeasurementThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            const response = await API.patch(`api/Measurements/${measurementData.id}`, measurementData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.status === 200) {
                // Instead of doing a full refetch, just update the specific measurement
                if (Array.isArray(response.data.data)) {
                    dispatch(setMeasurement(response.data.data));
                } else {
                    // Update the single measurement in existing data
                    dispatch(updateMeasurementInState(response.data.data));
                }
                
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }));
                // Removed fetchMeasurements() call to prevent race condition
            } 
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                // Server responded with an error status (e.g., 400, 409)
                errorMessage = error.response.data.message || "Update failed.";
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

// New function to delete a personal record
export function deleteMeasurement(id) {
    return async function deleteMeasurementThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            const response = await API.delete(`api/Measurements/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                // Refresh records after deletion
                const updatedListResponse = await API.get('api/Measurements', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (updatedListResponse.status === 200) {
                    dispatch(setMeasurement(updatedListResponse.data.data));
                    dispatch(setStatus({ 
                        status: STATUSES.SUCCESS, 
                        message: response.data.message || "Record deleted successfully" 
                    }));
                }
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to delete record.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}