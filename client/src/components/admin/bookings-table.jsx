"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";

export function BookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, paymentFilter, searchTerm]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockBookings = [
        {
          _id: "1",
          bookingCode: "BUS123456",
          date: "2024-01-15",
          timeSlot: "morning",
          passenger: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
          },
          seatNumber: 5,
          amount: 27.0,
          paymentStatus: "completed",
          status: "confirmed",
          createdAt: "2024-01-10T10:30:00Z",
        },
        {
          _id: "2",
          bookingCode: "BUS789012",
          date: "2024-01-15",
          timeSlot: "noon",
          passenger: {
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+1987654321",
          },
          seatNumber: 12,
          amount: 27.0,
          paymentStatus: "pending",
          status: "confirmed",
          createdAt: "2024-01-10T14:20:00Z",
        },
        {
          _id: "3",
          bookingCode: "BUS345678",
          date: "2024-01-16",
          timeSlot: "evening",
          passenger: {
            name: "Mike Johnson",
            email: "mike@example.com",
            phone: "+1122334455",
          },
          seatNumber: 8,
          amount: 27.0,
          paymentStatus: "completed",
          status: "cancelled",
          createdAt: "2024-01-11T09:15:00Z",
        },
        {
          _id: "4",
          bookingCode: "BUS456789",
          date: "2024-01-17",
          timeSlot: "morning",
          passenger: {
            name: "Sarah Wilson",
            email: "sarah@example.com",
            phone: "+1555666777",
          },
          seatNumber: 3,
          amount: 27.0,
          paymentStatus: "completed",
          status: "confirmed",
          createdAt: "2024-01-12T08:45:00Z",
        },
        {
          _id: "5",
          bookingCode: "BUS567890",
          date: "2024-01-18",
          timeSlot: "evening",
          passenger: {
            name: "Tom Brown",
            email: "tom@example.com",
            phone: "+1888999000",
          },
          seatNumber: 14,
          amount: 27.0,
          paymentStatus: "failed",
          status: "confirmed",
          createdAt: "2024-01-13T16:30:00Z",
        },
      ];

      let filteredBookings = mockBookings;

      if (statusFilter !== "all") {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.status === statusFilter
        );
      }

      if (paymentFilter !== "all") {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.paymentStatus === paymentFilter
        );
      }

      if (searchTerm) {
        filteredBookings = filteredBookings.filter(
          (booking) =>
            booking.bookingCode
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            booking.passenger.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            booking.passenger.email
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      }

      setBookings(filteredBookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: "default",
      cancelled: "destructive",
      completed: "secondary",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTimeSlotLabel = (timeSlot) => {
    const labels = {
      morning: "Morning (08:00 AM)",
      noon: "Noon (12:00 PM)",
      evening: "Evening (06:00 PM)",
    };
    return labels[timeSlot] || timeSlot;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>📋 Bookings Management</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking Code</TableHead>
                  <TableHead>Passenger</TableHead>
                  <TableHead>Travel Details</TableHead>
                  <TableHead>Seat</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {booking.bookingCode}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {booking.passenger.name}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          {booking.passenger.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          {booking.passenger.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {getTimeSlotLabel(booking.timeSlot)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Seat {booking.seatNumber}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${booking.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Booking
                          </DropdownMenuItem>
                          {booking.status === "confirmed" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateBookingStatus(booking._id, "cancelled")
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Cancel Booking
                            </DropdownMenuItem>
                          )}
                          {booking.status === "cancelled" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateBookingStatus(booking._id, "confirmed")
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Restore Booking
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {bookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <p>No bookings found matching your criteria</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
