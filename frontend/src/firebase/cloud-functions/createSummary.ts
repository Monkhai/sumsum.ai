import { httpsCallable } from "firebase/functions";
import { functions, storage } from "../firebase";
import { getBlob, ref } from "firebase/storage";

type CreateSummaryArgs = {
  documentIds: Array<string>;
  title: string;
};

export async function createSummary({ documentIds, title }: CreateSummaryArgs) {
  const createSummaryFn = httpsCallable<
    CreateSummaryArgs,
    { filePath: string }
  >(functions, "createSummary");

  const result = await createSummaryFn({ documentIds, title });
  const filePath = result.data.filePath;

  console.log("filePath", filePath);
  const fileRef = ref(storage, filePath);
  const blob = await getBlob(fileRef);
  return {
    content: await blob.text(),
    filePath,
  };
}
