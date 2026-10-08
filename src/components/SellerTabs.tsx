import { Tabs } from "expo-router";
import type { BottomTabNavigationOptions } from "expo-router/build/react-navigation/bottom-tabs";
import {
  CreditCard,
  LayoutDashboard,
  ReceiptText,
  RefreshCw,
} from "lucide-react-native";

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
            <LayoutDashboard
              color={color}
              size={iconSize}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history-seller"
        options={{
          title: "Historial",
          tabBarIcon: ({ color }) => (
            <ReceiptText
              color={color}
              size={iconSize}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="terminal"
        options={{
          title: "Terminal",
          tabBarIcon: ({ color }) => (
            <CreditCard
              color={color}
              size={iconSize}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sync-seller"
        options={{
          title: "Sync",
          tabBarIcon: ({ color }) => (
            <RefreshCw
              color={color}
              size={iconSize}
            />
          ),
        }}
      />
    </Tabs>
  );
}
