import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/use-auth";

export function ProfilePage() {
	const { user } = useAuth();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Profile</h1>
				<p className="text-muted-foreground">
					View and manage your account information
				</p>
			</div>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							User Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<div className="rounded-lg border p-4 space-y-2">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Email:</span>
									<span className="font-medium">{user?.email}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">User ID:</span>
									<span className="font-mono text-xs">{user?.id}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Created:</span>
									<span className="text-sm">
										{user?.created_at
											? new Date(user.created_at).toLocaleDateString("en-US", {
													day: "numeric",
													month: "long",
													year: "numeric",
												})
											: "N/A"}
									</span>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<h3 className="font-semibold">Supabase Environment</h3>
							<div className="rounded-lg border p-4">
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Connected to:</span>
									<span className="font-medium">
										{import.meta.env.VITE_SUPABASE_URL?.includes("localhost")
											? "🟢 Local"
											: "🔵 Remote"}
									</span>
								</div>
								<div className="text-xs text-muted-foreground mt-2 break-all">
									URL: {import.meta.env.VITE_SUPABASE_URL}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
