import "./App.css";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useNavigate,
} from "react-router-dom";
import { AuthPage } from "@/features/auth";
import { DashboardLayout } from "@/features/dashboard";
import { ProfilePage } from "@/features/profile";
import { TodosPage } from "@/features/todos";
import { useAuth } from "@/lib/hooks/use-auth";
import { ThemeProvider } from "./components/theme-provider/theme-provider";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !user) {
			navigate("/auth", { replace: true });
		}
	}, [user, loading, navigate]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return user ? children : null;
}

function App() {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<ThemeProvider defaultTheme="dark">
			<BrowserRouter>
				<Routes>
					<Route
						path="/auth"
						element={user ? <Navigate to="/todos" replace /> : <AuthPage />}
					/>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<DashboardLayout />
							</ProtectedRoute>
						}
					>
						<Route index element={<Navigate to="/todos" replace />} />
						<Route path="todos" element={<TodosPage />} />
						<Route path="profile" element={<ProfilePage />} />
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
