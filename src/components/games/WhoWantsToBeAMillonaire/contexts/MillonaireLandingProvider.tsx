import MillonaireLandingContext from './MillonaireLandingContext';
import { CurrentEventContext } from '@/context/eventContext';
import React, { useContext, useEffect, useState } from 'react';
import { IMillonaire, IQuestions, IEditModal, IStages, IAnswers } from '../interfaces/Millonaire';
import { INITIAL_STATE_MILLONAIRE, INITIAL_STATE_STAGE } from '../constants/formData';
import { DispatchMessageService } from '@/context/MessageService';
import { GetMillonaireAPi } from '../services/api';
import getMillonaireAdapter from '../adapters/getMillonaireAdapter';

export default function MillonaireLandingProvider({ children }: { children: React.ReactNode }) {
  const cEvent = useContext(CurrentEventContext);
  const [loading, setLoading] = useState(false);
  const [millonaire, setMillonaire] = useState<IMillonaire>(INITIAL_STATE_MILLONAIRE);
  const eventId = cEvent?.value?._id || '';
  const [startGame, setStartGame] = useState(false);
  const [statusGame, setStatusGame] = useState('NOT_STARTED');
  const [currentStage, setCurrentStage] = useState<IStages>(INITIAL_STATE_STAGE);
  const [stage, setStage] = useState<number>(1);
  const [stages, setStages] = useState<IStages[]>([]);
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [question, setQuestion] = useState<IQuestions>({} as IQuestions);
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
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

  // CountDown with currentStage
  useEffect(() => {
    if (statusGame === 'STARTED') {
      setTime(questions[0].timeForQuestion);
      const interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStage]);

  // game over when time is 0
  useEffect(() => {
    if (time === 0 && statusGame === 'STARTED') {
      setStartGame(false);
      setStatusGame('GAME_OVER');
      setCurrentStage(INITIAL_STATE_STAGE);
      setStage(0);
      setScore(0);
    }
  }, [time]);

  //--------------FUNCIONES-------------------------------------//

  const onGetMillonaire = async () => {
    setLoading(true);
    const response = await GetMillonaireAPi(eventId);
    if (response) {
      const millonaireAdapter = getMillonaireAdapter(response);
      setMillonaire(millonaireAdapter);
      setQuestions(millonaireAdapter.questions);
      setStages(millonaireAdapter.stages);
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

  // const timeOutStartGame = setTimeout(() => {
  //   onStartGame();
  // }, 10000);

  const onAnnouncement = () => {
    setStatusGame('ANNOUNCEMENT');
    // timeOutStartGame();
  };

  const onStartGame = () => {
    setLoading(true);
    setStartGame(true);
    setStatusGame('STARTED');
    setStage(stages[0].stage);
    setCurrentStage(stages[0]);
    //  clearTimeout(onAnnouncement);
    setQuestion(questions.find((question) => question.id === stages[0].question) as IQuestions);
    setLoading(false);
  };

  const onFinishedGame = () => {
    setLoading(true);
    setStartGame(false);
    setCurrentStage(INITIAL_STATE_STAGE);
    setLoading(false);
    setStage(0);
  };

  //------------------- FUNCIONES PARA WILDCARD --------------------------//

  const onFiftyOverFifty = () => {
    // funcion para eliminar dos respuestas incorrectas
    // if (typeof currentStage === 'string') return;
    // const answers = currentStage.question.answers;
    // const answersCorrect = answers.filter((answer) => answer.isCorrect);
    // const answersIncorrect = answers.filter((answer) => !answer.isCorrect);
    // const answersIncorrectRandom = answersIncorrect.sort(() => Math.random() - 0.5);
    // const answersIncorrectRandomCut = answersIncorrectRandom.slice(0, 2);
    // const answersRandom = answersCorrect.concat(answersIncorrectRandomCut).sort(() => Math.random() - 0.5);
    // const newCurrentStage = {
    //   ...currentStage,
    //   question: {
    //     ...currentStage.question,
    //     answers: answersRandom,
    //   },
    // };
    // setCurrentStage(newCurrentStage);
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
    if (stage < stages.length - 1) {
      const newStage = stage + 1;

      setCurrentStage(stages[newStage]);
      setStage(newStage);
      setQuestion(questions.find((question) => question.id === stages[newStage].question) as IQuestions);
      return;
    }
    setStatusGame('GAME_OVER');
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
      setCurrentStage(INITIAL_STATE_STAGE);
      setStatusGame('GAME_OVER');
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
        onStartGame,
        onFinishedGame,
        onFiftyOverFifty,
        onSaveAnswer,
        onAnnouncement,
      }}>
      {children}
    </MillonaireLandingContext.Provider>
  );
}
