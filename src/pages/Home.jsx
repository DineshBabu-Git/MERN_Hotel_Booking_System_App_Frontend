
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Hotel, Star, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="bg-gray-50">

            {/* HERO SLIDER */}
            <div className="h-[80vh]">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    loop
                    className="h-full"
                >
                    <SwiperSlide>
                        <div
                            className="h-full bg-cover bg-center flex items-center justify-center"
                            style={{
                                backgroundImage:
                                    "url(/images/luxury_stay_homeslide.jpg)",
                            }}
                        >
                            <h1 className="text-white text-5xl font-bold bg-black/50 px-6 py-4 rounded-xl">
                                Luxury Stay Experience
                            </h1>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div
                            className="h-full bg-cover bg-center flex items-center justify-center"
                            style={{
                                backgroundImage:
                                    "url(/images/comfort_elegance_homeslide.jpg)",
                            }}
                        >
                            <h1 className="text-white text-5xl font-bold bg-black/50 px-6 py-4 rounded-xl">
                                Comfort & Elegance
                            </h1>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div
                            className="h-full bg-cover bg-center flex items-center justify-center"
                            style={{
                                backgroundImage:
                                    "url(/images/book_dream_room_homeslide.jpg)",
                            }}
                        >
                            <h1 className="text-white text-5xl font-bold bg-black/50 px-6 py-4 rounded-xl">
                                Book Your Dream Room
                            </h1>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

            {/* FEATURES SECTION */}
            <div className="flex justify-end px-8 pt-8">
                {/* show button only if user is admin */}
                {(() => {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    if (user.role === "admin") {
                        return (
                            <Link
                                to="/admin"
                                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                            >
                                Admin Panel
                            </Link>
                        );
                    }
                    return null;
                })()}
            </div>
            <div className="py-16 px-8 grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
                    <Hotel size={40} className="mx-auto text-blue-600 mb-4" />
                    <h3 className="font-semibold text-lg">Premium Rooms</h3>
                    <p className="text-gray-500 mt-2">
                        Spacious and comfortable luxury rooms.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
                    <Star size={40} className="mx-auto text-yellow-500 mb-4" />
                    <h3 className="font-semibold text-lg">Top Rated</h3>
                    <p className="text-gray-500 mt-2">
                        Rated 5 stars by thousands of guests.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
                    <ShieldCheck size={40} className="mx-auto text-green-600 mb-4" />
                    <h3 className="font-semibold text-lg">Secure Payments</h3>
                    <p className="text-gray-500 mt-2">
                        100% secure payment with Razorpay.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
