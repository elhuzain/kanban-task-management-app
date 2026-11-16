import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import SubtaskCheckbox from "./subtaskCheckbox";
import { useContainer } from "@/providers/container";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import TaskFormDialog from "./taskFormDialog";

const Task = ({
    task,
    dragHandleProps,
}: {
    task: Task
    /** When provided, renders a grip handle that starts the drag. */
    dragHandleProps?: DraggableProvidedDragHandleProps | null
}) => {
    const { title } = task;
    const { selectedBoard, setStatus, editTask, deleteTask } = useContainer();
    const columns = selectedBoard?.columns ?? [];

    const completedCount = task.subtasks.filter((subtask) => subtask.isCompleted).length;

    const [viewOpen, setViewOpen] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const openEdit = () => {
        setOptionsOpen(false);
        setViewOpen(false);
        setEditOpen(true);
    };

    const handleDelete = () => {
        setOptionsOpen(false);
        setViewOpen(false);
        deleteTask(task.id);
    };

    return (
        <>
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
            <div className="flex items-stretch bg-bg rounded-sm w-full">
                <DialogTrigger className="group cursor-pointer p-5 pr-2 flex flex-col items-start gap-2 h-fit flex-1 min-w-0 text-left">
                    <h3 className="text-text-title heading-m group-hover:text-primary transition-colors duration-300">{title}</h3>
                    <p className="text-text-secondary body-bold">{completedCount} of {task.subtasks.length} subtasks</p>
                </DialogTrigger>
                {dragHandleProps && (
                    <div
                        {...dragHandleProps}
                        aria-label={`Drag ${title}`}
                        className="flex items-center px-2 text-text-secondary hover:text-primary cursor-grab active:cursor-grabbing rounded-r-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        <GripVertical className="size-5" />
                    </div>
                )}
            </div>
            <DialogContent>
                <DialogHeader>
                    <div className="flex justify-between">
                        <DialogTitle>{title}</DialogTitle>
                        <Popover open={optionsOpen} onOpenChange={setOptionsOpen}>
                            <PopoverTrigger className="cursor-pointer px-2 -mr-2" aria-label="Task options">
                                <Image height="20" width="4" alt="" src="/icon-vertical-ellipsis.svg" />
                            </PopoverTrigger>
                            <PopoverContent align="end" sideOffset={16} className="w-48 bg-bg border-0 rounded-lg p-4 shadow-lg flex flex-col items-start gap-4">
                                <button type="button" onClick={openEdit} className="body text-text-secondary hover:text-text-title cursor-pointer transition-colors duration-300">
                                    Edit Task
                                </button>
                                <button type="button" onClick={handleDelete} className="body text-destructive hover:text-destructive-hover cursor-pointer transition-colors duration-300">
                                    Delete Task
                                </button>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <DialogDescription>
                        {task.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Label>
                        Subtasks ({completedCount} of {task.subtasks.length})
                    </Label>
                    <div className="space-y-2">
                        {
                            task.subtasks.map((subtask, index) => (
                                <SubtaskCheckbox subtask={subtask} taskId={task.id} key={index} />
                            ))
                        }
                    </div>
                </div>

                <Label>
                    <span>Current Status</span>

                    <Select value={task.status} onValueChange={(columnId) => setStatus(task.id, columnId)}>
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
            </DialogContent>
        </Dialog>

        <TaskFormDialog
            mode="edit"
            open={editOpen}
            onOpenChange={setEditOpen}
            initialValues={{
                title: task.title,
                description: task.description,
                status: task.status,
                subtasks: task.subtasks.map(({ id, title }) => ({ id, title })),
            }}
            onSubmit={(values) => editTask(task.id, values)}
        />
        </>
    )
}

export default Task;
