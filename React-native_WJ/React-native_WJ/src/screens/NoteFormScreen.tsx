import React, { useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useNotes } from "../store/NotesStore";
import * as Location from "expo-location";
import { createRemoteNote } from "../api/notesApi";
import { Note } from "../types/note";

type Props = NativeStackScreenProps<RootStackParamList, "NoteForm">;

function genId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function NoteFormScreen({ route, navigation }: Props) {
  const { mode, id } = route.params;
  const { state, addNote, updateNote } = useNotes();

  const existing = useMemo(() => state.notes.find((n) => n.id === id), [state.notes, id]);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [loc, setLoc] = useState<Note["location"]>(existing?.location);
  const [busy, setBusy] = useState(false);

  async function handleGetLocation() {
  try {
    setBusy(true);

    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert("Permission denied", "Allow location permission to fetch GPS position.");
      return;
    }

    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      Alert.alert("Location disabled", "Turn on Location in system settings and try again.");
      return;
    }

    const last = await Location.getLastKnownPositionAsync();
    if (last?.coords) {
      setLoc({ latitude: last.coords.latitude, longitude: last.coords.longitude });
      return;
    }

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    setLoc({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
  } catch (e: any) {
    console.log("Location error:", e?.message ?? e);
    Alert.alert("Location error", "Could not fetch location. Check GPS/services and try again.");
  } finally {
    setBusy(false);
  }
}


  async function handleSave() {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle || !trimmedDesc) {
      Alert.alert("Validation", "Title and description are required.");
      return;
    }

    const note: Note = {
      id: mode === "edit" && existing ? existing.id : genId(),
      title: trimmedTitle,
      description: trimmedDesc,
      createdAt: mode === "edit" && existing ? existing.createdAt : new Date().toISOString(),
      location: loc,
    };

    try {
      setBusy(true);

      await createRemoteNote({ title: note.title, body: note.description });

      if (mode === "edit") updateNote(note);
      else addNote(note);

      navigation.navigate("NotesList");
    } catch (e) {
      Alert.alert(
        "API error",
        "Could not save to API (maybe no internet). Note was not saved."
      );
    } finally {
      setBusy(false);
    }
  }

  const locText = loc ? `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}` : "No location";

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "800" }}>
        {mode === "edit" ? "Edit note" : "New note"}
      </Text>

      <View style={{ gap: 8 }}>
        <Text accessibilityLabel="Title label">Title</Text>
        <TextInput
          accessibilityLabel="Title input"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          style={{
            minHeight: 48,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            paddingHorizontal: 12,
          }}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text accessibilityLabel="Description label">Description</Text>
        <TextInput
          accessibilityLabel="Description input"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
          style={{
            minHeight: 96,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            textAlignVertical: "top",
          }}
        />
      </View>

      <View style={{ padding: 14, borderRadius: 16, backgroundColor: "#f3f3f3", gap: 10 }}>
        <Text style={{ fontWeight: "700" }}>GPS</Text>
        <Text accessibilityLabel="Current location">{locText}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get GPS location"
          onPress={handleGetLocation}
          style={{
            minHeight: 48,
            paddingHorizontal: 16,
            justifyContent: "center",
            borderRadius: 12,
            backgroundColor: "#e5e5e5",
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ fontSize: 16 }}>Get location</Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save note"
        onPress={handleSave}
        disabled={busy}
        style={{
          minHeight: 48,
          paddingHorizontal: 16,
          justifyContent: "center",
          borderRadius: 12,
          backgroundColor: busy ? "#777" : "#111",
          alignSelf: "flex-start",
        }}
      >
        {busy ? <ActivityIndicator /> : <Text style={{ color: "#fff", fontSize: 16 }}>Save</Text>}
      </Pressable>

    </View>
  );
}
