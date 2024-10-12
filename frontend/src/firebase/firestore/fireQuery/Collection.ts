import {
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { type DocumentTypeWithId } from "./types";

export interface Collection<T> {
  useGetDocuments(): UseQueryResult<Array<DocumentTypeWithId<T>>, Error>;

  useGetDocument(
    documentId: string,
  ): UseQueryResult<DocumentTypeWithId<T>, Error>;

  useCreateDocument(): UseMutationResult<
    DocumentTypeWithId<T> | undefined,
    Error,
    T
  >;

  useUpdateDocument(): UseMutationResult<
    DocumentTypeWithId<T> | undefined,
    Error,
    { document: T; documentId: string }
  >;

  useDeleteDocument(): UseMutationResult<void, Error, { documentId: string }>;
}
