import { useState, useEffect, memo, useRef } from "react";
import { Bell, ChevronDown, Settings, HelpCircle, User, LogOut, Dumbbell } from "lucide-react";
import { throttle } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfile, handleLogout } from "../../../../store/authSlice";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationAction,
  fetchUnreadCount as fetchUnreadCountAction,
  addNewNotification
} from "../../../../store/adminNotficationSlice";
import { io } from "socket.io-client"; // Import socket.io-clie

const TopNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: profile } = useSelector((state) => state.auth);
  const { data: notifications, unreadCount: reduxUnreadCount } = useSelector((state) => state.adminNotification);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [socket, setSocket] = useState(null); // Add socket state

  // Refs for click-away detection
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const profileImageUrl = profile?.profileImage ? profile.profileImage.replace(/\\/g, "/") : "";

  console.log("profileImageUrl:", profileImageUrl);

  // Global click handler for closing dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Socket.io setup for real-time notifications
  useEffect(() => {
    if (profile && profile.id) {
      // Setup socket connection
      const newSocket = io("http://localhost:3001");
      setSocket(newSocket);

      // Authenticate with socket
      newSocket.emit('authenticate', profile.id);
      // In your TopNavbar component
      newSocket.on('new-notification', (newNotification) => {
        console.log("New notification received:", newNotification);
        // Directly update the Redux state with the new notification
        dispatch(addNewNotification(newNotification));
      });

      // Cleanup on unmount
      return () => {
        if (newSocket) {
          newSocket.off('new-notification');
          newSocket.disconnect();
        }
      };
    }
  }, [profile, dispatch]);

  // Toggle functions - ensure only one dropdown is open at a time
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false); // Close profile menu
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false); // Close notifications
  };

  // Mark notification as read handler
  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  // Mark all notifications as read handler
  const handleMarkAllAsRead = () => {
    if (notifications && notifications.length > 0) {
      dispatch(markAllNotificationsAsRead());
    }
  };

  // Delete notification handler
  const handleDeleteNotification = (id) => {
    dispatch(deleteNotificationAction(id));
  };

  // Fetch profile and initial notifications
  useEffect(() => {
    dispatch(fetchAdminProfile());
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCountAction());
  }, [dispatch]);

  const handleScroll = throttle(() => {
    setIsScrolled(window.scrollY > 10);
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // Set up polling for new notifications (every 30 seconds)
    const notificationInterval = setInterval(() => {
      dispatch(fetchUnreadCountAction());
      if (showNotifications) {
        dispatch(fetchNotifications());
      }
    }, 30000);

    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
      clearInterval(notificationInterval);
    };
  }, [handleScroll, showNotifications, dispatch]);

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (showNotifications) {
      dispatch(fetchNotifications());
    }
  }, [showNotifications, dispatch]);

  // Keyboard navigation handlers
  const handleKeyDown = (e, toggleFunction) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFunction();
    } else if (e.key === "Escape") {
      setShowNotifications(false);
      setShowProfileMenu(false);
    }
  };
  const onLogout = () => {
    dispatch(handleLogout());
    navigate('/login');
  };



  return (
    <nav
      className={`fixed top-0 right-0 left-16 z-80 h-20 px-6 flex items-center justify-between transition-all duration-300 ${isScrolled ? "bg-[#0b1129] shadow-lg" : "bg-[#0b1129]"
        }`}
    >
      {/* Logo */}
      <div className="flex items-center">
          <Link to="/admin" className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <h1 className="text-primary text-xl font-extrabold tracking-wide hover:text-primary/90 transition-all duration-300">
              FitTrack
            </h1>
          </Link>
        </div>

      {/* Right section: Actions and profile */}
      <div className="flex items-center space-x-3">


        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            aria-label="Notifications"
            aria-expanded={showNotifications}
            aria-haspopup="true"
            className="p-1.5 rounded-md hover:bg-navy-800 focus:bg-navy-700 focus:outline-none relative transition-colors"
            onClick={toggleNotifications}
            onKeyDown={(e) => handleKeyDown(e, toggleNotifications)}
          >
            <Bell size={20} className="text-gray-400" />
            {reduxUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-lime-300 text-navy-900 text-xs font-bold rounded-full flex items-center justify-center">
                {reduxUnreadCount > 9 ? '9+' : reduxUnreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50" role="menu">

              <div className="px-4 py-2 border-b border-gray-100 dark:border-navy-700 flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                {reduxUnreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-lime-500 hover:text-lime-600 hover:underline focus:underline focus:outline-none"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications && notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => {
                    // Determine icon style based on notification type
                    let iconClass = "bg-lime-300 text-navy-900";
                    let iconLetter = "N";

                    if (notification.type === 'user_registration') {
                      iconClass = "bg-lime-300 text-navy-900";
                      iconLetter = "U";
                    } else if (notification.type === 'system_stats') {
                      iconClass = "bg-blue-100 text-blue-500";
                      iconLetter = "S";
                    } else if (notification.type === 'admin-alert') {
                      iconClass = "bg-red-100 text-red-500";
                      iconLetter = "A";
                    } else if (notification.type === 'user_workout_creation') {
                      iconClass = "bg-purple-100 text-purple-500";
                      iconLetter = "W";
                    } else if (notification.type === 'workout_creation') {
                      iconClass = "bg-orange-100 text-orange-500";
                      iconLetter = "W+";
                    } else if (notification.type === 'account_deletion') {
                      iconClass = "bg-red-200 text-red-600";
                      iconLetter = "D";
                    } else if (notification.type === 'workout_completion') {
                      iconClass = "bg-green-200 text-green-600";
                      iconLetter = "C";
                    } else if (notification.type === 'workout_removed') {
                      iconClass = "bg-yellow-200 text-yellow-700";
                      iconLetter = "R";
                    }


                    return (
                      <div
                        key={notification.id}
                        className={`block px-4 py-3 hover:bg-gray-50 dark:hover:bg-navy-700 border-b border-gray-100 dark:border-navy-700 ${!notification.read ? 'bg-blue-50 dark:bg-navy-600' : ''}`}
                        role="menuitem"
                        tabIndex="0"
                      >
                        <div className="flex">
                          <div className={`w-10 h-10 rounded-full ${iconClass} flex items-center justify-center font-bold mr-3 flex-shrink-0`}>
                            {iconLetter}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium mb-1">{notification.title}</p>
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  className="text-xs text-lime-500 hover:text-lime-600 hover:underline focus:underline focus:outline-none ml-2"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{notification.message}</p>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-400">{notification.time}</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification.id);
                                }}
                                className="text-xs text-red-400 hover:text-red-500 hover:underline focus:underline focus:outline-none"
                                aria-label={`Delete notification: ${notification.title}`}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No notifications
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100 dark:border-navy-700 text-center">
                  <Link
                    to="/admin/notifications"
                    className="text-sm text-lime-500 hover:text-lime-600 hover:underline focus:underline focus:outline-none"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            aria-label="User profile menu"
            aria-expanded={showProfileMenu}
            aria-haspopup="true"
            className="flex items-center space-x-2 focus:outline-none rounded-md p-1 hover:bg-navy-800 focus:bg-navy-700 transition-colors"
            onClick={toggleProfileMenu}
            onKeyDown={(e) => handleKeyDown(e, toggleProfileMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center border border-navy-700 overflow-hidden">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="font-medium text-primary">AD</span>
              )}
            </div>
            <div className="hidden sm:block">
              <span className="text-primary">Admin</span>
              {/* <div className="flex items-center text-xs text-gray-400">
                <span>{profile?.role || "Admin"}</span>
                <ChevronDown size={14} className="ml-1" />
              </div> */}
            </div>
          </button>

          {/* Profile menu dropdown */}
          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-navy-800 rounded-md shadow-lg py-1 text-gray-800 dark:text-gray-200 z-50 border border-gray-200 dark:border-navy-700"
              role="menu"
            >
           
              <Link
                to="/admin/settings"
                className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors focus:bg-gray-50 dark:focus:bg-navy-700 focus:outline-none"
                role="menuitem"
              >
                <div className="flex items-center">
                  <Settings size={16} className="mr-2" />
                  <span>Settings</span>
                </div>
              </Link>
              <div className="border-t border-gray-100 dark:border-navy-700 my-1"></div>
              <button
                type="button"
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors focus:bg-gray-50 dark:focus:bg-navy-700 focus:outline-none text-red-500"
                role="menuitem"
              >
                <div className="flex items-center">
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </div>
              </button>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default memo(TopNavbar);