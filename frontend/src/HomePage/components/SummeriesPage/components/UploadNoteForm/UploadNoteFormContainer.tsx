import React, { useEffect, useRef } from "react";
import { notesCollection } from "~/firebase/firestore/notesCollection";
import UploadNoteForm from "./UploadNoteForm";

export default function UploadNoteFormContainer() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [titleText, setTitleText] = React.useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate, isPending, isSuccess, reset } =
    notesCollection.useUploadNote();

  useEffect(() => {
    if (isSuccess) {
      reset();
      formRef.current?.reset();
      setText("");
      setTitleText("");
      setIsModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const input = target.file as HTMLInputElement;
    const files = input.files;
    if (!files) return;
    const file = files[0];
    if (!file) return;
    mutate(file);
  }

  return (
    <UploadNoteForm
      formRef={formRef}
      isPending={isPending}
      text={text}
      setTitleText={setTitleText}
      titleText={titleText}
      setText={setText}
      handleSubmit={handleSubmit}
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
    />
  );
}
