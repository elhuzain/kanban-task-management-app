'use client';
import { useContainer } from "@/providers/container";
import { Button } from "./ui/button";
import PresentationSection from "./presentationSection";
import ThemeSwitcher from "./themeSwitcher";
import Task from "./task";
import CreateBoardButton from "./createBoardButton";
import AddColumnButton from "./addColumnButton";
import BoardList from "./boardList";

const Presentation = () => {
  const { tasks } = useContainer();

  return (
    <div className="bg-bg p-12 space-y-8 w-full">
      <PresentationSection title="Theme Switcher">
        <ThemeSwitcher />
      </PresentationSection>

      <PresentationSection title="Buttons">
        <Button>Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="destructive">Destructive Button</Button>
      </PresentationSection>

      <PresentationSection title="Sample Todos (from data.json)" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Task key={task.title} task={task} />
        ))}
      </PresentationSection>

      <PresentationSection title="Create New Board Button">
        <BoardList/> 
        <AddColumnButton />
        <CreateBoardButton />
      </PresentationSection>
    </div>
  )
}

export default Presentation;
