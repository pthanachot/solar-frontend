"use client";

import axios, { AxiosResponse } from "axios";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useRefreshToken from "./useRefreshToken";
import axiosInstance from "@/utils/axios";
type RetryRequestFunction = (() => Promise<AxiosResponse<any, any>>) | null;

const useAxios = () => {
	const { data: session, status } = useSession();
	const refreshToken = useRefreshToken();
	const [retryOriginalRequest, setRetryOriginalRequest] =
		useState<RetryRequestFunction>(null); // Store the original request for retry

	useEffect(() => {
		if (status !== "authenticated") return;
		const requestIntercept = axiosInstance.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${session.accessToken}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseIntercept = axiosInstance.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error.config;
				console.log("come here - 77778");
				// Check if the error status is 401 (unauthorized) and the request has not been retried yet
				if (error.response?.status === 401 && !prevRequest._retry) {
					prevRequest._retry = true;

					try {
						const res = await refreshToken();
						console.log("res: ", res);
						if (res.accessToken) {
							console.log("come here - 555");
							prevRequest.headers[
								"Authorization"
							] = `Bearer ${res.accessToken}`;
							setRetryOriginalRequest(() => () => axiosInstance(prevRequest)); // Store the request for retry
							return axiosInstance(prevRequest); // Retry the original request
						}
					} catch (err) {
						if (axios.isAxiosError(err) && err.response?.status !== 200) {
							console.error("Refresh token expired, signing out...");
							await signOut(); // Sign out and clear session
						}
						return Promise.reject(err); // Propagate the error to be caught in the calling function
					}
				}

				return Promise.reject(error);
			}
		);

		// Retry the original request if it was stored
		if (retryOriginalRequest) {
			retryOriginalRequest();
			setRetryOriginalRequest(null);
		}

		return () => {
			axiosInstance.interceptors.request.eject(requestIntercept);
			axiosInstance.interceptors.response.eject(responseIntercept);
		};
	}, [session, status, refreshToken, retryOriginalRequest]);

	return { axiosInstance, status };
};

export default useAxios;
