"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Tabs = () => {
	const pathname = usePathname();
	const router = useRouter();
	return (
		<div className="flex gap-4 mt-2">
			<div
				className={`flex rounded-full px-4 py-2 font-semibold ${
					pathname === "/control-center"
						? "bg-[#292B99] text-white"
						: "bg-[#EFEFEF]"
				}`}
				onClick={() => router.push("/control-center")}
			>
				ไฟฟ้าอาคาร
			</div>
			<div
				className={`flex rounded-full px-4 py-2 cursor-pointer ${
					pathname === "/control-center/solar-cell"
						? "bg-[#292B99] text-white font-semibold"
						: "bg-[#EFEFEF] font-normal"
				}`}
				onClick={() => router.push("/control-center/solar-cell")}
			>
				โซลาร์เซลล์
			</div>
			<div
				className={`flex rounded-full px-4 py-2 cursor-pointer ${
					pathname === "/control-center/street-light"
						? "bg-[#292B99] text-white font-semibold"
						: "bg-[#EFEFEF] font-normal"
				}`}
				onClick={() => {}}
			>
				ไฟถนน
			</div>
			<div
				className={`flex rounded-full px-4 py-2 cursor-pointer ${
					pathname === "/control-center/water-pump"
						? "bg-[#292B99] text-white font-semibold"
						: "bg-[#EFEFEF] font-normal"
				}`}
				onClick={() => {}}
			>
				ปั้มน้ำ
			</div>
		</div>
	);
};

export default Tabs;
