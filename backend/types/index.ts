export type NoteType = {
  title: string;
  tags: Array<string>;
  userId: string;
  assetPath: string;
};

export type SummaryType = {
  title: string;
  userId: string;
  assetPath: string;
  baseNoteIds: Array<string>;
};
