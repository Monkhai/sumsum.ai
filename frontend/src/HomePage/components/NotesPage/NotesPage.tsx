import NotesCard from "~/components/NoteCard";
import { DocumentTypeWithId } from "~/firebase/firestore/fireQuery/types";
import { type NoteType } from "~/firebase/firestore/noteTypes";
import UploadNoteForm from "../SummeriesPage/components/UploadNoteForm";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface Props {
  notes: Array<DocumentTypeWithId<NoteType & { content: string }>>;
}
export default function NotesPage({ notes }: Props) {
  const [search, setSearch] = useState("");
  const filteredNotes = notes.filter((note) => {
    return note.document.title.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flow-row flex justify-between">
        <div className="relative">
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <UploadNoteForm />
            </TooltipTrigger>
            <TooltipContent>Upload Note</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="inline-flex flex-wrap gap-4 px-4">
        {filteredNotes.map((note, index) => (
          <NotesCard key={index} note={note} />
        ))}
      </div>
    </div>
  );
}
