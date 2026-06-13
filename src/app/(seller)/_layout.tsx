import SellerTabs from "@/components/SellerTabs";
import Colors from "@/constants/Colors";
import { BottomTabNavigationOptions } from "expo-router/build/react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SellerLayout() {
  const insets = useSafeAreaInsets();

  const tabsOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: Colors.light.tint,
    headerShown: false,
    tabBarStyle: {
      paddingBottom: insets.bottom,
    },
  };

  return <SellerTabs options={tabsOptions} iconSize={24} />;
}
