"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import TaskFormDialog from "./taskFormDialog";
import { useContainer } from "@/providers/container";
import Image from "next/image";

const AddTaskButton = () => {
    const { selectedBoard, createTask } = useContainer();
    const [open, setOpen] = useState(false);

    return <TaskFormDialog
        mode="add"
        open={open}
        onOpenChange={setOpen}
        trigger={<Button disabled={!selectedBoard}><Image width={12} className="sm:hidden" height={12} src="/icon-add-task-mobile.svg" alt="+ Add New Task" /> <span className="sr-only sm:not-sr-only">+ Add New Task</span></Button>}
        onSubmit={({ title, description, status, subtasks }) => {
            if (!selectedBoard) return;
            createTask(selectedBoard.id, title, description, status || undefined, subtasks.map((s) => s.title));
        }}
    />
}

export default AddTaskButton;
