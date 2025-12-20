import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NotesProvider } from "./src/store/NotesStore";

import NotesListScreen from "./src/screens/NotesListScreen";
import NoteDetailsScreen from "./src/screens/NoteDetailsScreen";
import NoteFormScreen from "./src/screens/NoteFormScreen";
import AboutScreen from "./src/screens/AboutScreen";
import type { RootStackParamList } from "./src/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();



export default function App() {
  return (
    <NotesProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="NotesList" component={NotesListScreen} options={{ title: "Notes" }} />
          <Stack.Screen name="NoteDetails" component={NoteDetailsScreen} options={{ title: "Details" }} />
          <Stack.Screen name="NoteForm" component={NoteFormScreen} options={{ title: "Add / Edit" }} />
          <Stack.Screen name="About" component={AboutScreen} options={{ title: "About" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </NotesProvider>
  );
}
