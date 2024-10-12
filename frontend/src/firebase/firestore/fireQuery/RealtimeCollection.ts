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
import { storage } from "~/firebase/firebase";
import { type NoteType } from "../noteTypes";
import { BaseOperations } from "./BaseOperations";
import { QueryBuilder } from "./QueryBuilder";
import {
  type CollectionOptions,
  type DocumentTypeWithId,
  type OperationsParameters,
} from "./types";
import uploadNote from "~/firebase/storage/uploadNote";

export class StorageOperations extends BaseOperations<NoteType> {
  private storage: FirebaseStorage;

  constructor(
    collectionRef: CollectionReference<NoteType>,
    firestore: Firestore,
    baseQueryKey: string,
    queryClient: QueryClient,
    storage: FirebaseStorage,
  ) {
    super({ collectionRef, firestore, baseQueryKey, queryClient });
    this.storage = storage;
  }

  public async getFiles(): Promise<
    Array<DocumentTypeWithId<NoteType & { content: string }>>
  > {
    const userId = getAuth().currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");
    const q = new QueryBuilder(this.collectionRef)
      .where("userId", "==", userId)
      .build();
    const docs = await this.getDocuments(q);
    const files: Array<DocumentTypeWithId<NoteType & { content: string }>> = [];
    for (const doc of docs) {
      const path = doc.document.assetPath;
      const fileRef = ref(this.storage, path);
      const blob = await getBlob(fileRef);
      const note: DocumentTypeWithId<NoteType & { content: string }> = {
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

export class NotesCollection {
  protected operations: StorageOperations;
  protected collectionRef: CollectionReference<NoteType>;
  protected firestore: Firestore;
  protected baseQueryKey: string;
  protected queryClient: QueryClient;

  constructor(opts: CollectionOptions) {
    const operationsParameters: OperationsParameters<NoteType> = {
      collectionRef: collection(
        opts.firestore,
        opts.collectionPath,
      ) as CollectionReference<NoteType>,
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
    Array<DocumentTypeWithId<NoteType & { content: string }>>,
    Error
  > {
    return useQuery({
      queryKey: [this.baseQueryKey, "files"],
      queryFn: async () => await this.operations.getFiles(),
    });
  }

  public useGetDocuments(): UseQueryResult<
    Array<DocumentTypeWithId<NoteType>>,
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
  ): UseQueryResult<DocumentTypeWithId<NoteType>, Error> {
    return useQuery({
      queryKey: [this.baseQueryKey, "singleDoc", documentId],
      queryFn: async () => await this.operations.getDocument(documentId),
    });
  }

  public useCreateDocument(): UseMutationResult<
    DocumentTypeWithId<NoteType> | undefined,
    Error,
    NoteType
  > {
    return useMutation({
      mutationFn: async (document: NoteType) =>
        await this.operations.createDocument(document),
    });
  }

  public useUpdateDocument(): UseMutationResult<
    DocumentTypeWithId<NoteType> | undefined,
    Error,
    { document: NoteType; documentId: string }
  > {
    return useMutation({
      mutationFn: async ({
        document,
        documentId,
      }: {
        document: NoteType;
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

  public useUploadNote() {
    return useMutation({
      mutationFn: async (file: File) => await uploadNote({ file }),
      onSuccess: () => {
        void this.queryClient.refetchQueries({
          queryKey: [this.baseQueryKey],
        });
      },
    });
  }
}
