import Main from "@/components/StyledView";
import HistoryOverview from "@/features/user/components/HistoryOverview";
import DebtsOverview from "./components/DebtsOverview";
import SellersOverview from "./components/SellersOverview";

export default function UserDashboard() {
  return (
    <Main className="p-2">
      <DebtsOverview />
      <SellersOverview />
      <HistoryOverview />
    </Main>
  );
}
