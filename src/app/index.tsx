import { UserContextProvider } from "@/context/UserContext";
import WelcomePage from "@/features/user/pages/WelcomePage";

export default function Index() {
  return (
    <UserContextProvider>
      <WelcomePage />
    </UserContextProvider>
  );
}
