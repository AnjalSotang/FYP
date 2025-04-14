import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';
import { CircleGauge } from 'lucide-react';

const settingSlice = createSlice({
    name: 'setting',
    initialState: {
        data: [], // Holds setting objects
        status: null // Network status (success, pending, failure)
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload // Status could be either success, pending, or failure
        },
        setSetting(state, action) {
            state.data = action.payload
        }
    }
});

// Export actions and reducer
export const { setStatus, setSetting } = settingSlice.actions;
export default settingSlice.reducer;

// Thunk action to fetch settings
export function fetchSetting() {
    return async function fetchSettingThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            const response = await API.get('api/admin/settings',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 200) {
                console.log(response.data)
                dispatch(setSetting(response.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch settings.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}

// Thunk action to create new settings
export function createSetting(settingData) {
    console.log(settingData)
    return async function createSettingThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            console.log(token)
            const response = await API.post('api/admin/settings', 
                settingData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 201) {
                dispatch(setSetting(response.data));
                dispatch(setStatus({ 
                    status: STATUSES.SUCCESS, 
                    message: "Settings successfully created" 
                }));
                return true;
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to create settings.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
            return false;
        }
    }
}

// Thunk action to update existing settings
export function updateSetting(settingData) {
    return async function updateSettingThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            const response = await API.put('api/admin/settings',
                settingData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log(response)
            
            if (response.status === 200) {
                dispatch(setSetting(response.data));
                dispatch(setStatus({ 
                    status: STATUSES.SUCCESS, 
                    message: "Settings successfully updated" 
                }));
                return true;
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to update settings.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
            return false;
        }
    }
}


// Thunk action to update existing settings
export function updateUserSetting(settingData) {
    return async function updateUserSettingThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            const response = await API.patch('api/admin/userSettings',
                settingData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log(response.data.settings)
            
            if (response.status === 200) {
                dispatch(setSetting(response.data.settings));
                dispatch(setStatus({ 
                    status: STATUSES.SUCCESS, 
                    message: response.data.message 
                }));
                // dispatch(fetchSetting());
                
                return true;
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to update settings.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
            return false;
        }
    }
}

// Thunk action to update existing settings
export function updateMaintainanceMode(settingData) {
    return async function updateMaintainanceModeThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            const response = await API.patch('api/admin/maintainanceMode',
                settingData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 200) {
                dispatch(setSetting(response.data));
                dispatch(setStatus({ 
                    status: STATUSES.SUCCESS, 
                    message: "User Settings successfully updated" 
                }));
                // dispatch(fetchSetting());
                
                return true;
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to update mainitainace mode.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
            return false;
        }
    }
}