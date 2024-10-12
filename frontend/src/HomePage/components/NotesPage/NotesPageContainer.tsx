import { notesCollection } from "~/firebase/firestore/notesCollection";
import NotesPage from "./NotesPage";

export default function NotesPageContainer() {
  const { data, isLoading, isError, error } = notesCollection.useGetFiles();

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        Loading...
      </div>
    );

  if (isError || !data) return <div>{error?.message}</div>;

  return <NotesPage notes={data} />;
}
