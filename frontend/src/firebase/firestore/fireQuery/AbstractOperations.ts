import { type QueryClient } from "@tanstack/react-query";
import {
  type Query,
  type CollectionReference,
  type Firestore,
} from "firebase/firestore";
import { type OperationsStrategy } from "./OperationsStrategy";
import { type DocumentTypeWithId, type OperationsParameters } from "./types";

export abstract class AbstractOperations<T> implements OperationsStrategy<T> {
  collectionRef: CollectionReference<T>;
  firestore: Firestore;
  baseQueryKey: string;
  queryClient: QueryClient;

  constructor({
    collectionRef,
    firestore,
    baseQueryKey,
    queryClient,
  }: OperationsParameters<T>) {
    this.collectionRef = collectionRef;
    this.firestore = firestore;
    this.baseQueryKey = baseQueryKey;
    this.queryClient = queryClient;
  }

  abstract getDocuments(q?: Query<T>): Promise<DocumentTypeWithId<T>[]>;
  abstract getDocument<P>(
    documentId: string,
    params?: P,
  ): Promise<DocumentTypeWithId<T>>;
  abstract createDocument<P>(
    document: T,
    params?: P,
  ): Promise<DocumentTypeWithId<T>>;
  abstract updateDocument<P>(
    document: T,
    documentId: string,
    params?: P,
  ): Promise<DocumentTypeWithId<T>>;
  abstract deleteDocument(documentId: string): Promise<void>;
}
