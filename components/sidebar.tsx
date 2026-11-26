"use client";

import Image from "next/image";
import BoardList from "./boardList";
import CreateBoardButton from "./createBoardButton";
import ThemeSwitcher from "./themeSwitcher";
import { Button } from "./ui/button";
import { useContainer } from "@/providers/container";
import { cn } from "@/lib/utils";

const Sidebar = () => {
    const { isSidebarVisible, hideSidebar, showSidebar } = useContainer();

    return <>
        <aside className={cn("transition-all duration-300 bg-bg h-dvh border-r border-lines p-8 flex flex-col justify-between overflow-hidden", isSidebarVisible ? "max-w-[300px]" : "max-w-0 p-0")}>
            <div>
                <Image width="152" height="25" alt="Kanban" src="/logo-dark.svg" className="mb-13 dark:hidden" />
                <Image width="152" height="25" alt="Kanban" src="/logo-light.svg" className="mb-13 hidden dark:block" />

                <div>
                    <BoardList />
                    <CreateBoardButton />
                </div>
            </div>

            <div>
                <ThemeSwitcher />
                <Button variant="ghost" onClick={hideSidebar}>
                    <Image width="18" height="16" src="/icon-hide-sidebar.svg" alt="" />
                    <span>Hide Sidebar</span>
                </Button>
            </div>
        </aside>
        <Button variant="ghost" onClick={showSidebar} className={cn("fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-bg px-4 py-2 shadow-lg transition-all duration-300", isSidebarVisible ? "opacity-0 pointer-events-none" : "opacity-100")}>
            <Image width="18" height="16" src="/icon-show-sidebar.svg" alt="" />
            <span>Show Sidebar</span>
        </Button>
    </>
}

export default Sidebar;