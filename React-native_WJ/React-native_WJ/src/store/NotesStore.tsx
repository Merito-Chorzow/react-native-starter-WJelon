import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Note } from "../types/note";

type State = {
  notes: Note[];
};

type Action =
  | { type: "SET_NOTES"; payload: Note[] }
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "UPDATE_NOTE"; payload: Note };

const initialState: State = { notes: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_NOTES":
      return { ...state, notes: action.payload };
    case "ADD_NOTE":
      return { ...state, notes: [action.payload, ...state.notes] };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((n) => (n.id === action.payload.id ? action.payload : n)),
      };
    default:
      return state;
  }
}

type Ctx = {
  state: State;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
};

const NotesContext = createContext<Ctx | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<Ctx>(() => {
    return {
      state,
      setNotes: (notes) => dispatch({ type: "SET_NOTES", payload: notes }),
      addNote: (note) => dispatch({ type: "ADD_NOTE", payload: note }),
      updateNote: (note) => dispatch({ type: "UPDATE_NOTE", payload: note }),
    };
  }, [state]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}
