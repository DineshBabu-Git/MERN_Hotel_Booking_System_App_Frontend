import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import { Star, MapPin, Users, Wifi, Coffee, Tv, AlertCircle, Search, Filter } from "lucide-react";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        roomType: searchParams.get("roomType") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        amenities: searchParams.get("amenities") || "",
        sortBy: "rating",
        checkIn: searchParams.get("checkIn") || "",
        checkOut: searchParams.get("checkOut") || ""
    });

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, [filters.checkIn, filters.checkOut, filters.roomType]);

    useEffect(() => {
        applyFilters();
    }, [rooms, filters]);


    const fetchRooms = async () => {
        try {
            setLoading(true);

            // If dates are selected, use availability endpoint
            if (filters.checkIn && filters.checkOut) {
                const availabilityResponse = await API.get("/rooms/availability", {
                    params: {
                        checkIn: filters.checkIn,
                        checkOut: filters.checkOut,
                        roomType: filters.roomType || undefined
                    }
                });
                const availableRooms = availabilityResponse.data.availableRooms || [];
                setRooms(availableRooms);
            } else {
                // Otherwise, get all rooms from database (not mock data)
                const response = await API.get("/rooms");
                const data = Array.isArray(response.data) ? response.data : response.data.rooms || [];
                if (data.length === 0) {
                    setError("No rooms available");
                }
                setRooms(data);
            }

            setError("");
        } catch (err) {
            setError("Failed to fetch rooms");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        // create copy to avoid mutating state
        let filtered = [...rooms];

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(room =>
                room.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                room.description?.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Room type filter
        if (filters.roomType) {
            filtered = filtered.filter(room => room.roomType === filters.roomType);
        }

        // Price range filter
        if (filters.minPrice) {
            filtered = filtered.filter(room => room.price >= parseInt(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(room => room.price <= parseInt(filters.maxPrice));
        }

        // Amenities filter
        if (filters.amenities) {
            const selectedAmenities = filters.amenities.split(",");
            filtered = filtered.filter(room =>
                selectedAmenities.some(amenity => room.amenities?.includes(amenity))
            );
        }

        // Sorting
        if (filters.sortBy === "price_low") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === "price_high") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (filters.sortBy === "rating") {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        setFilteredRooms(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        if (name === "checkIn") {
            // Clear check-out if it's before the new check-in date
            if (filters.checkOut && value > filters.checkOut) {
                setFilters(prev => ({ ...prev, checkOut: "" }));
            }
        }

        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleRoomClick = (room) => {
        navigate(`/room/${room._id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading rooms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Find Your Perfect Room</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className={`${showFilters ? "block" : "hidden"} md:block md:col-span-1`}>
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                            <div className="flex items-center justify-between mb-6 md:hidden">
                                <h3 className="text-lg font-bold">Filters</h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Date Selection Notice */}
                            {(filters.checkIn || filters.checkOut) && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-blue-700">
                                        📅 Showing available rooms for selected dates
                                    </p>
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, checkIn: "", checkOut: "" }))}
                                        className="text-xs text-blue-600 hover:text-blue-800 mt-1 underline"
                                    >
                                        Clear dates
                                    </button>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="search"
                                            value={filters.search}
                                            onChange={handleFilterChange}
                                            placeholder="Search rooms..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        <b>Try:</b> "deluxe", "suite", "garden", "city loft", "ocean view", "mountain cabin" etc.
                                    </p>
                                </div>

                                {/* Check-in Date */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date</label>
                                    <input
                                        type="date"
                                        name="checkIn"
                                        value={filters.checkIn}
                                        onChange={handleFilterChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Check-out Date */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date</label>
                                    <input
                                        type="date"
                                        name="checkOut"
                                        value={filters.checkOut}
                                        onChange={handleFilterChange}
                                        min={filters.checkIn || new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Room Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type</label>
                                    <select
                                        name="roomType"
                                        value={filters.roomType}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Types</option>
                                        <option value="single">Single</option>
                                        <option value="double">Double</option>
                                        <option value="suite">Suite</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            name="minPrice"
                                            value={filters.minPrice}
                                            onChange={handleFilterChange}
                                            placeholder="Min"
                                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="number"
                                            name="maxPrice"
                                            value={filters.maxPrice}
                                            onChange={handleFilterChange}
                                            placeholder="Max"
                                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                                    <div className="space-y-2">
                                        {["wifi", "ac", "tv", "coffee"].map(amenity => (
                                            <label key={amenity} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.amenities.includes(amenity)}
                                                    onChange={(e) => {
                                                        let amenities = filters.amenities.split(",").filter(a => a);
                                                        if (e.target.checked) {
                                                            // add if not already present
                                                            if (!amenities.includes(amenity)) amenities.push(amenity);
                                                        } else {
                                                            // remove the deselected amenity
                                                            amenities = amenities.filter(a => a !== amenity);
                                                        }
                                                        setFilters(prev => ({ ...prev, amenities: amenities.join(",") }));
                                                    }}
                                                    className="mr-2 rounded"
                                                />
                                                <span className="text-sm text-gray-600 capitalize">{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                                    <select
                                        name="sortBy"
                                        value={filters.sortBy}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="rating">Highest Rating</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rooms Grid */}
                    <div className="md:col-span-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden mb-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            <Filter size={18} />
                            Filters
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map(room => (
                                    <div
                                        key={room._id}
                                        onClick={() => handleRoomClick(room)}
                                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
                                    >
                                        {/* Room Image */}
                                        <div className="h-48 bg-gray-200 overflow-hidden">
                                            <img
                                                src={room.images?.[0] || "https://images.unsplash.com/photo-1631049307038-da0ec89d4d48?w=400&h=300&fit=crop"}
                                                alt={room.name}
                                                className="w-full h-full object-cover hover:scale-110 transition"
                                            />
                                        </div>

                                        {/* Room Info */}
                                        <div className="p-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">{room.name}</h3>

                                            {/* Rating */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={i < Math.floor(room.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600">({room.ratingCount} reviews)</span>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-2 mb-4 text-sm text-gray-600">
                                                <p className="flex items-center gap-2">
                                                    <Users size={16} />
                                                    {room.maxGuests} Guests
                                                </p>
                                                {room.view && (
                                                    <p className="flex items-center gap-2">
                                                        <MapPin size={16} />
                                                        {room.view}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Amenities */}
                                            {room.amenities && room.amenities.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                                                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className="border-t pt-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-2xl font-bold text-blue-600">${room.price}</p>
                                                        <p className="text-xs text-gray-500">per night</p>
                                                    </div>
                                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500 text-lg">No rooms match your filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rooms;
