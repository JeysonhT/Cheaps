import { Tabs } from "expo-router";
import type { BottomTabNavigationOptions } from "expo-router/build/react-navigation/bottom-tabs";
import { Home, Receipt, ReceiptText } from "lucide-react-native";

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
            <Home color={color} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="debts"
        options={{
          title: "Deudas",
          tabBarIcon: ({ color }) => (
            <Receipt color={color} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          tabBarIcon: ({ color }) => (
            <ReceiptText color={color} size={iconSize} />
          ),
        }}
      />
    </Tabs>
  );
}
