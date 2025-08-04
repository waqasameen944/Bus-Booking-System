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
import { toast } from "sonner";

export function ClientBookingsTable() {
	const [bookings, setBookings] = useState([
		{
			_id: "",
			bookingCode: "",
			date: "",
			timeSlot: "",
			passenger: {
				name: "",
				email: "",
				phone: "",
			},
			seatNumber: 0,
			amount: 0,
			paymentStatus: "",
			status: "",
			createdAt: "",
		},
	]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [paymentFilter, setPaymentFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(5); // New state for items per page

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			fetchBookings();
		}, 500); // Wait 500ms after the last keystroke

		return () => clearTimeout(delayDebounce); // Cleanup on next keystroke
	}, [statusFilter, paymentFilter, searchTerm, currentPage, limit]); // Add limit to dependencies

	const fetchBookings = async () => {
		setLoading(true);

		try {
			// Build query parameters
			const params = new URLSearchParams();
			params.set("page", currentPage.toString());
			params.set("limit", limit.toString());

			if (searchTerm) params.set("search", searchTerm);
			if (statusFilter !== "all") params.set("status", statusFilter);
			if (paymentFilter !== "all") params.set("paymentStatus", paymentFilter);

			const response = await fetch(`/api/admin/bookings?${params.toString()}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			if (!response.ok) {
				console.error("Response not OK:", response.status);
				toast.error("Failed to fetch bookings.");
				return;
			}

			const data = await response.json();

			if (!data.success || !Array.isArray(data.bookings)) {
				toast.error("Invalid response structure.");
				console.error("Unexpected data format:", data);
				return;
			}

			setBookings(data.bookings);
			setCurrentPage(data.pagination?.currentPage || 1);
			setTotalPages(data.pagination?.totalPages || 1);

			// Optional debug log
			console.log("Fetched bookings:", data.bookings);
		} catch (error) {
			console.error("Fetch error:", error);
			toast.error("An error occurred while fetching bookings.");
		} finally {
			setLoading(false);
		}
	};

	const updateBookingStatus = async (bookingId, newStatus) => {
		// This function would typically make an API call to update the status on the server
		// For now, we'll just update the local state for demonstration purposes.
		setBookings((prev) =>
			prev.map((booking) =>
				booking._id === bookingId ? { ...booking, status: newStatus } : booking
			)
		);
		toast.success(`Booking ${bookingId} status updated to ${newStatus}.`);
		// After a real API call, you might want to re-fetch bookings:
		// fetchBookings();
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

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const renderPageNumbers = () => {
		const pageNumbers = [];
		const maxPagesToShow = 5; // Number of page buttons to display
		let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
		let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

		if (endPage - startPage + 1 < maxPagesToShow) {
			startPage = Math.max(1, endPage - maxPagesToShow + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<Button
					key={i}
					variant={currentPage === i ? "default" : "outline"}
					onClick={() => handlePageChange(i)}
					className="mx-1"
				>
					{i}
				</Button>
			);
		}
		return pageNumbers;
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<CardTitle>📋 Bookings Management</CardTitle>
					<div className="flex flex-wrap gap-2 justify-end">
						<div className="relative w-full md:w-auto">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search bookings..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 w-full md:w-64"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full md:w-32">
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
							<SelectTrigger className="w-full md:w-32">
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
						<div className="overflow-x-auto">
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
												<Badge variant="outline">
													Seat {booking.seatNumber}
												</Badge>
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
						</div>
						{bookings.length === 0 && !loading && (
							<div className="text-center py-8 text-gray-500">
								<div className="text-4xl mb-2">🔍</div>
								<p>No bookings found matching your criteria</p>
							</div>
						)}
						<div className="flex justify-between items-center mt-4 flex-wrap gap-2">
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-700">Rows per page:</span>
								<Select
									value={limit.toString()}
									onValueChange={(value) => setLimit(Number(value))}
								>
									<SelectTrigger className="w-[80px]">
										<SelectValue placeholder="10" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="5">5</SelectItem>
										<SelectItem value="10">10</SelectItem>
										<SelectItem value="20">20</SelectItem>
										<SelectItem value="50">50</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
								>
									Previous
								</Button>
								{renderPageNumbers()}
								<Button
									variant="outline"
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
								>
									Next
								</Button>
							</div>
							<div className="text-sm text-gray-700">
								Page {currentPage} of {totalPages}
							</div>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
