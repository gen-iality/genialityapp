import { useContext } from 'react';
import MillonaireLandingContext from '../contexts/MillonaireLandingContext';
export const useMillonaireLanding = () => {
  const {
    event,
    millonaire,
    stages,
    loading,
    isVisible,
    startGame,
    currentStage,
    score,
    time,
    statusGame,
    question,
    stage,
    onChangeVisibilityDrawer,
    onFinishedGame,
    onStartGame,
    onFiftyOverFifty,
    onSaveAnswer,
    onAnnouncement,
  } = useContext(MillonaireLandingContext);

  return {
    event,
    loading,
    millonaire,
    isVisible,
    stages,
    startGame,
    currentStage,
    score,
    time,
    statusGame,
    question,
    stage,
    onChangeVisibilityDrawer,
    onStartGame,
    onFinishedGame,
    onFiftyOverFifty,
    onSaveAnswer,
    onAnnouncement,
  };
};
