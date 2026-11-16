import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import SubtaskCheckbox from "./subtaskCheckbox";
import { useContainer } from "@/providers/container";

const Task = ({
    task
}: {
    task: Task
}) => {
    const { title } = task;
    const { selectedBoard, setStatus } = useContainer();
    const columns = selectedBoard?.columns ?? [];

    const completedCount = task.subtasks.filter((subtask) => subtask.isCompleted).length;

    return (

        <Dialog>
            <DialogTrigger className="group cursor-pointer bg-bg p-5 flex flex-col items-start gap-2 h-fit rounded-sm w-full">
                <h3 className="text-text-title heading-m group-hover:text-primary transition-colors duration-300">{title}</h3>
                <p className="text-text-secondary body-bold">{completedCount} of {task.subtasks.length} subtasks</p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {task.description}
                    </DialogDescription>

                    <div className="space-y-4">
                        <Label>
                            Subtasks (2 of 3)
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

                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default Task;
