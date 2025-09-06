import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";

export default function App() {
  const [mode, setMode] = useState<"calc" | "currency">("calc");

  // Calc state
  const [display1, setDisplay1] = useState("");
  const [scientific1, setScientific1] = useState(false);

  // Currency converter
  const [amount, setAmount] = useState("1"); // default to 1
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [rate, setRate] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selecting, setSelecting] = useState<"from" | "to">("from");

  const currencies = [
    "USD","INR","EUR","GBP","JPY","CAD","AUD","CNY","SGD","BRL",
    "ZAR","AED","CHF","SEK","NZD"
  ];

  //exchange rates
  const fetchRates = async () => {
    try {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${fromCurrency}`
      );
      const data = await response.json();
      if (data && data.rates) {
        setRate(data.rates[toCurrency]);
      }
    } catch (e) {
      console.log("Error fetching rates", e);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [fromCurrency, toCurrency]);

  //Calc logic
  const handlePress = (value: string) => {
    if (value === "AC") {
      setDisplay1("");
    } else if (value === "⌫") {
      setDisplay1(display1.slice(0, -1));
    } else if (value === "=") {
      try {
        let result = display1
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/%/g, "%");
        setDisplay1(eval(result).toString());
      } catch (e) {
        setDisplay1("Error");
      }
    } else {
      setDisplay1(display1 + value);
    }
  };

  // Curren keypad
  const handleCurrencyKey = (value: string) => {
    if (value === "AC") {
      setAmount("1"); // reset to 1 instead of 0
    } else if (value === "⌫") {
      setAmount(amount.length > 1 ? amount.slice(0, -1) : "1");
    } else {
      setAmount(amount === "0" || amount === "1" ? value : amount + value);
    }
  };

  // Curren select
  const handleCurrencySelect = (currency: string) => {
    if (selecting === "from") {
      setFromCurrency(currency);
    } else {
      setToCurrency(currency);
    }
    // reset to 1
    setAmount("1");
    setModalVisible(false);
  };

  // buttons
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

  const currencyButtons = [
    ["AC", "⌫"],
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["00", "0", "."],
  ];

  const buttons = scientific1 ? sciButtons : normalButtons;

  // Conversion
  const getConvertedValue = () => {
    if (!rate) return "Loading...";
    if (fromCurrency === toCurrency) return amount; // same currency
    return (parseFloat(amount) * rate).toFixed(2);
  };

  return (
    <View style={styles.container}>
      {/* Mode */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setMode("calc")}
        >
          <Text style={styles.toggleText}>Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setMode("currency")}
        >
          <Text style={styles.toggleText}>Currency Converter</Text>
        </TouchableOpacity>
      </View>

      {mode === "calc" ? (
        <>
          <TouchableOpacity
            style={styles.scientificToggle}
            onPress={() => setScientific1(!scientific1)}
          >
            <Text style={styles.scientificText}>
              {scientific1 ? "Normal" : "Sci"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.display}>{display1}</Text>

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
        </>
      ) : (
        <>
          {/* Currency Converter UI */}
          <Text style={styles.header}>Currency Converter</Text>

          <View style={styles.row}>
            <Text style={styles.amount}>{amount}</Text>
            <TouchableOpacity
              style={styles.currencyButton}
              onPress={() => {
                setSelecting("from");
                setModalVisible(true);
              }}
            >
              <Text style={styles.text}>{fromCurrency} ▸</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={styles.result}>{getConvertedValue()}</Text>
            <TouchableOpacity
              style={styles.currencyButton}
              onPress={() => {
                setSelecting("to");
                setModalVisible(true);
              }}
            >
              <Text style={styles.text}>{toCurrency} ▸</Text>
            </TouchableOpacity>
          </View>

          {/*Keypad */}
          <View style={styles.buttons}>
            {currencyButtons.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((btn, colIndex) => (
                  <TouchableOpacity
                    key={colIndex}
                    style={styles.button}
                    onPress={() => handleCurrencyKey(btn)}
                  >
                    <Text style={styles.text}>{btn}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/*Selection*/}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList
                  data={currencies}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => handleCurrencySelect(item)}
                    >
                      <Text style={styles.modalText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginTop: 35,
  },
  toggleButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 20,
  },
  toggleText: { color: "white", fontSize: 16 },

  scientificToggle: {
    alignSelf: "flex-end",
    backgroundColor: "#555",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 5,
  },
  scientificText: {
    color: "white",
    fontSize: 14,
  },

  display: {
    fontSize: 40,
    color: "white",
    textAlign: "right",
    margin: 20,
    flex: 1,
  },
  buttons: { flexDirection: "column", justifyContent: "flex-end" },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    alignItems: "center",
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
  header: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
  amount: { fontSize: 32, color: "white", flex: 1, textAlign: "right" },
  result: { fontSize: 32, color: "white", flex: 1, textAlign: "right" },
  currencyButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  modalItem: {
    padding: 15,
    borderBottomColor: "#444",
    borderBottomWidth: 1,
  },
  modalText: { color: "white", fontSize: 18 },
});
