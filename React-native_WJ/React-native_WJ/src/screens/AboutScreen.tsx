import React from "react";
import { Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "800" }}>About</Text>

      <View style={{ padding: 14, borderRadius: 16, backgroundColor: "#f3f3f3", gap: 8 }}>
        <Text style={{ fontWeight: "700" }}>Version</Text>
        <Text accessibilityLabel="App version">1.0.0</Text>
      </View>

      <View style={{ padding: 14, borderRadius: 16, backgroundColor: "#f3f3f3", gap: 8 }}>
        <Text style={{ fontWeight: "700" }}>Wojciech Jelonek, Budowa aplikacji mobilnych z uzyciem technologii frontendowych </Text>
      </View>
    </View>
  );
}
