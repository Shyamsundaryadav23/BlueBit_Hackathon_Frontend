// src/components/layout/Header.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  PieChart,
  Users,
  History,
  User,
  LogOut,
  Bell,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  // Navigation items with active state indicators
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Groups', path: '/groups', icon: <Users className="w-4 h-4 mr-2" />, notification: 2 },
    { name: 'Insights', path: '/insights', icon: <PieChart className="w-4 h-4 mr-2" /> },
  ];

  // Logout handler: clear auth state and navigate to signin.
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/signin');
  };

  // Minimal header for auth pages.
  // Note: Changed '/login' to '/signin' to match your route.
  const isAuthPage =
    location.pathname === '/signin' ||
    location.pathname === '/signup' ||
    location.pathname === '/';

  if (isAuthPage) {
    return (
      <header
        className={cn(
          'sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-200',
          isDarkMode ? 'bg-gray-900/95 text-white' : 'bg-white/95 text-gray-900',
          isScrolled && 'shadow-md'
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <span className="rounded-full bg-primary p-2 text-white">
              <PieChart size={16} />
            </span>
            <span className="font-semibold text-xl">SplitPal</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            {location.pathname === '/' && (
              <div className="flex gap-2">
                {/* Updated login link to /signin */}
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
        'sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-200',
        isDarkMode ? 'bg-gray-900/95 text-white' : 'bg-white/95 text-gray-900',
        isScrolled && 'shadow-md'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 transition-transform hover:scale-105" onClick={closeMenu}>
          <span className="rounded-full bg-primary p-2 text-white">
            <PieChart size={16} />
          </span>
          <span className="font-semibold text-xl">SplitPal</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center text-sm font-medium transition-all relative group',
                isActive(item.path)
                  ? isDarkMode
                    ? 'text-white'
                    : 'text-gray-900'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              {item.icon}
              {item.name}
              {item.notification && (
                <Badge variant="destructive" className="ml-1 text-xs h-5 min-w-5 flex items-center justify-center">
                  {item.notification}
                </Badge>
              )}
              {/* Active indicator line */}
              <span
                className={cn(
                  'absolute -bottom-1.5 left-0 w-full h-0.5 rounded-full transition-transform origin-left',
                  isActive(item.path)
                    ? 'bg-primary scale-x-100'
                    : 'bg-primary scale-x-0 group-hover:scale-x-100'
                )}
              />
            </Link>
          ))}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={18} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <p className="text-sm font-medium">Alex paid you $24.50</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
                </div>
                <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <p className="text-sm font-medium">New expense added in "Apartment"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-center justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-primary">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-gray-500">john.doe@example.com</p>
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
              <DropdownMenuItem className="text-red-500 focus:text-red-500" onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
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
        <div
          className={cn(
            'md:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm',
            isDarkMode ? 'bg-black/60' : 'bg-black/20'
          )}
        >
          <div
            className={cn(
              'absolute right-0 top-0 h-full w-3/4 max-w-xs p-4 shadow-lg animate-in slide-in-from-right',
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="font-semibold">Menu</p>
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X size={18} />
              </Button>
            </div>

            <div className="flex flex-col space-y-1 mb-6">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-gray-500">john.doe@example.com</span>
            </div>

            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.path)
                      ? isDarkMode
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-900'
                      : isDarkMode
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  )}
                  onClick={closeMenu}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.name}
                  </span>
                  {item.notification && (
                    <Badge variant="destructive" className="text-xs h-5 min-w-5 flex items-center justify-center">
                      {item.notification}
                    </Badge>
                  )}
                </Link>
              ))}

              <Link
                to="/profile"
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                )}
                onClick={closeMenu}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>

              <Button variant="destructive" size="sm" className="w-full justify-start mt-4" onClick={handleLogout}>
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
