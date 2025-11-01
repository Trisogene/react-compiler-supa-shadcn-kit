import { supabase } from "../lib/supabase";

// Example: Sign up with email and password
export async function signUp(email: string, password: string) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) throw error;
	return data;
}

// Example: Sign in with email and password
export async function signIn(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) throw error;
	return data;
}

// Example: Sign out
export async function signOut() {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}

// Example: Get current user
export async function getCurrentUser() {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) throw error;
	return user;
}

// Example: Reset password
export async function resetPassword(email: string) {
	const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${window.location.origin}/reset-password`,
	});

	if (error) throw error;
	return data;
}

// Example: Update user profile
export async function updateProfile(updates: {
	full_name?: string;
	avatar_url?: string;
}) {
	const { data, error } = await supabase.auth.updateUser({
		data: updates,
	});

	if (error) throw error;
	return data;
}
