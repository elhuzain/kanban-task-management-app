import { useContainer } from "@/providers/container";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import LabelledInput from "./labelledInput";
import { useState } from "react";

const AddColumnButton = () => {
    const [columnName, setColumnName] = useState("");
    const { selectedBoard, addColumn } = useContainer();

    const handleSubmit = () => {
        if (selectedBoard) {
            addColumn(selectedBoard.id, columnName);
            setColumnName("");
        }
    }

    return (
        <Dialog>
            <DialogTrigger className="text-primary bg-bg/30 min-w-[280px] max-w-[280px] mt-12 rounded-md">
                + New Column
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new column</DialogTitle>

                    <LabelledInput name="" placeholder="" label="Column Name" value={columnName} onChange={(e) => setColumnName(e.target.value)} />

                    <DialogFooter>
                        <DialogClose className="w-full">
                            <Button className="w-full" disabled={columnName.trim() === ""} onClick={handleSubmit}>
                                Create
                            </Button>
                            <Button variant="secondary" className="w-full mt-2" onClick={() => setColumnName("")}>
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddColumnButton;