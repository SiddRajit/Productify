import {
  SignInButton,
  SignUpButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { PlusIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  return (
    <div className="w-full bg-card shadow-sm px-4 flex items-center justify-between h-16">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <ShoppingBagIcon className="size-5 text-primary" />
          <span className="text-lg font-bold font-mono uppercase tracking-wider">
            Productify
          </span>
        </Link>
      </div>

      <div className="flex gap-2 items-center">
        <ThemeToggle />
        {isSignedIn ? (
          <>
            <Button>
              <Link to="/create" className="gap-1 flex items-center">
                <PlusIcon className="size-4" />
                <span className="hidden sm:inline">New Product</span>
              </Link>
            </Button>
            <Button variant="ghost">
              <Link to="/profile" className="gap-1 flex items-center">
                <UserIcon className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </Button>
            <UserButton />
          </>
        ) : (
          <>
            <SignInButton>
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Get Started</Button>
            </SignUpButton>
          </>
        )}
      </div>
    </div>
  );
}
