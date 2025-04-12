// Corrected authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses'
import API from '../src/http';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        step: 1,
        user: {
            userName: '',
            email: '',
            password: '',
            gender: '',
            age: '',
            weight: '',
            heightFeet: '',
            heightInches: '',
            selectedOptions: [], // 🔥 Multiple selection (Step 3)
            experienceLevel: '',
        },
        data: null,
        token: null,
        status: null
    },
    reducers: {
        setStep(state, action) {
            state.step = action.payload;  // Update step number
        },
        setUser(state, action) {
            state.user = { ...state.user, ...action.payload };
        },
        setStatus(state, action) {
            state.status = action.payload; // Fixed: updating status instead of user
        },
        setToken(state, action) {
            state.token = action.payload
        },
        setData(state, action) {
            state.data = action.payload;
        },
    }
})

export const { setStep, setUser, setStatus, setToken, setData } = authSlice.actions;

export default authSlice.reducer

export function register(data) {

    return async function registerThunk(dispatch) {

        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.post('auth/register', data)
            if (response.status === 201) {
                dispatch(setUser(data))
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

export function login(data) {
    return async function loginThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.post('auth/login', data)
            if (response.status === 200 && response.data.token) {
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }))
                dispatch(setUser(response.data.user))
                dispatch(setToken(response.data.token))
                console.log(response.data.token);  // Check if the token exists and is valid
                localStorage.setItem('token', response.data.token)
                console.log(response.data.token);
                const token = localStorage.getItem('token');
                console.log(token);
            }
            
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";


            if (error.response) {
                // Server responded with an error status (e.g., 400, 409)
                errorMessage = error.response.data.message || "Login failed.";
            } else if (error.request) {
                // Request was made but no response (backend is down or network issue)
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                // Other unexpected errors (e.g., something wrong with frontend code)
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
            // dispatch(setStatus(STATUSES.ERROR))
        }
    }
}

export function forget(data) {
    return async function forgetThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.post('auth/forget', data)
            if (response.status === 200) {
                dispatch(setUser({ email: data.email }))
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }))
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.response) {
                // Server responded with an error status (e.g., 400, 409)
                errorMessage = error.response.data.message || "Password reset failed.";
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

export function reset(data) {
    return async function resetThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.post('auth/reset', data)
            if (response.status === 201) {
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }))
            }
        }
        catch (error) {
            if (error.response) {
                // Server responded with an error status (e.g., 400, 409)
                errorMessage = error.response.data.message || "Password reset failed.";
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



export function fetchProfile() {
    return async function fetchProfileThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);

            const response = await API.get('auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}` // Fixed: Using token correctly
                }
            });

            console.log(response.data.data)

            if (response.status === 200) {
                dispatch(setData(response.data?.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS}))
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch profile.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}

export function fetchAdminProfile() {
    return async function fetchProfileThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);

            const response = await API.get('auth/admin/profile', {
                headers: {
                    'Authorization': `Bearer ${token}` // Fixed: Using token correctly
                }
            });

            console.log(response.data.data)

            if (response.status === 200) {
                dispatch(setData(response.data?.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS}))
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch profile.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}



export function changeProfilePassword(formData) {
    return async function changeProfiePasswordThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);

            const response = await API.patch('auth/profile/password', formData, {
                headers: {
                    'Authorization': `Bearer ${token}` // Fixed: Using token correctly
                }
            });

            console.log(response.data.data)

            if (response.status === 200) {
                // dispatch(setData(response.data?.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successful" }))
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to change the password.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}

export function deleteAccount() {
    return async function deleteAccountThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);

            const response = await API.delete('auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}` // Fixed: Using token correctly
                }
            });

            console.log(response.data.data)

            if (response.status === 200) {
                // dispatch(setData(response.data?.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successful" }))
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to delete the account.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}




export function updateProfile(updatedData = {}, imageFile = null) {
    return async function updateProfileThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);

            // Create FormData object for the PATCH request
            const formData = new FormData();
            
            // Add only the fields that need to be updated
            Object.keys(updatedData).forEach(key => {
                // Only append if the field has a value (including empty strings if that's intentional)
                if (updatedData[key] !== undefined && updatedData[key] !== null) {
                    formData.append(key, updatedData[key]);
                }
            });
            
            // Add image if provided
            if (imageFile) {
                formData.append('image', imageFile);
            }
            
            // Only proceed if there's something to update
            if (formData.entries().next().done && !imageFile) {
                // No data to update
                return dispatch(setStatus({ 
                    status: STATUSES.INFO, 
                    message: "No changes to update" 
                }));
            }
            
            // Make the PATCH request to your endpoint
                const response = await API.patch('auth/profile', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                        // Content-Type is automatically set by the browser with the correct boundary when using FormData
                    }
                });

            console.log("Updated profile data:", response.data.data);

            if (response.status === 200) {
                // Update the Redux store with the new data
                dispatch(setData(response.data?.data));
                dispatch(setStatus({ 
                    status: STATUSES.SUCCESS, 
                    message: response.data?.message || "Profile updated successfully" 
                }));
                
                return response.data; // Return data for chaining
            }
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to update profile.";
                console.error("Error response:", error.response.data);
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
                console.error("Error request:", error.request);
            } else {
                errorMessage = error.message;
                console.error("Error message:", error.message);
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
            throw error; // Re-throw to allow error handling in components
        }
    }
}