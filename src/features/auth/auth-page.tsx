import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth";

export function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			if (isLogin) {
				await signIn(email, password);
				setSuccess("Login effettuato con successo!");
			} else {
				await signUp(email, password);
				setSuccess(
					"Registrazione completata! Controlla la tua email per confermare l'account.",
				);
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Si è verificato un errore",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>{isLogin ? "Accedi" : "Registrati"}</CardTitle>
					<CardDescription>
						{isLogin
							? "Inserisci le tue credenziali per accedere"
							: "Crea un nuovo account"}
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{success && (
							<Alert>
								<AlertDescription>{success}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="nome@esempio.it"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={loading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={loading}
								minLength={6}
							/>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Caricamento...
								</>
							) : isLogin ? (
								"Accedi"
							) : (
								"Registrati"
							)}
						</Button>

						<Button
							type="button"
							variant="link"
							className="w-full"
							onClick={() => {
								setIsLogin(!isLogin);
								setError(null);
								setSuccess(null);
							}}
							disabled={loading}
						>
							{isLogin
								? "Non hai un account? Registrati"
								: "Hai già un account? Accedi"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
