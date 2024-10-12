import { type DocumentTypeWithId } from "~/firebase/firestore/fireQuery/types";
import SummaryCard from "./SummaryCard";
import { SummaryType } from "~/firebase/firestore/fireQuery/summaryCollection";

interface Props {
  summary: DocumentTypeWithId<SummaryType & { content: string }>;
}
export default function SumamryCardContainer({ summary }: Props) {
  return <SummaryCard summary={summary} />;
}
