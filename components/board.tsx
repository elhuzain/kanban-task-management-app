"use client";

import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useContainer } from "@/providers/container";
import Column from "./column";
import AddColumnButton from "./addColumnButton";

const Board = () => {
    const { selectedBoard, boards, moveTask } = useContainer();

    if (!selectedBoard || boards.length === 0) {
        return <div>
            empty.
        </div>
    }

    const handleDragEnd = ({ draggableId, source, destination }: DropResult) => {
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        moveTask(draggableId, destination.droppableId, destination.index);
    };

    return <DragDropContext onDragEnd={handleDragEnd}>
        <div className="w-full h-full flex gap-6 bg-bg-deep p-6 overflow-auto">
            {
                selectedBoard.columns.map((column) => {
                    return <Column column={column} key={column.id} />
                })
            }
            <AddColumnButton />
        </div>
    </DragDropContext>
}

export default Board;
