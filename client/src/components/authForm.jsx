"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx";
import { Separator } from "./ui/separator.jsx";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner"; //For Notification

export default function AuthForms() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    login: { email: "", password: "", remember: false },
    register: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const navigate = useNavigate();

  const handleInputChange = (form, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [form]: { ...prev[form], [field]: value },
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (type) => {
    const newErrors = {};

    if (type === "login") {
      if (!formData.login.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.login.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.login.password) {
        newErrors.password = "Password is required";
      } else if (formData.login.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else if (type === "register") {
      if (!formData.register.username) {
        newErrors.username = "Username is required";
      } else if (formData.register.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }

      if (!formData.register.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.register.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.register.password) {
        newErrors.password = "Password is required";
      } else if (formData.register.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.register.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (
        formData.register.password !== formData.register.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.register.terms) {
        newErrors.terms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm("login")) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.login.email,
            password: formData.login.password,
            remember: formData.login.remember,
          }),
          credentials: "include",
        }
      );

      let data = {};

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok) {
        toast.success("You have been logged in successfully.", {
          description: "Welcome back!",
        });
        console.log("Login successful:", data);
        navigate("/");
      } else {
        toast.error(data.message || "Invalid credentials. Please try again.", {
          description: "Login Failed",
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        description: "Login Error",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm("register")) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.register.username,
            email: formData.register.email,
            password: formData.register.password,
            role: "user",
          }),
          credentials: "include",
        }
      );
      console.log("Sending data:", {
        name: formData.register.username,
        email: formData.register.email,
        password: formData.register.password,
        role: "user",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Your account has been created successfully.", {
          description: "Please log in with your new credentials.",
        });
        // Reset form and switch to login tab
        setFormData((prev) => ({
          ...prev,
          register: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
          },
        }));
        // You might want to switch to login tab here
      } else {
        toast.error(
          data.message || "Failed to create account. Please try again.",
          {
            description: "Registration Failed",
          }
        );
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        description: "Registration Error",
      });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${
        import.meta.env.VITE_API_URL
      }/api/v1/auth/google`;
    } catch (error) {
      toast.error("Failed to initiate Google login. Please try again.", {
        description: "Google Login Error",
      });
      console.error("Google login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to your account or create a new one
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="text-sm font-medium">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register" className="text-sm font-medium">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-semibold text-center">
                  Sign In
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 bg-transparent"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {isLoading ? "Loading..." : "Continue with Google"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="login-email"
                      className="text-sm font-medium"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="john@example.com"
                        className={`pl-10 h-11 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        value={formData.login.email}
                        onChange={(e) =>
                          handleInputChange("login", "email", e.target.value)
                        }
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="login-password"
                      className="text-sm font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`pl-10 pr-10 h-11 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        value={formData.login.password}
                        onChange={(e) =>
                          handleInputChange("login", "password", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={formData.login.remember}
                        onChange={(e) =>
                          handleInputChange(
                            "login",
                            "remember",
                            e.target.checked
                          )
                        }
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-gray-600"
                      >
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-semibold text-center">
                  Create Account
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Enter your information to create your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 bg-transparent"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {isLoading ? "Loading..." : "Continue with Google"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        placeholder="johndoe"
                        className={`pl-10 h-11 ${
                          errors.username ? "border-red-500" : ""
                        }`}
                        value={formData.register.username}
                        onChange={(e) =>
                          handleInputChange(
                            "register",
                            "username",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    {errors.username && (
                      <p className="text-sm text-red-500">{errors.username}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="register-email"
                      className="text-sm font-medium"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="john@example.com"
                        className={`pl-10 h-11 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        value={formData.register.email}
                        onChange={(e) =>
                          handleInputChange("register", "email", e.target.value)
                        }
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="register-password"
                      className="text-sm font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className={`pl-10 pr-10 h-11 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        value={formData.register.password}
                        onChange={(e) =>
                          handleInputChange(
                            "register",
                            "password",
                            e.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-sm font-medium"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={`pl-10 pr-10 h-11 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                        value={formData.register.confirmPassword}
                        onChange={(e) =>
                          handleInputChange(
                            "register",
                            "confirmPassword",
                            e.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className={`h-4 w-4 rounded border-gray-300 ${
                          errors.terms ? "border-red-500" : ""
                        }`}
                        checked={formData.register.terms}
                        onChange={(e) =>
                          handleInputChange(
                            "register",
                            "terms",
                            e.target.checked
                          )
                        }
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Privacy Policy
                        </button>
                      </Label>
                    </div>
                    {errors.terms && (
                      <p className="text-sm text-red-500">{errors.terms}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
