import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  type Query,
  updateDoc,
} from "firebase/firestore";
import { AbstractOperations } from "./AbstractOperations";
import { type DocumentTypeWithId } from "./types";

export class BaseOperations<T> extends AbstractOperations<T> {
  public async getDocuments(q?: Query<T>) {
    try {
      const snap = await getDocs(q ? q : this.collectionRef);
      const documents: Array<DocumentTypeWithId<T>> = [];
      snap.forEach((doc) => {
        const data = doc.data();
        const document: DocumentTypeWithId<T> = {
          document: data,
          id: doc.id,
        };
        documents.push(document);
      });
      return documents;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getDocument(documentId: string): Promise<DocumentTypeWithId<T>> {
    const documents: Array<DocumentTypeWithId<T>> =
      this.queryClient.getQueryData([this.baseQueryKey]) ?? [];
    const document = documents.find((doc) => doc.id === documentId);
    if (document) return document;
    const ref = doc(this.collectionRef, documentId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("data is undefined");
    const data = snap.data();
    return { document: data, id: snap.id } as DocumentTypeWithId<T>;
  }

  public async createDocument(document: T): Promise<DocumentTypeWithId<T>> {
    try {
      const ref = await addDoc(this.collectionRef, document);
      return { document: document, id: ref.id } as DocumentTypeWithId<T>;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async updateDocument(document: T, documentId: string) {
    try {
      const ref = doc(this.firestore, this.collectionRef.id, documentId);
      await updateDoc(ref, document as object);
      return { document: document, id: documentId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async deleteDocument(documentId: string) {
    try {
      const ref = doc(this.firestore, this.collectionRef.id, documentId);
      await deleteDoc(ref);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
