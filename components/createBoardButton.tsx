"use client";

import { useContainer } from "@/providers/container";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, type FormEvent } from "react";
import LabelledInput from "./labelledInput";
import Image from "next/image";

type ColumnDraft = { id: string; name: string };

const newColumn = (name = ""): ColumnDraft => ({ id: crypto.randomUUID(), name });

const defaultColumns = () => ["To do", "Doing", "Done"].map(newColumn);

const CreateBoardButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="text-primary flex gap-2 items-center -translate-x-6 p-6 py-2">
                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" fill="#828FA3" /></svg>                <span>+ Create New Board</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new board</DialogTitle>
                </DialogHeader>
                {/* Mounted only while open, so the form resets to its defaults on every open */}
                {open && <CreateBoardForm onDone={() => setOpen(false)} />}
            </DialogContent>
        </Dialog>
    )
}

const CreateBoardForm = ({ onDone }: { onDone: () => void }) => {
    const { createBoard } = useContainer();

    const [boardName, setBoardName] = useState("");
    const [columns, setColumns] = useState<ColumnDraft[]>(defaultColumns);
    const [lastAddedId, setLastAddedId] = useState<string | null>(null);

    const canSubmit = boardName.trim() !== "";

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) return;

        // Column names double as ids, so drop blanks and case-insensitive duplicates
        const seen = new Set<string>();
        const columnNames = columns
            .map((column) => column.name.trim())
            .filter((name) => {
                const key = name.toLowerCase();
                if (name === "" || seen.has(key)) return false;
                seen.add(key);
                return true;
            });

        createBoard(boardName.trim(), columnNames);
        onDone();
    };

    const addColumn = () => {
        const column = newColumn();
        setColumns((prev) => [...prev, column]);
        setLastAddedId(column.id);
    };

    const updateColumn = (id: string, name: string) => {
        setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
    };

    const removeColumn = (id: string) => {
        setColumns((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} className="contents">
            <LabelledInput name="board-name" placeholder="e.g. Web Design" label="Board Name" value={boardName} onChange={(e) => setBoardName(e.target.value)} />

            <div className="flex flex-col gap-2">
                <span id="columns-label" className="text-sm leading-none font-medium text-text-secondary dark:text-text-primary">Columns (Optional)</span>
                <ul aria-labelledby="columns-label" className="flex flex-col gap-3">
                    {columns.map((column, index) => (
                        <li key={column.id} className="flex items-center gap-4 w-full">
                            <Input
                                aria-label={`Column ${index + 1}`}
                                placeholder="e.g. Todo"
                                value={column.name}
                                onChange={(e) => updateColumn(column.id, e.target.value)}
                                autoFocus={column.id === lastAddedId}
                            />
                            <button
                                type="button"
                                className="cursor-pointer"
                                onClick={() => removeColumn(column.id)}
                            >
                                <Image height="14" width="14" alt={`Delete column ${index + 1}`} src="/icon-cross.svg" />
                            </button>
                        </li>
                    ))}
                </ul>
                <Button type="button" variant="secondary" className="w-full" onClick={addColumn}>
                    + Add Column
                </Button>
            </div>

            <DialogFooter className="flex-col sm:flex-col gap-2">
                <Button type="submit" className="w-full" disabled={!canSubmit}>
                    Create
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="secondary" className="w-full">
                        Cancel
                    </Button>
                </DialogClose>
            </DialogFooter>
        </form>
    )
}

export default CreateBoardButton;
