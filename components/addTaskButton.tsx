"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import TaskFormDialog from "./taskFormDialog";
import { useContainer } from "@/providers/container";

const AddTaskButton = () => {
    const { selectedBoard, createTask } = useContainer();
    const [open, setOpen] = useState(false);

    return <TaskFormDialog
        mode="add"
        open={open}
        onOpenChange={setOpen}
        trigger={<Button disabled={!selectedBoard}>+ Add New Task</Button>}
        onSubmit={({ title, description, status, subtasks }) => {
            if (!selectedBoard) return;
            createTask(selectedBoard.id, title, description, status || undefined, subtasks.map((s) => s.title));
        }}
    />
}

export default AddTaskButton;
