"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          toast.error("Something went wrong.");
          return;
        }

        const data = await response.json();
        // console.log(data);
        if (isMounted) {
          if (data.success) {
            setStats(data.statistics); // only set the raw stats object
          }
          setLoading(false);
        }
      } catch (err) {
        // console.error(err);
        setLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  // ✅ Build cards from stats object
  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: Users,
      change: `${stats.weeklyGrowth}%`,
      changeType: "positive",
      description: "from last week",
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings.toString(),
      icon: Calendar,
      change: "vs 18 yesterday",
      changeType: stats.todayBookings > 18 ? "positive" : "negative",
      description: "daily bookings",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: `${stats.revenueGrowth > 0 ? "+" : ""}${stats.revenueGrowth}%`,
      changeType:
        stats.revenueGrowth > 0
          ? "positive"
          : stats.revenueGrowth < 0
          ? "negative"
          : "neutral",
      description: "from last month",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments.toString(),
      icon: AlertCircle,
      change: stats.pendingPayments > 0 ? "Needs attention" : "All clear",
      changeType: stats.pendingPayments > 0 ? "warning" : "positive",
      description: "payment issues",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    stat.changeType === "positive"
                      ? "default"
                      : stat.changeType === "negative"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {stat.changeType === "positive" && (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  )}
                  {stat.changeType === "negative" && (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.changeType === "warning" && (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
                <span className="text-xs text-gray-500">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Daily Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.averageBookingsPerDay}
            </div>
            <p className="text-xs text-gray-500 mt-1">Based on last 30 days</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.occupancyRate}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${stats.occupancyRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Average seat utilization
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
