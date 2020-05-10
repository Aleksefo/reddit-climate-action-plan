import * as React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";

import useCachedResources from "./hooks/useCachedResources";

export default function App(props) {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
        <HomeScreen />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
