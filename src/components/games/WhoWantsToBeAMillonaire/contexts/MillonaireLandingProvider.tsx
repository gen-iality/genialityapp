import MillonaireLandingContext from './MillonaireLandingContext';
import { CurrentEventContext } from '@/context/eventContext';
import React, { useContext, useEffect, useState } from 'react';
import { IMillonaire, IQuestions, IEditModal, IStages, IAnswers } from '../interfaces/Millonaire';
import { INITIAL_STATE_MILLONAIRE } from '../constants/formData';
import { DispatchMessageService } from '@/context/MessageService';
import { GetMillonaireAPi } from '../services/api';
import getMillonaireAdapter from '../adapters/getMillonaireAdapter';

export default function MillonaireLandingProvider({ children }: { children: React.ReactNode }) {
  const cEvent = useContext(CurrentEventContext);
  const [loading, setLoading] = useState(false);
  const [millonaire, setMillonaire] = useState<IMillonaire>(INITIAL_STATE_MILLONAIRE);
  const stagesForExample: IStages[] = [
    {
      stage: 1,
      question: {
        question: 'Cuanto es dos mas dos?',
        timeForQuestion: 30,
        type: 'text',
        answers: [
          {
            answer: '1',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: '2',
            isCorrect: true,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: '4',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: '6',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
        ],
      },
      lifeSaver: true,
      score: 100,
    },
    {
      stage: 2,
      question: {
        question: 'Agua es ?',
        timeForQuestion: 10,
        type: 'text',
        answers: [
          {
            answer: 'nada',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: 'h2o',
            isCorrect: true,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: 'false',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: '6',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
        ],
      },
      lifeSaver: false,
      score: 200,
    },
    {
      stage: 3,
      question: {
        question: 'Pais que empieza con CO',
        timeForQuestion: 40,
        type: 'text',
        answers: [
          {
            answer: 'Paraguay',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: 'COSTA RICA',
            isCorrect: true,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: 'CAMERUN',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: '6',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
        ],
      },
      lifeSaver: true,
      score: 300,
    },
    {
      stage: 4,
      question: {
        question: 'Animal mas peligros de la tierrra ?',
        timeForQuestion: 60,
        type: 'text',
        answers: [
          {
            answer: 'perro',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: 'oso',
            isCorrect: true,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: 'leon',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
          {
            answer: 'gato',
            isCorrect: false,
            isTrueOrFalse: false,
            type: 'text',
          },
        ],
      },
      lifeSaver: true,
      score: 400,
    },
  ];
  const eventId = cEvent?.value?._id || '';
  const [startGame, setStartGame] = useState(false);
  const [currentStage, setCurrentStage] = useState<IStages | string>('INICIAR PREGUNTA');
  const [stage, setStage] = useState<number | string>(0);
  const [score, setScore] = useState<Number>(0);
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

  const onStartGame = () => {
    setLoading(true);
    setStartGame(true);
    setCurrentStage(stagesForExample[stage]);
    setLoading(false);
  };

  const onFinishedGame = () => {
    setLoading(true);
    setStartGame(false);
    setCurrentStage('JUEGO FINALIZADO');
    setLoading(false);
    setStage(0);
  };

  //------------------- FUNCIONES PARA WILDCARD --------------------------//

  const onFiftyOverFifty = () => {
    setLoading(true);
    setStartGame(false);
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

  //--------------------------------FUNCIONES DE JUGABILIDAD -----------------------------------------//
  const onNextQuestion = () => {
    if (typeof stage === 'number') {
      const newStage = stage + 1;
      if (stage < stagesForExample.length - 1) {
        setCurrentStage(stagesForExample[newStage]);
        setStage(newStage);
        return;
      }
      setCurrentStage('JUEGO FINALIZADO');
      setStage(newStage);
    }
    if (stage !== 'Finalizado') {
      DispatchMessageService({
        type: 'error',
        msj: 'Algo ha ocurrido al avanzar',
        action: 'show',
      });
    }

    return;
  };

  const onSaveAnswer = (question: IQuestions, answer: IAnswers) => {
    if (!question) {
      DispatchMessageService({
        type: 'error',
        msj: 'No encontramos la pregunta a evaluar',
        action: 'show',
      });
      return;
    }
    if (answer.isCorrect === false) {
      DispatchMessageService({
        type: 'error',
        msj: 'Perdites, no contesto correctamente la pregunta',
        action: 'show',
      });
      // agregar funcionalidad de firebase
      setCurrentStage('JUEGO FINALIZADO, NO CONTESTO CORRECTAMENTE');
      setStage('Finalizado');
      return;
    }
    // agregar funcionalidad a firebase
    onNextQuestion();
  };

  return (
    <MillonaireLandingContext.Provider
      value={{
        event: cEvent,
        millonaire,
        stages: stagesForExample,
        loading,
        isVisible,
        startGame,
        currentStage,
        onChangeVisibilityDrawer,
        onStartGame,
        onFinishedGame,
        onFiftyOverFifty,
        onSaveAnswer,
      }}>
      {children}
    </MillonaireLandingContext.Provider>
  );
}
