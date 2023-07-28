import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getTodosByGroupedColumn() {
  try {
    let { data: todos, error } = await supabase.from("todos").select("*");

    if (error) throw error;

    // If todos exist, sort and then group them by status
    if (todos) {
      // Define the order of statuses
      const statusOrder = ["todo", "inprogress", "done"];

      // Sort todos based on the order of statuses
      todos.sort(
        (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
      );

      let groupedTodos = new Map();

      // Initialize an empty array for each status in groupedTodos
      statusOrder.forEach((status) => {
        groupedTodos.set(status, {
          id: status,
          todos: [],
        });
      });

      todos.forEach((todo) => {
        const key = todo.status;
        if (!groupedTodos.has(key)) {
          groupedTodos.set(key, {
            id: key,
            todos: [],
          });
        }
        groupedTodos.get(key).todos.push({
          $id: todo.id,
          created: todo.created_at,
          title: todo.todo,
          status: todo.status,
          ...(todo.image && { image: JSON.parse(todo.image) }),
        });
      });

      const board: Board = {
        columns: groupedTodos,
      };
      console.log(board);
      return board;
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}
