import { Text, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export default function TabTwoScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Profile</ThemedText>
    </View>
  );
}


