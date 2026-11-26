import Board from "@/components/board";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { ContainerProvider } from "@/providers/container";

export default function Home() {
  return (
    <ContainerProvider>
      <main className="flex min-h-screen w-full">
        <Sidebar />

        <div className="w-full flex-1 flex flex-col overflow-hidden">
          <Header />
          <Board />
        </div>

      </main>
    </ContainerProvider>
  );
}
