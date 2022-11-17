import MillonaireLandingContext from './MillonaireLandingContext';
import { CurrentEventContext } from '@/context/eventContext';
import React, { useContext, useEffect, useState } from 'react';
import { IMillonaire, IQuestions, IEditModal, IStages, IAnswers, IVisibility } from '../interfaces/Millonaire';
import { INITIAL_STATE_MILLONAIRE, INITIAL_STATE_STAGE, INITIAL_STATE_USED_WILDCARD } from '../constants/formData';
import { DispatchMessageService } from '@/context/MessageService';
import { GetMillonaireAPi } from '../services/api';
import getMillonaireAdapter from '../adapters/getMillonaireAdapter';
import {
  listenerVisibilityControl,
  saveScoreUser,
  getScoreUser,
  getScore,
  getStageUser,
  saveStageUser,
  getStatusGameByUser,
  saveStatusGameByUser,
  deleteStatusStagesAndScoreAll,
} from '../services/firebase';
import { CurrentEventUserContext } from '@/context/eventUserContext';
import { Score } from '../../common/Ranking/types';
export default function MillonaireLandingProvider({ children }: { children: React.ReactNode }) {
  //-----------------------------------CONTEXT--------------------------//
  const cEvent = useContext(CurrentEventContext);
  const cUser = useContext(CurrentEventUserContext);
  //-----------------------------STATE---------------------------------//
  const [loading, setLoading] = useState(false);
  const [millonaire, setMillonaire] = useState<IMillonaire>(INITIAL_STATE_MILLONAIRE);
  const [startGame, setStartGame] = useState(false);
  const [statusGame, setStatusGame] = useState('NOT_STARTED');
  const [currentStage, setCurrentStage] = useState<IStages>(INITIAL_STATE_STAGE);
  console.log(
    '🚀 ~ file: MillonaireLandingProvider.tsx ~ line 31 ~ MillonaireLandingProvider ~ currentStage',
    currentStage
  );
  const [stage, setStage] = useState<number>(1);
  const [stages, setStages] = useState<IStages[]>([]);
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [question, setQuestion] = useState<IQuestions>({} as IQuestions);
  const [score, setScore] = useState<number>(0);
  const [scores, setScores] = useState<Score[]>([]);
  const [scoreUser, setScoreUser] = useState<Score>({} as Score);
  const [time, setTime] = useState<number>(0);
  const [visibilityControl, setVisibilityControl] = useState<IVisibility>({} as IVisibility);
  const [usedWildCards, setUsedWildCards] = useState(INITIAL_STATE_USED_WILDCARD);
  //-------------------STATE-MODALS---------------------------------------//
  const [isVisible, setIsVisible] = useState(false);
  //-------------------CONSTANTS---------------------------------------//
  const eventId = cEvent?.value?._id || '';
  const currentUser = cUser?.value || null;
  const stagesInitial =
    currentStage.stage > 1 ? currentStage : stages?.find((stage) => stage.stage === 1) || INITIAL_STATE_STAGE;
  const questionInitial = questions.find((question) => question.id === stagesInitial.question) as IQuestions;
  const user = {
    name: currentUser?.properties?.names,
    uid: currentUser?.user?.uid,
    imageProfile: currentUser?.user?.picture,
    index: stage,
    score: '0',
    //  email: currentUser.properties.email,
  };

  //-------------USEEFECTS---------------------------------------//

  useEffect(() => {
    onGetMillonaire();
    return () => {
      setLoading(false);
      setMillonaire(INITIAL_STATE_MILLONAIRE);
      setStartGame(false);
      setStatusGame('NOT_STARTED');
      setCurrentStage(INITIAL_STATE_STAGE);
      setStage(1);
      setStages([]);
      setQuestions([]);
      setQuestion({} as IQuestions);
      setScore(0);
      setScores([]);
      setScoreUser({} as Score);
      setTime(0);
      setVisibilityControl({} as IVisibility);
      setUsedWildCards(INITIAL_STATE_USED_WILDCARD);
      setIsVisible(false);
    };
  }, [eventId]);

  useEffect(() => {
    if (millonaire) {
      onGetProgressUser();
    }
  }, [millonaire, questions]);

  // CountDown with currentStage
  useEffect(() => {
    if (statusGame === 'STARTED' && currentStage && question) {
      setTime(question.timeForQuestion);
      const interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStage, statusGame]);

  // game over when time is 0
  useEffect(() => {
    if (time === 0 && statusGame === 'STARTED') {
      setStartGame(false);
      setStatusGame('GAME_OVER');
      setCurrentStage(INITIAL_STATE_STAGE);
      saveScoreUser(eventId, currentUser.user.uid!, scoreUser);
      setStage(0);
      setScore(0);
    }
  }, [time, statusGame]);

  useEffect(() => {
    if (statusGame === 'GAME_OVER') {
      getScore(eventId).then((res) => {
        setScores((res as unknown) as Score[]);
      });
    }
  }, [statusGame]);

  // listenerVisibilityControl
  useEffect(() => {
    let unsubscribe: any;
    if (eventId) {
      unsubscribe = listenerVisibilityControl(eventId, (data: any) => {
        setVisibilityControl(data);
      });
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

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

  const onGetProgressUser = async () => {
    setLoading(true);
    if (questions.length > 0) {
      Promise.all([
        getScoreUser(eventId, currentUser.user.uid!),
        getStageUser(eventId, currentUser.user.uid!),
        getStatusGameByUser(eventId, currentUser.user.uid!),
      ]).then(([score, stage, statusGame]) => {
        setScoreUser((score as Score) || ({} as Score));
        setCurrentStage((stage as IStages) || INITIAL_STATE_STAGE);
        if (statusGame && statusGame?.status === 'STARTED') {
          setStage(stage?.stage || 1);
          setQuestion(questions.find((question) => question.id === stage?.question) as IQuestions);
          setStartGame(true);
          setTime((questions.find((question) => question.id === stage?.question) as IQuestions)?.timeForQuestion);
        }
        setStatusGame(statusGame?.status || 'NOT_STARTED');
      });
    }
    setLoading(false);
  };

  // const timeOutStartGame = setTimeout(() => {
  //   onStartGame();
  // }, 10000);

  const onAnnouncement = () => {
    setStatusGame('ANNOUNCEMENT');
    // timeOutStartGame();
  };

  const onChangeStatusGame = (status: string) => {
    setStatusGame(status);
  };

  const onStartGame = () => {
    setLoading(true);
    setStartGame(true);
    setStatusGame('STARTED');
    setStage(stagesInitial.stage);
    setCurrentStage(stagesInitial);
    setScoreUser(user);
    saveScoreUser(eventId, currentUser.user.uid!, user);
    setQuestion(questionInitial);
    setLoading(false);
    saveStatusGameByUser(eventId, currentUser.user.uid, 'STARTED');
    setUsedWildCards(INITIAL_STATE_USED_WILDCARD);
  };

  const onFinishedGame = () => {
    setLoading(true);
    setStartGame(false);
    setStatusGame('GAME_OVER');
    setCurrentStage(INITIAL_STATE_STAGE);
    saveScoreUser(eventId, currentUser.user.uid!, user);
    saveStatusGameByUser(eventId, currentUser.user.uid, 'GAME_OVER');
    setLoading(false);
    setStage(0);
  };

  //------------------- FUNCIONES PARA WILDCARD --------------------------//

  const onFiftyOverFifty = () => {
    // funcion para dejar una respuesta correcta y una incorrecta de forma aleatoria y ordenarlas de forma aleatoria
    const answers = question.answers;
    const correctAnswer = answers.find((answer) => answer.isCorrect === true);
    const incorrectAnswer = answers.filter((answer) => answer.isCorrect === false);
    const incorrectAnswerRandom = incorrectAnswer[Math.floor(Math.random() * incorrectAnswer.length)];
    const answersFiftyOverFifty = [correctAnswer, incorrectAnswerRandom];
    const answersFiftyOverFiftyRandom = answersFiftyOverFifty.sort(() => Math.random() - 0.5);
    setQuestion({ ...question, answers: answersFiftyOverFiftyRandom });
    setUsedWildCards({ ...usedWildCards, used50: true });
  };
  //-------------------------------------------FUNCIONES DRAWER-------------------------------------------//
  const onChangeVisibilityDrawer = () => {
    setIsVisible(!isVisible);
  };

  //--------------------------------FUNCIONES DE JUGABILIDAD -----------------------------------------//
  const onNextQuestion = () => {
    if (stage <= stages.length - 1) {
      const newStage = stage + 1;
      const newCurrentStage = stages.find((stage) => stage.stage === newStage) || INITIAL_STATE_STAGE;
      setCurrentStage(newCurrentStage);
      setStage(newStage);
      setQuestion(questions.find((question) => question.id === newCurrentStage.question) as IQuestions);
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
    if (!currentUser) {
      DispatchMessageService({
        type: 'error',
        msj: 'No encontramos el usuario',
        action: 'show',
      });
      return;
    }
    saveStageUser(eventId, scoreUser.uid, currentStage);
    if (answer.isCorrect === false) {
      DispatchMessageService({
        type: 'error',
        msj: 'Perdites, no contesto correctamente la pregunta',
        action: 'show',
      });
      // agregar funcionalidad de firebase
      setCurrentStage(INITIAL_STATE_STAGE);
      setStatusGame('GAME_OVER');
      saveStatusGameByUser(eventId, scoreUser.uid, 'GAME_OVER');
      saveScoreUser(eventId, scoreUser.uid!, scoreUser);
      return;
    }

    if (currentStage.lifeSaver === true || stage === stages.length) {
      // agregar funcionalidad de firebase
      setScoreUser((prevState) => ({
        ...prevState,
        score: String(currentStage.score),
      }));
      saveScoreUser(eventId, scoreUser.uid, scoreUser);
    }
    saveStatusGameByUser(eventId, scoreUser.uid, 'STARTED');
    DispatchMessageService({
      type: 'success',
      msj: 'Felicidades, contesto correctamente la pregunta',
      action: 'show',
    });
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
        visibilityControl,
        scoreUser,
        scores,
        usedWildCards,
        onChangeVisibilityDrawer,
        onStartGame,
        onFinishedGame,
        onFiftyOverFifty,
        onSaveAnswer,
        onAnnouncement,
        onChangeStatusGame,
      }}>
      {children}
    </MillonaireLandingContext.Provider>
  );
}
