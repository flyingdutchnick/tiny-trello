import { getTodosByGroupedColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { supabase } from "@/supabase";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  newTaskInput: string;
  newTaskType: TypedColumn;
  image: File | null;

  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;

  setNewTaskType: (columnId: TypedColumn) => void;
  setNewTaskInput: (input: string) => void;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: { columns: new Map<TypedColumn, Column>() },
  searchString: "",
  newTaskInput: "",
  newTaskType: "todo",

  image: null,

  setSearchString: (searchString) => set({ searchString }),

  getBoard: async () => {
    const board = await getTodosByGroupedColumn();
    set({ board });
  },
  setBoardState: (board) => set({ board }),

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

  setImage: (image: File | null) => set({ image }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    if (todo.image) {
      await supabase.storage.from("images").remove([todo.image.fileId]);
    }

    // Delete the task from the todos table
    const { error: deleteError } = await supabase
      .from("todos")
      .delete()
      .eq("id", todo.$id);

    if (deleteError) {
      console.error("Error deleting task:", deleteError);
    }
  },

  updateTodoInDB: async (todo, columnId) => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .update({
          todo: todo.title,
          status: columnId,
        })
        .eq("id", todo.$id);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error updating todo:", error);
      // Handle the error appropriately in your app
    }
  },

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    if (image) {
      try {
        const fileUploaded = await uploadImage(image);
        if (fileUploaded) {
          file = {
            bucketId: "images",
            fileId: fileUploaded.path,
          };
        } else {
          throw new Error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    const { data, error } =  await supabase
    .from("todos")
    .insert({
      todo: todo,
      status: columnId,
      // include image if it exists
      ...(file && {image: JSON.stringify(file)})
    })
    .select()

    if (error) {
      console.error('Error:', error)
      return
    }

    const newId = data[0].id.toString()

    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id: newId,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && {image: file}),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        }
      }
    })
  }
}));
