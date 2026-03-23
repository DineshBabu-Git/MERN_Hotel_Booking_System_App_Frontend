import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Star, AlertCircle, CheckCircle, MessageCircle } from "lucide-react";

const Reviews = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [room, setRoom] = useState(null);
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
        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);

            // Get booking details
            const bookingResponse = await API.get(`/bookings/${bookingId}`);
            const bookingData = bookingResponse.data;

            // Check if booking is completed and belongs to user
            if (bookingData.bookingStatus !== "completed") {
                setError("You can only review completed bookings");
                return;
            }

            setBooking(bookingData);

            // Get room details
            const roomResponse = await API.get(`/rooms/${bookingData.roomId}`);
            setRoom(roomResponse.data);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch booking details");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReviewData(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (field, rating) => {
        setReviewData(prev => ({ ...prev, [field]: rating }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reviewData.comment.trim()) {
            setError("Please provide a review comment");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await API.post("/reviews", {
                roomId: booking.roomId,
                bookingId: booking._id,
                rating: parseInt(reviewData.rating),
                comment: reviewData.comment,
                cleanlinessRating: parseInt(reviewData.cleanlinessRating),
                serviceRating: parseInt(reviewData.serviceRating),
                amenitiesRating: parseInt(reviewData.amenitiesRating)
            });

            setSuccess("Review submitted successfully! It will be published after admin approval.");
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = ({ field, value, onChange }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(field, star)}
                    className="focus:outline-none"
                >
                    <Star
                        size={24}
                        className={`${
                            star <= value
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        } hover:text-yellow-400 transition-colors`}
                    />
                </button>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading review details...</p>
                </div>
            </div>
        );
    }

    if (error && !booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-3 max-w-md">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageCircle className="text-blue-600" size={32} />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Write a Review</h1>
                            <p className="text-gray-600">Share your experience with other guests</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3">
                            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                            <p className="text-green-600">{success}</p>
                        </div>
                    )}

                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Booking Details</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Room:</strong> {room?.name}</p>
                            <p><strong>Check-in:</strong> {new Date(booking?.checkIn).toLocaleDateString()}</p>
                            <p><strong>Check-out:</strong> {new Date(booking?.checkOut).toLocaleDateString()}</p>
                            <p><strong>Guests:</strong> {booking?.numberOfGuests}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Overall Rating */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Overall Rating *
                            </label>
                            <StarRating
                                field="rating"
                                value={reviewData.rating}
                                onChange={handleRatingChange}
                            />
                        </div>

                        {/* Detailed Ratings */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Cleanliness
                                </label>
                                <StarRating
                                    field="cleanlinessRating"
                                    value={reviewData.cleanlinessRating}
                                    onChange={handleRatingChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Service
                                </label>
                                <StarRating
                                    field="serviceRating"
                                    value={reviewData.serviceRating}
                                    onChange={handleRatingChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Amenities
                                </label>
                                <StarRating
                                    field="amenitiesRating"
                                    value={reviewData.amenitiesRating}
                                    onChange={handleRatingChange}
                                />
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Review *
                            </label>
                            <textarea
                                name="comment"
                                value={reviewData.comment}
                                onChange={handleInputChange}
                                placeholder="Tell others about your experience..."
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Your review will be published after admin approval
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <MessageCircle size={20} />
                                        Submit Review
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Reviews;