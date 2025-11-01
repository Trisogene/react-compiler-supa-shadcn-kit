import { CheckSquare, LogOut, Menu, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { signOut } from "@/lib/auth";
import { useAuth } from "@/lib/hooks/use-auth";
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

export function AppTopbar() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOut();
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	const handleProfile = () => {
		navigate("/profile");
	};

	const getInitials = (email?: string) => {
		if (!email) return "U";
		return email.charAt(0).toUpperCase();
	};

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-background">
				<div className="flex h-full items-center justify-between px-4 md:px-6 md:pl-20">
					{/* Left side - Mobile menu + Title */}
					<div className="flex items-center gap-4">
						{/* Mobile menu button */}
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={() => setMobileMenuOpen(true)}
						>
							<Menu className="h-5 w-5" />
							<span className="sr-only">Open menu</span>
						</Button>

						<h2 className="text-lg font-semibold">
							{/* Page title will go here */}
						</h2>
					</div>

					{/* Right side - User menu */}
					<div className="flex items-center gap-4">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<Avatar className="h-8 w-8">
										<AvatarFallback className="bg-primary text-primary-foreground">
											{getInitials(user?.email)}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">Account</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user?.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleProfile}>
									<User className="mr-2 h-4 w-4" />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleSignOut}>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			{/* Mobile Navigation Sheet */}
			<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
				<SheetContent side="left" className="w-64">
					<SheetHeader>
						<SheetTitle>Navigation</SheetTitle>
					</SheetHeader>
					<nav className="mt-6">
						<div className="space-y-1">
							{navItems.map((item) => {
								const isActive = location.pathname === item.path;
								const Icon = item.icon;

								return (
									<Link
										key={item.path}
										to={item.path}
										onClick={() => setMobileMenuOpen(false)}
										className={cn(
											"flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
											isActive
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
										)}
									>
										<Icon className="h-5 w-5 shrink-0" />
										<span className="text-sm font-medium">{item.title}</span>
									</Link>
								);
							})}
						</div>
					</nav>
				</SheetContent>
			</Sheet>
		</>
	);
}
