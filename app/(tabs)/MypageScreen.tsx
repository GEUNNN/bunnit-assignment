import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

const Mypage: FC = () => {
  return (
    <View style={styles.container}>
      <Text>Mypage</Text>
    </View>
  );
};

export default Mypage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
