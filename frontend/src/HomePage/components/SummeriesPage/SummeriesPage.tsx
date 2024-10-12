import { Search } from "lucide-react";
import { useState } from "react";
import SummaryCard from "~/components/SummaryCard/SummaryCard";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { SummaryType } from "~/firebase/firestore/fireQuery/summaryCollection";
import { DocumentTypeWithId } from "~/firebase/firestore/fireQuery/types";
import CreateSummaryForm from "./components/CreateSummaryForm/CreateSummaryForm";

interface Props {
  summaries: DocumentTypeWithId<
    SummaryType & {
      content: string;
    }
  >[];
}
export default function SummeriesPage({ summaries }: Props) {
  const [search, setSearch] = useState("");

  const filteredSummaries = summaries.filter((note) => {
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
              <CreateSummaryForm />
            </TooltipTrigger>
            <TooltipContent>Create Summary</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="inline-flex flex-wrap gap-4 px-4">
        {filteredSummaries.map((summary, index) => (
          <SummaryCard key={index} summary={summary} />
        ))}
      </div>
    </div>
  );
}
