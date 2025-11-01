import { supabase } from "@/lib/supabase";
import type { CreateTodoInput, Todo, UpdateTodoInput } from "@/types/todos";

/**
 * Get all todos for the current user
 */
export async function getTodos(): Promise<Todo[]> {
	const { data, error } = await supabase
		.from("todos")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) throw error;
	return data || [];
}

/**
 * Create a new todo
 */
export async function createTodo(input: CreateTodoInput): Promise<Todo> {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) throw new Error("User not authenticated");

	const { data, error } = await supabase
		.from("todos")
		.insert({
			title: input.title,
			description: input.description,
			completed: input.completed,
			user_id: user.id,
		})
		.select()
		.single();

	if (error) throw error;
	return data;
}

/**
 * Update a todo
 */
export async function updateTodo(
	id: string,
	updates: UpdateTodoInput,
): Promise<Todo> {
	const { data, error } = await supabase
		.from("todos")
		.update(updates)
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;
	return data;
}

/**
 * Toggle todo completed status
 */
export async function toggleTodo(
	id: string,
	completed: boolean,
): Promise<Todo> {
	return updateTodo(id, { completed });
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string): Promise<void> {
	const { error } = await supabase.from("todos").delete().eq("id", id);

	if (error) throw error;
}
