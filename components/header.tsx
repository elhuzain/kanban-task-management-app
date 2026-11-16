"use client";

import { useContainer } from "@/providers/container";
import AddTaskButton from "./addTaskButton";

const Header = () => {
    const { selectedBoard } = useContainer();

    return <header className="w-full h-[96px] bg-bg px-8 flex items-center justify-between border-b border-lines">
        <h1 className="text-xl text-text-title">{selectedBoard?.name}</h1>
        <AddTaskButton />
    </header>
}

export default Header;