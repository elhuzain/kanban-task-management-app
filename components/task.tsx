import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import StatusSelector from "./statusSelector";
import SubtaskCheckbox from "./subtaskCheckbox";

const Task = ({
    task
}: {
    task: Task
}) => {
    const { title, description } = task;

    const completedCount = task.subtasks.filter((subtask) => subtask.isCompleted).length;

    return (

        <Dialog>
            <DialogTrigger className="group hover:bg-card cursor-pointer bg-card p-5 flex flex-col items-start gap-2 h-fit rounded-sm w-full">
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

                    <StatusSelector label="Current Status" task={task} />

                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default Task;
