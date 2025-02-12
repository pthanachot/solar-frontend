"use client";

import { useCallback, useEffect, useState } from "react";
import useAxios from "./useAxios";

function useFetch<T>(url: string, initialParams?: any) {
	const [data, setData] = useState<T>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [params, setParams] = useState(initialParams);

	const { axiosInstance, status } = useAxios();

	const fetchData = useCallback(
		async (newParams?: any) => {
			if (status !== "authenticated") {
				setLoading(false); // Stop loading if unauthenticated
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const res = await axiosInstance.get(url, {
					params: newParams || params,
				});
				// Delay 3 seconds
				// await new Promise((resolve) => setTimeout(resolve, 3000));
				setData(res.data);
			} catch (error: any) {
				setError(error);
			} finally {
				setLoading(false);
			}
		},
		[axiosInstance, url, params, status]
	);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const refetchWithParams = (newParams: any) => {
		setParams(newParams);
		fetchData(newParams);
	};

	return { data, loading, error, refetch: fetchData, refetchWithParams };
}

export default useFetch;
