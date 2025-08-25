import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  const [display1, display2] = useState("");
  const [scientific1, scientific2] = useState(false);

  const handlePress = (value:string) => {
    if (value === "AC") {
      display2("");
    } else if (value === "⌫") {
      display2(display1.slice(0, -1));
    } else if (value === "=") {
      try {
        let result = display1
        .replace(/×/g,"*")
        .replace(/÷/g,"/")
        .replace(/%/g,"%")
        display2(eval(result).toString());
      } catch (e) {
        display2("Error");
      }
    } else if (value === "%") {
      try {
        display2((eval(display1) / 100).toString());
      } catch {
        display2("Error");
      }
    } else {
      display2(display1 + value);
    }
  };

  const normalButtons = [
    ["AC", "⌫", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["00", "0", ".", "="],
  ];

  const sciButtons = [
    ["sin", "cos", "tan", "rad", "deg"],
    ["log", "ln", "(", ")", "inv"],
    ["!", "AC", "%", "⌫", "÷"],
    ["*", "7", "8", "9", "×"],
    ["√", "4", "5", "6", "-"],
    ["π", "1", "2", "3", "+"],
    ["e", "00", "0", ".", "="],
  ];

  const buttons = scientific1 ? sciButtons : normalButtons;

  return (
    <View style={styles.container}>
      {/* scientific button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => scientific2(!scientific1)}
        >
          <Text style={styles.toggleText}>
            {scientific1 ? "Normal" : "Scientific"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Display */}
      <Text style={styles.display}>{display1}</Text>

      {/* Buttons grid */}
      <View style={styles.buttons}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((btn, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.button}
                onPress={() => btn && handlePress(btn)}
              >
                <Text style={styles.text}>{btn}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    marginTop: 35,
  },
  toggleButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 20,
  },
  toggleText: { color: "white", fontSize: 16 },
  display: {
    fontSize: 40,
    color: "white",
    textAlign: "right",
    margin: 20,
    flex: 1,
  },
  buttons: {
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 5,
  },
  button: {
    width: 65,
    height: 65,
    borderRadius: 65 / 2,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "white", fontSize: 20 },
});
