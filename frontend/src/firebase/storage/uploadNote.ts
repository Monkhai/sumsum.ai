import { getAuth } from "firebase/auth";
import { getBytes, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { storagePathstore } from "./storagePathstore";

type Args = {
  file: File;
};

export default async function uploadNote({ file }: Args) {
  try {
    const userId = getAuth().currentUser?.uid;
    if (!userId) throw new Error("User is not authenticated");

    const path = storagePathstore.note(userId, file.name);
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const blob = await getBytes(storageRef);

    return blob;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
