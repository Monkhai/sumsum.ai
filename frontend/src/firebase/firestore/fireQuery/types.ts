import { type QueryClient } from "@tanstack/react-query";
import { type CollectionReference, type Firestore } from "firebase/firestore";

export type DocumentTypeWithId<T> = {
  id: string;
  document: T;
};
export type CollectionOptions = {
  collectionPath: string;
  baseQueryKey: string;
  firestore: Firestore;
  queryClient: QueryClient;
};

export type OperationsParameters<T> = {
  collectionRef: CollectionReference<T>;
  firestore: Firestore;
  baseQueryKey: string;
  queryClient: QueryClient;
};
