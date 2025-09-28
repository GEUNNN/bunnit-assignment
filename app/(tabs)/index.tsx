import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

const HomeScreen: FC = () => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
