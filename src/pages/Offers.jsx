import { useState, useEffect } from "react";
import API from "../services/api";
import { Tag, AlertCircle, Calendar, Percent, DollarSign, X } from "lucide-react";

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        fetchOffers();

        // Clear errors when component unmounts (navigate away)
        return () => {
            setError("");
        };
    }, []);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const response = await API.get("/offers/active");
            setOffers(response.data);
        } catch (err) {
            setError("Failed to fetch offers");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getDiscountDisplay = (offer) => {
        if (offer.discountType === "percentage") {
            return `${offer.discount}% off`;
        } else {
            return `$${offer.discount} off`;
        }
    };

    const getIcon = (offer) => {
        return offer.discountType === "percentage" ? (
            <Percent className="text-green-600" size={24} />
        ) : (
            <DollarSign className="text-blue-600" size={24} />
        );
    };

    const getRemainingCount = (offer) => {
        if (!offer.usageLimit) return null;
        const remaining = offer.usageLimit - (offer.usedCount || 0);
        return Math.max(0, remaining);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading offers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Tag className="text-blue-600" size={40} />
                        <h1 className="text-4xl font-bold text-gray-900">Special Offers</h1>
                    </div>
                    <p className="text-xl text-gray-600">
                        Discover amazing deals and exclusive discounts for your stay
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex gap-3 justify-between items-start max-w-md mx-auto">
                        <div className="flex gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                            <p className="text-red-600">{error}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="text-red-600 hover:text-red-700 flex-shrink-0"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {offers.length === 0 ? (
                    <div className="text-center py-12">
                        <Tag className="text-gray-400 mx-auto mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Offers</h3>
                        <p className="text-gray-500">Check back later for special deals and promotions</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offers.map((offer) => (
                            <div
                                key={offer._id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                    <div className="flex items-center justify-between mb-2">
                                        {getIcon(offer)}
                                        <span className="text-2xl font-bold">
                                            {getDiscountDisplay(offer)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{offer.title}</h3>
                                    <div className="flex items-center gap-2 text-blue-100">
                                        <Calendar size={16} />
                                        <span className="text-sm">
                                            Valid till {new Date(offer.validTill).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4">{offer.description}</p>

                                    {/* Terms */}
                                    <div className="space-y-2 text-sm text-gray-500">
                                        {/*{offer.minAmount > 0 && (
                                            <p>💰 Minimum purchase: ${offer.minAmount}</p>
                                        )}
                                        {offer.maxDiscount && offer.discountType === "percentage" && (
                                            <p>🎯 Maximum discount: ${offer.maxDiscount}</p>
                                        )}
                                        {offer.applicableRoomTypes && offer.applicableRoomTypes.length > 0 && (
                                            <p>🏨 Applicable to: {offer.applicableRoomTypes.join(", ")}</p>
                                        )}*/}
                                        {offer.usageLimit && (
                                            <p className={`font-semibold ${getRemainingCount(offer) <= 5 ? "text-orange-600" : "text-gray-600"}`}>
                                                📊 {getRemainingCount(offer)} code{getRemainingCount(offer) !== 1 ? "s" : ""} remaining out of {offer.usageLimit}
                                            </p>
                                        )}
                                    </div>

                                    {/* Code */}
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Use code at checkout:</p>
                                            <div className="flex items-center justify-between">
                                                <code className="bg-white px-3 py-1 rounded border text-lg font-mono font-bold text-blue-600">
                                                    {offer.code}
                                                </code>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(offer.code);
                                                        setCopiedCode(offer._id);
                                                        setTimeout(() => setCopiedCode(null), 2000);
                                                    }}
                                                    className={`text-sm underline font-semibold transition ${copiedCode === offer._id
                                                        ? "text-green-600 hover:text-green-800"
                                                        : "text-blue-600 hover:text-blue-800"
                                                        }`}
                                                >
                                                    {copiedCode === offer._id ? "✓ Copied" : "Copy"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* How to Use Section */}
                <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        How to Use Your Discount Code
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">1</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Choose Your Room</h3>
                            <p className="text-gray-600">Browse and select the perfect room for your stay</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">2</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Enter Booking Details</h3>
                            <p className="text-gray-600">Fill in your check-in/out dates and guest information</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">3</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Apply Discount Code</h3>
                            <p className="text-gray-600">Enter your discount code at checkout to save</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Offers;