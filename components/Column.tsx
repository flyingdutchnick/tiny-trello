  import { PlusCircleIcon } from '@heroicons/react/24/solid';
  import React from 'react';
  import { Droppable, Draggable } from 'react-beautiful-dnd';
  import TodoCard from './TodoCard';
  import { useBoardStore } from '@/store/BoardStore';
  import { useModalStore } from '@/store/ModalStore';

  interface ColumnProps {
    id: TypedColumn;
    index: number;
    todos: Todo[];
  }

  const idToColumn:{
    [key in TypedColumn]: string;
  } = {
    todo: "To do",
    inprogress: "In progress",
    done: "Done"
  };

  function Column({ id, todos, index }: ColumnProps) {
    const [searchString, setNewTaskType] = useBoardStore((state) => [state.searchString, state.setNewTaskType])
    const [ openModal ] = useModalStore((state) => [state.openModal])

    const handleAddToDo = () => {
      setNewTaskType(id)
      openModal();
    }

    return (
      <Draggable draggableId={id.toString()} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {/* Droppable area that can be dropped into */}
              <Droppable droppableId={index.toString()} type="card">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-2 rounded-2xl shadow-sm ${
                      snapshot.isDraggingOver ? "bg-green-200" :
                      "bg-white/50"
                    }`}
                  >
                    <h2 className="flex justify-between font-bold text-xl p-2">{idToColumn[id]}
                    <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal">
                      {!searchString
                      ? todos.length
                      : todos.filter((todo) => todo.title.toLowerCase().includes(searchString.toLowerCase())).length
                      }
                      </span>
                    </h2>
                    <div className="space-y-2">
                      {todos.map((todo, index) => {
                        if (
                          searchString &&
                          !todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                            ) return null;
                        return (
                        <Draggable
                        key={todo.$id.toString()}
                        draggableId={todo.$id.toString()}
                        index={index}
                        >
                          {(provided)=> (
                            <TodoCard
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                            />
                          )}
                        </Draggable>
                      )}
                      )}
                      {provided.placeholder}
                      <div className="flex items-end justify-end p-2">
                        <button
                          onClick={handleAddToDo}
                          className="text-green-500 hover:text-green-600">
                          <PlusCircleIcon className="h-10 w-10" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
              </div>
            // )}
            // {provided.placeholder}

        )}
      </Draggable>
    );
  }

  export default Column;
