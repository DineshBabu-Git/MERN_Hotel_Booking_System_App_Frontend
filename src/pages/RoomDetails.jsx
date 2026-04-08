import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Star, MapPin, Users, Heart, AlertCircle, Calendar, MessageCircle } from "lucide-react";
import { getImagePath } from "../utils/imageHelper";

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchRoomDetails();
        fetchReviews();
        if (token) {
            API.get("/auth/profile")
                .then(res => {
                    const saved = res.data.savedRooms || [];
                    if (saved.some(r => r._id === id || r === id)) {
                        setIsSaved(true);
                    }
                })
                .catch(() => { });
        }
    }, [id]);

    const fetchRoomDetails = async () => {
        try {
            const response = await API.get(`/rooms/${id}`);
            // Handle both old format (direct object) and new format ({success, data})
            const roomData = response.data.data || response.data;
            setRoom(roomData);
        } catch (err) {
            setError("Failed to fetch room details");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await API.get(`/reviews/room/${id}`);
            // Handle both array and new standardized format {success, data}
            const reviewsData = Array.isArray(response.data)
                ? response.data
                : (response.data.data || []);
            // Filter to show only approved reviews to regular users
            const approvedReviews = reviewsData.filter(review => review.isApproved);
            setReviews(approvedReviews);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        }
    };

    const handleSaveRoom = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            if (isSaved) {
                await API.post("/auth/remove-saved-room", { roomId: id });
            } else {
                await API.post("/auth/save-room", { roomId: id });
            }
            setIsSaved(!isSaved);
        } catch (err) {
            console.error("Error saving room:", err);
        }
    };

    const handleBook = () => {
        if (!token) {
            navigate("/login");
            return;
        }
        navigate(`/book/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading room details...</p>
                </div>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-3 max-w-md">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                    <p className="text-red-600">{error || "Room not found"}</p>
                </div>
            </div>
        );
    }

    const images = room.images && room.images.length > 0
        ? room.images
        : [null];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Image Gallery */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="relative h-96 bg-gray-300">
                        <img
                            src={getImagePath(images[imageIndex])}
                            alt={room.name}
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={() => setImageIndex((imageIndex - 1 + images.length) % images.length)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                        >
                            ‹
                        </button>
                        <button
                            onClick={() => setImageIndex((imageIndex + 1) % images.length)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                        >
                            ›
                        </button>
                        <button
                            onClick={handleSaveRoom}
                            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition"
                        >
                            <Heart
                                size={24}
                                className={isSaved ? "fill-red-500 text-red-500" : "text-gray-400"}
                            />
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setImageIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition ${idx === imageIndex ? "bg-white" : "bg-white/50"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Room Info */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{room.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            className={i < Math.floor(room.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600">({room.ratingCount} reviews)</span>
                            </div>

                            {/* Key Details */}
                            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                                <div>
                                    <p className="text-gray-600 text-sm">Room Type</p>
                                    <p className="font-semibold text-lg capitalize">{room.roomType}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Bed Type</p>
                                    <p className="font-semibold text-lg capitalize">{room.bedType}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Room Size</p>
                                    <p className="font-semibold text-lg">{room.roomSize || "N/A"} sq ft</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Max Guests</p>
                                    <p className="font-semibold text-lg flex items-center gap-1">
                                        <Users size={20} />
                                        {room.maxGuests}
                                    </p>
                                </div>
                            </div>

                            {/* View */}
                            {room.view && (
                                <div className="mb-6 pb-6 border-b">
                                    <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                                        <MapPin size={16} />
                                        View
                                    </p>
                                    <p className="font-semibold text-lg">{room.view}</p>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
                                <p className="text-gray-700 leading-relaxed">{room.description}</p>
                            </div>

                            {/* Amenities */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {room.amenities && room.amenities.length > 0 ? (
                                        room.amenities.map((amenity, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                                                <span className="text-2xl">✓</span>
                                                <span className="capitalize text-gray-700">{amenity}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No amenities listed</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <MessageCircle size={24} />
                                    Guest Reviews ({reviews.length})
                                </h3>
                                {token && (
                                    <button
                                        onClick={() => navigate(`/dashboard`)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                                    >
                                        Write a Review
                                    </button>
                                )}
                            </div>

                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map(review => (
                                        <div key={review._id} className="border-b pb-6 last:border-b-0">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {review.userId?.name?.[0] || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{review.userId?.name || "Anonymous"}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-3">{review.comment}</p>

                                            {/* Detailed Ratings */}
                                            {(review.cleanlinessRating || review.serviceRating || review.amenitiesRating) && (
                                                <div className="grid grid-cols-3 gap-2 mb-3 py-3 border-t border-b text-sm">
                                                    {review.cleanlinessRating && (
                                                        <div>
                                                            <span className="text-gray-600">Cleanliness:</span>
                                                            <div className="flex gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={12} className={i < review.cleanlinessRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {review.serviceRating && (
                                                        <div>
                                                            <span className="text-gray-600">Service:</span>
                                                            <div className="flex gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={12} className={i < review.serviceRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {review.amenitiesRating && (
                                                        <div>
                                                            <span className="text-gray-600">Amenities:</span>
                                                            <div className="flex gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={12} className={i < review.amenitiesRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Admin Response */}
                                            {review.adminResponse && (
                                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <p className="text-sm font-semibold text-blue-900 mb-1">Hotel Response:</p>
                                                    <p className="text-sm text-blue-700">{review.adminResponse}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <MessageCircle size={32} className="mx-auto mb-3 text-gray-300" />
                                    <p className="text-gray-500 mb-4">No guest reviews yet</p>
                                    {token && (
                                        <button
                                            onClick={() => navigate(`/dashboard`)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                        >
                                            Be the first to review this room!
                                        </button>
                                    )}
                                    {!token && (
                                        <p className="text-gray-400 text-sm"><a href="/login" className="text-blue-600 hover:underline">Log in</a> to write a review after booking</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                            <div className="text-center mb-6">
                                <p className="text-gray-600 text-sm mb-2">Price per night</p>
                                <h2 className="text-5xl font-bold text-blue-600">${room.price}</h2>
                            </div>

                            {room.originalPrice > room.price && (
                                <p className="text-center text-gray-500 line-through mb-4">
                                    ${room.originalPrice}
                                </p>
                            )}

                            <button
                                onClick={handleBook}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition mb-4 flex items-center justify-center gap-2"
                            >
                                <Calendar size={20} />
                                Book Now
                            </button>

                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Availability</span>
                                    <span className="font-semibold text-green-600">
                                        {room.availableRooms} rooms available
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Cancellation</span>
                                    <span className="font-semibold">Free cancellation</span>
                                </div>
                            </div>

                            {token && (
                                <button
                                    onClick={handleSaveRoom}
                                    className={`w-full mt-4 py-2 rounded-lg font-semibold transition ${isSaved
                                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {isSaved ? "❤ Saved" : "♡ Save for later"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
