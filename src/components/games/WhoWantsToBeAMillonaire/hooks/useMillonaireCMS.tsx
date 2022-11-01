import { useContext, useEffect, useState } from 'react';
import MillonaireCMSContext from '../contexts/MillonaireCMSContext';
export const useMillonaireCMS = () => {
  const { event, millonaire, loading, isNewGame, onChangeMillonaire, onSubmit } = useContext(MillonaireCMSContext);

  return {
    event,
    loading,
    millonaire,
    isNewGame,
    onChangeMillonaire,
    onSubmit,
  };
};
