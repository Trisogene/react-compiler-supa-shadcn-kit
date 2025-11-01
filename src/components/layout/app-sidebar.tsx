import { CheckSquare, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	path: string;
}

const navItems: NavItem[] = [
	{
		title: "Todos",
		icon: CheckSquare,
		path: "/todos",
	},
	{
		title: "Profile",
		icon: User,
		path: "/profile",
	},
];

export function AppSidebar() {
	const [isExpanded, setIsExpanded] = useState(false);
	const location = useLocation();

	return (
		<aside
			className={cn(
				// Desktop: narrow sidebar that expands on hover
				"fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300 ease-in-out z-40 overflow-hidden",
				// Mobile: hidden by default
				"hidden md:block",
				isExpanded ? "w-64" : "w-16",
			)}
			onMouseEnter={() => setIsExpanded(true)}
			onMouseLeave={() => setIsExpanded(false)}
		>
			{/* Navigation */}
			<nav className="flex-1 overflow-y-auto p-2 overflow-hidden">
				<div className="space-y-1 overflow-hidden">
					{navItems.map((item) => {
						const isActive = location.pathname === item.path;
						const Icon = item.icon;

						return (
							<Link
								key={item.path}
								to={item.path}
								className={cn(
									"flex  gap-3 rounded-md px-3 py-2 transition-colors",
									isActive
										? "bg-accent text-accent-foreground"
										: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
									!isExpanded && "",
								)}
								title={!isExpanded ? item.title : undefined}
							>
								<Icon className="h-5 w-5 shrink-0" />
								{isExpanded && (
									<span className="flex-1 text-sm font-medium">
										{item.title}
									</span>
								)}
							</Link>
						);
					})}
				</div>
			</nav>
		</aside>
	);
}
