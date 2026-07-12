import GreetingsScreen from "../pages/welcomeStack/greetings";
import GuideScreen from "../pages/welcomeStack/guide";
import TipsScreen from "../pages/welcomeStack/tips";
import type { welcomeProps } from "../types/user.types";

const WELCOME_COMPONENTS: Record<string, React.ComponentType<welcomeProps>> = {
  greeting: GreetingsScreen,
  guide: GuideScreen,
  tips: TipsScreen,
};

export default WELCOME_COMPONENTS;
