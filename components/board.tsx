"use client";

import { useContainer } from "@/providers/container";
import Column from "./column";
import CreateBoardButton from "./createBoardButton";
import AddColumnButton from "./addColumnButton";

const Board = () => {
    const { selectedBoard, boards } = useContainer();

    if (!selectedBoard || boards.length === 0) {
        return <div>
            empty.
        </div>
    }


    return <div className="w-full h-full flex gap-6 bg-bg-deep p-6 overflow-auto">
        {
            selectedBoard.columns.map((column) => {
                return <Column column={column} key={column.id} />
            })
        }
        <AddColumnButton />
    </div>
}

export default Board;