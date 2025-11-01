import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/hooks/use-auth";
import type { Todo } from "@/types/todos";
import * as todosService from "./todos-service";

export function TodoList() {
	const { user } = useAuth();
	const [newTodo, setNewTodo] = useState({ title: "", description: "" });
	const [todos, setTodos] = useState<Todo[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);

	const loadTodos = async () => {
		try {
			setIsLoading(true);
			const data = await todosService.getTodos();
			setTodos(data);
		} catch (error) {
			console.error("Error loading todos:", error);
			toast.error("Failed to load todos");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!user) {
			setTodos([]);
			setIsLoading(false);
			return;
		}

		loadTodos();
	}, [user]);

	const handleAddTodo = async () => {
		if (!user || !newTodo.title.trim()) {
			toast.error("Title is required");
			return;
		}

		try {
			setIsCreating(true);
			const created = await todosService.createTodo({
				title: newTodo.title,
				description: newTodo.description || null,
			});

			setTodos((prev) => [created, ...prev]);
			setNewTodo({ title: "", description: "" });
			toast.success("Todo added!");
		} catch (error) {
			console.error("Error adding todo:", error);
			toast.error("Failed to add todo");
		} finally {
			setIsCreating(false);
		}
	};

	const handleToggleTodo = async (id: string, completed: boolean) => {
		try {
			const updated = await todosService.toggleTodo(id, completed);
			setTodos((prev) => prev.map((todo) => (todo.id === id ? updated : todo)));
		} catch (error) {
			console.error("Error toggling todo:", error);
			toast.error("Failed to update todo");
		}
	};

	const handleDeleteTodo = async (id: string) => {
		try {
			await todosService.deleteTodo(id);
			setTodos((prev) => prev.filter((todo) => todo.id !== id));
			toast.success("Todo deleted!");
		} catch (error) {
			console.error("Error deleting todo:", error);
			toast.error("Failed to delete todo");
		}
	};

	if (!user) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Todos</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Please log in to view your todos
					</p>
				</CardContent>
			</Card>
		);
	}

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Todos</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Loading...</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Add Todo</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Input
						placeholder="Todo title"
						value={newTodo.title}
						onChange={(e) =>
							setNewTodo((prev) => ({ ...prev, title: e.target.value }))
						}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleAddTodo();
							}
						}}
					/>
					<Textarea
						placeholder="Description (optional)"
						value={newTodo.description}
						onChange={(e) =>
							setNewTodo((prev) => ({ ...prev, description: e.target.value }))
						}
						rows={3}
					/>
					<Button
						onClick={handleAddTodo}
						disabled={isCreating}
						className="w-full"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Todo
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>My Todos ({todos.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{todos.length === 0 ? (
						<p className="text-muted-foreground text-center py-8">
							No todos yet. Add one!
						</p>
					) : (
						<div className="space-y-3">
							{todos.map((todo) => (
								<div
									key={todo.id}
									className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
								>
									<Checkbox
										checked={todo.completed}
										onCheckedChange={() =>
											handleToggleTodo(todo.id, todo.completed)
										}
										className="mt-1"
									/>
									<div className="flex-1 min-w-0">
										<h3
											className={`font-medium ${
												todo.completed
													? "line-through text-muted-foreground"
													: ""
											}`}
										>
											{todo.title}
										</h3>
										{todo.description && (
											<p
												className={`text-sm mt-1 ${
													todo.completed
														? "line-through text-muted-foreground"
														: "text-muted-foreground"
												}`}
											>
												{todo.description}
											</p>
										)}
										<p className="text-xs text-muted-foreground mt-1">
											{new Date(todo.created_at).toLocaleDateString("en-US", {
												day: "numeric",
												month: "short",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleDeleteTodo(todo.id)}
										className="text-destructive hover:text-destructive hover:bg-destructive/10"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
