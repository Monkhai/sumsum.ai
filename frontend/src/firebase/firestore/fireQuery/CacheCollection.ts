/* eslint-disable react-hooks/rules-of-hooks */
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { BaseCollection } from "./BaseCollection";
import { type DocumentTypeWithId } from "./types";
import { type OperationsStrategy } from "./OperationsStrategy";

export class CachedCollection<
  T,
  O extends OperationsStrategy<T>,
> extends BaseCollection<T, O> {
  public useCreateDocument(): UseMutationResult<
    DocumentTypeWithId<T> | undefined,
    Error,
    T
  > {
    return useMutation({
      mutationFn: async (document: T) =>
        await this.operations.createDocument(document),
      onSuccess: (newDoc) => {
        const queryKey = [this.baseQueryKey];
        const queryClient = this.queryClient;
        const prev: Array<DocumentTypeWithId<T>> =
          queryClient.getQueryData(queryKey) ?? [];

        const updated = [...prev, newDoc];
        queryClient.setQueryData(queryKey, updated);
      },
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
      onMutate: ({ document, documentId }) => {
        const queryKey = [this.baseQueryKey];
        const queryClient = this.queryClient;
        const prev: Array<DocumentTypeWithId<T>> =
          queryClient.getQueryData(queryKey) ?? [];
        const updated = prev.map((doc) => {
          if (doc.id === documentId) {
            return {
              document: document,
              id: documentId,
            } as DocumentTypeWithId<T>;
          }
          return doc;
        });
        queryClient.setQueryData(queryKey, updated);

        function rollback() {
          queryClient.setQueryData(queryKey, prev);
        }
        return { rollback };
      },
      onError: (_, __, context) => {
        if (context) context.rollback();
      },
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
      onMutate: ({ documentId }) => {
        const queryKey = [this.baseQueryKey];
        const queryClient = this.queryClient;
        const prev: Array<DocumentTypeWithId<T>> =
          queryClient.getQueryData(queryKey) ?? [];
        const updated = prev.filter((doc) => doc.id !== documentId);
        queryClient.setQueryData(queryKey, updated);

        function rollback() {
          queryClient.setQueryData(queryKey, prev);
        }

        return { rollback };
      },
      onError: (_, __, context) => {
        if (context) context.rollback();
      },
    });
  }
}
