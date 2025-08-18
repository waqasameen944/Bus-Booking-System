"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone } from "lucide-react";

export function UserDetailsForm({
  userEmail,
  userName,
  userPhone,
  onDetailsSubmit,
  onBack,
}) {
  const [formData, setFormData] = useState({
    userEmail: userEmail || "",
    userName: userName || "",
    userPhone: userPhone || "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required";
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      newErrors.userEmail = "Please enter a valid email";
    }

    if (!formData.userPhone.trim()) {
      newErrors.userPhone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.userPhone)) {
      newErrors.userPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onDetailsSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="userName"
                type="text"
                value={formData.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
                placeholder="Enter your full name"
                className={errors.userName ? "border-red-500" : ""}
              />
              {errors.userName && (
                <p className="text-sm text-red-500">{errors.userName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleInputChange("userEmail", e.target.value)}
                placeholder="Enter your email address"
                className={errors.userEmail ? "border-red-500" : ""}
              />
              {errors.userEmail && (
                <p className="text-sm text-red-500">{errors.userEmail}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userPhone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="userPhone"
                type="tel"
                value={formData.userPhone}
                onChange={(e) => handleInputChange("userPhone", e.target.value)}
                placeholder="Enter your phone number"
                className={errors.userPhone ? "border-red-500" : ""}
              />
              {errors.userPhone && (
                <p className="text-sm text-red-500">{errors.userPhone}</p>
              )}
            </div>

            <div className="flex flex-col-reverse md:flex-row gap-2 justify-between pt-4">
              <Button
                className={"cursor-pointer"}
                type="button"
                variant="outline"
                onClick={onBack}
              >
                Back to Time Selection
              </Button>
              <Button className={"cursor-pointer"} type="submit">
                Continue to Payment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
