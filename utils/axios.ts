import axios from "axios";

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	headers: { "Content-Type": "application/json" },
	httpsAgent: new (require("https").Agent)({
		rejectUnauthorized: process.env.DISABLE_SSL_VERIFICATION === "true",
	}),
});

export default axiosInstance;
