import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Colours from "../constants/Colours";

const StartUpScreen = (props) => {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={Colours.darkblue} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartUpScreen;
