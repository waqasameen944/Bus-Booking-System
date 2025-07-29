"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, DollarSign } from "lucide-react";


export function RevenueChart() {
  const [period, setPeriod] = useState("7days");
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, [period]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockData = {
        "7days": {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [450, 620, 380, 890, 720, 950, 680],
          total: 4690,
          growth: 12.5,
        },
        "30days": {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          values: [2800, 3200, 2900, 3400],
          total: 12300,
          growth: 8.3,
        },
        "90days": {
          labels: ["Month 1", "Month 2", "Month 3"],
          values: [12300, 14200, 13800],
          total: 40300,
          growth: 15.2,
        },
      };

      setRevenueData(mockData[period]);
    } catch (error) {
      console.error("Failed to fetch revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const maxValue = revenueData ? Math.max(...revenueData.values) : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            💰 Revenue Overview
          </CardTitle>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        ) : revenueData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  ${revenueData.total.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">
                  +{revenueData.growth}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {revenueData.labels.map((label, index) => {
                const value = revenueData.values[index];
                const percentage = (value / maxValue) * 100;

                return (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium">
                        ${value.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Average per{" "}
                  {period === "7days"
                    ? "day"
                    : period === "30days"
                    ? "week"
                    : "month"}
                </span>
                <span className="font-medium">
                  $
                  {Math.round(
                    revenueData.total / revenueData.values.length
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Failed to load revenue data
          </div>
        )}
      </CardContent>
    </Card>
  );
}
