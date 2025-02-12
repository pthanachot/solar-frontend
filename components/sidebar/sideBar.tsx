"use client";

import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
	{
		href: "/dashboard",
		label: "แดชบอร์ด",
		defaultIcon: "/dashboard.svg",
		hoverIcon: "/dashboard-filled.svg",
	},
	{
		href: "/control-center",
		label: "ศูนย์ควบคุม",
		defaultIcon: "/control.svg",
		hoverIcon: "/control-filled.svg",
	},
	{
		href: "/reports",
		label: "รายงานแสดงผล",
		defaultIcon: "/report.svg",
		hoverIcon: "/report-filled.svg",
	},
	{
		href: "/settings",
		label: "การตั้งค่า",
		defaultIcon: "/setting.svg",
		hoverIcon: "/setting-filled.svg",
	},
	{
		href: "/users",
		label: "จัดการผู้ใช้งาน",
		defaultIcon: "/user.svg",
		hoverIcon: "/user-filled.svg",
	},
	{
		href: "/sign-out",
		label: "ออกจากระบบ",
		defaultIcon: "/sign-out.svg",
		hoverIcon: "/sign-out-filled.svg",
	},
];

const SideBar = () => {
	const { data: session } = useSession();
	const [hovered, setHovered] = useState<{ [key: string]: boolean }>({});
	const pathname = usePathname();

	const handleMouseEnter = (key: string) => {
		setHovered((prev) => ({ ...prev, [key]: true }));
	};

	const handleMouseLeave = (key: string) => {
		setHovered((prev) => ({ ...prev, [key]: false }));
	};

	return (
		<div className="flex flex-col justify-between h-screen  bg-[#F8F8F8]">
			<div className="flex flex-col px-[25px] py-8 border-b border-border">
				<Image src="/logo.png" alt="logo" width={220} height={44} />
			</div>
			<div className="flex flex-col flex-1 px-[25px] py-8 gap-3">
				{menuItems.map(({ href, label, defaultIcon, hoverIcon }) => {
					const isActive = pathname.startsWith(href); // Check if the current path starts with the link's href
					const isHovered = hovered[href] || isActive;

					return (
						<Link
							key={href}
							href={href}
							className={`flex gap-5 items-center p-[10px] text-base rounded-lg ${
								isActive
									? "bg-sidebar-hover text-sidebar-active font-medium"
									: "hover:bg-sidebar-hover hover:text-sidebar-active text-subtitle"
							}`}
							onMouseEnter={() => handleMouseEnter(href)}
							onMouseLeave={() => handleMouseLeave(href)}
						>
							<Image
								src={isHovered ? hoverIcon : defaultIcon}
								alt={label}
								width={24}
								height={24}
							/>
							<span>{label}</span>
						</Link>
					);
				})}
				{/* <Link
					href="/dashboard"
					className="flex gap-5 items-center p-[10px] rounded-lg hover:bg-sidebar-hover text-base text-subtitle hover:text-sidebar-active"
				>
					<Image src="/dashboard.svg" alt="dashboard" width={24} height={24} />
					<span>แดชบอร์ด</span>
				</Link> */}
			</div>
			<div className="flex flex-col">
				<div className="flex px-3 py-2 bg-white rounded-lg w-[90%] mx-auto mb-6 gap-3 sidebar-shadow">
					<div className="flex h-9 w-9 rounded-full bg-[#90B5D8] items-center justify-center text-white">
						<User />
					</div>
					<div className="flex flex-col">
						<div className="text-title text-sm">{session?.user?.name}</div>
						<div className="text-subtitle text-xs">{session?.role}</div>
					</div>
				</div>
				<div className="flex flex-col w-full items-center gap-2 px-[25px] py-8 border-t border-border">
					<div className="text-subtitle text-xs">Powered by</div>
					<Image src="/logo.png" alt="logo" width={202} height={40} />
				</div>
			</div>
		</div>
	);
};

export default SideBar;
