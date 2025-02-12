import SideBar from "@/components/sidebar/sideBar";
import { SessionProvider } from "next-auth/react";
import { auth } from "../auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();

	// if (!session || !session.user.name || !session.role) {
	// 	redirect("/login");
	// }
	return (
		<SessionProvider>
			<div className="flex">
				<SideBar />
				<div className="flex-1 px-12 py-8">{children}</div>
			</div>
		</SessionProvider>
	);
};

export default Layout;
