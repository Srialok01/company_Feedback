import { Link, useLocation } from "wouter";
import { Star, Home, Settings, List, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-xl font-bold text-gray-900 cursor-pointer">
                <Star className="inline w-5 h-5 text-primary mr-2" />
                ReviewHub
              </h1>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/">
              <button className={`px-4 py-2 text-sm font-medium transition-colors ${
                location === "/" 
                  ? "text-primary" 
                  : "text-gray-700 hover:text-primary"
              }`}>
                <Home className="inline w-4 h-4 mr-1" />
                Home
              </button>
            </Link>
            <Link href="/reviews">
              <button className={`px-4 py-2 text-sm font-medium transition-colors ${
                location === "/reviews" 
                  ? "text-primary" 
                  : "text-gray-700 hover:text-primary"
              }`}>
                <List className="inline w-4 h-4 mr-1" />
                All Reviews
              </button>
            </Link>
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link href="/admin">
                      <button className={`px-4 py-2 text-sm font-medium transition-colors ${
                        location === "/admin" 
                          ? "text-primary" 
                          : "text-gray-700 hover:text-primary"
                      }`}>
                        <Settings className="inline w-4 h-4 mr-1" />
                        Admin
                      </button>
                    </Link>
                    <a
                      href="/api/logout"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      <LogOut className="inline w-4 h-4 mr-1" />
                      Logout
                    </a>
                  </>
                ) : (
                  <a
                    href="/api/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                  >
                    <LogIn className="inline w-4 h-4 mr-1" />
                    Login
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
