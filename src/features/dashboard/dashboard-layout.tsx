import { Outlet } from "react-router-dom";
import { AppSidebar, AppTopbar } from "@/components/layout";

export function DashboardLayout() {
	return (
		<div className="min-h-screen">
			<AppTopbar />
			<AppSidebar />
			<main className="pt-16 md:pl-16">
				<div className="container max-w-7xl p-4 md:p-6 mx-auto">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
