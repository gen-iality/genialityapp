import MillonaireLandingContext from './MillonaireLandingContext';
import { CurrentEventContext } from '@/context/eventContext';
import React, { useContext, useEffect, useState } from 'react';
import { IMillonaire, IQuestions, IEditModal, IStages } from '../interfaces/Millonaire';
import { INITIAL_STATE_MILLONAIRE } from '../constants/formData';
import { DispatchMessageService } from '@/context/MessageService';
import { GetMillonaireAPi } from '../services/api';
import getMillonaireAdapter from '../adapters/getMillonaireAdapter';

export default function MillonaireLandingProvider({ children }: { children: React.ReactNode }) {
  const cEvent = useContext(CurrentEventContext);
  const [loading, setLoading] = useState(false);
  const [millonaire, setMillonaire] = useState<IMillonaire>(INITIAL_STATE_MILLONAIRE);
  const eventId = cEvent?.value?._id || '';
  const [startGame, setStartGame] = useState(false);

  //-------------------STATE-MODALS---------------------------------------//
  const [isVisible, setIsVisible] = useState(false);
  //-------------USEEFECTS---------------------------------------//

  useEffect(() => {
    onGetMillonaire();
    return () => {
      setLoading(false);
      setMillonaire(INITIAL_STATE_MILLONAIRE);
    };
  }, [eventId]);

  //--------------FUNCIONES-------------------------------------//

  const onGetMillonaire = async () => {
    setLoading(true);
    const response = await GetMillonaireAPi(eventId);
    if (response) {
      const millonaireAdapter = getMillonaireAdapter(response);
      setMillonaire(millonaireAdapter);
      setLoading(false);
      return DispatchMessageService({
        type: 'success',
        msj: 'parametros de la dinamica obtenidos correctamente',
        action: 'show',
      });
    }
    setMillonaire(INITIAL_STATE_MILLONAIRE);
    setLoading(false);
  };

  //   const onSaveAnswers = () => {
  //     //setLoading(true);
  //     setMillonaire((prevState) => ({
  //       ...prevState,
  //       questions: [...prevState.questions, question],
  //     }));
  //     // setLoading(false);
  //   };

  //-------------------------------------------FUNCIONES DRAWER-------------------------------------------//
  const onChangeVisibilityDrawer = () => {
    setIsVisible(!isVisible);
  };

  return (
    <MillonaireLandingContext.Provider
      value={{
        event: cEvent,
        millonaire,
        loading,
        isVisible,
        startGame,
        onChangeVisibilityDrawer,
      }}>
      {children}
    </MillonaireLandingContext.Provider>
  );
}
