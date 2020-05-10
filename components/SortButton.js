import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

import Colors from "../constants/Colors";

export default function SortButton(props) {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          backgroundColor: Colors.primary,
          shadowColor: Colors.black,
        },
        styles.button,
        props.style,
      ]}
      hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
    >
      <Ionicons
        name={props.name}
        size={32}
        color={Colors.white}
        // color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
      <Text style={{ color: Colors.white }}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
