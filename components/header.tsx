"use client";

import { useState } from "react";
import Image from "next/image";
import { useContainer } from "@/providers/container";
import AddTaskButton from "./addTaskButton";
import BoardList from "./boardList";
import CreateBoardButton from "./createBoardButton";
import ThemeSwitcher from "./themeSwitcher";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const Header = () => {
    const { selectedBoard } = useContainer();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return <header className="w-full h-[96px] bg-bg px-8 flex items-center justify-between border-b border-lines">
        <div className="flex sm:hidden items-center gap-4">
            <Image width={24} height={24} src="/logo-mobile.svg" alt="Kanban Task Management" />

            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <PopoverTrigger className="sm:hidden heading-l text-text-title flex items-center gap-2 cursor-pointer">
                    <span className="truncate">{selectedBoard?.name}</span>
                    <Image
                        width={10}
                        height={7}
                        src={isMenuOpen ? "/icon-chevron-up.svg" : "/icon-chevron-down.svg"}
                        alt=""
                    />
                </PopoverTrigger>
                <PopoverContent align="start" sideOffset={16} className="w-[264px] bg-bg border-none rounded-lg py-4 px-0 flex flex-col gap-4">
                    <BoardList className="w-full" onSelect={() => setIsMenuOpen(false)} />
                    <div className="px-8">
                        <CreateBoardButton />
                    </div>
                    <div className="px-4">
                        <ThemeSwitcher />
                    </div>
                </PopoverContent>
            </Popover>
        </div>

        <h1 className="text-xl text-text-title hidden sm:block">{selectedBoard?.name}</h1>

        <AddTaskButton />
    </header>
}

export default Header;
