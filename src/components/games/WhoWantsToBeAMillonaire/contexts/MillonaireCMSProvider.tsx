import MillonaireCMSContext from './MillonaireCMSContext';
import { CurrentEventContext } from '@/context/eventContext';
import React, { useContext, useEffect, useState } from 'react';
import { IMillonaire } from '../interfaces/Millonaire';
import { INITIAL_STATE_MILLONAIRE } from '../constants/formData';
import { DispatchMessageService } from '@/context/MessageService';

export default function MillonaireCMSProvider({ children }: { children: React.ReactNode }) {
  const cEvent = useContext(CurrentEventContext);
  const [loading, setLoading] = useState(false);
  const [millonaire, setMillonaire] = useState<IMillonaire>(INITIAL_STATE_MILLONAIRE);
  const [isNewGame, setIsNewGame] = useState(true);

  //-------------USEEFECTS---------------------------------------//

  useEffect(() => {
    setLoading(true);
    setMillonaire(INITIAL_STATE_MILLONAIRE);
    setIsNewGame(true);
    setLoading(false);
    return () => {
      setLoading(false);
      setMillonaire(INITIAL_STATE_MILLONAIRE);
    };
  }, []);

  //--------------FUNCIONES-------------------------------------//
  const onChangeMillonaire = (name: string, value: string) => {
    setMillonaire((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onCreateMillonaire = () => {
    setLoading(true);
    const { name, numberOfQuestions } = millonaire;
    if (name === '' || numberOfQuestions === 0) {
      return DispatchMessageService({
        type: 'error',
        msj: 'Se debe completar los parametros',
        action: 'show',
      });
    }
    // colocar la peticion de crear
    DispatchMessageService({
      type: 'success',
      msj: 'Se creo la dinamica correctamente',
      action: 'show',
    });
    setIsNewGame(false);
    setLoading(false);
  };

  const onUpdateMillonaire = () => {
    setLoading(true);
    const { name, numberOfQuestions } = millonaire;
    DispatchMessageService({
      type: 'success',
      msj: 'Se actaulizaron los parametros correctamente',
      action: 'show',
    });
    // colocar la peticion de crear
    setIsNewGame(false);
    setLoading(false);
  };

  const onSubmit = () => {
    console.log('el update aun no esta');
    if (isNewGame) {
      console.log('🚀 ~ file: MillonaireCMSProvider.tsx ~ line 53 ~ onSubmit ~ isNewGame', isNewGame);
      onCreateMillonaire();
    } else {
      console.log('el update aun no esta');
    }
  };

  return (
    <MillonaireCMSContext.Provider
      value={{
        event: cEvent,
        millonaire,
        loading,
        isNewGame,
        onChangeMillonaire,
        onCreateMillonaire,
        onSubmit,
      }}>
      {children}
    </MillonaireCMSContext.Provider>
  );
}
