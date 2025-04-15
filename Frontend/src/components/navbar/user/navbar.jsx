import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { Bell, Dumbbell, Menu, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, handleLogout} from "../../../../store/authSlice";
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  fetchUnreadCount, 
  addNewNotification 
} from "../../../../store/userNotificationSlice";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { data: profile } = useSelector((state) => state.auth);
  
  // Get notification data from Redux store
  const { 
    data: notifications, 
    unreadCount, 
    status: notificationStatus 
  } = useSelector((state) => state.userNotification);
  
  const loading = notificationStatus === 'LOADING';
  const profileImageUrl = profile?.profileImage ? profile.profileImage.replace(/\\/g, "/") : "";

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Fetch profile
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Setup socket and fetch notifications
  useEffect(() => {
    if (profile && profile.id) {
      // Fetch notifications using the Redux thunk
      dispatch(fetchNotifications(profile.id));
      dispatch(fetchUnreadCount(profile.id));

      // Setup socket connection
      const socket = io("http://localhost:3001");

      // Authenticate with socket
      socket.emit('authenticate', profile.id);

      // Setup event listener for new notifications
      socket.on('new-notification', (newNotification) => {
        console.log("New notification received:", newNotification);
        dispatch(addNewNotification(newNotification));
      });

      // Cleanup on unmount
      return () => {
        socket.off('new-notification');
        socket.disconnect();
      };
    }
  }, [profile, dispatch]);

  const onLogout = () => {
    dispatch(handleLogout());
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!profile || !profile.name) return "A";

    const nameParts = profile.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }

    return profile.name.substring(0, 2).toUpperCase();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification.id));
    }

    // Navigate to related content if applicable
    if (notification.relatedType === 'WorkoutSchedule') {
      navigate(`/workouts/${notification.relatedId}`);
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  // Mobile nav links
  const NavLinks = ({ className, onClick }) => (
    <>
      <Link
        to="/user"
        className={cn(
          "text-sm font-medium transition-colors hover:text-foreground",
          isActive("/user") ? "text-foreground font-semibold" : "text-muted-foreground",
          className
        )}
        onClick={onClick}
      >
        Dashboard
      </Link>
      <Link
        to="/plans"
        className={cn(
          "text-sm font-medium transition-colors hover:text-foreground",
          isActive("/plans") ? "text-foreground font-semibold" : "text-muted-foreground",
          className
        )}
        onClick={onClick}
      >
        Workout Plans
      </Link>
      <Link
        to="/schedule"
        className={cn(
          "text-sm font-medium transition-colors hover:text-foreground",
          isActive("/schedule") ? "text-foreground font-semibold" : "text-muted-foreground",
          className
        )}
        onClick={onClick}
      >
        Schedule
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo and brand */}
        <div className="flex items-center">
          <Link to="/user" className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <h1 className="text-primary text-xl font-extrabold tracking-wide hover:text-primary/90 transition-all duration-300">
              FitTrack
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <Link to="/user" className="flex items-center gap-2 mb-8 mt-4">
              <Dumbbell className="h-6 w-6 text-primary" />
              <h1 className="text-primary text-xl font-extrabold tracking-wide">
                FitTrack
              </h1>
            </Link>
            <nav className="flex flex-col space-y-6 mt-8">
              <NavLinks className="text-base px-2 py-1" onClick={() => document.querySelector('[data-state="open"]')?.click()} />
              <Link 
                to="/generate" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => document.querySelector('[data-state="open"]')?.click()}
              >
                New Workout
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Link to="/generate" className="hidden sm:flex">
            <Button size="sm" className="gap-1 h-9">
              <Plus className="h-4 w-4" />
              <span>New Workout</span>
            </Button>
          </Link>
          
          <ThemeToggle />

          {/* Notifications dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-9 w-9">
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
                  <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-auto text-xs">
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
                      className="flex flex-col items-start p-4 cursor-pointer hover:bg-accent"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="font-medium flex items-center gap-2">
                          {notification.title}
                          {!notification.read && <Badge variant="primary" className="h-1.5 w-1.5 rounded-full p-0" />}
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

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full overflow-hidden p-0 h-9 w-9">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={profileImageUrl ? `http://localhost:3001/${profileImageUrl}` : undefined}
                    alt="User Avatar"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-sm font-medium bg-primary/10">
                    {getInitials() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex w-full cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link to="/settings" className="flex w-full cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem asChild>
                <Link to="/MyWorkouts" className="flex w-full cursor-pointer">
                  My Workouts
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}