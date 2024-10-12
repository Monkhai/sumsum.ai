import { type DocumentTypeWithId } from "~/firebase/firestore/fireQuery/types";
import NotesCard from "./NotesCard";
import { NoteType } from "~/firebase/firestore/noteTypes";

interface Props {
  note: DocumentTypeWithId<NoteType & { content: string }>;
}
export default function NotesCardContainer({ note }: Props) {
  return <NotesCard note={note} />;
}
