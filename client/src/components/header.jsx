import {
  MenuIcon,
  Mountain,
  Settings,
  LogOut,
  UserIcon,
  UserCircle,
  Bus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboardIcon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ModernHeader() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogIn, setisLogIn] = useState(false);
  const [checkUser, setCheckUser] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
          credentials: "include", // sends the HTTP-only cookie
        });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();

        setUser(data);
        setCheckUser(data.role);
        setisLogIn(true);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogOut = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      const data = await response.json();
      toast.success(data.message);

      setUser(null);
      setisLogIn(false);
      setCheckUser("");

      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Generate a random Image
  const seed = name || Math.random().toString(36).substring(2, 8);
  const avatarUrl = `https://api.dicebear.com/8.x/lorelei/svg?seed=${seed}`;

  if (loading) return <div className="p-4">Loading...</div>;
  return (
    <header className="flex items-center justify-center sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex justify-between gap-10 h-16 items-center px-4 md:px-6">
        <div className="w-[30%]">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Bus className="h-6 w-6" />
            <span className="font-bold">Transporation Authority LLC</span>
          </Link>
        </div>

        <div className="w-[70%] flex justify-end gap-6">
          <Button variant="default" className=" sm:inline-flex">
            <Link to="/booking">Book Now</Link>
          </Button>

          <div className="flex items-center justify-end space-x-4">
            {isLogIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8 border border-gray-500">
                        <AvatarImage
                          src={
                            avatarUrl ||
                            "/placeholder.svg?height=32&width=32&query=user avatar"
                          }
                          alt={user.name}
                        />
                        <AvatarFallback>
                          <UserIcon className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="flex  items-start ">
                      <div className="">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              avatarUrl ||
                              "/placeholder.svg?height=32&width=32&query=user avatar"
                            }
                            alt={user.name}
                          />
                          <AvatarFallback>
                            <UserIcon className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-semibold text-sm font-medium capitalize">
                          {user.name}
                        </span>{" "}
                        <br />
                        {user.email}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>
                        <Link
                          to="/profile"
                          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                          My Profile
                        </Link>
                      </span>
                    </DropdownMenuItem>
                    {checkUser === "admin" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                          <span>
                            <Link
                              to="/dashboard"
                              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                              My Dashboard
                            </Link>
                          </span>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
                        onClick={handleLogOut}
                      >
                        Log out
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="default">Login</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
