import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const NotoSansThai = Noto_Sans_Thai({
	variable: "--font-NotoSansThai",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ระบบจัดการอาคาร | เทศบาลตำบลบ้านเพ",
	description: "ระบบจัดการอาคารทศบาลตำบลบ้านเพ",
	icons: {
		icon: "/icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${NotoSansThai.variable} antialiased`}>{children}</body>
		</html>
	);
}
