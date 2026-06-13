import { Roles } from "@/constants/roles";
import { Redirect } from "expo-router";

const CURRENT_ROLE: Roles = "user";

export default function Index() {
  if (CURRENT_ROLE === "seller") {
    return <Redirect href="/(seller)/dashboard-seller" />;
  }

  return <Redirect href="/(tabs)/dashboard" />;
}
