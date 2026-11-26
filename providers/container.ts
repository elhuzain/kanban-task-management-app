'use client';
import { createContext, createElement, useContext, useState, type ReactNode } from "react";

type ContainerContextValue = {
    boards: Board[];
    /** All tasks across every board and column (flattened, read-only view). */
    tasks: Task[];
    /** The currently selected board, or undefined if none is selected. */
    selectedBoard: Board | undefined;
    selectBoard: (boardId: string) => void;
    createBoard: (name: string, columnNames?: string[]) => void;
    addColumn: (boardId: string, name: string) => void;
    createTask: (boardId: string, title: string, description: string, status?: string, subtaskTitles?: string[]) => void;
    setStatus: (taskId: string, newStatus: string) => void;
    /** Moves a task to `destinationColumnId` at `destinationIndex` (used by drag and drop). */
    moveTask: (taskId: string, destinationColumnId: string, destinationIndex: number) => void;
    /** Updates a task's fields. Subtasks are matched by id so existing ones keep their completion state. */
    editTask: (taskId: string, changes: { title: string; description: string; status: string; subtasks: { id: string; title: string }[] }) => void;
    deleteTask: (taskId: string) => void;
    addSubtask: (taskId: string, subtaskTitle: string) => void;
    checkSubtask: (taskId: string, subtaskId: string, isCompleted: boolean) => void;
    isSidebarVisible: boolean;
    hideSidebar: () => void;
    showSidebar: () => void;
};

const generateId = () => crypto.randomUUID();

/** Column ids double as task statuses, e.g. "In Progress" -> "in-progress". */
const toColumnId = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "-");

const initialBoards: Board[] = [
    {
        id: "1",
        name: "Platform Launch",
        columns: [
            {
                id: "todo",
                name: "Todo",
                tasks: [
                    {
                        id: "1",
                        title: "Task 1",
                        description: "Description for Task 1",
                        status: "todo",
                        subtasks: [
                            { id: "1", title: "Subtask 1.1", isCompleted: false },
                            { id: "2", title: "Subtask 1.2", isCompleted: true },
                        ],
                    },
                ],
            },
            {
                id: "in-progress",
                name: "In Progress",
                tasks: [
                    {
                        id: "2",
                        title: "Task 2",
                        description: "Description for Task 2",
                        status: "in-progress",
                        subtasks: [
                            { id: "1", title: "Subtask 2.1", isCompleted: false },
                            { id: "2", title: "Subtask 2.2", isCompleted: false },
                            { id: "3", title: "Subtask 2.3", isCompleted: true },
                        ],
                    },
                ],
            },
            {
                id: "done",
                name: "Done",
                tasks: [],
            },
        ],
    },
];

/** Applies `update` to the task with `taskId`, wherever it lives. */
const updateTask = (boards: Board[], taskId: string, update: (task: Task) => Task): Board[] =>
    boards.map((board) => ({
        ...board,
        columns: board.columns.map((column) => ({
            ...column,
            tasks: column.tasks.map((task) => (task.id === taskId ? update(task) : task)),
        })),
    }));

const ContainerContext = createContext<ContainerContextValue | null>(null);

export const ContainerProvider = ({ children }: { children: ReactNode }) => {
    const [boards, setBoards] = useState<Board[]>(initialBoards);
    const [selectedBoardId, setSelectedBoardId] = useState<string | undefined>(initialBoards[0]?.id);
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

    const selectedBoard = boards.find((board) => board.id === selectedBoardId);

    const selectBoard = (boardId: string) => {
        setSelectedBoardId(boardId);
    };

    const tasks = boards.flatMap((board) => board.columns.flatMap((column) => column.tasks));

    const createBoard = (name: string, columnNames: string[] = ["Todo", "In Progress", "Done"]) => {
        setBoards((prevBoards) => [
            ...prevBoards,
            {
                id: generateId(),
                name,
                columns: columnNames.map((columnName) => ({
                    id: toColumnId(columnName),
                    name: columnName,
                    tasks: [],
                })),
            },
        ]);
    };

    const addColumn = (boardId: string, name: string) => {
        setBoards((prevBoards) =>
            prevBoards.map((board) =>
                board.id === boardId
                    ? { ...board, columns: [...board.columns, { id: toColumnId(name), name, tasks: [] }] }
                    : board
            )
        );
    };

    const createTask = (
        boardId: string,
        title: string,
        description: string,
        status?: string,
        subtaskTitles: string[] = []
    ) => {
        setBoards((prevBoards) =>
            prevBoards.map((board) => {
                if (board.id !== boardId || board.columns.length === 0) return board;

                // Default to the board's first column when no (valid) status is given
                const targetColumnId = board.columns.some((column) => column.id === status)
                    ? status!
                    : board.columns[0].id;

                const newTask: Task = {
                    id: generateId(),
                    title,
                    description,
                    status: targetColumnId,
                    subtasks: subtaskTitles.map((subtaskTitle) => ({
                        id: generateId(),
                        title: subtaskTitle,
                        isCompleted: false,
                    })),
                };

                return {
                    ...board,
                    columns: board.columns.map((column) =>
                        column.id === targetColumnId ? { ...column, tasks: [...column.tasks, newTask] } : column
                    ),
                };
            })
        );
    };

    /** Updates the task's status and moves it into the matching column of its board. */
    const setStatus = (taskId: string, newStatus: string) => {
        setBoards((prevBoards) =>
            prevBoards.map((board) => {
                const task = board.columns.flatMap((column) => column.tasks).find((t) => t.id === taskId);
                if (!task || !board.columns.some((column) => column.id === newStatus)) return board;

                const movedTask = { ...task, status: newStatus };
                return {
                    ...board,
                    columns: board.columns.map((column) => {
                        const remaining = column.tasks.filter((t) => t.id !== taskId);
                        return column.id === newStatus
                            ? { ...column, tasks: [...remaining, movedTask] }
                            : { ...column, tasks: remaining };
                    }),
                };
            })
        );
    };

    const moveTask = (taskId: string, destinationColumnId: string, destinationIndex: number) => {
        setBoards((prevBoards) =>
            prevBoards.map((board) => {
                const task = board.columns.flatMap((column) => column.tasks).find((t) => t.id === taskId);
                if (!task || !board.columns.some((column) => column.id === destinationColumnId)) return board;

                const movedTask = { ...task, status: destinationColumnId };
                return {
                    ...board,
                    columns: board.columns.map((column) => {
                        const remaining = column.tasks.filter((t) => t.id !== taskId);
                        if (column.id !== destinationColumnId) return { ...column, tasks: remaining };

                        const tasks = [...remaining];
                        tasks.splice(destinationIndex, 0, movedTask);
                        return { ...column, tasks };
                    }),
                };
            })
        );
    };

    const editTask: ContainerContextValue["editTask"] = (taskId, { title, description, status, subtasks }) => {
        setBoards((prevBoards) =>
            prevBoards.map((board) => {
                const task = board.columns.flatMap((column) => column.tasks).find((t) => t.id === taskId);
                if (!task) return board;

                const newStatus = board.columns.some((column) => column.id === status) ? status : task.status;
                const updatedTask: Task = {
                    ...task,
                    title,
                    description,
                    status: newStatus,
                    subtasks: subtasks.map(({ id, title: subtaskTitle }) => ({
                        id,
                        title: subtaskTitle,
                        isCompleted: task.subtasks.find((s) => s.id === id)?.isCompleted ?? false,
                    })),
                };

                return {
                    ...board,
                    columns: board.columns.map((column) => {
                        // Same column: update in place to keep its position
                        if (newStatus === task.status) {
                            return { ...column, tasks: column.tasks.map((t) => (t.id === taskId ? updatedTask : t)) };
                        }
                        // Status changed: move to the end of the new column
                        const remaining = column.tasks.filter((t) => t.id !== taskId);
                        return column.id === newStatus
                            ? { ...column, tasks: [...remaining, updatedTask] }
                            : { ...column, tasks: remaining };
                    }),
                };
            })
        );
    };

    const deleteTask = (taskId: string) => {
        setBoards((prevBoards) =>
            prevBoards.map((board) => ({
                ...board,
                columns: board.columns.map((column) => ({
                    ...column,
                    tasks: column.tasks.filter((t) => t.id !== taskId),
                })),
            }))
        );
    };

    const addSubtask = (taskId: string, subtaskTitle: string) => {
        setBoards((prevBoards) =>
            updateTask(prevBoards, taskId, (task) => ({
                ...task,
                subtasks: [...task.subtasks, { id: generateId(), title: subtaskTitle, isCompleted: false }],
            }))
        );
    };

    const checkSubtask = (taskId: string, subtaskId: string, isCompleted: boolean) => {
        setBoards((prevBoards) =>
            updateTask(prevBoards, taskId, (task) => ({
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId ? { ...subtask, isCompleted } : subtask
                ),
            }))
        );
    };

    const hideSidebar = () => {
        setIsSidebarVisible(false);
    }

    const showSidebar = () => {
        setIsSidebarVisible(true);
    }

    return createElement(
        ContainerContext.Provider,
        {
            value: { boards, tasks, selectedBoard, selectBoard, createBoard, addColumn, createTask, setStatus, moveTask, editTask, deleteTask, addSubtask, checkSubtask, isSidebarVisible, hideSidebar, showSidebar },
        },
        children
    );
};

export const useContainer = () => {
    const context = useContext(ContainerContext);
    if (!context) {
        throw new Error("useContainer must be used within a ContainerProvider");
    }
    return context;
};
