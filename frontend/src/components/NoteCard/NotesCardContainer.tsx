import { type NoteType } from "essence-cloud-functions/functions/types";
import { type DocumentTypeWithId } from "~/firebase/firestore/fireQuery/types";
import NotesCard from "./NotesCard";

interface Props {
  note: DocumentTypeWithId<NoteType & { content: string }>;
}
export default function NotesCardContainer({ note }: Props) {
  return <NotesCard note={note} />;
}
