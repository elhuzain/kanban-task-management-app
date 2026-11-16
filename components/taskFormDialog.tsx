"use client";

import Image from "next/image";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useContainer } from "@/providers/container";

/** A subtask row in the form. `id` matches an existing subtask when editing. */
export type SubtaskDraft = { id: string; title: string };

export type TaskFormValues = {
    title: string;
    description: string;
    status: string;
    subtasks: SubtaskDraft[];
};

const newSubtask = (): SubtaskDraft => ({ id: crypto.randomUUID(), title: "" });

const emptyValues = (): TaskFormValues => ({
    title: "",
    description: "",
    status: "",
    subtasks: [newSubtask(), newSubtask()],
});

type TaskFormDialogProps = {
    mode: "add" | "edit";
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Pre-filled values (edit mode). Read each time the dialog opens. */
    initialValues?: TaskFormValues;
    onSubmit: (values: TaskFormValues) => void;
    /** Optional trigger element; omit when opening the dialog programmatically. */
    trigger?: ReactNode;
};

const TaskFormDialog = ({ mode, open, onOpenChange, initialValues, onSubmit, trigger }: TaskFormDialogProps) => {
    const { selectedBoard } = useContainer();
    const columns = selectedBoard?.columns ?? [];

    return <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{mode === "add" ? "Add New Task" : "Edit Task"}</DialogTitle>
            </DialogHeader>
            {/* Mounted only while open, so the form re-initialises from `initialValues` on every open */}
            {open && (
                <TaskForm
                    mode={mode}
                    columns={columns}
                    initialValues={initialValues ?? emptyValues()}
                    onSubmit={(values) => {
                        onSubmit(values);
                        onOpenChange(false);
                    }}
                />
            )}
        </DialogContent>
    </Dialog>
}

const TaskForm = ({
    mode,
    columns,
    initialValues,
    onSubmit,
}: {
    mode: "add" | "edit";
    columns: Column[];
    initialValues: TaskFormValues;
    onSubmit: (values: TaskFormValues) => void;
}) => {
    const [title, setTitle] = useState(initialValues.title);
    const [description, setDescription] = useState(initialValues.description);
    const [status, setStatus] = useState(initialValues.status);
    const [subtasks, setSubtasks] = useState<SubtaskDraft[]>(initialValues.subtasks);
    const [lastAddedId, setLastAddedId] = useState<string | null>(null);

    const canSubmit = title.trim() !== "";

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) return;

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            status,
            subtasks: subtasks
                .map((subtask) => ({ ...subtask, title: subtask.title.trim() }))
                .filter((subtask) => subtask.title !== ""),
        });
    };

    const addSubtask = () => {
        const subtask = newSubtask();
        setSubtasks((prev) => [...prev, subtask]);
        setLastAddedId(subtask.id);
    };

    const updateSubtask = (id: string, title: string) => {
        setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
    };

    const removeSubtask = (id: string) => {
        setSubtasks((prev) => prev.filter((s) => s.id !== id));
    };

    return <form onSubmit={handleSubmit} className="contents">
        <Label>
            <span>Title</span>
            <Input
                placeholder="e.g, Take coffee break"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
        </Label>

        <Label>
            <span>Description</span>
            <Textarea
                placeholder="e.g, It's always good to take a break. This 15 minute break will recharge the batteries a little."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </Label>

        <div className="flex flex-col gap-2">
            <span id="subtasks-label" className="text-sm leading-none font-medium text-text-secondary dark:text-text-primary">Subtasks</span>
            <ul aria-labelledby="subtasks-label" className="flex flex-col gap-3">
                {subtasks.map((subtask, index) => (
                    <li key={subtask.id} className="flex items-center gap-4 w-full">
                        <Input
                            aria-label={`Subtask ${index + 1}`}
                            placeholder="e.g, Make coffee"
                            value={subtask.title}
                            onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                            autoFocus={subtask.id === lastAddedId}
                        />
                        <button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => removeSubtask(subtask.id)}
                        >
                            <Image height="14" width="14" alt={`Delete subtask ${index + 1}`} src="/icon-cross.svg" />
                        </button>
                    </li>
                ))}
            </ul>
            <Button type="button" variant="secondary" className="w-full" onClick={addSubtask}>
                + Add New Subtask
            </Button>
        </div>

        <Label>
            <span>Status</span>

            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full cursor-pointer hover:border-primary transition-colors duration-300">
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-0 rounded-sm p-2">
                    {columns.map((column) => (
                        <SelectItem key={column.id} value={column.id}>{column.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Label>

        <Button type="submit" disabled={!canSubmit}>{mode === "add" ? "Create Task" : "Save Changes"}</Button>
    </form>
}

export default TaskFormDialog;
