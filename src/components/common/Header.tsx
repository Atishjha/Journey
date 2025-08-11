import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function Header({ isAuthenticated = false, onLogin, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard", authRequired: true },
    { name: "Plan Trip", href: "/planner", authRequired: true },
    { name: "My Trips", href: "/itinerary", authRequired: true },
  ];

  const filteredNavigation = navigation.filter(
    (item) => !item.authRequired || isAuthenticated
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block bg-gradient-primary bg-clip-text text-transparent">
              TravelPlan
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button
              variant="ghost"
              className="inline-flex items-center rounded-md font-medium transition-colors md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={onLogin} size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-b md:hidden">
          <nav className="flex flex-col space-y-3 px-4 py-4">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}