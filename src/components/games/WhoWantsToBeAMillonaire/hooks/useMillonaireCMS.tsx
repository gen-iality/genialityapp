import { useContext } from 'react';
import MillonaireCMSContext from '../contexts/MillonaireCMSContext';
export const useMillonaireCMS = () => {
  const {
    event,
    millonaire,
    loading,
    isNewGame,
    question,
    stage,
    isVisibleModalQuestion,
    isVisibleModalStage,
    onChangeAppearance,
    onChangeMillonaire,
    onSubmit,
    onDelete,
    onSaveQuestion,
    onSaveStage,
    onCancelModalStage,
    onCancelModalQuestion,
    setIsVisibleModalQuestion,
    setIsVisibleModalStage,
  } = useContext(MillonaireCMSContext);

  return {
    event,
    loading,
    millonaire,
    isNewGame,
    stage,
    question,
    isVisibleModalQuestion,
    isVisibleModalStage,
    onChangeMillonaire,
    onChangeAppearance,
    onSubmit,
    onDelete,
    onSaveQuestion,
    onSaveStage,
    onCancelModalStage,
    onCancelModalQuestion,
    setIsVisibleModalQuestion,
    setIsVisibleModalStage,
  };
};
