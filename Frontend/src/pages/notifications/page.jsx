import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck, Filter } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RootLayout from "@/components/layout/UserLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

// API functions for notifications
const fetchNotifications = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/notifications/user/${userId}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return { notifications: [] }
    };
};

const markAllNotificationsAsRead = async (userId) => {
    try {
        await axios.patch(`http://localhost:3001/api/notifications/user/${userId}/read-all`);
        return true;
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return false;
    }
};

const markNotificationAsRead = async (notificationId) => {
    try {
        await axios.patch(`http://localhost:3001/api/notifications/${notificationId}/read`);
        return true;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return false;
    }
};

const clearAllNotifications = async (id) => {
    try {
        console.log(id)
        await axios.delete(`http://localhost:3001/api/notifications/user/${id}`);
        return true;
    } catch (error) {
        console.error("Error clearing notifications:", error);
        return false;
    }
};

export default function NotificationsPage() {
    const { data: profile } = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [filters, setFilters] = useState({
        workout_reminder: true,
        achievement: true,
        workout_added: true,
        // Add any other notification types you have
    });

    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);

    // Fetch notifications and setup socket connection
    useEffect(() => {
        const getNotifications = async () => {
            if (profile && profile.id) {
                setLoading(true);
                const notificationsData = await fetchNotifications(profile.id);
                setNotifications(notificationsData.notifications || []);
                setLoading(false);
            }
        };

        if (profile && profile.id) {
            getNotifications();

            // Setup socket connection
            const newSocket = io("http://localhost:3001");
            setSocket(newSocket);

            // Authenticate with socket
            newSocket.emit('authenticate', profile.id);

            // Setup event listener for new notifications
            newSocket.on('new-notification', (newNotification) => {
                console.log("New notification received:", newNotification);

                // Use functional updates to ensure we're working with the latest state
                setNotifications(prevNotifications => {
                    // Check if notification already exists to prevent duplicates
                    const exists = prevNotifications.some(n => n.id === newNotification.id);
                    if (exists) return prevNotifications;

                    // Add new notification at the beginning of the array
                    return [newNotification, ...prevNotifications];
                });
            });

            // Cleanup on unmount
            return () => {
                if (newSocket) {
                    newSocket.off('new-notification');
                    newSocket.disconnect();
                }
            };
        }
    }, [profile]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const filteredNotifications = notifications.filter((notification) => {
        if (activeTab === "unread" && notification.read) return false;
        if (activeTab === "read" && !notification.read) return false;
        return filters[notification.type] !== false; // Using notification.type instead of category
    });

    const markAllAsRead = async () => {
        if (profile && profile.id) {
            setLoading(true);
            const success = await markAllNotificationsAsRead(profile.id);
            if (success) {
                setNotifications(prevNotifications =>
                    prevNotifications.map(n => ({ ...n, read: true }))
                );
            }
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        setLoading(true);
        const success = await markNotificationAsRead(id);
        if (success) {
            setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
        }
        setLoading(false);
    };

    const clearNotifications = async () => {
        if (profile && profile.id) {
            // Add confirmation dialog
            const confirmed = window.confirm("Are you sure you want to clear all notifications?");
            
            if (confirmed) {
                setLoading(true);
                const success = await clearAllNotifications(profile.id);
                if (success) {
                    setNotifications([]);
                }
                setLoading(false);
            }
        }
    };


    const toggleFilter = (type) => {
        setFilters({
            ...filters,
            [type]: !filters[type],
        });
    };
    const getCategoryColor = (category) => {
        switch (category) {
            case "workout_reminder":
                return "bg-blue-500";
            case "achievement":
                return "bg-green-500";
            case "workout_added":
                return "bg-purple-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <RootLayout>
            <div className="container mx-auto py-10 px-12">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                            <p className="text-muted-foreground">View and manage your notifications</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-1">
                                        <Filter className="h-4 w-4" />
                                        <span>Filter</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuCheckboxItem
                                        checked={filters.workout_reminder}
                                        onCheckedChange={() => toggleFilter("workout_reminder")}
                                    >
                                        Reminders
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filters.achievement}
                                        onCheckedChange={() => toggleFilter("achievement")}
                                    >
                                        Achievements
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filters.workout_added}
                                        onCheckedChange={() => toggleFilter("workout_added")}
                                    >
                                        Updates
                                    </DropdownMenuCheckboxItem>
                                    {/* Add other notification types as needed */}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {unreadCount > 0 && (
                                <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={loading}>
                                    <CheckCheck className="mr-2 h-4 w-4" />
                                    Mark all as read
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearNotifications}
                                disabled={notifications.length === 0 || loading}
                            >
                                Clear all
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="all">
                                All
                                <Badge variant="secondary" className="ml-2">
                                    {notifications.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="unread">
                                Unread
                                <Badge variant="secondary" className="ml-2">
                                    {unreadCount}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="read">
                                Read
                                <Badge variant="secondary" className="ml-2">
                                    {notifications.length - unreadCount}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="mt-4">
                            <NotificationsList
                                notifications={filteredNotifications}
                                markAsRead={markAsRead}
                                getCategoryColor={getCategoryColor}
                                loading={loading}
                            />
                        </TabsContent>
                        <TabsContent value="unread" className="mt-4">
                            <NotificationsList
                                notifications={filteredNotifications}
                                markAsRead={markAsRead}
                                getCategoryColor={getCategoryColor}
                                loading={loading}
                            />
                        </TabsContent>
                        <TabsContent value="read" className="mt-4">
                            <NotificationsList
                                notifications={filteredNotifications}
                                markAsRead={markAsRead}
                                getCategoryColor={getCategoryColor}
                                loading={loading}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </RootLayout>
    );
}

function NotificationsList({
    notifications,
    markAsRead,
    getCategoryColor,
    loading
}) {
    if (loading) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-lg font-medium">Loading notifications...</p>
                </CardContent>
            </Card>
        );
    }

    if (notifications.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <Bell className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-lg font-medium">No notifications</p>
                    <p className="text-sm text-muted-foreground">You don't have any notifications in this category</p>
                </CardContent>
            </Card>
        );
    }

    const formatTime = (dateString) => {
        if (!dateString) return "Unknown";

        const date = new Date(dateString);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));

        if (isNaN(diffMinutes)) return "Unknown";

        if (diffMinutes < 1) return "Just now";
        if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString();
    };

    return (
        <Card>
            <CardContent className="p-0">
                <ul className="divide-y">
                    {notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 ${!notification.read ? "bg-muted/40" : ""}`}
                        >
                            <div className={`mt-1 h-2 w-2 rounded-full ${getCategoryColor(notification.type)}`} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{notification.title}</h3>
                                    <span className="text-xs text-muted-foreground">
                                        {notification.time || formatTime(notification.createdAt || notification.date)}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                                {notification.relatedType && (
                                    <Badge variant="" className="mt-2">
                                        {notification.relatedType}
                                    </Badge>
                                )}
                            </div>
                            {!notification.read && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => markAsRead(notification.id)}
                                    disabled={loading}
                                >
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only">Mark as read</span>
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}