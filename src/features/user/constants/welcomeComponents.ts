import FinishScreen from "../pages/welcomeStack/finish";
import GreetingsScreen from "../pages/welcomeStack/greetings";
import GuideScreen from "../pages/welcomeStack/guide";
import type { welcomeProps } from "../types/user.types";

const WELCOME_COMPONENTS: Record<string, React.ComponentType<welcomeProps>> = {
  greeting: GreetingsScreen,
  guide: GuideScreen,
  finish: FinishScreen,
};

export default WELCOME_COMPONENTS;
