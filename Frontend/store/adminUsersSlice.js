import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';


const adminUsersSlice = createSlice({
    name: 'adminUsers',
    initialState: {
        data: [], // Holds user objects
        data7: [],
        userMetrics: null, // Holds user metrics
        userGrowthChart: [],
        token: null,
        status: null // Network status (success, pending, failure)
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload // Status could be either success, pending, or failure
        },
        setUsersSevenDays(state, action) {
            state.data7 = action.payload
        },
        setUserMetrics(state, action) {
            state.userMetrics = action.payload
        },
        setUserGrowthChart(state, action) {
            state.userGrowthChart = action.payload
        },
        setUsers(state, action) {
            state.data = action.payload
        },
        setToken(state, action) {
            state.token = action.payload
        }
    }
});

// Export actions and reducer
export const { setStatus, setUserMetrics, setUsersSevenDays, setUsers,setUserGrowthChart, setToken } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;

// Thunk action to fetch all users
export function fetchUsers() {
    return async function fetchUsersThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get('api/admin/Users');
            
            if (response.status === 200) {
                const users = response.data?.data || [];
                
                if (users.length > 0) {
                    dispatch(setUsers(users));
                    dispatch(setStatus({ status: STATUSES.SUCCESS }));
                } else {
                    dispatch(setUsers([]));
                    dispatch(setStatus({ status: STATUSES.SUCCESS, message: "No users found" }));
                }
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch users.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}
export function fetchUsersSevenDays() {
    return async function fetchUsersSeveDaysThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get('api/admin/users/sevenDays');
            
            if (response.status === 200) {
                const users = response.data?.data || [];
                
                if (users.length > 0) {
                    dispatch(setUsersSevenDays(users));
                    dispatch(setStatus({ status: STATUSES.SUCCESS }));
                } else {
                    dispatch(setUsers([]));
                    dispatch(setStatus({ status: STATUSES.SUCCESS, message: "No users found" }));
                }
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch users.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}
export function fetchUserMetrics() {
    return async function fetchUsersThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get('api/admin/users/metrics');

            if (response.status === 200) {
                const metrics = response.data;
                console.log(metrics)

                if (metrics) {
                    dispatch(setUserMetrics(metrics));
                    dispatch(setStatus({ status: STATUSES.SUCCESS }));
                } else {
                    dispatch(setUserMetrics(null)); // or {} if your reducer expects an object
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

export function fetchUserGrowth() {
    return async function fetchUserGrowth(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get('api/admin/users/growth');

            if (response.status === 200) {
                const metrics = response.data?.data;
                console.log(metrics)

                if (metrics) {
                    dispatch(setUserGrowthChart(metrics));
                    dispatch(setStatus({ status: STATUSES.SUCCESS }));
                } else {
                    dispatch(setUserGrowthChart([]));
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



// Thunk action to fetch a single user by ID
export function fetchUser(id) {
    return async function fetchUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get(`api/getUser/${id}`);
            
            if (response.status === 200) {
                dispatch(setUsers([response.data.data]));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "Successfully fetched user" }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to fetch user.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}

// Thunk action to add a new user
export function addUser(data) {
    return async function addUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.post('api/addUser', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'Authorization': localStorage.getItem(token)
                }
            });
            
            if (response.status === 201) {
                dispatch(fetchUsers()); // Refetch all users to update the list
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to add user.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}

// Thunk action to update a user
export function updateUser(data) {
    const id = data.id;
    return async function updateUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            console.log(data)
            const response = await API.patch(`api/admin/Users/${id}`, data);
            if (response.status === 200) {
                dispatch(fetchUsers()); // Refetch all users to update the list
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: response.data.message }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to update user.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}

// Thunk action to delete a user
export function deleteUser(id) {
    return async function deleteUserThunk(dispatch, getState) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.delete(`api/admin/Users/${id}`);
            
            if (response.status === 200) {
                // Update local state by filtering out the deleted user
                const currentData = getState().adminUsers.data;
                const newData = currentData.filter(user => user.id !== id);
                dispatch(setUsers(newData));
                dispatch(setStatus({ status: STATUSES.SUCCESS, message: "User successfully deleted" }));
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred.";

            if (error.response) {
                errorMessage = error.response.data.message || "Failed to delete user.";
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
        }
    }
}

// // Thunk action to toggle user active status
// export function toggleUserActive(id, isActive) {
//     return async function toggleUserActiveThunk(dispatch) {
//         dispatch(setStatus(STATUSES.LOADING));
//         try {
//             const response = await API.patch(`api/updateUser/${id}`, { isActive });
            
//             if (response.status === 200) {
//                 dispatch(fetchUsers()); // Refetch all users to update the list
//                 const statusMessage = isActive ? "User activated successfully" : "User deactivated successfully";
//                 dispatch(setStatus({ status: STATUSES.SUCCESS, message: statusMessage }));
//             }
//         } catch (error) {
//             let errorMessage = "An unexpected error occurred.";

//             if (error.response) {
//                 errorMessage = error.response.data.message || "Failed to update user status.";
//             } else if (error.request) {
//                 errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
//             } else {
//                 errorMessage = error.message;
//             }

//             dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
//         }
//     }
// }

// // Thunk action to search users
// export function searchUsers(query) {
//     return async function searchUsersThunk(dispatch) {
//         dispatch(setStatus(STATUSES.LOADING));
//         try {
//             const response = await API.get(`api/searchUsers?query=${encodeURIComponent(query)}`);
            
//             if (response.status === 200) {
//                 const users = response.data?.data || [];
//                 dispatch(setUsers(users));
//                 dispatch(setStatus({ 
//                     status: STATUSES.SUCCESS, 
//                     message: users.length > 0 ? "Search successful" : "No users found matching your query" 
//                 }));
//             }
//         } catch (error) {
//             let errorMessage = "An unexpected error occurred.";

//             if (error.response) {
//                 errorMessage = error.response.data.message || "Search failed.";
//             } else if (error.request) {
//                 errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
//             } else {
//                 errorMessage = error.message;
//             }

//             dispatch(setStatus({ status: STATUSES.ERROR, message: errorMessage }));
//         }
//     }
// }