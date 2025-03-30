import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';

const userWorkoutSlice = createSlice({
    name: 'workout',
    initialState: {
        data: [], //It holds object alright
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
        setToken(state, action) {
            state.token = action.payload
        }
    }
});

//Step 2: Now Action
export const { setStatus, setWorkout, setToken } = userWorkoutSlice.actions;
export default userWorkoutSlice.reducer


export function addUserWorkout(planId) {
    const WorkoutId = planId;
    console.log(WorkoutId)
    return async function addWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            setToken(token);

            console.log("Authorization Header:", `Bearer ${token}`); // Log the token being sent

            const response = await API.post(
                `api/addWorkoutToActive/${WorkoutId}`,
                {},  // Empty body if not needed
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            

            if (response.status === 201) {
                dispatch(setWorkout(response.data.data))
                console.log(response.data.data)
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }))
                console.log(response.data.message)

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




export function getUserWorkout() {
    
    return async function addWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            setToken(token);

            console.log("Authorization Header:", `Bearer ${token}`); // Log the token being sent

            const response = await API.get(    
                'getUserWorkouts',
                {},  // Empty body if not needed
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            

            if (response.status === 200) {
                dispatch(setWorkout(response.data.data))
              // Do not set success message, just update the status
              dispatch(setStatus({ status: STATUSES.SUCCESS }));
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



// Function to delete a workout
export function deleteUserWorkout(WorkoutId,getState) {
    return async function deleteWorkoutThunk(dispatch) {
      dispatch(setStatus(STATUSES.LOADING)); // Set loading status
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found in localStorage.");
        }
  
        console.log("Token before request:", token);
        setToken(token);
  
        // Perform the delete API request
        const response = await API.delete(
          `api/deleteUserWorkout/${WorkoutId}`, // API endpoint for deleting the workout
          {
            headers: { 
              'Authorization': `Bearer ${token}`
            }
          }
        );
  
    // If delete was successful (status 200)
    if (response.status === 200) {
        // Get the current list of workouts from the Redux store
        const currentWorkouts = getState().workout.data;
        
        // Filter out the deleted workout using the WorkoutId
        const updatedWorkouts = currentWorkouts.filter(workout => workout.id !== WorkoutId);

        // Dispatch the updated workout list to the Redux store
        dispatch(setWorkout(updatedWorkouts));

        dispatch(setStatus({
          status: STATUSES.SUCCESS,
          message: response.data.message || "Workout removed successfully."
        }));
      }
      } catch (error) {
        let errorMessage = "An unexpected error occurred.";
  
        if (error.response) {
          // Server responded with an error status (e.g., 400, 404)
          errorMessage = error.response.data.message || "Failed to delete the workout.";
        } else if (error.request) {
          // Request was made but no response (network issues)
          errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
        } else {
          // Other unexpected errors
          errorMessage = error.message;
        }
  
        dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
      }
    };
  }







