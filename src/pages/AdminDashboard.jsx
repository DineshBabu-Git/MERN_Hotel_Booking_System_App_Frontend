import { useState, useEffect } from "react";
import API from "../services/api";
import {
    BarChart3,
    TrendingUp,
    Users,
    BookOpen,
    AlertCircle,
    Building2,
    Star,
    DollarSign,
    Home,
    Settings,
    Calendar,
    MessageSquare,
    MessageCircle,
    Tag,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Eye,
    Search
} from "lucide-react";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [occupancy, setOccupancy] = useState(null);
    const [trends, setTrends] = useState([]);
    const [roomPerformance, setRoomPerformance] = useState([]);
    const [reviewAnalytics, setReviewAnalytics] = useState(null);
    const [userDemographics, setUserDemographics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Management state
    const [activeTab, setActiveTab] = useState("dashboard");
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [offers, setOffers] = useState([]);
    const [managementLoading, setManagementLoading] = useState(false);
    const [managementError, setManagementError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [updatingBookingId, setUpdatingBookingId] = useState(null);

    // Form states
    const [roomForm, setRoomForm] = useState({
        name: "",
        roomType: "",
        price: "",
        bedType: "",
        roomSize: "",
        view: "",
        description: "",
        amenities: [], // kept for backwards compatibility
        totalRooms: "",
        maxGuests: "",
        images: []
    });
    // separate string state for the comma‑separated amenities field
    const [amenitiesInput, setAmenitiesInput] = useState("");
    // Image preview state
    const [imagePreviews, setImagePreviews] = useState(["", ""]);

    const [offerForm, setOfferForm] = useState({
        code: "",
        title: "",
        description: "",
        discountType: "percentage",
        discount: "",
        minAmount: "",
        maxDiscount: "",
        validTill: "",
        usageLimit: "",
        applicableRoomTypes: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    useEffect(() => {
        if (activeTab === "rooms") {
            fetchRooms();
        } else if (activeTab === "bookings") {
            fetchBookings();
        } else if (activeTab === "reviews") {
            fetchReviews();
        } else if (activeTab === "offers") {
            fetchOffers();
        }
    }, [activeTab]);

    const fetchAnalytics = async () => {
        try {
            const [statsRes, revenueRes, occupancyRes, trendsRes, roomRes, reviewRes, userRes] =
                await Promise.allSettled([
                    API.get("/admin/dashboard"),
                    API.get("/admin/revenue/monthly"),
                    API.get("/admin/occupancy"),
                    API.get("/admin/trends/booking"),
                    API.get("/admin/performance/rooms"),
                    API.get("/admin/analytics/reviews"),
                    API.get("/admin/demographics/users"),
                ]);

            // Handle each response with fallback
            if (statsRes.status === "fulfilled") {
                setStats(statsRes.value.data);
            }
            if (revenueRes.status === "fulfilled") {
                setMonthlyRevenue(revenueRes.value.data || []);
            }
            if (occupancyRes.status === "fulfilled") {
                setOccupancy(occupancyRes.value.data);
            }
            if (trendsRes.status === "fulfilled") {
                setTrends(trendsRes.value.data || []);
            }
            if (roomRes.status === "fulfilled") {
                setRoomPerformance(roomRes.value.data || []);
            }
            if (reviewRes.status === "fulfilled") {
                setReviewAnalytics(reviewRes.value.data);
            }
            if (userRes.status === "fulfilled") {
                setUserDemographics(userRes.value.data || []);
            }

            // Check if at least one call failed
            const failures = [statsRes, revenueRes, occupancyRes, trendsRes, roomRes, reviewRes, userRes]
                .filter(r => r.status === "rejected");
            if (failures.length > 0) {
                setError(`Failed to load some analytics (${failures.length}/${7} endpoints failed)`);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch analytics data");
        } finally {
            setLoading(false);
        }
    };

    // Management data fetching functions
    const fetchRooms = async () => {
        setManagementLoading(true);
        try {
            const response = await API.get("/rooms");
            setRooms(response.data);
        } catch (err) {
            console.error("Failed to fetch rooms:", err);
        } finally {
            setManagementLoading(false);
        }
    };

    const fetchBookings = async () => {
        setManagementLoading(true);
        setManagementError("");
        try {
            const response = await API.get("/bookings");
            // Handle both array and object responses
            const bookingsData = Array.isArray(response.data) ? response.data : response.data.bookings || [];
            setBookings(bookingsData);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
            setManagementError(err.response?.data?.message || "Failed to load bookings. Please try again.");
            setBookings([]);
        } finally {
            setManagementLoading(false);
        }
    };

    const fetchReviews = async () => {
        setManagementLoading(true);
        setManagementError("");
        try {
            const response = await API.get("/reviews");
            // Handle both array and object responses
            const reviewsData = Array.isArray(response.data) ? response.data : response.data.reviews || [];
            setReviews(reviewsData);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
            setManagementError(err.response?.data?.message || "Failed to load reviews. Please try again.");
            setReviews([]);
        } finally {
            setManagementLoading(false);
        }
    };

    const fetchOffers = async () => {
        setManagementLoading(true);
        try {
            const response = await API.get("/offers");
            setOffers(response.data);
        } catch (err) {
            console.error("Failed to fetch offers:", err);
        } finally {
            setManagementLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm("");

        // Always fetch fresh data when switching to management tabs
        if (tab === "rooms") fetchRooms();
        if (tab === "bookings") fetchBookings();
        if (tab === "reviews") fetchReviews();
        if (tab === "offers") fetchOffers();
    };

    // Management action handlers
    const handleApproveReview = async (reviewId) => {
        try {
            const response = await API.put(`/reviews/${reviewId}/approve`);
            setReviews(reviews.map(r => r._id === reviewId ? { ...r, isApproved: true } : r));
            alert("✓ Review approved successfully! Notification email sent to user.");
        } catch (err) {
            alert("Failed to approve review: " + (err.response?.data?.message || err.message));
        }
    };

    const handleAddResponse = async (reviewId, response) => {
        try {
            await API.put(`/reviews/${reviewId}/response`, { response });
            setReviews(reviews.map(r => r._id === reviewId ? { ...r, adminResponse: response } : r));
            alert("Response added successfully!");
        } catch (err) {
            alert("Failed to add response");
        }
    };

    const handleUpdateBookingStatus = async (bookingId, status) => {
        setUpdatingBookingId(bookingId);
        try {
            const payload = { bookingStatus: status };
            const booking = bookings.find(b => b._id === bookingId);
            if (booking?.paymentStatus) {
                payload.paymentStatus = booking.paymentStatus;
            }
            await API.put(`/bookings/${bookingId}/status`, payload);
            setBookings(bookings.map(b => b._id === bookingId ? { ...b, bookingStatus: status } : b));
            alert("Booking status updated successfully! Email Notification sent to guest.");
        } catch (err) {
            alert("Failed to update booking status");
        } finally {
            setUpdatingBookingId(null);
        }
    };

    const handleViewBookingDetails = (booking) => {
        setSelectedBooking(booking);
        setShowBookingDetailsModal(true);
    };

    const closeBookingDetailsModal = () => {
        setShowBookingDetailsModal(false);
        setSelectedBooking(null);
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            await API.delete(`/rooms/${roomId}`);
            setRooms(rooms.filter(r => r._id !== roomId));
            alert("Room deleted successfully!");
        } catch (err) {
            alert("Failed to delete room");
        }
    };

    const handleDeleteOffer = async (offerId) => {
        if (!window.confirm("Are you sure you want to delete this offer?")) return;
        try {
            await API.delete(`/offers/${offerId}`);
            setOffers(offers.filter(o => o._id !== offerId));
            alert("Offer deleted successfully!");
        } catch (err) {
            alert("Failed to delete offer");
        }
    };

    // Modal handlers
    const openRoomModal = (room = null) => {
        if (room) {
            setRoomForm({
                name: room.name || "",
                roomType: room.roomType || "",
                price: room.price || "",
                bedType: room.bedType || "",
                roomSize: room.roomSize || "",
                view: room.view || "",
                description: room.description || "",
                amenities: room.amenities || [],
                totalRooms: room.totalRooms || "",
                maxGuests: room.maxGuests || "",
                images: room.images || []
            });
            setImagePreviews([
                (room.images && room.images[0]) || "",
                (room.images && room.images[1]) || ""
            ]);
            setAmenitiesInput((room.amenities || []).join(", "));
            setSelectedItem(room);
            setModalType("edit-room");
        } else {
            setRoomForm({
                name: "",
                roomType: "",
                price: "",
                bedType: "",
                roomSize: "",
                view: "",
                description: "",
                amenities: [],
                totalRooms: "",
                maxGuests: "",
                images: []
            });
            setImagePreviews(["", ""]);
            setAmenitiesInput("");
            setSelectedItem(null);
            setModalType("add-room");
        }
        setShowModal(true);
    };

    const openOfferModal = (offer = null) => {
        if (offer) {
            setOfferForm({
                code: offer.code || "",
                title: offer.title || "",
                description: offer.description || "",
                discountType: offer.discountType || "percentage",
                discount: offer.discount || "",
                minAmount: offer.minAmount || "",
                maxDiscount: offer.maxDiscount || "",
                validTill: offer.validTill ? new Date(offer.validTill).toISOString().split('T')[0] : "",
                usageLimit: offer.usageLimit || "",
                applicableRoomTypes: offer.applicableRoomTypes || []
            });
            setSelectedItem(offer);
            setModalType("edit-offer");
        } else {
            setOfferForm({
                code: "",
                title: "",
                description: "",
                discountType: "percentage",
                discount: "",
                minAmount: "",
                maxDiscount: "",
                validTill: "",
                usageLimit: "",
                applicableRoomTypes: []
            });
            setSelectedItem(null);
            setModalType("add-offer");
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType("");
        setSelectedItem(null);
    };

    // Form handlers
    // Handle image file upload and convert to base64
    const handleImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPreviews = [...imagePreviews];
                newPreviews[index] = reader.result;
                setImagePreviews(newPreviews);
                
                const newImages = [...roomForm.images];
                newImages[index] = reader.result;
                setRoomForm({ ...roomForm, images: newImages });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRoomSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                ...roomForm,
                price: parseFloat(roomForm.price),
                totalRooms: parseInt(roomForm.totalRooms),
                maxGuests: parseInt(roomForm.maxGuests) || 2,
                // parse amenities only at submission; the input string is maintained separately
                amenities: amenitiesInput.split(",").map(a => a.trim()).filter(a => a !== ""),
                // normalize bedType so it matches backend enum
                bedType: roomForm.bedType ? roomForm.bedType.toLowerCase() : "",
                // filter out empty images
                images: roomForm.images.filter(img => img !== "")
            };

            if (modalType === "edit-room") {
                await API.put(`/rooms/${selectedItem._id}`, formData);
                alert("Room updated successfully!");
            } else {
                await API.post("/rooms", formData);
                alert("Room created successfully!");
            }
            fetchRooms();
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${modalType === "edit-room" ? "update" : "create"} room`);
        }
    };

    const handleOfferSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                code: offerForm.code?.toUpperCase() || "",
                title: offerForm.title || "",
                description: offerForm.description || "",
                discount: parseFloat(offerForm.discount),
                discountType: offerForm.discountType,
                minAmount: parseFloat(offerForm.minAmount) || 0,
                maxDiscount: parseFloat(offerForm.maxDiscount) || 0,
                usageLimit: parseInt(offerForm.usageLimit) || 0,
                validTill: new Date(offerForm.validTill)
            };

            if (modalType === "edit-offer") {
                await API.put(`/offers/${selectedItem._id}`, formData);
                alert("Offer updated successfully!");
            } else {
                await API.post("/offers", formData);
                alert("Offer created successfully!");
            }
            fetchOffers();
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${modalType === "edit-offer" ? "update" : "create"} offer`);
        }
    };

    // Render functions for different tabs
    const renderDashboardContent = () => (
        <>
            {/* Top Stats Cards */}
            {stats && (
                <div className="grid md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                                <h3 className="text-3xl font-bold mt-2">{stats.totalBookings || 0}</h3>
                            </div>
                            <BookOpen className="text-blue-600" size={40} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                                <h3 className="text-3xl font-bold mt-2">${stats.totalRevenue || 0}</h3>
                            </div>
                            <DollarSign className="text-green-600" size={40} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Rooms</p>
                                <h3 className="text-3xl font-bold mt-2">{stats.totalRooms || 0}</h3>
                            </div>
                            <Home className="text-purple-600" size={40} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                                <h3 className="text-3xl font-bold mt-2">{stats.totalUsers || 0}</h3>
                            </div>
                            <Users className="text-orange-600" size={40} />
                        </div>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6 mb-10">
                {/* Monthly Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp size={24} className="text-blue-600" />
                        Monthly Revenue (Last 12 Months)
                    </h2>
                    <div className="h-64 overflow-x-auto">
                        <div className="flex gap-4 pb-4">
                            {monthlyRevenue.map((item, idx) => (
                                <div key={idx} className="flex-shrink-0 flex flex-col items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                                            style={{
                                                height: Math.max(150, (item.revenue / (Math.max(...monthlyRevenue.map(m => m.revenue || 0)) || 1)) * 200),
                                            }}
                                        ></div>
                                        <p className="text-xs font-medium mt-2 whitespace-nowrap">
                                            {item.month && `${new Date(item.month).toLocaleDateString("en-US", { month: "short" })}`}
                                        </p>
                                        <p className="text-xs text-gray-600">${item.revenue || 0}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Occupancy Rate */}
                {occupancy && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <BarChart3 size={24} className="text-green-600" />
                            Occupancy Rate
                        </h2>
                        <div className="flex flex-col items-center justify-center h-48">
                            <div className="relative w-32 h-32 rounded-full flex items-center justify-center bg-gray-100">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-600">{occupancy.occupancyRate}%</p>
                                    <p className="text-sm text-gray-600">occupied</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    const renderRoomsManagement = () => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Room Management</h2>
                <button onClick={() => openRoomModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus size={16} />
                    Add Room
                </button>
            </div>

            <div className="mb-4 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            {managementLoading ? (
                <div className="text-center py-8">Loading rooms...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rooms
                                .filter(room => room.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((room) => (
                                    <tr key={room._id}>
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-gray-900">{room.name}</div>
                                            <div className="text-sm text-gray-500">{room.roomType}</div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">{room.roomType}</td>
                                        <td className="px-4 py-4 text-sm text-gray-900">${room.price}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                room.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}>
                                                {room.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => openRoomModal(room)} className="text-blue-600 hover:text-blue-800">
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRoom(room._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderBookingsManagement = () => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Booking Management</h2>
                <button
                    onClick={() => fetchBookings()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                    Refresh
                </button>
            </div>

            {managementError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <p className="text-red-600">{managementError}</p>
                </div>
            )}

            <div className="mb-4 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by guest email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            {/* bookings content is computed to avoid nested JSX ternaries */}
            {(() => {
                if (managementLoading) {
                    return (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading bookings...</p>
                        </div>
                    );
                }
                if (!bookings || bookings.length === 0) {
                    return (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <Calendar className="mx-auto mb-3 text-gray-400" size={32} />
                            <p className="text-gray-500 text-lg">No bookings found</p>
                            <p className="text-gray-400 text-sm mt-1">Bookings will appear here when guests make reservations</p>
                        </div>
                    );
                }
                const filteredBookings = bookings.filter(booking =>
                    (booking.guestEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (booking.guestPhone || "").toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (filteredBookings.length === 0) {
                    return <div className="text-center py-8 text-gray-500">No bookings match your search.</div>;
                }
                return (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Guest</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Room</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Check-in</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Check-out</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredBookings.map((booking) => {
                                    const roomName = booking.roomId?.name ? `${booking.roomId.name}` : `Room ${booking.roomId?._id || booking.roomId}`;
                                    const totalPrice = booking.totalPrice ? `$${booking.totalPrice.toFixed(2)}` : "N/A";
                                    return (
                                        <tr key={booking._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-gray-900">{booking.guestEmail || "N/A"}</div>
                                                <div className="text-sm text-gray-500">{booking.guestPhone || "N/A"}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900">{roomName}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">{totalPrice}</td>
                                            <td className="px-4 py-4">
                                                <div className="relative">
                                                    <select
                                                        value={booking.bookingStatus || "pending"}
                                                        onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                                                        className={`text-sm border rounded px-3 py-1 font-medium ${
                                                            booking.bookingStatus === "confirmed"
                                                                ? "bg-green-50 border-green-300 text-green-700"
                                                                : booking.bookingStatus === "cancelled"
                                                                    ? "bg-red-50 border-red-300 text-red-700"
                                                                    : booking.bookingStatus === "completed"
                                                                        ? "bg-blue-50 border-blue-300 text-blue-700"
                                                                        : "bg-yellow-50 border-yellow-300 text-yellow-700"
                                                        }`}
                                                        disabled={updatingBookingId === booking._id}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                    {updatingBookingId === booking._id && (
                                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    booking.paymentStatus === "paid"
                                                        ? "bg-green-100 text-green-800"
                                                        : booking.paymentStatus === "refunded"
                                                            ? "bg-gray-100 text-gray-800"
                                                            : "bg-orange-100 text-orange-800"
                                                }`}>
                                                    {booking.paymentStatus || "Pending"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button 
                                                    onClick={() => handleViewBookingDetails(booking)}
                                                    className="text-blue-600 hover:text-blue-800 transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
            })()}
        </div>
    );

    const renderReviewsManagement = () => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Review Moderation</h2>
                <button
                    onClick={() => fetchReviews()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                    Refresh
                </button>
            </div>

            <div className="mb-4 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search reviews by user or comment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            {managementError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <div className="text-red-800">{managementError}</div>
                </div>
            )}

            {managementLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading reviews...</p>
                </div>
            ) : !managementLoading && reviews && reviews.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <MessageCircle size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 text-lg font-semibold">No Reviews Yet</p>
                    <p className="text-gray-400 text-sm mt-1">Details will Appear once Reviews added by the Customer/User</p>
                </div>
            ) : reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews
                        .filter(review => 
                            (review.userId?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (review.comment || "").toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .sort((a, b) => {
                            // Show unapproved reviews first
                            if (a.isApproved !== b.isApproved) return a.isApproved ? 1 : -1;
                            // Then sort by date (newest first)
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        })
                        .map((review) => (
                            <div key={review._id} className={`border rounded-lg p-4 ${review.isApproved ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {review.userId?.name?.[0] || "U"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{review.userId?.name || "Anonymous"}</p>
                                                <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {review.roomId?.name && (
                                            <p className="text-sm text-gray-600 mb-2">Room: <span className="font-medium">{review.roomId.name}</span></p>
                                        )}
                                        <div className="flex gap-1 mb-2">
                                            {[1,2,3,4,5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={14}
                                                    className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                />
                                            ))}
                                            <span className="text-xs text-gray-600 ml-1">({review.rating}/5)</span>
                                        </div>
                                        <p className="text-sm text-gray-700 break-words">{review.comment}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        {!review.isApproved && (
                                            <button
                                                onClick={() => handleApproveReview(review._id)}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition whitespace-nowrap"
                                            >
                                                ✓ Approve
                                            </button>
                                        )}
                                        {review.isApproved && (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium text-center">
                                                Approved
                                            </span>
                                        )}
                                        <button
                                            onClick={() => {
                                                const response = prompt("Enter your response to this review:");
                                                if (response) handleAddResponse(review._id, response);
                                            }}
                                            className={`px-3 py-1 rounded text-sm transition whitespace-nowrap ${review.adminResponse ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                        >
                                            {review.adminResponse ? "Edit Response" : "Reply"}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Detailed Ratings */}
                                {(review.cleanlinessRating || review.serviceRating || review.amenitiesRating) && (
                                    <div className="grid grid-cols-3 gap-2 my-3 py-3 border-t border-b text-xs">
                                        {review.cleanlinessRating && (
                                            <div>
                                                <span className="text-gray-600">Cleanliness:</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} className={i < review.cleanlinessRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {review.serviceRating && (
                                            <div>
                                                <span className="text-gray-600">Service:</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} className={i < review.serviceRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {review.amenitiesRating && (
                                            <div>
                                                <span className="text-gray-600">Amenities:</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} className={i < review.amenitiesRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {review.adminResponse && (
                                    <div className="bg-blue-100 border-l-4 border-blue-500 p-3 mt-3">
                                        <p className="text-sm font-semibold text-blue-900">Your Response:</p>
                                        <p className="text-sm text-blue-800 break-words">{review.adminResponse}</p>
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-center text-xs text-gray-600 mt-3">
                                    <span>
                                        {review.isApproved ? (
                                            <span className="text-green-600 font-medium">✓ Approved • Visible to guests</span>
                                        ) : (
                                            <span className="text-yellow-600 font-medium">⏳ Pending • Not visible yet</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <MessageCircle size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 text-lg">No reviews yet</p>
                    <p className="text-gray-400 text-sm mt-1">Guest reviews will appear here</p>
                </div>
            )}
        </div>
    );

    const renderOffersManagement = () => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Special Offers Management</h2>
                <button onClick={() => openOfferModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus size={16} />
                    Create Offer
                </button>
            </div>

            <div className="mb-4 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search offers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            {managementLoading ? (
                <div className="text-center py-8">Loading offers...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers
                        .filter(offer => offer.title.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((offer) => (
                            <div key={offer._id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg">{offer.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                                        <div className="flex items-center gap-2 mb-2">
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{offer.code}</code>
                                            <span className={`px-2 py-1 text-xs rounded ${
                                                offer.discountType === "percentage" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                            }`}>
                                                {offer.discountType === "percentage" ? `${offer.discount}%` : `$${offer.discount}`}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Valid till: {new Date(offer.validTill).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openOfferModal(offer)} className="text-blue-600 hover:text-blue-800">
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOffer(offer._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Status: {offer.isActive ? "Active" : "Inactive"} • Used: {offer.usedCount || 0} times
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg">Loading analytics...</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>

                {error && (
                    <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => handleTabChange("dashboard")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "dashboard"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <BarChart3 className="inline mr-2" size={16} />
                                Analytics
                            </button>
                            <button
                                onClick={() => handleTabChange("rooms")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "rooms"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <Building2 className="inline mr-2" size={16} />
                                Rooms
                            </button>
                            <button
                                onClick={() => handleTabChange("bookings")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "bookings"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <Calendar className="inline mr-2" size={16} />
                                Bookings
                            </button>
                            <button
                                onClick={() => handleTabChange("reviews")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "reviews"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <MessageSquare className="inline mr-2" size={16} />
                                Reviews
                            </button>
                            <button
                                onClick={() => handleTabChange("offers")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "offers"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <Tag className="inline mr-2" size={16} />
                                Offers
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "dashboard" && renderDashboardContent()}
                {activeTab === "rooms" && renderRoomsManagement()}
                {activeTab === "bookings" && renderBookingsManagement()}
                {activeTab === "reviews" && renderReviewsManagement()}
                {activeTab === "offers" && renderOffersManagement()}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {modalType === "add-room" && "Add New Room"}
                                {modalType === "edit-room" && "Edit Room"}
                                {modalType === "add-offer" && "Create New Offer"}
                                {modalType === "edit-offer" && "Edit Offer"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <XCircle size={24} />
                            </button>
                        </div>

                        {(modalType === "add-room" || modalType === "edit-room") && (
                            <form onSubmit={handleRoomSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Room Name</label>
                                        <input
                                            type="text"
                                            value={roomForm.name}
                                            onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Room Type</label>
                                        <select
                                            value={roomForm.roomType}
                                            onChange={(e) => setRoomForm({...roomForm, roomType: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="single">Single</option>
                                            <option value="double">Double</option>
                                            <option value="suite">Suite</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Price per Night</label>
                                        <input
                                            type="number"
                                            value={roomForm.price}
                                            onChange={(e) => setRoomForm({...roomForm, price: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Total Rooms</label>
                                        <input
                                            type="number"
                                            value={roomForm.totalRooms}
                                            onChange={(e) => setRoomForm({...roomForm, totalRooms: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Bed Type</label>
                                        <select
                                            value={roomForm.bedType}
                                            onChange={(e) => setRoomForm({...roomForm, bedType: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">Select Bed Type</option>
                                            <option value="single">Single</option>
                                            <option value="double">Double</option>
                                            <option value="queen">Queen</option>
                                            <option value="king">King</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Max Guests</label>
                                        <input
                                            type="number"
                                            value={roomForm.maxGuests}
                                            onChange={(e) => setRoomForm({...roomForm, maxGuests: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Room View Type</label>
                                    <select
                                        value={roomForm.view}
                                        onChange={(e) => setRoomForm({...roomForm, view: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Select View Type</option>
                                        <option value="ocean">Ocean View</option>
                                        <option value="city">City View</option>
                                        <option value="mountain">Mountain View</option>
                                        <option value="garden">Garden View</option>
                                        <option value="lake">Lake View</option>
                                        <option value="street">Street View</option>
                                        <option value="pool">Pool View</option>
                                        <option value="balcony">Balcony View</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        value={roomForm.description}
                                        onChange={(e) => setRoomForm({...roomForm, description: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        rows="3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Room Images (Upload 2 Images for Interior Views)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[0, 1].map((index) => (
                                            <div key={index} className="border border-gray-300 rounded-lg p-3">
                                                <label className="block text-xs font-medium mb-2">Image {index + 1}</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, index)}
                                                    className="block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-3
                                                        file:rounded-lg file:border-0
                                                        file:text-xs file:font-semibold
                                                        file:bg-blue-50 file:text-blue-700
                                                        hover:file:bg-blue-100"
                                                />
                                                {imagePreviews[index] && (
                                                    <img 
                                                        src={imagePreviews[index]} 
                                                        alt={`Preview ${index + 1}`}
                                                        className="mt-2 w-full h-32 object-cover rounded-lg border border-gray-200"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Amenities (comma separated)</label>
                                    <input
                                        type="text"
                                        value={amenitiesInput}
                                        onChange={(e) => setAmenitiesInput(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        placeholder="WiFi, Pool, Gym"
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        {modalType === "edit-room" ? "Update Room" : "Create Room"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {(modalType === "add-offer" || modalType === "edit-offer") && (
                            <form onSubmit={handleOfferSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Offer Code</label>
                                        <input
                                            type="text"
                                            value={offerForm.code}
                                            onChange={(e) => setOfferForm({...offerForm, code: e.target.value.toUpperCase()})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={offerForm.title}
                                            onChange={(e) => setOfferForm({...offerForm, title: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        value={offerForm.description}
                                        onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        rows="2"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Discount Type</label>
                                        <select
                                            value={offerForm.discountType}
                                            onChange={(e) => setOfferForm({...offerForm, discountType: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Discount {offerForm.discountType === "percentage" ? "(%)" : "($)"}
                                        </label>
                                        <input
                                            type="number"
                                            value={offerForm.discount}
                                            onChange={(e) => setOfferForm({...offerForm, discount: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Valid Till</label>
                                        <input
                                            type="date"
                                            value={offerForm.validTill}
                                            onChange={(e) => setOfferForm({...offerForm, validTill: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Usage Limit</label>
                                        <input
                                            type="number"
                                            value={offerForm.usageLimit}
                                            onChange={(e) => setOfferForm({...offerForm, usageLimit: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            placeholder="0 for unlimited"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        {modalType === "edit-offer" ? "Update Offer" : "Create Offer"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Booking Details Modal */}
            {showBookingDetailsModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Booking Details</h2>
                            <button onClick={closeBookingDetailsModal} className="text-gray-500 hover:text-gray-700">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Booking ID */}
                            <div className="border-b pb-4">
                                <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Booking ID</h3>
                                <p className="text-lg font-semibold text-gray-800">{selectedBooking._id}</p>
                            </div>

                            {/* Guest Information */}
                            <div className="grid grid-cols-2 gap-6 border-b pb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Guest Name</h3>
                                    <p className="text-gray-800">{selectedBooking.userId?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Guest Email</h3>
                                    <p className="text-gray-800">{selectedBooking.userId?.email || "N/A"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Guest Phone</h3>
                                    <p className="text-gray-800">{selectedBooking.userId?.phone || "N/A"}</p>
                                </div>
                            </div>

                            {/* Room Information */}
                            <div className="grid grid-cols-2 gap-6 border-b pb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Room Name</h3>
                                    <p className="text-gray-800">{selectedBooking.roomId?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Room Type</h3>
                                    <p className="text-gray-800">{selectedBooking.roomId?.roomType || "N/A"}</p>
                                </div>
                            </div>

                            {/* Booking Dates */}
                            <div className="grid grid-cols-2 gap-6 border-b pb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Check-in Date</h3>
                                    <p className="text-gray-800">{new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Check-out Date</h3>
                                    <p className="text-gray-800">{new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Number of Nights */}
                            <div className="grid grid-cols-2 gap-6 border-b pb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Number of Nights</h3>
                                    <p className="text-gray-800">{selectedBooking.numberOfNights || "N/A"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Number of Guests</h3>
                                    <p className="text-gray-800">{selectedBooking.numberOfGuests || "N/A"}</p>
                                </div>
                            </div>

                            {/* Pricing Information */}
                            <div className="grid grid-cols-2 gap-6 border-b pb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Room Price per Night</h3>
                                    <p className="text-gray-800">${selectedBooking.roomId?.price || "N/A"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Original Total</h3>
                                    <p className="text-gray-800">${selectedBooking.originalPrice || selectedBooking.totalPrice || "N/A"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Promo Code</h3>
                                    <p className="text-gray-800">{selectedBooking.discountCode || "None"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Discount Amount</h3>
                                    <p className="text-red-600 font-semibold">-${selectedBooking.discountAmount || 0}</p>
                                </div>
                                <div className="col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Final Total Price</h3>
                                    <p className="text-lg font-semibold text-green-600">${selectedBooking.totalPrice || "N/A"}</p>
                                </div>
                            </div>

                            {/* Status Information */}
                            <div className="grid grid-cols-2 gap-6 border-b pb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Booking Status</h3>
                                    <p className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${
                                        selectedBooking.bookingStatus === "confirmed" ? "bg-green-100 text-green-700" :
                                        selectedBooking.bookingStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                                        selectedBooking.bookingStatus === "cancelled" ? "bg-red-100 text-red-700" :
                                        selectedBooking.bookingStatus === "completed" ? "bg-blue-100 text-blue-700" :
                                        "bg-gray-100 text-gray-700"
                                    }`}>
                                        {selectedBooking.bookingStatus?.charAt(0).toUpperCase() + selectedBooking.bookingStatus?.slice(1)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Payment Status</h3>
                                    <p className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${
                                        selectedBooking.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                                        selectedBooking.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                                        selectedBooking.paymentStatus === "failed" ? "bg-red-100 text-red-700" :
                                        "bg-gray-100 text-gray-700"
                                    }`}>
                                        {selectedBooking.paymentStatus?.charAt(0).toUpperCase() + selectedBooking.paymentStatus?.slice(1)}
                                    </p>
                                </div>
                            </div>

                            {/* Special Requests */}
                            {selectedBooking.specialRequests && (
                                <div className="border-b pb-4">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Special Requests</h3>
                                    <p className="text-gray-800">{selectedBooking.specialRequests}</p>
                                </div>
                            )}

                            {/* Close Button */}
                            <div className="flex justify-end gap-4">
                                <button 
                                    onClick={closeBookingDetailsModal} 
                                    className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
    );
};

export default AdminDashboard;
