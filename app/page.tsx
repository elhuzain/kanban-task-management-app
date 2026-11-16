import Board from "@/components/board";
import BoardList from "@/components/boardList";
import CreateBoardButton from "@/components/createBoardButton";
import Header from "@/components/header";
import ThemeSwitcher from "@/components/themeSwitcher";
import { Button } from "@/components/ui/button";
import { ContainerProvider } from "@/providers/container";
import Image from "next/image";

export default function Home() {
  return (
    <ContainerProvider>
      <main className="flex min-h-screen w-full">

        {/* Sidebar */}
        <aside className="w-[300px] bg-bg h-dvh border-r border-lines p-8 flex flex-col justify-between">
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
            <Button variant="ghost">
              <Image width="18" height="16" src="/icon-hide-sidebar.svg" alt="" />
              <span>Hide Sidebar</span>
            </Button>
          </div>
        </aside>
        <div className="w-full flex-1 flex flex-col overflow-hidden">

          {/* Page header */}
          <Header />

          {/* Main Content */}
          <Board />
        </div>
      </main>
    </ContainerProvider>
  );
}
