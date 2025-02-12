export const formatPathname = (name: string) => {
	const pathnameArray = name.split("-");
	return pathnameArray
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export function formatTimestamp(timestamp: number): string {
	const date = new Date(timestamp);
	const shortMonthsThai = [
		"ม.ค.",
		"ก.พ.",
		"มี.ค.",
		"เม.ย.",
		"พ.ค.",
		"มิ.ย.",
		"ก.ค.",
		"ส.ค.",
		"ก.ย.",
		"ต.ค.",
		"พ.ย.",
		"ธ.ค.",
	];

	// Pad single digit numbers with leading zeros
	const pad = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

	const day = pad(date.getDate());
	const month = shortMonthsThai[date.getMonth()];
	const year = date.getFullYear();
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	// Construct the formatted date-time string
	return `${day} ${month} ${hours}:${minutes}:${seconds}`;
}
