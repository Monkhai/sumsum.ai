import {
  type QueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  collection,
  type CollectionReference,
  type Firestore,
} from "firebase/firestore";
import { type Collection } from "./Collection";
import { type OperationsStrategy } from "./OperationsStrategy";
import {
  type CollectionOptions,
  type DocumentTypeWithId,
  type OperationsParameters,
} from "./types";

export abstract class AbstractCollection<T, O extends OperationsStrategy<T>>
  implements Collection<T>
{
  protected operations: O;
  protected collectionRef: CollectionReference<T>;
  protected firestore: Firestore;
  protected baseQueryKey: string;
  protected queryClient: QueryClient;

  constructor(
    { baseQueryKey, collectionPath, firestore, queryClient }: CollectionOptions,
    queryOperationsConstructor: new (
      opeartionsParameters: OperationsParameters<T>,
    ) => O,
  ) {
    const operationsParameters: OperationsParameters<T> = {
      collectionRef: collection(
        firestore,
        collectionPath,
      ) as CollectionReference<T>,
      firestore: firestore,
      baseQueryKey: baseQueryKey,
      queryClient: queryClient,
    };

    this.operations = new queryOperationsConstructor(operationsParameters);
    this.collectionRef = operationsParameters.collectionRef;
    this.firestore = operationsParameters.firestore;
    this.baseQueryKey = operationsParameters.baseQueryKey;
    this.queryClient = operationsParameters.queryClient;
  }

  public abstract useGetDocuments(): UseQueryResult<
    DocumentTypeWithId<T>[],
    Error
  >;

  public abstract useGetDocument(
    documentId: string,
  ): UseQueryResult<DocumentTypeWithId<T>, Error>;

  public abstract useCreateDocument(): UseMutationResult<
    DocumentTypeWithId<T> | undefined,
    Error,
    T
  >;

  public abstract useUpdateDocument(): UseMutationResult<
    DocumentTypeWithId<T> | undefined,
    Error,
    { document: T; documentId: string }
  >;

  public abstract useDeleteDocument(): UseMutationResult<
    void,
    Error,
    { documentId: string }
  >;
}
