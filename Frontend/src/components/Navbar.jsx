
import { useState } from "react";
import { Link } from "react-router-dom";
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

export function Navbar() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Workout Reminder",
      message: "Upper Body workout scheduled for today at 6:00 PM",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Achievement Unlocked",
      message: "You've completed 5 workouts this week!",
      time: "Yesterday",
      read: true,
    },
    {
      id: 3,
      title: "New Workout Plan",
      message: "Check out our new HIIT workout plan",
      time: "3 days ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center px-12">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden mr-4">
              <Menu className="h-7 w-7" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="px-4 py-8">
              <Link to="/" className="flex items-center gap-4 mb-10">
                <Dumbbell className="h-6 w-6" />
                <span className="font-bold text-4xl">FitTrack</span>
              </Link>
              <nav className="flex flex-col gap-5">
                <Link
                  to="/"
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
                  to="/user/Schedule"
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

        <Link to="/" className="flex items-center gap-2 mr-6">
          <Dumbbell className="h-6 w-6" />
          <span className="font-bold text-xl hidden sm:inline-block">FitTrack</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 flex-1">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link
            to="/user"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Workout Plans
          </Link>
          <Link
            to="/user/schedule"
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
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4 cursor-pointer">
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
                  <DropdownMenuItem className="justify-center text-sm">View all notifications</DropdownMenuItem>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">No notifications</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile1" className="flex w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="flex w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/my-workouts" className="flex w-full">
                  My Workouts
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}