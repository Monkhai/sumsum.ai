import { queryClient } from "~/Providers";
import { firestore } from "../firebase";
import { NotesCollection } from "./fireQuery/RealtimeCollection";

export const notesCollection = new NotesCollection({
  baseQueryKey: "notes",
  collectionPath: "notes",
  firestore,
  queryClient,
});
