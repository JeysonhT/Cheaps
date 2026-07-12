import { StyleSheet } from "react-native";
import Main from "@/components/StyledView";
import HistoryOverview from "@/features/user/components/HistoryOverview";
import { makeStyles } from "@/hooks/useTheme";
import DebtsOverview from "./components/DebtsOverview";
import SellersOverview from "./components/SellersOverview";

export default function UserDashboard() {
  const styles = useStyles();
  return (
    <Main style={styles.container}>
      <DebtsOverview />
      <SellersOverview />
      <HistoryOverview />
    </Main>
  );
}

const useStyles = makeStyles((t, sp) =>
  StyleSheet.create({
    container: {
      padding: sp[2],
    },
  }),
);
