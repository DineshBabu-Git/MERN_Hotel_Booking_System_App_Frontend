import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Calendar, Users, Tag, AlertCircle, CheckCircle } from "lucide-react";
import CheckoutForm from "../components/CheckoutForm";

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentStep, setPaymentStep] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [formData, setFormData] = useState({
        checkIn: "",
        checkOut: "",
        numberOfGuests: 1,
        specialRequests: "",
        guestEmail: "",
        guestPhone: "",
        discountCode: ""
    });

    const [bookingSummary, setBookingSummary] = useState(null);

    useEffect(() => {
        fetchRoom();

        // prefill guest contact details for logged-in user
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser.email) {
            setFormData(prev => ({ ...prev, guestEmail: storedUser.email }));
        }
        if (storedUser.phone) {
            setFormData(prev => ({ ...prev, guestPhone: storedUser.phone }));
        }
    }, []);

    const fetchRoom = async () => {
        try {
            const response = await API.get(`/rooms/${id}`);
            setRoom(response.data);

            // lock guest count to room capacity
            const max = response.data.maxGuests || 1;
            setFormData(prev => ({ ...prev, numberOfGuests: max }));
        } catch (err) {
            setError("Failed to fetch room details");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "numberOfGuests") {
            // enforce room limit (also prevent manual typing above capacity)
            const max = room?.maxGuests || 6;
            const clamped = Math.min(parseInt(value) || 0, max);
            setFormData(prev => ({ ...prev, numberOfGuests: clamped }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const calculateBookingSummary = async () => {
        if (!formData.checkIn || !formData.checkOut) {
            setError("Please select both check-in and check-out dates");
            return;
        }

        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);

        if (checkOut <= checkIn) {
            setError("Check-out date must be after check-in date");
            return;
        }

        const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        // enforce maximum guests per room
        if (room && formData.numberOfGuests > room.maxGuests) {
            setError(`Number of guests cannot exceed the room limit (${room.maxGuests})`);
            return;
        }
        let totalPrice = room.price * numberOfNights;
        let discountAmount = 0;

        // Apply discount code if provided
        if (formData.discountCode) {
            try {
                const discountResponse = await API.post("/offers/validate", {
                    code: formData.discountCode,
                    totalAmount: totalPrice,
                    roomType: room.roomType
                });

                discountAmount = discountResponse.data.offer.discountAmount || 0;
                totalPrice -= discountAmount;
            } catch (err) {
                setError(err.response?.data?.message || "Invalid discount code");
                return;
            }
        }

        setBookingSummary({
            numberOfNights,
            originalPrice: room.price * numberOfNights,
            discountAmount,
            totalPrice: Math.max(totalPrice, 0),
            discountCode: formData.discountCode
        });

        setError("");
    };

    const handleProceedToPayment = async () => {
        try {
            // Create booking first
            const bookingResponse = await API.post("/bookings", {
                roomId: id,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                numberOfGuests: parseInt(formData.numberOfGuests),
                specialRequests: formData.specialRequests,
                guestEmail: formData.guestEmail,
                guestPhone: formData.guestPhone,
                discountCode: formData.discountCode
            });

            setBookingId(bookingResponse.data.booking._id);
            setPaymentStep(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create booking");
        }
    };

    const handlePaymentSimulation = async () => {
        try {
            // Update booking with Razorpay payment ID (can be set in CheckoutForm)
            await API.put(`/bookings/${bookingId}/confirm`, {
                razorpayPaymentId: "pay_simulation_" + Date.now(),
                razorpayOrderId: "order_simulation_" + Date.now()
            });

            setSuccessMessage("Booking confirmed successfully! Check your email for details.");
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Payment failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-600">Room not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            {/* Fixed Notification Container - Always at Top */}
            {(successMessage || error) && (
                <div className="fixed top-0 left-0 right-0 z-50 p-4 animate-in">
                    <div className="max-w-4xl mx-auto">
                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 shadow-lg">
                                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                                <p className="text-green-600 font-medium">{successMessage}</p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 shadow-lg">
                                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                                <p className="text-red-600 font-medium">{error}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Booking Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {!paymentStep ? (
                                <form className="space-y-6">
                                    {/* Dates */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Check-in Date <span className="text-red-500 font-bold">*</span></label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                                <input
                                                    type="date"
                                                    name="checkIn"
                                                    value={formData.checkIn}
                                                    onChange={handleInputChange}
                                                    min={getMinDate()}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Check-out Date <span className="text-red-500 font-bold">*</span></label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                                <input
                                                    type="date"
                                                    name="checkOut"
                                                    value={formData.checkOut}
                                                    onChange={handleInputChange}
                                                    min={getMinDate()}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guests */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Number of Guests <span className="text-red-500 font-bold">*</span> (Max: {room?.maxGuests})</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                                            <input
                                                type="number"
                                                name="numberOfGuests"
                                                value={formData.numberOfGuests}
                                                onChange={handleInputChange}
                                                min="1"
                                                max={room?.maxGuests || 6}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Guest Info */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Email <span className="text-red-500 font-bold">*</span></label>
                                            <input
                                                type="email"
                                                name="guestEmail"
                                                value={formData.guestEmail}
                                                onChange={handleInputChange}
                                                placeholder="your@email.com"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Phone <span className="text-red-500 font-bold">*</span></label>
                                            <input
                                                type="tel"
                                                name="guestPhone"
                                                value={formData.guestPhone}
                                                onChange={handleInputChange}
                                                placeholder="Your phone number"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Discount Code */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                                            <Tag size={18} />
                                            Discount Code (optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="discountCode"
                                            value={formData.discountCode}
                                            onChange={handleInputChange}
                                            placeholder="Enter promo code"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                                        />
                                    </div>

                                    {/* Special Requests */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Special Requests</label>
                                        <textarea
                                            name="specialRequests"
                                            value={formData.specialRequests}
                                            onChange={handleInputChange}
                                            placeholder="Any special requests? (e.g., high floor, quiet room)"
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        ></textarea>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={calculateBookingSummary}
                                            className="flex-1 bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition"
                                        >
                                            Calculate Total
                                        </button>

                                        {bookingSummary && (
                                            <button
                                                type="button"
                                                onClick={handleProceedToPayment}
                                                className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Proceed to Payment
                                            </button>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Payment</h2>
                                    <CheckoutForm
                                        bookingData={{
                                            bookingId,
                                            totalPrice: bookingSummary.totalPrice,
                                            numberOfNights: bookingSummary.numberOfNights,
                                            discountAmount: bookingSummary.discountAmount,
                                            guestEmail: formData.guestEmail,
                                            guestPhone: formData.guestPhone
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>

                            <div className="space-y-4 border-b pb-4 mb-4">
                                <div>
                                    <p className="text-gray-600 text-sm">Room</p>
                                    <p className="font-semibold text-lg">{room.name}</p>
                                </div>

                                {bookingSummary && (
                                    <>
                                        <div>
                                            <p className="text-gray-600 text-sm">Duration</p>
                                            <p className="font-semibold">{bookingSummary.numberOfNights} nights</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-600 text-sm">Nightly Rate</p>
                                            <p className="font-semibold text-lg">${room.price}/night</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {bookingSummary && (
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">${bookingSummary.originalPrice.toFixed(2)}</span>
                                    </div>

                                    {bookingSummary.discountAmount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-${bookingSummary.discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-blue-600">${bookingSummary.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
