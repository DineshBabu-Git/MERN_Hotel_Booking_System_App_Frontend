import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Calendar, DollarSign, Clock, CheckCircle, AlertCircle, Eye, Trash2, Heart, Bell, User, Edit2, Save, MessageCircle } from "lucide-react";

const Dashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [savedRooms, setSavedRooms] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("bookings");
    const [cancellingBookingId, setCancellingBookingId] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: ""
    });
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalSpent: 0,
        upcomingBookings: 0,
        completedBookings: 0,
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const userResponse = await API.get("/auth/profile");
            setUser(userResponse.data);
            setSavedRooms(userResponse.data.savedRooms || []);
            setProfileForm({
                name: userResponse.data.name || "",
                phone: userResponse.data.phone || "",
                address: userResponse.data.address || "",
                city: userResponse.data.city || "",
                state: userResponse.data.state || "",
                zipCode: userResponse.data.zipCode || ""
            });

            const bookingsResponse = await API.get("/bookings/my-bookings");
            const allBookings = bookingsResponse.data;
            setBookings(allBookings);

            // Calculate stats
            const totalSpent = allBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
            const upcoming = allBookings.filter((b) => new Date(b.checkOut) > new Date()).length;
            const completed = allBookings.filter((b) => b.bookingStatus === "completed").length;

            setStats({
                totalBookings: allBookings.length,
                totalSpent,
                upcomingBookings: upcoming,
                completedBookings: completed,
            });
        } catch (err) {
            console.error(err);
            setError("Failed to fetch user data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await API.put("/auth/profile", profileForm);
            setUser(response.data.user);
            setIsEditingProfile(false);
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Failed to update profile: " + (err.response?.data?.message || err.message));
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        setCancellingBookingId(bookingId);
        try {
            await API.put(`/bookings/${bookingId}/cancel`, {
                cancellationReason: "Cancelled by user"
            });
            setBookings(bookings.map((b) => (b._id === bookingId ? { ...b, bookingStatus: "cancelled" } : b)));
            alert("Booking cancelled successfully. Check your email for details.");
        } catch (err) {
            alert("Failed to cancel booking: " + (err.response?.data?.message || err.message));
        } finally {
            setCancellingBookingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            case "completed":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getPaymentStatusColor = (status) => {
        return status === "paid" ? "text-green-600" : "text-yellow-600";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
                    <p className="text-gray-600">{user?.email}</p>
                </div>

                {error && (
                    <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-10">
                    <div className="rounded-lg shadow bg-white p-6 flex items-center gap-4 hover:shadow-lg transition">
                        <Calendar className="text-blue-600" size={32} />
                        <div>
                            <p className="text-gray-500 text-sm">Total Bookings</p>
                            <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
                        </div>
                    </div>

                    <div className="rounded-lg shadow bg-white p-6 flex items-center gap-4 hover:shadow-lg transition">
                        <DollarSign className="text-green-600" size={32} />
                        <div>
                            <p className="text-gray-500 text-sm">Total Spent</p>
                            <h3 className="text-2xl font-bold">${stats.totalSpent}</h3>
                        </div>
                    </div>

                    <div className="rounded-lg shadow bg-white p-6 flex items-center gap-4 hover:shadow-lg transition">
                        <Clock className="text-yellow-600" size={32} />
                        <div>
                            <p className="text-gray-500 text-sm">Upcoming</p>
                            <h3 className="text-2xl font-bold">{stats.upcomingBookings}</h3>
                        </div>
                    </div>

                    <div className="rounded-lg shadow bg-white p-6 flex items-center gap-4 hover:shadow-lg transition">
                        <CheckCircle className="text-purple-600" size={32} />
                        <div>
                            <p className="text-gray-500 text-sm">Completed</p>
                            <h3 className="text-2xl font-bold">{stats.completedBookings}</h3>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("bookings")}
                        className={`pb-3 font-semibold transition whitespace-nowrap ${activeTab === "bookings"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                    >
                        My Bookings ({bookings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("saved")}
                        className={`pb-3 font-semibold transition whitespace-nowrap ${activeTab === "saved"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                    >
                        Saved Rooms ({savedRooms.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`pb-3 font-semibold transition whitespace-nowrap flex items-center gap-1 ${activeTab === "profile"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                    >
                        <User size={18} />
                        Profile
                    </button>
                </div>

                {/* Bookings Tab */}
                {activeTab === "bookings" && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-6">My Bookings</h2>

                        {bookings.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No bookings yet. Start exploring rooms!</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-semibold">Room</th>
                                            <th className="text-left py-3 px-4 font-semibold">Check-In</th>
                                            <th className="text-left py-3 px-4 font-semibold">Check-Out</th>
                                            <th className="text-left py-3 px-4 font-semibold">Nights</th>
                                            <th className="text-left py-3 px-4 font-semibold">Total</th>
                                            <th className="text-left py-3 px-4 font-semibold">Status</th>
                                            <th className="text-left py-3 px-4 font-semibold">Payment</th>
                                            <th className="text-left py-3 px-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking) => (
                                            <tr key={booking._id} className="border-b hover:bg-gray-50">
                                                <td className="py-4 px-4 font-medium">{booking.roomId?.name || "Room"}</td>
                                                <td className="py-4 px-4">{new Date(booking.checkIn).toLocaleDateString()}</td>
                                                <td className="py-4 px-4">{new Date(booking.checkOut).toLocaleDateString()}</td>
                                                <td className="py-4 px-4">{booking.numberOfNights}</td>
                                                <td className="py-4 px-4 font-bold text-blue-600">${booking.totalPrice}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(booking.bookingStatus)}`}>
                                                        {booking.bookingStatus}
                                                    </span>
                                                </td>
                                                <td className={`py-4 px-4 font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                                    {booking.paymentStatus}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => navigate(`/room/${booking.roomId?._id}`)}
                                                            className="p-2 hover:bg-blue-100 rounded transition"
                                                            title="View Room"
                                                        >
                                                            <Eye size={18} className="text-blue-600" />
                                                        </button>
                                                        {booking.bookingStatus === "completed" && (
                                                            <button
                                                                onClick={() => navigate(`/reviews/${booking._id}`)}
                                                                className="p-2 hover:bg-green-100 rounded transition"
                                                                title="Write Review"
                                                            >
                                                                <MessageCircle size={18} className="text-green-600" />
                                                            </button>
                                                        )}
                                                        {booking.bookingStatus !== "cancelled" && (
                                                            <button
                                                                onClick={() => handleCancelBooking(booking._id)}
                                                                disabled={cancellingBookingId === booking._id}
                                                                className={`p-2 rounded transition ${
                                                                    cancellingBookingId === booking._id
                                                                        ? "bg-gray-100 cursor-not-allowed"
                                                                        : "hover:bg-red-100"
                                                                }`}
                                                                title="Cancel Booking"
                                                            >
                                                                {cancellingBookingId === booking._id ? (
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                                                                ) : (
                                                                    <Trash2 size={18} className="text-red-600" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Saved Rooms Tab */}
                {activeTab === "saved" && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-6">Saved Rooms</h2>

                        {savedRooms.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No saved rooms yet. Add some favorites!</p>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedRooms.map((room) => (
                                    <div key={room._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                                        {room.images && room.images[0] && (
                                            <img src={room.images[0]} alt={room.name} className="w-full h-48 object-cover" />
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg mb-2">{room.name}</h3>
                                            <p className="text-gray-600 text-sm mb-2">{room.roomType}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-blue-600 font-bold text-lg">${room.price}/night</span>
                                                <button
                                                    onClick={() => navigate(`/room/${room._id}`)}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">My Profile</h2>
                            <button
                                onClick={() => setIsEditingProfile(!isEditingProfile)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                {isEditingProfile ? <Save size={18} /> : <Edit2 size={18} />}
                                {isEditingProfile ? "Save" : "Edit Profile"}
                            </button>
                        </div>

                        {isEditingProfile ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={profileForm.address}
                                        onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">City</label>
                                        <input
                                            type="text"
                                            value={profileForm.city}
                                            onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">State</label>
                                        <input
                                            type="text"
                                            value={profileForm.state}
                                            onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Zip Code</label>
                                        <input
                                            type="text"
                                            value={profileForm.zipCode}
                                            onChange={(e) => setProfileForm({...profileForm, zipCode: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingProfile(false)}
                                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600 text-sm">Full Name</p>
                                        <p className="text-lg font-medium">{user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Email</p>
                                        <p className="text-lg font-medium">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600 text-sm">Phone</p>
                                        <p className="text-lg font-medium">{user?.phone || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Role</p>
                                        <p className="text-lg font-medium capitalize">{user?.role}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Address</p>
                                    <p className="text-lg font-medium">{user?.address || "Not provided"}</p>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-gray-600 text-sm">City</p>
                                        <p className="text-lg font-medium">{user?.city || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">State</p>
                                        <p className="text-lg font-medium">{user?.state || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Zip Code</p>
                                        <p className="text-lg font-medium">{user?.zipCode || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
