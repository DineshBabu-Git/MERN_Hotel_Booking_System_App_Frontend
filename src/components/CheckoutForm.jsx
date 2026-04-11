
import axios from "axios";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

const CheckoutForm = ({ bookingData }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "error" or "success"

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        try {
            // Validate booking data
            if (!bookingData.bookingId) {
                throw new Error("Booking ID is missing. Please try again.");
            }
            if (!bookingData.totalPrice || bookingData.totalPrice <= 0) {
                throw new Error("Invalid payment amount. Please check your booking details.");
            }

            // 1️⃣ Create Razorpay Order
            const { data: orderData } = await axios.post(
                "https://mern-hotel-booking-system-backend.onrender.com/api/payments/create-order",
                {
                    amount: parseFloat(bookingData.totalPrice),
                    bookingId: bookingData.bookingId,
                    currency: "INR"
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!orderData || !orderData.data || !orderData.data.orderId) {
                throw new Error(orderData?.message || "Failed to create payment order");
            }

            const orderId = orderData.data.orderId;

            // 2️⃣ Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // From .env
                amount: orderData.data.amount, // In Cents
                currency: orderData.data.currency || "INR",
                name: "Hotel Booking System",
                description: `Booking for ${bookingData.numberOfNights} nights`,
                order_id: orderId,
                handler: async (response) => {
                    try {
                        // Validate response from Razorpay
                        if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                            throw new Error("Missing payment response data from Razorpay");
                        }

                        // 3️⃣ Verify Payment on Backend
                        const verifyResponse = await axios.post(
                            "https://mern-hotel-booking-system-backend.onrender.com/api/payments/verify",
                            {
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                                bookingId: bookingData.bookingId
                            },
                            {
                                headers: { Authorization: `Bearer ${token}` }
                            }
                        );

                        setMessage("Payment Successful! Booking Confirmed. Check your Email for Details.🎉");
                        setMessageType("success");
                        setLoading(false);

                        // Redirect after success
                        setTimeout(() => {
                            window.location.href = "/dashboard";
                        }, 2000);
                    } catch (err) {
                        const errorMsg = err.response?.data?.message || err.message || "Payment verification failed";
                        setMessage(errorMsg);
                        setMessageType("error");
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user.name || "",
                    email: user.email || bookingData.guestEmail || "",
                    contact: bookingData.guestPhone || ""
                },
                theme: {
                    color: "#3b82f6"
                },
                modal: {
                    ondismiss: () => {
                        setMessage("Payment cancelled by user");
                        setMessageType("error");
                        setLoading(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", (response) => {
                const errorMsg = response.error?.description || "Payment failed";
                setMessage(`Payment failed: ${errorMsg}`);
                setMessageType("error");
                setLoading(false);
            });

            razorpay.open();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to create payment order";
            setMessage(errorMsg);
            setMessageType("error");
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handlePayment}
            className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-xl"
        >
            <h2 className="text-xl font-bold mb-4">Complete Payment</h2>

            {message && (
                <div className={`mb-4 p-4 rounded-lg flex gap-3 justify-between items-start ${messageType === "success"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                    }`}>
                    <div className="flex gap-3">
                        {messageType === "success" ? (
                            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                        ) : (
                            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                        )}
                        <p className={messageType === "success" ? "text-green-700" : "text-red-700"}>
                            {message}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setMessage("")}
                        className={`flex-shrink-0 ${messageType === "success" ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"}`}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">Amount to Pay</p>
                <p className="text-2xl font-bold text-gray-900">${bookingData.totalPrice.toFixed(2)}</p>
                {bookingData.discountAmount > 0 && (
                    <p className="text-xs text-green-600 mt-2">
                        Discount Applied: ${bookingData.discountAmount.toFixed(2)}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
            >
                {loading ? "Processing..." : `Pay $${bookingData.totalPrice.toFixed(2)}`}
            </button>

            <p className="mt-4 text-xs text-gray-500 text-center">
                Secure payment powered by Razorpay
            </p>
        </form>
    );
};

export default CheckoutForm;
