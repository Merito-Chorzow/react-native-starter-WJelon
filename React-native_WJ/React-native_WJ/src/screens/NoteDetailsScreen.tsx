import React from "react";
import { Text, View, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNotes } from "../store/NotesStore";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "NoteDetails">;

export default function NoteDetailsScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { state } = useNotes();

  const note = state.notes.find((n) => n.id === id);

  if (!note) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text accessibilityLabel="Note not found">Note not found.</Text>
      </View>
    );
  }

  const locText = note.location
    ? `${note.location.latitude.toFixed(6)}, ${note.location.longitude.toFixed(6)}`
    : "No location";

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "800" }}>{note.title}</Text>
      <Text style={{ opacity: 0.75 }}>{new Date(note.createdAt).toLocaleString()}</Text>

      <View style={{ padding: 14, borderRadius: 16, backgroundColor: "#f3f3f3" }}>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>Description</Text>
        <Text accessibilityLabel="Note description">{note.description}</Text>
      </View>

      <View style={{ padding: 14, borderRadius: 16, backgroundColor: "#f3f3f3" }}>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>Position</Text>
        <Text accessibilityLabel="Note location">{locText}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Edit note"
        onPress={() => navigation.navigate("NoteForm", { mode: "edit", id: note.id })}
        style={{
          minHeight: 48,
          paddingHorizontal: 16,
          justifyContent: "center",
          borderRadius: 12,
          backgroundColor: "#111",
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Edit</Text>
      </Pressable>
    </View>
  );
}
