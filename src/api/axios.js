
import axios from "axios";

const API = axios.create({
    baseURL: "https://mern-hotel-booking-system-backend.onrender.com/api",
});

export default API;
