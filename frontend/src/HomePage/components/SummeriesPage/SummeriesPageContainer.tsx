import { summaryCollection } from "~/firebase/firestore/fireQuery/summaryCollection";
import SummeriesPage from "./SummeriesPage";

export default function SummeriesPageContainer() {
  const { data, isLoading, isError, error } = summaryCollection.useGetFiles();

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        Loading...
      </div>
    );

  if (isError || !data) return <div>{error?.message}</div>;

  return <SummeriesPage summaries={data} />;
}
