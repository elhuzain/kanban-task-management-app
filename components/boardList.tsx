"use client";

import { useContainer } from "@/providers/container";
import { cn } from "@/lib/utils";
import { BookMarked } from "lucide-react";

type BoardListProps = {
    className?: string;
    onSelect?: (boardId: string) => void;
};

const BoardList = ({ className, onSelect }: BoardListProps) => {
    const { boards, selectedBoard, selectBoard } = useContainer();

    return (
        <nav aria-label="Boards" className={cn("w-[300px] overflow-y-auto", className)}>
            <p className="heading-s text-text-secondary tracking-[2.4px] mb-5 px-8">
                ALL BOARDS ({boards.length})
            </p>
            <ul className="pe-8">
                {boards.map((board) => {
                    const isSelected = board.id === selectedBoard?.id;
                    return (
                        <li key={board.id}>
                            <button
                                type="button"
                                onClick={() => {
                                    selectBoard(board.id);
                                    onSelect?.(board.id);
                                }}
                                aria-current={isSelected ? "page" : undefined}
                                className={cn(
                                    "heading-m flex items-center gap-4 w-full h-12 px-8 rounded-r-full cursor-pointer transition-colors duration-300",
                                    isSelected
                                        ? "bg-primary text-text-primary"
                                        : "text-text-secondary hover:bg-secondary-button hover:text-primary"
                                )}
                            >
                                <BookMarked className={isSelected ? "stroke-text-primary!" : "stroke-text-secondary!"} />
                                <span className="truncate">
                                    {board.name}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default BoardList;
