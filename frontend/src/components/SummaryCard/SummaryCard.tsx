import MDEditor from "@uiw/react-md-editor";
import { SummaryType } from "~/firebase/firestore/fireQuery/summaryCollection";
import { type DocumentTypeWithId } from "~/firebase/firestore/fireQuery/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Props {
  summary: DocumentTypeWithId<SummaryType & { content: string }>;
}

export default function SummaryCard({ summary }: Props) {
  return (
    <Card className="flex h-80 w-80 flex-col overflow-auto">
      <CardHeader className="flex flex-row items-center">
        <CardTitle>{summary.document.title}</CardTitle>
      </CardHeader>
      <CardContent
        data-color-mode="dark"
        className="flex h-full flex-col overflow-auto p-0"
      >
        <MDEditor.Markdown
          components={{
            a: () => null,
          }}
          source={summary.document.content}
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
