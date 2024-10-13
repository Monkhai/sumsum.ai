import { Upload } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import UploadFileDialog from "./components/UploadFileDialog";

interface Props {
  formRef: React.RefObject<HTMLFormElement>;
  isPending: boolean;
  text: string;
  setTitleText: Dispatch<SetStateAction<string>>;
  titleText: string;
  setText: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function UploadNoteForm({
  formRef,
  isPending,
  text,
  titleText,
  setText,
  setTitleText,
  handleSubmit,
  isOpen,
  setIsOpen,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isOpen) {
      setText("");
      setTitleText("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      action=""
      className="flex flex-row gap-4"
    >
      <Input
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          const files = target.files;
          if (!files) return;
          const file = files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result;
            setText(text as string);
            const title = file.name;
            setTitleText(title);
          };
          reader.readAsText(file);

          setIsOpen(true);
        }}
        type="file"
        id="file"
        ref={inputRef}
        className="hidden"
        placeholder=""
        accept=".md"
      />
      <Button
        size="icon"
        onClick={() => inputRef.current?.click()}
        variant="outline"
      >
        <Upload size={20} />
      </Button>
      <UploadFileDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        formRef={formRef}
        isPending={isPending}
        text={text}
        titleText={titleText}
      />
    </form>
  );
}
