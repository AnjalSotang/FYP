import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';

const personalRecordSlice = createSlice({
    name: 'personalRecord',
    initialState: {
        data: [], //It holds object alright
        token: null,
        status: null //We will see about this
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload //Status is a network status it could be either success or pending or faliure
        },
        setPersonalRecord(state, action) {
            state.data = action.payload
        },
        setToken(state, action) {
            state.token = action.payload
        }
    }
});

//Step 2: Now Action
export const { setStatus, setPersonalRecord, setToken } = personalRecordSlice.actions;
export default personalRecordSlice.reducer


export function addPersonalRecord(formattedRecords) {
    return async function addPersonalRecordThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            dispatch(setToken(token));

            console.log(formattedRecords)
            
            const response = await API.post('api/PersonalRecords', formattedRecords, {
                headers: {
                      Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 201) {
                dispatch(setPersonalRecord(response.data.data))
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }))
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
                errorMessage = error.data.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}

export function fetchPersonalRecords() {
    return async function fetchPersonalRecordsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            // dispatch(setToken(token));

            const response = await API.get('api/PersonalRecords',{
                headers: {
                      Authorization: `Bearer ${token}`
                }});

            if (response.status === 200) {
                const records = response.data.data;
                console.log(records)

                if (records.length > 0) {
                    dispatch(setPersonalRecord(records));
                    dispatch(setStatus({ status: STATUSES.SUCCESS }))
                } else {
                    dispatch(setPersonalRecord([]));
                    dispatch(setStatus({ status: STATUSES.SUCCESS }))
                }
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";


            if (error.response) {
                // Server responded with an error status (e.g., 400, 409)
                errorMessage = error.response.message || "Failed to load personal records.";
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


export function updatePersonalRecords(records){
    return async function updatePersonalRecordsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        console.log(records)
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            // dispatch(setToken(token));


            const response = await API.patch('api/PersonalRecords', records, {
                headers: {
                      Authorization: `Bearer ${token}`
                }});
            if (response.status === 200) {
                dispatch(setPersonalRecord(response.data.data))
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }))
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
export function deletePersonalRecord(recordId) {
    return async function deletePersonalRecordThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before delete request:", token);

            const response = await API.delete(`api/PersonalRecords/${recordId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                // Refresh records after deletion
                const updatedListResponse = await API.get('api/PersonalRecords', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (updatedListResponse.status === 200) {
                    dispatch(setPersonalRecord(updatedListResponse.data.data));
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