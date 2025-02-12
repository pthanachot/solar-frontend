"use client";

import axiosInstance from "@/utils/axios";
import { useSession } from "next-auth/react";

const useRefreshToken = () => {
	const { data: session, update } = useSession();

	const refreshToken = async () => {
		if (!session?.refreshToken) {
			throw new Error("No refresh token available");
		}
		console.log("come here - 123");
		const { data } = await axiosInstance.post(
			"/user/refresh-token",
			{
				refreshToken: session?.refreshToken,
			},
			{
				headers: {
					Authorization: `Bearer ${session?.accessToken}`,
				},
			}
		);

		console.log("data: ", data);
		console.log("session: ", session);

		if (session) {
			// Update session with new access and refresh tokens
			console.log("data2: ", data);
			await update({
				...session,
				accessToken: data.data.accessToken,
				refreshToken: data.data.refreshToken,
			});
		}

		return data;
	};

	return refreshToken;
};

export default useRefreshToken;
