export type RootStackParamList = {
  NotesList: undefined;
  NoteDetails: { id: string };
  NoteForm: { mode: "create" | "edit"; id?: string };
  About: undefined;
};
