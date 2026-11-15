import { useContainer } from "@/providers/container";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import LabelledInput from "./labelledInput";

const CreateBoardButton = () => {
    const [boardName, setBoardName] = useState("");

    const { createBoard } = useContainer();

    const handleSubmit = () => {
        createBoard(boardName);
        setBoardName("");
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="ghost" className="text-primary">
                    + Create New Board
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new board</DialogTitle>

                    <LabelledInput name="" placeholder="" label="Board Name" value={boardName} onChange={(e) => setBoardName(e.target.value)} />

                    <DialogFooter>
                        <DialogClose className="w-full">
                            <Button className="w-full" disabled={boardName.trim() === ""} onClick={handleSubmit}>
                                Create
                            </Button>
                            <Button variant="secondary" className="w-full mt-2" onClick={() => setBoardName("")}>
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CreateBoardButton;