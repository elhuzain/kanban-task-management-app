import Task from "./task"

const Column = ({ column }: { column: Column }) => {
    return <div>
        <h2>{column.name}</h2>
        <div>
            {column.tasks.map((task) => (<Task key={task.id} task={task} />))}
        </div>
    </div>
}