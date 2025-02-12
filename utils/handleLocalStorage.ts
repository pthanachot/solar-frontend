"use client";

// Save data to localStorage
export function saveDataToLocalStorage(key: string, data: any) {
	if (typeof window !== "undefined") {
		const serializedData = JSON.stringify(data);
		localStorage.setItem(key, serializedData);
	}
}

// Retrieve data from localStorage
export function getDataFromLocalStorage(key: string) {
	if (typeof window !== "undefined") {
		const serializedData = localStorage.getItem(key);
		if (!serializedData) {
			return null;
		}
		return JSON.parse(serializedData);
	}
	return null;
}

// Remove data from localStorage
export function removeDataInLocalStorage(key: string) {
	if (typeof window !== "undefined") {
		localStorage.removeItem(key);
	}
}
