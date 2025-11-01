import { TodoList } from "@/features/todos";

export function TodosPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Todos</h1>
				<p className="text-muted-foreground">
					Manage your tasks and stay organized
				</p>
			</div>

			<TodoList />
		</div>
	);
}
