"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useContainer } from "@/providers/container";

type SubtaskDraft = { id: string; title: string };

const newSubtask = (): SubtaskDraft => ({ id: crypto.randomUUID(), title: "" });

const AddTaskButton = () => {
    const { selectedBoard, createTask } = useContainer();
    const columns = selectedBoard?.columns ?? [];

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [subtasks, setSubtasks] = useState<SubtaskDraft[]>(() => [newSubtask(), newSubtask()]);
    const [lastAddedId, setLastAddedId] = useState<string | null>(null);

    const canSubmit = selectedBoard !== undefined && title.trim() !== "";

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setStatus("");
        setSubtasks([newSubtask(), newSubtask()]);
        setLastAddedId(null);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedBoard || !canSubmit) return;

        const subtaskTitles = subtasks
            .map((subtask) => subtask.title.trim())
            .filter((subtaskTitle) => subtaskTitle !== "");

        createTask(selectedBoard.id, title.trim(), description.trim(), status || undefined, subtaskTitles);
        handleOpenChange(false);
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

    return <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger className={buttonVariants({ variant: "default" })}>+ Add New Task</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="contents">
                <Label>
                    <span>title</span>
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
                        placeholder="e.g, Take coffee break"
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
                                    placeholder="e.g, Take coffee break"
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

                <Button type="submit" disabled={!canSubmit}>Create Task</Button>
            </form>
        </DialogContent>
    </Dialog>
}

export default AddTaskButton;
