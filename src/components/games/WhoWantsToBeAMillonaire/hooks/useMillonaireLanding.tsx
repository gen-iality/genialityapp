import { useContext } from 'react';
import MillonaireLandingContext from '../contexts/MillonaireLandingContext';
export const useMillonaireLanding = () => {
  const { event, millonaire, loading, isVisible, startGame, onChangeVisibilityDrawer } = useContext(
    MillonaireLandingContext
  );

  return {
    event,
    loading,
    millonaire,
    isVisible,
    startGame,
    onChangeVisibilityDrawer,
  };
};
