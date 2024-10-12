export const storagePathstore = {
  notes: (userId: string) => `${userId}/notes`,
  note: (userId: string, fileName: string) => `${userId}/notes/${fileName}`,
  summary: (userId: string, fileName: string) =>
    `${userId}/summaries/${fileName}`,
};
