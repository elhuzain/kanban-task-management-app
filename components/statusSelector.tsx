import { useContainer } from "@/providers/container";
import { Label } from "./ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

const StatusSelector = ({ label, task }: { label: string, task: Task }) => {
    const { setStatus } = useContainer();

    return (
        <Label className="flex flex-col gap-2 text-start items-start">
            <span className="text-white">{label}</span>
            <Select value={task.status.toLowerCase()} onValueChange={(value) => setStatus(task.id, value)}>
                <SelectTrigger className="w-full cursor-pointer hover:border-primary transition-colors duration-300">
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-0 rounded-sm p-2">
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                </SelectContent>
            </Select>
        </Label>
    )
}

export default StatusSelector;
