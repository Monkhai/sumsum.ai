import { type Query } from "firebase/firestore";
import { type DocumentTypeWithId } from "./types";

export interface OperationsStrategy<T> {
  getDocuments(q?: Query<T>): Promise<DocumentTypeWithId<T>[]>;
  getDocument(documentId: string): Promise<DocumentTypeWithId<T>>;
  createDocument(document: T): Promise<DocumentTypeWithId<T>>;
  updateDocument(
    document: T,
    documentId: string,
  ): Promise<DocumentTypeWithId<T>>;
  deleteDocument(documentId: string): Promise<void>;
}
