import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses'
import API from '../src/http';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        step: 1,
        user:{
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
        setToken(state, action) {
            state.token = action.payload
        },
        setStatus(state, action) {
            state.status = action.payload
        }
    }
})

export const { setStep, setUser, setToken, setStatus } = authSlice.actions
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
                localStorage.setItem('token', response.data.token)
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
    return async function forgetThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING))
        try{
            const response = await API.post('auth/forget',data)
            if(response.status === 200){
                dispatch(setUser({email: data.email}))
                dispatch(setStatus({status: STATUSES.SUCCESS, message: response.data.message}))
            }
        }
        catch(error){
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
    return async function resetThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING))
        try{
            const response = await API.post('auth/reset',data)
            if(response.status === 201){
                dispatch(setStatus({status: STATUSES.SUCCESS, message: response.data.message}))
            }
        }
        catch(error){
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
