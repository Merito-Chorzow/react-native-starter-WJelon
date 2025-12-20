import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View, Alert, StyleSheet, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useNotes } from "../store/NotesStore";
import { fetchRemoteNotes } from "../api/notesApi";
import { Note } from "../types/note";


type Props = NativeStackScreenProps<RootStackParamList, "NotesList">;

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function NotesListScreen({ navigation }: Props) {
  const { state, setNotes } = useNotes();
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const controller = new AbortController();

  async function load() {
    if (state.notes.length > 0) return;

    try {
      setLoading(true);
      const remote = await fetchRemoteNotes(controller.signal);

      const mapped: Note[] = remote.map((r) => ({
        id: String(r.id),
        title: r.title,
        description: r.body,
        createdAt: new Date().toISOString(),
      }));

      setNotes(mapped);
    } catch (e) {
      Alert.alert("API error", "Could not fetch notes. Check internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  load();
  return () => controller.abort();
}, [state.notes.length, setNotes]);


  return (
  <View style={{ flex: 1 }}>
    {}
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="About screen"
          onPress={() => navigation.navigate("About")}
          style={{
            minHeight: 48,
            paddingHorizontal: 16,
            justifyContent: "center",
            borderRadius: 12,
            backgroundColor: "#e5e5e5",
          }}
        >
          <Text style={{ color: "#111", fontSize: 16 }}>About</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={state.notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }} 
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => {
            const hasLoc = !!item.location;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open note ${item.title}`}
                onPress={() => navigation.navigate("NoteDetails", { id: item.id })}
                style={{
                  padding: 14,
                  borderRadius: 16,
                  backgroundColor: "#f3f3f3",
                  minHeight: 72,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "700" }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={{ marginTop: 6, opacity: 0.8 }}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>

    {}
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add new note"
      onPress={() => navigation.navigate("NoteForm", { mode: "create" })}
      style={({ pressed }) => [
        styles.fab,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={styles.fabText}>+</Text>
    </Pressable>
  </View>
);

}
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",

    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    lineHeight: Platform.OS === "ios" ? 32 : 36,
    fontWeight: "600",
  },
});

