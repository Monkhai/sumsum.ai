/* eslint-disable react-hooks/rules-of-hooks */
import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { type Query } from "firebase/firestore";
import { AbstractCollection } from "./AbstractCollection";
import { type OperationsStrategy } from "./OperationsStrategy";
import { type DocumentTypeWithId } from "./types";

export class BaseCollection<
  T,
  O extends OperationsStrategy<T>,
> extends AbstractCollection<T, O> {
  public useGetDocuments(
    q?: Query<T>,
  ): UseQueryResult<Array<DocumentTypeWithId<T>>, Error> {
    return useQuery({
      queryKey: [this.baseQueryKey],
      queryFn: async () => await this.operations.getDocuments(q),
    });
  }

  public useGetDocument(
    documentId: string,
  ): UseQueryResult<DocumentTypeWithId<T>, Error> {
    return useQuery({
      queryKey: [this.baseQueryKey, "singleDoc", documentId],
      queryFn: async () => await this.operations.getDocument(documentId),
    });
  }

  public useCreateDocument(): UseMutationResult<
    DocumentTypeWithId<T> | undefined,
    Error,
    T
  > {
    return useMutation({
      mutationFn: async (document: T) =>
        await this.operations.createDocument(document),
    });
  }

  public useUpdateDocument(): UseMutationResult<
    DocumentTypeWithId<T> | undefined,
    Error,
    { document: T; documentId: string }
  > {
    return useMutation({
      mutationFn: async ({
        document,
        documentId,
      }: {
        document: T;
        documentId: string;
      }) => await this.operations.updateDocument(document, documentId),
    });
  }

  public useDeleteDocument(): UseMutationResult<
    void,
    Error,
    { documentId: string }
  > {
    return useMutation({
      mutationFn: async ({ documentId }: { documentId: string }) =>
        await this.operations.deleteDocument(documentId),
    });
  }
}
