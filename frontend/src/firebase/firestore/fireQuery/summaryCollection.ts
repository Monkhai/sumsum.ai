/* eslint-disable react-hooks/rules-of-hooks */
import {
  type QueryClient,
  useMutation,
  type UseMutationResult,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import {
  collection,
  type CollectionReference,
  type Firestore,
} from "firebase/firestore";
import { type FirebaseStorage, getBlob, ref } from "firebase/storage";
import { firestore, storage } from "~/firebase/firebase";
import { queryClient } from "~/Providers";
import { BaseOperations } from "./BaseOperations";
import { QueryBuilder } from "./QueryBuilder";
import {
  type CollectionOptions,
  type DocumentTypeWithId,
  type OperationsParameters,
} from "./types";

export type SummaryType = {
  documentIds: Array<string>;
  title: string;
  assetPath: string;
  userId: string;
};

export class StorageOperations extends BaseOperations<SummaryType> {
  private storage: FirebaseStorage;

  constructor(
    collectionRef: CollectionReference<SummaryType>,
    firestore: Firestore,
    baseQueryKey: string,
    queryClient: QueryClient,
    storage: FirebaseStorage,
  ) {
    super({ collectionRef, firestore, baseQueryKey, queryClient });
    this.storage = storage;
  }

  public async getFiles(): Promise<
    Array<DocumentTypeWithId<SummaryType & { content: string }>>
  > {
    const userId = getAuth().currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    const q = new QueryBuilder(this.collectionRef)
      .where("userId", "==", userId)
      .build();
    const docs = await this.getDocuments(q);
    const files: Array<DocumentTypeWithId<SummaryType & { content: string }>> =
      [];
    for (const doc of docs) {
      const path = doc.document.assetPath;
      const fileRef = ref(this.storage, path);
      const blob = await getBlob(fileRef);
      const note: DocumentTypeWithId<SummaryType & { content: string }> = {
        document: {
          ...doc.document,
          content: await blob.text(),
        },
        id: doc.id,
      };

      files.push(note);
    }

    return files;
  }
}

export class SummaryCollection {
  protected operations: StorageOperations;
  protected collectionRef: CollectionReference<SummaryType>;
  protected firestore: Firestore;
  protected baseQueryKey: string;
  protected queryClient: QueryClient;

  constructor(opts: CollectionOptions) {
    const operationsParameters: OperationsParameters<SummaryType> = {
      collectionRef: collection(
        opts.firestore,
        opts.collectionPath,
      ) as CollectionReference<SummaryType>,
      firestore: opts.firestore,
      baseQueryKey: opts.baseQueryKey,
      queryClient: opts.queryClient,
    };

    const operations = new StorageOperations(
      operationsParameters.collectionRef,
      operationsParameters.firestore,
      operationsParameters.baseQueryKey,
      operationsParameters.queryClient,
      storage,
    );
    this.operations = operations;
    this.collectionRef = operationsParameters.collectionRef;
    this.firestore = operationsParameters.firestore;
    this.baseQueryKey = operationsParameters.baseQueryKey;
    this.queryClient = operationsParameters.queryClient;
  }

  public useGetFiles(): UseQueryResult<
    Array<DocumentTypeWithId<SummaryType & { content: string }>>,
    Error
  > {
    return useQuery({
      queryKey: [this.baseQueryKey, "files"],
      queryFn: async () => await this.operations.getFiles(),
    });
  }

  public useGetDocuments(): UseQueryResult<
    Array<DocumentTypeWithId<SummaryType>>,
    Error
  > {
    const userId = getAuth().currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    const q = new QueryBuilder(this.collectionRef)
      .where("userId", "==", userId)
      .build();
    return useQuery({
      queryKey: [this.baseQueryKey],
      queryFn: async () => await this.operations.getDocuments(q),
    });
  }

  public useGetDocument(
    documentId: string,
  ): UseQueryResult<DocumentTypeWithId<SummaryType>, Error> {
    return useQuery({
      queryKey: [this.baseQueryKey, "singleDoc", documentId],
      queryFn: async () => await this.operations.getDocument(documentId),
    });
  }

  public useCreateDocument(): UseMutationResult<
    DocumentTypeWithId<SummaryType> | undefined,
    Error,
    SummaryType
  > {
    return useMutation({
      mutationFn: async (document: SummaryType) =>
        await this.operations.createDocument(document),
    });
  }

  public useUpdateDocument(): UseMutationResult<
    DocumentTypeWithId<SummaryType> | undefined,
    Error,
    { document: SummaryType; documentId: string }
  > {
    return useMutation({
      mutationFn: async ({
        document,
        documentId,
      }: {
        document: SummaryType;
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

export const summaryCollection = new SummaryCollection({
  baseQueryKey: "summaries",
  collectionPath: "summaries",
  firestore: firestore,
  queryClient: queryClient,
});
