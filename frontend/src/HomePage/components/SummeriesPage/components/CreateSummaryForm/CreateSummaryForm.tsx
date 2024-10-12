import { useMutation } from "@tanstack/react-query";
import { FilePen } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { createSummary } from "~/firebase/cloud-functions/createSummary";
import { notesCollection } from "~/firebase/firestore/notesCollection";
import { queryClient } from "~/Providers";

export default function CreateSummaryForm() {
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data, isLoading, isError } = notesCollection.useGetDocuments();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      noteIds,
      title,
    }: {
      noteIds: string[];
      title: string;
    }) => {
      const res = await createSummary({ documentIds: noteIds, title });
      return res.content;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["summaries"] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  if (isLoading) return null;

  if (!data || isError) return null;

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        mutate({ noteIds: Array.from(selectedNotes), title });
      }}
    >
      <Dialog onOpenChange={(open) => setIsModalOpen(open)} open={isModalOpen}>
        <DialogTrigger>
          <Button onClick={() => setIsModalOpen(true)} variant="outline">
            <FilePen size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3/4 h-3/4 w-3/4 overflow-auto">
          <DialogHeader>
            <DialogTitle>Create Summary</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Table className="flex h-full w-full flex-col overflow-auto">
            <TableHeader className="top-0 z-10 m-0 rounded-lg bg-stone-900 opacity-100">
              <TableHead className="w-10"></TableHead>
              <TableHead className="">Name</TableHead>
            </TableHeader>
            <TableBody className="flex h-full w-full flex-col overflow-auto">
              {data.map((note, index) => {
                const isChecked = selectedNotes.has(note.id);
                return (
                  <TableRow
                    onClick={() => {
                      if (isChecked) {
                        const newSelectedNotes = new Set(selectedNotes);
                        newSelectedNotes.delete(note.id);
                        setSelectedNotes(newSelectedNotes);
                      } else {
                        setSelectedNotes(new Set(selectedNotes).add(note.id));
                      }
                    }}
                    key={index}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedNotes(
                              new Set(selectedNotes).add(note.id),
                            );
                          } else {
                            const newSelectedNotes = new Set(selectedNotes);
                            newSelectedNotes.delete(note.id);
                            setSelectedNotes(newSelectedNotes);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{note.document.title}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <DialogFooter className="items-end justify-end">
            <Button
              type="submit"
              onClick={() => formRef.current?.requestSubmit()}
              loading={isPending}
              disabled={selectedNotes.size === 0 || !title}
            >
              Create Summary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
