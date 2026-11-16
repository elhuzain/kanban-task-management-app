'use client';
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useContainer } from "@/providers/container";

const SubtaskCheckbox = ({ subtask, taskId }: { subtask: SubTask, taskId: string }) => {
    const { checkSubtask } = useContainer();

    const { isCompleted, title } = subtask;

    const CheckedStyle = isCompleted ? "line-through text-text-title/50" : "";
    return (
        <Label className="flex flex-row! items-center gap-4 bg-bg-deep p-4 rounded-sm group hover:bg-primary/20">
            <Checkbox checked={isCompleted} onCheckedChange={() => checkSubtask(taskId, subtask.id, !isCompleted)} className="bg-bg h-4 w-4 border-2 border-lines" />
            <span className={`text-text-title body-bold ${CheckedStyle}`}>
                {title}
            </span>
        </Label>
    );
};

export default SubtaskCheckbox;
