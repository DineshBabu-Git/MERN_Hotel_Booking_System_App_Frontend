
import { BedDouble, Users, Wifi, Bath } from "lucide-react";
import { Link } from "react-router-dom";

function RoomCard({ room }) {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
            <img
                src={room.images[0]}
                alt={room.name}
                className="h-56 w-full object-cover"
            />

            <div className="p-6">
                <h2 className="text-xl font-bold">{room.name}</h2>
                <p className="text-gray-500 mt-2">{room.description}</p>

                <div className="flex items-center gap-4 mt-4 text-gray-600">
                    <BedDouble size={18} />
                    <span>{room.bedType}</span>

                    <Users size={18} />
                    <span>{room.capacity} Guests</span>
                </div>

                <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <Wifi size={18} />
                    <Bath size={18} />
                </div>

                <div className="flex justify-between items-center mt-6">
                    <span className="text-blue-600 font-bold text-lg">
                        ${room.price}/night
                    </span>

                    <Link
                        to={`/rooms/${room._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RoomCard;
