import { useState, useEffect, useRef, memo } from "react";
import { Bell, ChevronDown, Search, Menu, Settings, HelpCircle, User, LogOut, XCircle } from "lucide-react";
import Avatar from "react-avatar";
import { throttle } from "lodash";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClear, setShowClear] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)


  const handleScroll = throttle(() => {
    setIsScrolled(window.scrollY > 10);
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowClear(e.target.value.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowClear(false);
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-16 z-80 h-20 px-6 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? "bg-[#0b1129] shadow-lg" : "bg-[#0b1129]"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-[#b4e61d] text-3xl font-bold cursor-pointer">
          FitTrack
        </span>
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-6 relative">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-10 rounded-md bg-[#1a2c50]/50 text-white placeholder:text-gray-400 border-0 focus:outline-none focus:ring-1 focus:ring-[#b4e61d]"
          />
          {showClear && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

        
        {/* Right section: Actions and profile */}
        <div className="flex items-center space-x-3">
          {/* Help button */}
          <button className="p-1.5 rounded-md hover:bg-navy-800 focus:outline-none hidden sm:block">
            <HelpCircle size={20} className="text-gray-400"/>
          </button>

          {/* Settings button */}
          <button className="p-1.5 rounded-md hover:bg-navy-800 focus:outline-none hidden sm:block">
            <Settings size={20} className="text-gray-400"/>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-1.5 rounded-md hover:bg-navy-800 focus:outline-none relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} className="text-gray-400"/>
              <span className="absolute top-0 right-0 w-4 h-4 bg-lime-300 text-navy-900 text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* Notification items */}
                  <a href="#" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-lime-300 flex items-center justify-center text-navy-900 font-bold mr-3">
                        U
                      </div>
                      <div>
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-gray-500 mt-1">John Doe created an account</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold mr-3">
                        E
                      </div>
                      <div>
                        <p className="text-sm font-medium">New exercise added</p>
                        <p className="text-xs text-gray-500 mt-1">Bench Press was added to database</p>
                        <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                      </div>
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold mr-3">
                        S
                      </div>
                      <div>
                        <p className="text-sm font-medium">System update</p>
                        <p className="text-xs text-gray-500 mt-1">System will be updated tonight</p>
                        <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <a href="#" className="text-sm text-lime-500 hover:underline">
                    View all notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center border border-navy-700">
              {/* className="text-gray-400" */}
                <span className="font-medium text-gray-400">AD</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-gray-400">Admin User</span>
                <div className="flex items-center text-xs text-gray-400">
                  <span>Admin</span>
                  <ChevronDown size={14} />
                </div>
              </div>
            </button>

            {/* Profile menu dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    <span>My Profile</span>
                  </div>
                </a>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  <div className="flex items-center">
                    <Settings size={16} className="mr-2" />
                    <span>Account Settings</span>
                  </div>
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-50 text-red-500">
                  <div className="flex items-center">
                    <LogOut size={16} className="mr-2" />
                    <span>Logout</span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      
    </nav>
  );
};

export default memo(Navbar);
