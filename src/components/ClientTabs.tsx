import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Tabs } from "expo-router";
import type { BottomTabNavigationOptions } from "expo-router/build/react-navigation/bottom-tabs";

type ClientTabsProps = {
  options: BottomTabNavigationOptions;
  iconSize: number;
};

export default function ClientTabs({ options, iconSize }: ClientTabsProps) {
  return (
    <Tabs screenOptions={options}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" color={color} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="debts"
        options={{
          title: "Deudas",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="receipt" color={color} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="receipt-long" color={color} size={iconSize} />
          ),
        }}
      />
    </Tabs>
  );
}
