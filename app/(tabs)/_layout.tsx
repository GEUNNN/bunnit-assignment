import { Tabs } from "expo-router";
import React from "react";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="CalendarScreen"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="LibraryScreen"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="dumbbell" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="MypageScreen"
        options={{
          title: "Mypage",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
