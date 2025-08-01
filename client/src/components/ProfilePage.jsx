import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppWindowIcon, CodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ProfileSkeleton from "./ProfileSkeleton";

const ProfilePage = () => {
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          toast.error("Unauthorized");
          navigate("/");
          return;
        }

        const data = await response.json();
        if (isMounted) setUser(data);
      } catch (err) {
        navigate("/");
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (!user) return <ProfileSkeleton />;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const payload = {};
    if (username.trim()) payload.name = username;
    if (newPassword.trim()) payload.password = newPassword;

    if (Object.keys(payload).length === 0) {
      toast.error("Please enter a new username or password.");
      return;
    }

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This sends cookies (e.g. token)
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Update failed");
      }

      if (response.ok) {
        toast.success(data.message);
        navigate("/");
      }
    } catch (err) {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="account">
          <TabsList className="w-full">
            <TabsTrigger value="account">Profile Detail</TabsTrigger>
            <TabsTrigger value="password">Update Profile </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>
                  Welcome Back{" "}
                  <span className="uppercase">{user.user.name}</span>
                </CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you&apos;re
                  done.
                </CardDescription>
              </CardHeader>
              <form>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      defaultValue={user.user.name}
                      className="h-11"
                      disabled
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      defaultValue={user.user.email}
                      className="h-11"
                      disabled
                    />
                  </div>
                </CardContent>
                <CardFooter>{/* <Button>Save changes</Button> */}</CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Update Username and password</CardTitle>
                <CardDescription>
                  Change your username and password. After saving, you&apos;ll
                  be logged out.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your new Username"
                      className="h-11"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter your new password"
                      className="h-11"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="mt-4 w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    type="submit"
                  >
                    Update Profile
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
