import MDEditor from "@uiw/react-md-editor";
import { type DocumentTypeWithId } from "~/firebase/firestore/fireQuery/types";
import { type NoteType } from "~/firebase/firestore/noteTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Tag from "../ui/tag";

interface Props {
  note: DocumentTypeWithId<NoteType & { content: string }>;
}

export default function NotesCard({ note }: Props) {
  return (
    <Card className="flex h-80 w-80 flex-col overflow-auto">
      <CardHeader className="flex flex-row items-center">
        <CardTitle>{note.document.title}</CardTitle>
        <CardDescription className="inline-flex flex-row flex-wrap gap-2 justify-self-center">
          {note.document.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent
        data-color-mode="dark"
        className="flex h-full flex-col overflow-auto p-0"
      >
        <MDEditor.Markdown
          components={{ a: () => null }}
          source={note.document.content}
          style={{
            fontSize: 10,
            paddingRight: 8,
            paddingLeft: 8,
            paddingBottom: 8,
          }}
        />
      </CardContent>
    </Card>
  );
}
