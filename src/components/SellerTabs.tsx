import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Tabs } from "expo-router";
import { BottomTabNavigationOptions } from "expo-router/build/react-navigation/bottom-tabs";

type ClientTabsProps = {
  options: BottomTabNavigationOptions;
  iconSize: number;
};

export default function SellerTabs({ options, iconSize }: ClientTabsProps) {
  return (
    <Tabs screenOptions={options}>
      <Tabs.Screen
        name="dashboard-seller"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" color={color} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="history-seller"
        options={{
          title: "Historial",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="receipt-long" color={color} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="terminal"
        options={{
          title: "Terminal",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="credit-card" color={color} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="sync-seller"
        options={{
          title: "Sync",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="sync" color={color} size={iconSize} />
          ),
        }}
      />
    </Tabs>
  );
}
