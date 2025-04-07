
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { cn } from "../lib/utils";
import { useTwilioAuthStore } from "../utils/twilio-auth-store";
import { User, LogOut, LogIn, UserRoundPlus, FileText, Users } from "lucide-react";
import { useLocation } from "react-router-dom";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useTwilioAuthStore();
  const location = useLocation();
  
  // Check if user is on dashboard or other authenticated pages
  const isAuthenticatedPage = location.pathname === "/dashboard" || 
                             location.pathname === "/report-viewer";
  
  // Check if user is an admin
  const isAdmin = user?.profile_type === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={cn(
        "fixed w-full top-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-gray-900 font-bold text-xl flex items-center">
              <span className="text-health-600 mr-1">GATOR</span>
              PRIME
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isAuthenticatedPage && (
              <>
                <a 
                  href="#about" 
                  className="text-gray-700 hover:text-health-600 transition-colors duration-300 text-sm font-medium"
                >
                  About
                </a>
                <a 
                  href="#how-it-works" 
                  className="text-gray-700 hover:text-health-600 transition-colors duration-300 text-sm font-medium"
                >
                  How It Works
                </a>
                <a 
                  href="#benefits" 
                  className="text-gray-700 hover:text-health-600 transition-colors duration-300 text-sm font-medium"
                >
                  Benefits
                </a>
              </>
            )}
            
            {/* Admin-specific navigation options */}
            {isAdmin && (
              <>
                <a 
                  href="/manage-patients"
                  className="text-gray-700 hover:text-health-600 transition-colors duration-300 text-sm font-medium"
                >
                  <span className="flex items-center">
                    <UserRoundPlus size={16} className="mr-1" />
                    Sign Up
                  </span>
                </a>
                <a 
                  href="/all-reports"
                  className="text-gray-700 hover:text-health-600 transition-colors duration-300 text-sm font-medium"
                >
                  <span className="flex items-center">
                    <FileText size={16} className="mr-1" />
                    All Reports
                  </span>
                </a>
                <a 
                  href="/manage-users"
                  className="text-gray-700 hover:text-health-600 transition-colors duration-300 text-sm font-medium"
                >
                  <span className="flex items-center">
                    <Users size={16} className="mr-1" />
                    Manage Users
                  </span>
                </a>
              </>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-health-600" />
                  <span className="text-sm font-medium">
                    {user.phone || "User"}
                    {isAdmin && <span className="ml-1 text-health-600">(Admin)</span>}
                  </span>
                </div>
                <Button 
                  onClick={() => window.location.href = '/logout'}
                  variant="outline"
                  size="sm"
                  className="border-health-500 text-health-600"
                >
                  <LogOut size={16} className="mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => window.location.href = '/login'}
                  variant="health"
                  size="sm"
                >
                  Access Report
                </Button>
                <Button 
                  onClick={() => window.location.href = '/general-login'}
                  variant="outline"
                  size="sm"
                  className="border-health-500 text-health-600"
                >
                  <LogIn size={16} className="mr-1" />
                  Login
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-health-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4 px-2 pt-2 pb-3">
              {!isAuthenticatedPage && (
                <>
                  <a
                    href="#about"
                    className="text-gray-900 hover:text-health-600 transition-colors duration-300 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-gray-900 hover:text-health-600 transition-colors duration-300 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </a>
                  <a
                    href="#benefits"
                    className="text-gray-900 hover:text-health-600 transition-colors duration-300 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Benefits
                  </a>
                </>
              )}
              
              {/* Admin-specific mobile navigation options */}
              {isAdmin && (
                <>
                  <a
                    href="/manage-patients"
                    className="text-gray-900 hover:text-health-600 transition-colors duration-300 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <UserRoundPlus size={16} className="mr-1" />
                      Sign Up
                    </span>
                  </a>
                  <a
                    href="/all-reports"
                    className="text-gray-900 hover:text-health-600 transition-colors duration-300 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <FileText size={16} className="mr-1" />
                      All Reports
                    </span>
                  </a>
                  <a
                    href="/manage-users"
                    className="text-gray-900 hover:text-health-600 transition-colors duration-300 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <Users size={16} className="mr-1" />
                      Manage Users
                    </span>
                  </a>
                </>
              )}
              
              {user ? (
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2 mb-3">
                    <User size={16} className="text-health-600" />
                    <span className="text-sm font-medium">
                      {user.phone || "User"}
                      {isAdmin && <span className="ml-1 text-health-600">(Admin)</span>}
                    </span>
                  </div>
                  <Button 
                    onClick={() => {
                      window.location.href = '/logout';
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-health-500 text-health-600"
                  >
                    <LogOut size={16} className="mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 px-3 py-2">
                  <Button 
                    onClick={() => {
                      window.location.href = '/login';
                      setMobileMenuOpen(false);
                    }}
                    variant="health"
                    size="default"
                  >
                    Access Report
                  </Button>
                  <Button 
                    onClick={() => {
                      window.location.href = '/general-login';
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    size="default"
                    className="border-health-500 text-health-600"
                  >
                    <LogIn size={16} className="mr-1" />
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
