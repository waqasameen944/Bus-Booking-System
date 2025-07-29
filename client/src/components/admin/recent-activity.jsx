"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  User,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockActivities = [
        {
          id: "1",
          type: "booking",
          title: "New Booking Created",
          description: "John Doe booked seat 5 for Morning slot on Jan 15",
          timestamp: "2024-01-10T10:30:00Z",
          status: "success",
          user: "John Doe",
          amount: 27.0,
        },
        {
          id: "2",
          type: "payment",
          title: "Payment Completed",
          description: "Payment of $27.00 received for booking BUS123456",
          timestamp: "2024-01-10T10:32:00Z",
          status: "success",
          amount: 27.0,
        },
        {
          id: "3",
          type: "booking",
          title: "New Booking Created",
          description: "Jane Smith booked seat 12 for Noon slot on Jan 15",
          timestamp: "2024-01-10T14:20:00Z",
          status: "success",
          user: "Jane Smith",
          amount: 27.0,
        },
        {
          id: "4",
          type: "payment",
          title: "Payment Pending",
          description: "Payment pending for booking BUS789012",
          timestamp: "2024-01-10T14:22:00Z",
          status: "warning",
          amount: 27.0,
        },
        {
          id: "5",
          type: "cancellation",
          title: "Booking Cancelled",
          description: "Mike Johnson cancelled booking BUS345678",
          timestamp: "2024-01-11T09:15:00Z",
          status: "error",
          user: "Mike Johnson",
        },
        {
          id: "6",
          type: "system",
          title: "Schedule Updated",
          description: "Bus schedule for Jan 16 has been updated",
          timestamp: "2024-01-11T08:00:00Z",
          status: "info",
        },
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error("Failed to fetch recent activity:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "cancellation":
        return <XCircle className="h-4 w-4" />;
      case "system":
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "info":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "border-l-green-500 bg-green-50";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50";
      case "error":
        return "border-l-red-500 bg-red-50";
      case "info":
        return "border-l-blue-500 bg-blue-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            📊 Recent Activity
          </CardTitle>
          <Button variant="outline" size="sm" onClick={fetchRecentActivity}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`border-l-4 p-3 rounded-r-lg ${getStatusColor(
                  activity.status
                )} hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </h4>
                        {getStatusIcon(activity.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                        {activity.user && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {activity.user}
                          </span>
                        )}
                        {activity.amount && (
                          <Badge variant="outline" className="text-xs">
                            ${activity.amount.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
