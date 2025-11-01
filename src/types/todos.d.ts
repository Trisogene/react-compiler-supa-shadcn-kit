export type Todo = Database["public"]["Tables"]["todos"]["Row"];
export type CreateTodoInput = Omit<
	Database["public"]["Tables"]["todos"]["Insert"],
	"user_id"
>;
export type UpdateTodoInput = Database["public"]["Tables"]["todos"]["Update"];
