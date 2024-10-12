import MDEditor from "@uiw/react-md-editor";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface Props {
  text: string;
  titleText: string;
  isPending: boolean;
  formRef: React.RefObject<HTMLFormElement>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function UploadFileDialog({
  formRef,
  isPending,
  text,
  titleText,
  isOpen,
  setIsOpen,
}: Props) {
  return (
    <Dialog onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
      <DialogContent
        aria-describedby="Preview your file"
        className="max-w-3/4 h-3/4 w-3/4 overflow-auto"
      >
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
        </DialogHeader>
        <Card className="h-full w-full flex-1 overflow-auto border-2 border-none">
          <CardContent className="px-0">
            <MDEditor.Markdown source={text} style={{ fontSize: 10 }} />
          </CardContent>
        </Card>
        <DialogFooter className="flex items-end justify-end">
          <Button
            loading={isPending}
            onClick={() => {
              if (formRef.current) {
                formRef.current.requestSubmit();
              }
            }}
            type="submit"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
