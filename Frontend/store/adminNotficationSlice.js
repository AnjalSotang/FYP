import { createSlice } from '@reduxjs/toolkit';
import STATUSES from '../src/globals/status/statuses';
import API from '../src/http';

const adminNotificationSlice = createSlice({
    name: 'adminNotification',
    initialState: {
        data: [], // It holds notification objects
        unreadCount: 0,
        status: null, // Network status (success, pending, failure)
        error: null
    },
    reducers: {
        setStatus(state, action) {
            state.status = action.payload // Status is a network status it could be either success or pending or failure
        },
        // Add this to your existing reducers in adminNotificationSlice.js
        addNewNotification(state, action) {
            // Check if notification already exists to prevent duplicates
            const exists = state.data.some(n => n.id === action.payload.id);
            if (!exists) {
                // Add new notification at the beginning of the array
                state.data = [action.payload, ...state.data];
            }
            // Increment unread count if the notification is unread
            if (!action.payload.read) {
                state.unreadCount += 1;
            }
        },
        setNotification(state, action) {
            state.data = action.payload
        },
        setUnreadCount(state, action) {
            state.unreadCount = action.payload
        },
        updateNotificationReadStatus(state, action) {
            const { id, read } = action.payload;
            state.data = state.data.map(notification =>
                notification.id === id ? { ...notification, read } : notification
            );
        },
        markAllAsRead(state) {
            state.data = state.data.map(notification => ({ ...notification, read: true }));
            state.unreadCount = 0;
        },
        removeNotification(state, action) {
            state.data = state.data.filter(notification => notification.id !== action.payload);
        },
        setError(state, action) {
            state.error = action.payload;
            state.status = STATUSES.ERROR;
        }
    }
});

// Action creators
export const {
    setStatus,
    setNotification,
    setUnreadCount,
    updateNotificationReadStatus,
    markAllAsRead,
    removeNotification,
    setError,
    addNewNotification
} = adminNotificationSlice.actions;

export default adminNotificationSlice.reducer;

// Thunk for fetching notifications
export function fetchNotifications() {
    return async function fetchNotificationsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const token = localStorage.getItem('token');
            const response = await API.get('api/admin/notifications',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                const notifications = response.data?.notifications || [];
                console.log(notifications)
                dispatch(setNotification(notifications));
                dispatch(setStatus(STATUSES.SUCCESS));
            }
        }
        catch (error) {
            let errorMessage = "Failed to fetch notifications.";

            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                errorMessage = "Cannot connect to the server. Please check your internet or try again later.";
            } else {
                errorMessage = error.message;
            }

            dispatch(setError(errorMessage));
        }
    }
}

// Thunk for fetching unread count
export function fetchUnreadCount() {
    return async function fetchUnreadCountThunk(dispatch) {
        try {
            const token = localStorage.getItem('token');
            const response = await API.get('api/admin/notifications/unread-count',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                const count = response.data?.count || 0;
                dispatch(setUnreadCount(count));
            }
        }
        catch (error) {
            console.error("Error fetching unread count:", error);
            // We don't set an error state here as this is a background operation
            // that shouldn't disrupt the UI if it fails
        }
    }
}

// Thunk for marking a notification as read
export function markNotificationAsRead(id) {
    return async function markNotificationAsReadThunk(dispatch) {
        try {
            console.log(id)
            const token = localStorage.getItem('token');
            const response = await API.patch(`api/admin/notifications/${id}/read`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                dispatch(updateNotificationReadStatus({ id, read: true }));
                dispatch(fetchUnreadCount()); // Update the unread count
            }
        }
        catch (error) {
            console.error("Error marking notification as read:", error);
            // Optional: Display a toast notification for the error
        }
    }
}

// Thunk for marking all notifications as read
export function markAllNotificationsAsRead() {
    return async function markAllNotificationsAsReadThunk(dispatch, getState) {
        try {
            // Check if there are any notifications to mark as read
            const { adminNotification } = getState();
            if (adminNotification.data.length > 0) {
                const token = localStorage.getItem('token');
                // Using the first notification's ID for the endpoint
                // You could also create a separate endpoint for this operation
                const firstId = adminNotification.data[0].id;
                const response = await API.patch(`api/admin/notifications/read-all`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    dispatch(markAllAsRead());
                }
            }
        }
        catch (error) {
            console.error("Error marking all notifications as read:", error);
            // Optional: Display a toast notification for the error
        }
    }
}

// Thunk for deleting a notification
export function deleteNotification(id) {
    return async function deleteNotificationThunk(dispatch) {
        try {
            const token = localStorage.getItem('token');
            const response = await API.delete(`api/admin/notifications/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                dispatch(removeNotification(id));
                dispatch(fetchUnreadCount()); // Update the unread count in case a unread notification was deleted
            }
        }
        catch (error) {
            console.error("Error deleting notification:", error);
            // Optional: Display a toast notification for the error
        }
    }
}