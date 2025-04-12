import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Calendar, Dumbbell, Home, LineChart, Menu, Plus, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../../store/authSlice";
import axios from "axios";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// const fetchNotifications = async (userId, page = 1, limit = 10) => {
const fetchNotifications = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/notifications/user/${userId}`);

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { notifications: [], pagination: { currentPage: 1, totalPages: 1, totalNotifications: 0 } };
  }
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

export function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { data: profile } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);


  const profileImageUrl = profile?.profileImage ? profile.profileImage.replace(/\\/g, "/") : "";

  // Fetch profile
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);


  const handleLogout = () => {
    localStorage.removeItem('token')
    // setIsLoggedIn(false)
    navigate('/login')
  }



  // Setup socket and fetch notifications
  useEffect(() => {
    const getNotifications = async () => {
      if (profile && profile.id) {
        setLoading(true);
        const notificationsData = await fetchNotifications(profile.id);
        setNotifications(notificationsData.notifications);
        setUnreadCount(notificationsData.notifications.filter(n => !n.read).length);
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

        // Update unread count
        if (!newNotification.read) {
          setUnreadCount(prevCount => prevCount + 1);
        }
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

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!profile || !profile.name) return "A";

    const nameParts = profile.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }

    return profile.name.substring(0, 2).toUpperCase();
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      const success = await markNotificationAsRead(notification.id);
      if (success) {
        // Update the notification to mark as read
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => prev - 1);
      }
    }

    // Navigate to related content if applicable
    if (notification.relatedType === 'WorkoutSchedule') {
      // Navigation logic can be added here
      // navigate(`/workouts/${notification.relatedId}`);
    }
  };

  const markAllAsRead = async () => {
    if (profile && profile.id) {
      const success = await markAllNotificationsAsRead(profile.id);
      if (success) {
        // Mark all notifications as read
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center px-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden mr-4">
              <Menu className="h-7 w-7" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>


          <SheetContent side="left">
            <div className="px-4 py-8">
              <Link to="/user" className="flex items-center gap-4 mb-10">
                <Dumbbell className="h-6 w-6" />
                <span className="font-bold text-4xl">FitTrack</span>
              </Link>
              <nav className="flex flex-col gap-5">
                <Link
                  to="/user"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/user"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LineChart className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/plans"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Dumbbell className="h-5 w-5" />
                  <span>Workout Plans</span>
                </Link>
                <Link
                  to="/schedule"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Schedule</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/user" className="flex items-center gap-2 mr-12">
          <Dumbbell className="h-6 w-6" />
          <span className="font-bold text-xl hidden sm:inline-block">FitTrack</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 flex-1">
          <Link to="/plans" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link
            to="/user"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/plans"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Workout Plans
          </Link>
          <Link
            to="/schedule"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Schedule
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/generate" className="hidden sm:flex">
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span>New Workout</span>
            </Button>
          </Link>
          {/* Add ThemeToggle here */}
          <ThemeToggle />



          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto text-xs">
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">Loading...</div>
              ) : notifications.length > 0 ? (
                <>
                  {notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start p-4 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="font-medium flex items-center gap-2">
                          {notification.title}
                          {!notification.read && <Badge className="h-1.5 w-1.5 rounded-full p-0" />}
                        </div>
                        <div className="text-xs text-muted-foreground">{notification.time}</div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{notification.message}</div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-sm">
                    <Link to="/notifications" className="w-full text-center">View all notifications</Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">No notifications</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full p-1">
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  <AvatarImage
                    src={profileImageUrl ? `http://localhost:3001/${profileImageUrl}` : undefined}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 text-lg font-medium">
                    {getInitials() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="flex w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="flex w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/MyWorkouts" className="flex w-full">
                  My Workouts
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
