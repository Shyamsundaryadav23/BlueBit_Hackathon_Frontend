import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  PieChart,
  Users,
  User,
  LogOut,
  Bell,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "@/lib/utils";

export const Header = () => {
  const { logout, state } = useAuth();
  const { user } = state;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Log current user for debugging purposes
  useEffect(() => {
    console.log("Current user in Header:", user);
  }, [user]);

  // Set theme based on stored preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  // Update header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle theme and store preference
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
      console.log("Switched to light mode");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
      console.log("Switched to dark mode");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path: string) => location.pathname === path;

  // Navigation items (removed notification property)
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "Groups", path: "/groups", icon: <Users className="w-4 h-4 mr-2" /> },
    { name: "Insights", path: "/insights", icon: <PieChart className="w-4 h-4 mr-2" /> },
  ];

  // Logout handler
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/signin");
  };

  const isAuthPage =
    location.pathname === "/signin" ||
    location.pathname === "/signup" ||
    location.pathname === "/";

  if (isAuthPage) {
    return (
      <header
        className={cn(
          "sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-200",
          "bg-white/95 text-gray-900 dark:bg-gray-900/95 dark:text-white",
          isScrolled && "shadow-md"
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <span className="rounded-full bg-primary p-2 text-white">
              <PieChart size={16} />
            </span>
            <span className="font-semibold text-xl">SplitBro</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            {location.pathname === "/" && (
              <div className="flex gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/signin">Log in</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-200",
        "bg-white/95 text-gray-900 dark:bg-gray-900/95 dark:text-white",
        isScrolled && "shadow-md"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/dashboard"
          className={cn("flex items-center gap-2 transition-transform hover:scale-105")}
          onClick={closeMenu}
        >
          <img
            src="/logo_bluebit.png"
            alt="logo"
            className="rounded-full w-10 h-10 object-cover"
          />
          <span className="font-semibold text-xl">SplitBro</span>
          <span className="rounded-full bg-primary p-2 text-white">
            <PieChart size={16} />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center text-sm font-medium transition-all relative group",
                isActive(item.path)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              {item.name}
              <span
                className={cn(
                  "absolute -bottom-1.5 left-0 w-full h-0.5 rounded-full transition-transform origin-left",
                  isActive(item.path)
                    ? "bg-primary scale-x-100"
                    : "bg-primary scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0"
              >
                <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-primary">
                  {user?.picture ? (
                    <AvatarImage src={user.picture} alt={user.name} />
                  ) : (
                    <AvatarFallback>{user ? getInitials(user.name) : "?"}</AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white shadow-md border border-gray-200"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-gray-500">
                    {user?.Email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Manage Groups
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onSelect={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <button
            className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 backdrop-blur-sm bg-black/20">
          <div className="absolute right-0 top-0 h-full w-3/4 max-w-xs p-4 shadow-lg animate-in slide-in-from-right bg-white">
            <div className="flex items-center justify-between mb-6">
              <p className="font-semibold">Menu</p>
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X size={18} />
              </Button>
            </div>
            <div className="flex flex-col space-y-1 mb-6">
              <span className="text-sm font-medium">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-gray-500">
                {user?.Email || "user@example.com"}
              </span>
            </div>
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  )}
                  onClick={closeMenu}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.name}
                  </span>
                </Link>
              ))}
              <Link
                to="/profile"
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                )}
                onClick={closeMenu}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
              <Button
                variant="destructive"
                size="sm"
                className="w-full justify-start mt-4 text-red-600 hover:text-white hover:bg-red-500"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
