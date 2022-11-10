import { useContext } from "react";
import MillonaireLandingContext from "../contexts/MillonaireLandingContext";
export const useMillonaireLanding = () => {
  const {
    event,
    millonaire,
    stages,
    loading,
    isVisible,
    startGame,
    currentStage,
    onChangeVisibilityDrawer,
    onFinishedGame,
    onStartGame,
    onFiftyOverFifty,
    onSaveAnswer,
  } = useContext(MillonaireLandingContext);

  return {
    event,
    loading,
    millonaire,
    isVisible,
    stages,
    startGame,
    currentStage,
    onChangeVisibilityDrawer,
    onStartGame,
    onFinishedGame,
    onFiftyOverFifty,
    onSaveAnswer,
  };
};
