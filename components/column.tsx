import Task from "./task"

const Column = ({ column }: { column: Column }) => {
    return <div className="min-w-[280px] max-w-[280px] space-y-6">
        <h2>{column.name}</h2>
        <div className="flex flex-col gap-4">
            {column.tasks.map((task) => (<Task key={task.id} task={task} />))}
        </div>
    </div>
}

export default Column;