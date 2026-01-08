import { Circle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Circle className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">dincharya</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {isHome ? (
            <>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </a>
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Why Us
              </a>
            </>
          ) : (
            <>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Back to Home
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;