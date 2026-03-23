import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Star, AlertCircle, CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";

const WriteReview = () => {
    const { id } = useParams(); // This is the bookingId from the URL
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: "",
        cleanlinessRating: 5,
        serviceRating: 5,
        amenitiesRating: 5
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            // Validate id exists (this is bookingId)
            if (!id || id === 'undefined') {
                setError("Invalid booking. Please access this page from a valid booking.");
                setLoading(false);
                return;
            }

            // Fetch booking details first
            try {
                const bookingResponse = await API.get(`/bookings/${id}`);
                const bookingData = bookingResponse.data;
                setBooking(bookingData);

                // Get roomId from booking and fetch room details
                if (bookingData.roomId) {
                    try {
                        const roomId = typeof bookingData.roomId === 'object' 
                            ? bookingData.roomId._id 
                            : bookingData.roomId;
                        const roomResponse = await API.get(`/rooms/${roomId}`);
                        setRoom(roomResponse.data);
                    } catch (roomErr) {
                        console.log("Could not fetch room details:", roomErr);
                    }
                }
            } catch (bookingErr) {
                setError(bookingErr.response?.data?.message || "Failed to fetch booking details");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load page");
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (value) => {
        setReviewData({ ...reviewData, rating: value });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReviewData({ ...reviewData, [name]: value });
    };

    const handleDetailedRatingChange = (ratingType, value) => {
        setReviewData({ ...reviewData, [ratingType]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reviewData.comment.trim()) {
            setError("Please enter a comment");
            return;
        }

        if (reviewData.rating < 1 || reviewData.rating > 5) {
            setError("Please select a valid rating");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            // Get roomId from booking
            if (!booking || !booking.roomId) {
                setError("Invalid room information. Please refresh and try again.");
                setSubmitting(false);
                return;
            }

            const roomIdToSubmit = typeof booking.roomId === 'object' 
                ? booking.roomId._id 
                : booking.roomId;

            // Ensure bookingId is valid
            if (!id || id === 'undefined') {
                setError("Invalid booking ID. Please refresh and try again.");
                setSubmitting(false);
                return;
            }

            const payload = {
                roomId: String(roomIdToSubmit || "").trim(),
                bookingId: String(id || "").trim(),
                rating: reviewData.rating,
                comment: reviewData.comment,
                cleanlinessRating: reviewData.cleanlinessRating || null,
                serviceRating: reviewData.serviceRating || null,
                amenitiesRating: reviewData.amenitiesRating || null
            };

            const response = await API.post("/reviews", payload);

            setSuccess("Review submitted successfully! It will be visible after admin approval.");
            setTimeout(() => {
                navigate(`/room/${roomIdToSubmit}`);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* Fixed Notification Container - Always at Top */}
            {(error || success) && (
                <div className="fixed top-0 left-0 right-0 z-50 p-4 animate-in">
                    <div className="max-w-2xl mx-auto">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 shadow-lg mb-2">
                                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                                <p className="text-red-800 font-medium">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 shadow-lg mb-2">
                                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                                <p className="text-green-800 font-medium">{success}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="max-w-2xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Review</h1>
                        <p className="text-gray-600">Share your experience with other guests</p>
                    </div>

                    {/* Room Info */}
                    {room && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                            <p className="text-sm text-gray-600 mb-1">Reviewing:</p>
                            <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{room.roomType} • ${room.price}/night</p>
                        </div>
                    )}

                    {/* Booking Details */}
                    {booking && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Booking Details:</p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-600">Room:</p>
                                    <p className="font-medium text-gray-900">{booking.roomId?.name || room?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Guest Email:</p>
                                    <p className="font-medium text-gray-900">{booking.guestEmail || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Check-in:</p>
                                    <p className="font-medium text-gray-900">{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Check-out:</p>
                                    <p className="font-medium text-gray-900">{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Review Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Overall Rating */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Overall Rating <span className="text-red-500 font-bold">*</span>
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingChange(star)}
                                        className="transition transform hover:scale-110"
                                    >
                                        <Star
                                            size={40}
                                            className={star <= reviewData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{reviewData.rating} out of 5 stars</p>
                        </div>

                        {/* Comment */}
                        <div>
                            <label htmlFor="comment" className="block text-sm font-semibold text-gray-900 mb-2">
                                Your Comment <span className="text-red-500 font-bold">*</span>
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                value={reviewData.comment}
                                onChange={handleInputChange}
                                placeholder="Share your experience at this hotel... (minimum 10 characters)"
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">{reviewData.comment.length} characters</p>
                        </div>

                        {/* Detailed Ratings */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Rate Specific Aspects (Optional)</h3>
                            <div className="space-y-4">
                                {/* Cleanliness */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">Cleanliness</label>
                                        <span className="text-xs text-gray-600">{reviewData.cleanlinessRating}/5</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleDetailedRatingChange("cleanlinessRating", star)}
                                                className="transition"
                                            >
                                                <Star
                                                    size={24}
                                                    className={star <= reviewData.cleanlinessRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Service */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">Service</label>
                                        <span className="text-xs text-gray-600">{reviewData.serviceRating}/5</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleDetailedRatingChange("serviceRating", star)}
                                                className="transition"
                                            >
                                                <Star
                                                    size={24}
                                                    className={star <= reviewData.serviceRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">Amenities</label>
                                        <span className="text-xs text-gray-600">{reviewData.amenitiesRating}/5</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleDetailedRatingChange("amenitiesRating", star)}
                                                className="transition"
                                            >
                                                <Star
                                                    size={24}
                                                    className={star <= reviewData.amenitiesRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
                            >
                                {submitting ? "Submitting..." : "Submit Review"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                Cancel
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            Your review will be visible after admin approval
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WriteReview;
