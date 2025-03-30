import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';
import { format } from "date-fns";

const workoutScheduleSlice = createSlice({
    name: 'workoutSchedule',
    initialState: {
        // Workout data
        workoutPlans: [], // List of all workout plans (equivalent to data in second implementation)
        workoutDetails: null, // Details of a single workout (equivalent to data1 in second implementation)
        
        // Scheduling data
        scheduledWorkouts: [],

        workoutsForSelectedDate: [],

        upcomingWorkouts: [],
        selectedDate: new Date().toISOString(),
        
        // Form data for scheduling
        formData: {
            selectedWorkoutPlanId: "",
            selectedDayId: "",
            selectedTime: "08:00",
            enableReminder: true,
        },
        
        // UI state
        isDialogOpen: false,
        
        // Common state
        status: null,
        token: null,
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload
        },
        // Workout plan reducers
        setWorkoutPlans(state, action) {
            state.workoutPlans = action.payload
        },
        setWorkoutDetails(state, action) {
            state.workoutDetails = action.payload
        },
        updateWorkoutPlanInState(state, action) {
            const updatedPlan = action.payload;
            state.workoutPlans = state.workoutPlans.map(plan =>
                plan.id === updatedPlan.id ? { ...plan, ...updatedPlan } : plan
            );
        },
        updateWorkoutDayInState(state, action) {
            const updatedDay = action.payload;
            if (state.workoutDetails?.days) {
                state.workoutDetails.days = state.workoutDetails.days.map(day =>
                    day.id === updatedDay.id ? { ...day, ...updatedDay } : day
                );
            }
        },
        
        // Scheduling reducers
        setScheduledWorkouts(state, action) {
            state.scheduledWorkouts = action.payload
        },
        setWorkoutsForSelectedDate(state, action) {
            state.workoutsForSelectedDate = action.payload
        },
        setUpcomingWorkouts(state, action) {
            state.upcomingWorkouts = action.payload
        },
        setSelectedDate(state, action) {
            state.selectedDate = action.payload
        },
        
        // Form reducers
        setFormWorkoutPlan(state, action) {
            state.formData.selectedWorkoutPlanId = action.payload;
            state.formData.selectedDayId = ""; // Reset day when plan changes
        },
        setFormWorkoutDay(state, action) {
            state.formData.selectedDayId = action.payload;
        },
        setFormTime(state, action) {
            state.formData.selectedTime = action.payload;
        },
        setFormReminder(state, action) {
            state.formData.enableReminder = action.payload;
        },
        setDialogOpen(state, action) {
            state.isDialogOpen = action.payload;
        },
        resetForm(state) {
            state.formData = {
                selectedWorkoutPlanId: "",
                selectedDayId: "",
                selectedTime: "08:00",
                enableReminder: true,
            };
        },
        
        // Common reducers
        setToken(state, action) {
            state.token = action.payload
        },
    }
});

// Export actions
export const {
    // Status and common actions
    setStatus,
    setToken,
    
    // Workout plan actions
    setWorkoutPlans,
    setWorkoutDetails,
    updateWorkoutPlanInState,
    updateWorkoutDayInState,
    
    // Scheduling actions
    setScheduledWorkouts,
    setWorkoutsForSelectedDate,
    setUpcomingWorkouts,
    setSelectedDate,
    
    // Form actions
    setFormWorkoutPlan,
    setFormWorkoutDay,
    setFormTime,
    setFormReminder,
    setDialogOpen,
    resetForm
} = workoutScheduleSlice.actions;

export default workoutScheduleSlice.reducer;

// ==== WORKOUT THUNKS ====


export function fetchWorkout(id) {
    return async function fetchWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get(`api/getWorkout/${id}`);
            if (response.status === 200) {
                dispatch(setWorkoutDetails(response.data.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfully fetched workout details" }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch workout details";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}

export function addWorkout(data) {
    return async function addWorkoutThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.post('api/createWorkout', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response.status === 201) {
                dispatch(setWorkoutDetails(response.data.data));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }));
                // Refresh the workout list
                dispatch(fetchWorkouts());
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.response) {
                errorMessage = error.response.data.message || "Workout Creation Failed";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}


// ==== SCHEDULING THUNKS ====

export function fetchWorkouts() {
    return async function fetchWorkoutsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get('api/workout-schedules/getAllWorkoutPlans');
            if (response.status === 200) {
                const workoutPlans = response.data.data || [];
                dispatch(setWorkoutPlans(workoutPlans));
                dispatch(setStatus({ status: STATUSES.SUCCESS }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch workout plans";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}

export function fetchScheduledWorkouts() {
    return async function fetchScheduledWorkoutsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            setToken(token);

            console.log("Authorization Header:", `Bearer ${token}`); // Log the token being sent

            const response = await API.get('api/workout-schedules/getScheduleWorkouts',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }});


            if (response.status === 200) {
                const scheduledWorkouts = response.data?.data || [];
                dispatch(setScheduledWorkouts(scheduledWorkouts));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfully fetched scheduled workouts" }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch scheduled workouts";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}

export function fetchWorkoutsForDate(date) {
    return async function fetchWorkoutsForDateThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            setToken(token);

            console.log("Authorization Header:", `Bearer ${token}`); // Log the token being sent

            const formattedDate = format(date, "yyyy-MM-dd");

            console.log("Formatted Date:", formattedDate);

            const response = await API.get(`api/workout-schedules/date/${formattedDate}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("Response Status:", response.status);

            if (response.status === 200) {
                const workoutsForDate = response.data?.data || [];
                dispatch(setWorkoutsForSelectedDate(workoutsForDate));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfully fetched workouts for date" }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch workouts for date";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}

export function fetchUpcomingWorkouts() {
    return async function fetchUpcomingWorkoutsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            setToken(token);

            console.log("Authorization Header:", `Bearer ${token}`); // Log the token being sent


            const response = await API.get(`api/workout-schedules/upcoming`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }});

            if (response.status === 200) {
                const upcomingWorkouts = response.data?.data || [];
                dispatch(setUpcomingWorkouts(upcomingWorkouts));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfully fetched upcoming workouts" }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch upcoming workouts";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}

export function scheduleWorkout(workoutData) {
    return async function scheduleWorkoutThunk(dispatch) {
        console.log(workoutData);
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            console.log("Token before request:", token);
            setToken(token);

            console.log("Authorization Header:", `Bearer ${token}`); // Log the token being sent


            const response = await API.post(`api/workout-schedules`, workoutData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status === 201) {
                // Refresh data after scheduling
                dispatch(fetchScheduledWorkouts());
                dispatch(fetchWorkoutsForDate(new Date(workoutData.scheduledDate)));
                dispatch(fetchUpcomingWorkouts());
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Workout scheduled successfully" }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.response) {
                errorMessage = error.response.data.message || "Failed to schedule workout";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}

export function deleteScheduledWorkout(id) {
    return async function deleteScheduledWorkoutThunk(dispatch, getState) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.delete(`api/workout-schedules/${id}`);
            
            if (response.status === 200) {
                // Refresh data after deletion
                dispatch(fetchScheduledWorkouts());
                dispatch(fetchWorkoutsForDate(new Date(getState().workoutSchedule.selectedDate)));
                dispatch(fetchUpcomingWorkouts());
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Scheduled workout deleted successfully" }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.response) {
                errorMessage = error.response.data.message || "Failed to delete scheduled workout";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }
            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    };
}

// ==== SELECTORS ====

// Workout selectors
export const selectWorkoutPlans = (state) => state.workoutSchedule.workoutPlans;
export const selectWorkoutDetails = (state) => state.workoutSchedule.workoutDetails;

// Scheduling selectors
export const selectScheduledWorkouts = (state) => state.workoutSchedule.scheduledWorkouts;
export const selectWorkoutsForSelectedDate = (state) => state.workoutSchedule.workoutsForSelectedDate;
export const selectUpcomingWorkouts = (state) => state.workoutSchedule.upcomingWorkouts;
export const selectSelectedDate = (state) => new Date(state.workoutSchedule.selectedDate);
export const selectFormData = (state) => state.workoutSchedule.formData;
export const selectIsDialogOpen = (state) => state.workoutSchedule.isDialogOpen;

// Common selectors
export const selectStatus = (state) => state.workoutSchedule.status;

// Helper selectors
export const selectDatesWithWorkouts = (state) => {
    return (state.workoutSchedule?.scheduledWorkouts || []).map((workout) =>
        new Date(workout.date).toDateString()
    );
};

export const selectWorkoutPlanById = (state, planId) => {
    if (!planId) return null; // Prevents errors if planId is empty or undefined
    return state?.workoutSchedule?.workoutPlans?.find((plan) => Number(plan.id) === Number(planId)) || null;
};