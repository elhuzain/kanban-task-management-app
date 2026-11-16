import { Draggable, Droppable } from "@hello-pangea/dnd";
import Task from "./task"

const Column = ({ column }: { column: Column }) => {
    return <div className="min-w-[280px] max-w-[280px] flex flex-col gap-6">
        <h2>{column.name}</h2>
        <Droppable droppableId={column.id}>
            {(droppableProvided, droppableSnapshot) => (
                <div
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                    className={`flex flex-col flex-1 min-h-24 rounded-sm transition-colors duration-200 ${droppableSnapshot.isDraggingOver ? "bg-lines/40" : ""}`}
                >
                    {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(draggableProvided, draggableSnapshot) => (
                                <div
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.draggableProps}
                                    // Spacing via padding (not gap/margin) so the library measures it correctly
                                    className="pb-4"
                                >
                                    <div className={draggableSnapshot.isDragging ? "rotate-2 shadow-lg rounded-sm" : ""}>
                                        <Task task={task} dragHandleProps={draggableProvided.dragHandleProps} />
                                    </div>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                </div>
            )}
        </Droppable>
    </div>
}

export default Column;
