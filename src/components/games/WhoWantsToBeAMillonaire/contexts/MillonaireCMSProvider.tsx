import MillonaireCMSContext from './MillonaireCMSContext';
import { CurrentEventContext } from '@/context/eventContext';
import React, { useContext, useEffect, useState } from 'react';
import {
  IMillonaire,
  IQuestions,
  IEditModal,
  IStages,
  IAnswers,
  IModalVisible,
  IVisibility,
} from '../interfaces/Millonaire';
import {
  INITIAL_STATE_MILLONAIRE,
  INITIAL_STATE_QUESTION,
  INITIAL_STATE_STAGE,
  INITIAL_STATE_EDIT_MODAL,
  INITIAL_STATE_ANSWER,
  INITIAL_STATE_MODAL_VISIBLE,
  INITIAL_STATE_VISIBILITY,
  INITIAL_ANSWER_TO_RENDER,
} from '../constants/formData';
import { DispatchMessageService } from '@/context/MessageService';
import {
  CreateMillonaireApi,
  GetMillonaireAPi,
  UpdateMillonaireApi,
  DeleteMillonairApi,
  createQuestionMillonaireApi,
  DeleteQuestionMillonairApi,
  createStageMillonaireApi,
  DeleteStageMillonairApi,
  UpdateQuestionMillonaireApi,
  UpdateStageMillonaireApi,
} from '../services/api';

import {
  saveVisibilityControl,
  getVisibilityControl,
  listenRanking,
  deleteStatusStagesAndScoreAll,
} from '../services/firebase';
import createMillonaireAdapter from '../adapters/createMillonaireAdapter';
import getMillonaireAdapter from '../adapters/getMillonaireAdapter';
import createQuestionAdapter from '../adapters/createQuestionAdapter';
import createStageAdapter from '../adapters/createStageAdapter';
import { Score } from '../../common/Ranking/types';

export default function MillonaireCMSProvider({ children }: { children: React.ReactNode }) {
  const cEvent = useContext(CurrentEventContext);
  const [loading, setLoading] = useState(false);
  const [millonaire, setMillonaire] = useState<IMillonaire>(INITIAL_STATE_MILLONAIRE);
  const [question, setQuestion] = useState<IQuestions>(INITIAL_STATE_QUESTION);
  const [answer, setAnswer] = useState<IAnswers>(INITIAL_STATE_ANSWER);
  const [answers, setAnswers] = useState<IAnswers[]>(INITIAL_ANSWER_TO_RENDER);
  const [stage, setStage] = useState<IStages>(INITIAL_STATE_STAGE);
  const [isEditQuestion, setIsEditQuestion] = useState<IEditModal>(INITIAL_STATE_EDIT_MODAL);
  const [isEditStage, setIsEditStage] = useState<IEditModal>(INITIAL_STATE_EDIT_MODAL);
  const [isEditAnswer, setIsEditAnswer] = useState<IEditModal>(INITIAL_STATE_EDIT_MODAL);
  const [isVisibleModalAnswer, setIsVisibleModalAnswer] = useState<IModalVisible>(INITIAL_STATE_MODAL_VISIBLE);
  const [isNewGame, setIsNewGame] = useState(true);
  const eventId = cEvent?.value?._id || '';
  const [previusStage, setPreviusStage] = useState<IStages>(INITIAL_STATE_STAGE);
  const [laterStage, setLaterStage] = useState<IStages>(INITIAL_STATE_STAGE);
  const [visibilityControl, setVisibilityControl] = useState(INITIAL_STATE_VISIBILITY);
  const [tab, setTab] = useState('1');
  //-------------------STATE-MODALS---------------------------------------//
  const [isVisibleModalQuestion, setIsVisibleModalQuestion] = useState(false);
  const [isVisibleModalStage, setIsVisibleModalStage] = useState(false);
  const [scores, setScores] = useState<Score[]>([] as Score[]);

  //-------------🚀 USEEFECTS 🚀---------------------------------------//

  useEffect(() => {
    onGetMillonaire();
    getVisibility();
    return () => {
      setLoading(false);
      setMillonaire(INITIAL_STATE_MILLONAIRE);
    };
  }, [eventId]);

  // listen ranking
  useEffect(() => {
    let unsubscribe: any;
    if (eventId) {
      unsubscribe = listenRanking(eventId, (scores) => {
        setScores(scores);
      });
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [eventId]);

  // useEffect(() => {
  //   getVisibility();
  // }, [millonaire.id]);

  //--------------🚀 FUNCIONES MANEJAR FORMULARIO 🚀-------------------------------------//
  const onChangeMillonaire = (name: string, value: string) => {
    setMillonaire((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const onChangeAppearance = (name: string, value: any) => {
    setMillonaire((prevState) => ({
      ...prevState,
      appearance: {
        ...prevState['appearance'],
        [name]: value,
      },
    }));
  };
  const onChangeQuestion = (name: string, value: string) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };
  const onChangeAnswer = (name: string, value: string | boolean) => {
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      [name]: value,
    }));
  };

  const onChangeStage = (name: string, value: string | number | boolean) => {
    setStage((prevStage) => ({
      ...prevStage,
      [name]: value,
    }));
  };

  //----------------------🚀 FUNCION PARA OBETENER EL MILLONARIO 🚀--------------------------//

  const onGetMillonaire = async () => {
    setLoading(true);
    const response = await GetMillonaireAPi(eventId);
    if (response) {
      const millonaireAdapter = getMillonaireAdapter(response);
      setMillonaire(millonaireAdapter);
      setIsNewGame(false);
      setLoading(false);
      return DispatchMessageService({
        type: 'success',
        msj: 'parametros de la dinamica obtenidos correctamente',
        action: 'show',
      });
    }
    setMillonaire(INITIAL_STATE_MILLONAIRE);
    setIsNewGame(true);
    setLoading(false);
  };

  //---------------------- FUNCION PARA CREAR EL MILLONARIO--------------------------//

  const onCreateMillonaire = async () => {
    setLoading(true);
    const { name, numberOfQuestions } = millonaire;
    if (name === '' || numberOfQuestions === 0 || numberOfQuestions === null) {
      setLoading(false);
      return DispatchMessageService({
        type: 'error',
        msj: 'Se debe completar los parametros',
        action: 'show',
      });
    }
    const body = createMillonaireAdapter(millonaire);
    const response = await CreateMillonaireApi(eventId, body);
    if (response) {
      const millonaireAdapter = getMillonaireAdapter(response);
      setMillonaire(millonaireAdapter);
      DispatchMessageService({
        type: 'success',
        msj: 'Se creo la dinamica correctamente',
        action: 'show',
      });
      setIsNewGame(false);
    }
    setLoading(false);
  };

  //---------------------- FUNCION PARA ACTUALIZAR EL MILLONARIO--------------------------//

  const onUpdateMillonaire = async () => {
    setLoading(true);
    const { name, numberOfQuestions, id } = millonaire;
    if (name === '' || numberOfQuestions === 0) {
      setLoading(false);
      return DispatchMessageService({
        type: 'error',
        msj: 'Se debe completar los parametros',
        action: 'show',
      });
    }
    if (id && id === '') {
      return DispatchMessageService({
        type: 'error',
        msj: 'No se encontro la dinamica a editar',
        action: 'show',
      });
    }
    const body = createMillonaireAdapter(millonaire);
    const response = await UpdateMillonaireApi(eventId, id!, body);
    if (response) {
      DispatchMessageService({
        type: 'success',
        msj: 'Se actaulizaron los parametros correctamente',
        action: 'show',
      });
    }
    setIsNewGame(false);
    setLoading(false);
  };

  //---------------------- FUNCION PARA ELIMINAR EL MILLONARIO--------------------------//

  const onDelete = async () => {
    setLoading(true);
    const { id } = millonaire;
    if (id && id === '') {
      return DispatchMessageService({
        type: 'error',
        msj: 'No se encontro la dinamica a eliminar',
        action: 'show',
      });
    }
    const response = await DeleteMillonairApi(eventId, id!);
    if (response) {
      setMillonaire(INITIAL_STATE_MILLONAIRE);
      DispatchMessageService({
        type: 'success',
        msj: 'Se elimino la dinamica correctamente',
        action: 'show',
      });
      setIsNewGame(true);
    }

    setLoading(false);
  };

  //---------------------- FUNCION PARA CREAR  O ACTUALIZAR LA PREGUNTA--------------------------//

  const onSubmit = () => {
    if (isNewGame) {
      onCreateMillonaire();
    } else {
      onUpdateMillonaire();
    }
  };

  //-------------------------🚀 FUNCIONES BANCO PREGUNTAS 🚀 ----------------------------------------------//

  //---------------------- FUNCION PARA CREAR LA PREGUNTA--------------------------//
  const onSaveQuestion = async () => {
    setLoading(true);
    const { id } = millonaire;
    if (id && id === '') {
      return DispatchMessageService({
        type: 'error',
        msj: 'No se encontro la dinamica',
        action: 'show',
      });
    }
    if (millonaire.questions && millonaire.questions.length > 0) {
      setMillonaire((prevState) => ({
        ...prevState,
        questions: [...prevState.questions, question],
      }));
    } else {
      setMillonaire((prevState) => ({
        ...prevState,
        questions: [question],
      }));
    }
    const dataToSend = createQuestionAdapter(question);
    const response = await createQuestionMillonaireApi(id!, dataToSend);
    if (response) {
      const millonaireAdapter = getMillonaireAdapter(response);
      setMillonaire(millonaireAdapter);
      DispatchMessageService({
        type: 'success',
        msj: 'Se creo la dinamica correctamente',
        action: 'show',
      });
      setIsVisibleModalQuestion(!isVisibleModalQuestion);
      setAnswer(INITIAL_STATE_ANSWER);
      setQuestion(INITIAL_STATE_QUESTION);
    }
    setLoading(false);
  };

  //---------------------- FUNCION PARA ACTUALIZAR LA PREGUNTA--------------------------//

  const onEditQuestion = async () => {
    setLoading(true);
    const { id } = millonaire;
    if (id && id === '') {
      return DispatchMessageService({
        type: 'error',
        msj: 'No se encontro la dinamica',
        action: 'show',
      });
    }
    if (!question.id) {
      return DispatchMessageService({
        type: 'error',
        msj: 'No se encontro la pregunta',
        action: 'show',
      });
    }
    setMillonaire((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((item) => (item.id === question.id ? question : item)),
    }));
    const dataToSend = createQuestionAdapter(question);
    const response = await UpdateQuestionMillonaireApi(id!, question.id, dataToSend);
    if (response) {
      const millonaireAdapter = getMillonaireAdapter(response);
      setMillonaire(millonaireAdapter);
      DispatchMessageService({
        type: 'success',
        msj: 'Se actualizo la dinamica correctamente',
        action: 'show',
      });
      setIsVisibleModalQuestion(!isVisibleModalQuestion);
      setAnswer(INITIAL_STATE_ANSWER);
      setQuestion(INITIAL_STATE_QUESTION);
    }
    setLoading(false);
  };

  //---------------------- FUNCION PARA ELIMINAR LA PREGUNTA--------------------------//

  const onDeleteQuestion = async (question: IQuestions) => {
    setLoading(true);
    const { id } = millonaire;
    if (id && id === '') {
      return DispatchMessageService({
        type: 'error',
        msj: 'No se encontro la dinamica',
        action: 'show',
      });
    }
    const response = await DeleteQuestionMillonairApi(id!, question.id!);
    if (response) {
      DispatchMessageService({
        type: 'success',
        msj: 'Se elimino la pregunta correctamente, verifique que no este en uso',
        action: 'show',
      });
    }

    setLoading(false);
  };

  //---------------------- FUNCION PARA CREAR O ACTUALIZAR PREGUNTA --------------------------//

  const onSubmitQuestion = () => {
    if (isEditQuestion.isEdit) {
      onEditQuestion();
    } else {
      onSaveQuestion();
    }
  };

  //-----------------------🚀 FUNCIONES ANWSER 🚀----------------------------------------------//

  //---------------------- FUNCION PARA CREAR LA RESPUESTA--------------------------//

  const onEditAnswer = () => {
    if (answer.id) {
      setQuestion((prevState) => ({
        ...prevState,
        answers: prevState.answers.map((item) => (item.id === answer.id ? answer : item)),
      }));
    } else {
      setQuestion((prevState) => ({
        ...prevState,
        answers: prevState.answers.map((item, i) => (i === isEditAnswer.id ? answer : item)),
      }));
    }
    setIsEditAnswer(INITIAL_STATE_EDIT_MODAL);
    setAnswer(INITIAL_STATE_ANSWER);
  };

  //---------------------- FUNCION PARA ELIMINAR LA RESPUESTA--------------------------//
  const onDeleteAnswer = (answer: IAnswers, index: number) => {
    if (answer.id) {
      setQuestion((prevState) => ({
        ...prevState,
        answers: prevState.answers.filter((item) => item.id !== answer.id),
      }));
    }
    // delete with index if is not saved in database
    else {
      setQuestion((prevState) => ({
        ...prevState,
        answers: prevState.answers.filter((item, i) => i !== index),
      }));
    }
  };

  //---------------------- FUNCION PARA CREAR O ACTUALIZAR RESPUESTA --------------------------//
  const onChangeAnswerFour = (index: number, key: string, value: any) => {
    if (key === 'isCorrect') {
      setAnswers((prev) => {
        return prev.map((item) => {
          return {
            ...item,
            isCorrect: false,
          };
        });
      });
    }
    setAnswers((prev) => {
      return prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [key]: value,
          };
        }
        return item;
      });
    });
  };

  //---------------------- FUNCION PARA CREAR  --------------------------//

  const onSaveAnswerInQuestion = () => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      answers: [...prevQuestion.answers, answer],
    }));
    setAnswer(INITIAL_STATE_ANSWER);
  };
  const onSaveAnswerFour = () => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      answers: [...answers],
    }));
  };

  //---------------------- FUNCION PARA CREAR O ACTUALIZAR RESPUESTA --------------------------//

  const onSubmitAnswer = () => {
    if (isEditAnswer.isEdit) {
      //onEditAnswer();
      onSaveAnswerFour();
      onChangeVisibleModalAnswer();
    } else {
      //onSaveAnswerInQuestion();
      onSaveAnswerFour();
      onChangeVisibleModalAnswer();
    }
  };

  //-----------------------🚀 FUNCIONES ETAPA 🚀----------------------------------------------//

  //---------------------- FUNCION PARA CREAR LA ETAPA--------------------------//
  const onSaveStage = async () => {
    setLoading(true);
    const { id } = millonaire;
    if (id && id === '') {
      return DispatchMessageService({
        type: 'error',
        msj: 'No se encontro la dinamica',
        action: 'show',
      });
    }
    if (millonaire.stages && millonaire.stages.length > 0) {
      setMillonaire((prevState) => ({
        ...prevState,
        stages: [...prevState.stages, stage],
      }));
    } else {
      setMillonaire((prevState) => ({
        ...prevState,
        stages: [stage],
      }));
    }
    const dataToSend = createStageAdapter(stage);
    const response = await createStageMillonaireApi(id!, dataToSend);
    if (response) {
      const millonaireAdapter = getMillonaireAdapter(response);
      setMillonaire(millonaireAdapter);
      DispatchMessageService({
        type: 'success',
        msj: 'Se creo la dinamica correctamente',
        action: 'show',
      });
      setIsVisibleModalStage(!isVisibleModalStage);
      setStage(INITIAL_STATE_STAGE);
    }
    setLoading(false);
  };

  //---------------------- FUNCION PARA ACTUALIZAR LA ETAPA--------------------------//

  const onEditStage = async () => {
    setLoading(true);
    const { id } = millonaire;
    if (id && id === '') {
      return DispatchMessageService({
        type: 'error',
        msj: 'No se encontro la dinamica',
        action: 'show',
      });
    }
    const dataToSend = createStageAdapter(stage);
    const response = await UpdateStageMillonaireApi(id!, stage.id!, dataToSend);
    if (response) {
      setMillonaire((prevState) => ({
        ...prevState,
        stages: prevState.stages.map((item) => (item.id === stage.id ? stage : item)),
      }));
      setStage(INITIAL_STATE_STAGE);
      setIsVisibleModalStage(!isVisibleModalStage);
      const millonaireAdapter = getMillonaireAdapter(response);
      setMillonaire(millonaireAdapter);
      DispatchMessageService({
        type: 'success',
        msj: 'Se actualizo la etapa correctamente',
        action: 'show',
      });
    }
    setLoading(false);
  };

  //---------------------- FUNCION PARA ELIMINAR LA ETAPA--------------------------//

  const onDeleteStage = async (stage: IStages) => {
    setLoading(true);
    const { id } = millonaire;
    if (id && id === '') {
      return DispatchMessageService({
        type: 'error',
        msj: 'No se encontro la dinamica',
        action: 'show',
      });
    }
    const response = await DeleteStageMillonairApi(id!, stage.id!);
    if (response) {
      setMillonaire((prevState) => ({
        ...prevState,
        stages: prevState.stages.filter((item) => item.id !== stage.id),
      }));
      DispatchMessageService({
        type: 'success',
        msj: 'Se elimino la dinamica correctamente',
        action: 'show',
      });
    }

    setLoading(false);
  };

  //---------------------- FUNCION PARA CREAR O ACTUALIZAR ETAPA --------------------------//

  const onSubmitStage = () => {
    if (isEditStage.isEdit) {
      onEditStage();
    } else {
      onSaveStage();
    }
  };

  //-----------------------🚀 FUNCIONES ACTIVADORAS 🚀----------------------------------------------//

  const onActionEditQuestion = (question: IQuestions, index: string | number) => {
    setQuestion(question);
    setIsEditQuestion({
      isEdit: true,
      id: question.id || index,
    });
    setAnswers(question.answers);
    setIsVisibleModalQuestion(!isVisibleModalQuestion);
  };

  const onActionEditAnwser = (answer: IAnswers, index: string | number) => {
    setQuestion(question);
    setAnswers(question.answers);
    setAnswer(answer);
    setIsEditAnswer({
      isEdit: true,
      id: answer.id || index,
    });
    onChangeVisibleModalAnswer();
  };
  const onActionEditStage = (stage: IStages, index: string | number) => {
    setStage(stage);
    setIsEditStage({
      isEdit: true,
      id: stage.id || index,
    });
    setIsVisibleModalStage(!isVisibleModalStage);
    const etapaAnterior = millonaire.stages.find((item) => item.stage === stage.stage - 1);
    if (etapaAnterior) {
      setPreviusStage(etapaAnterior);
    }
    const etapaPosterior = millonaire.stages.find((item) => item.stage === stage.stage + 1);
    if (etapaPosterior) {
      setLaterStage(etapaPosterior);
    }
  };

  //-------------------------------------------FUNCIONES MODAL-------------------------------------------//
  const onCancelModalQuestion = () => {
    setIsVisibleModalQuestion(!isVisibleModalQuestion);
    setQuestion(INITIAL_STATE_QUESTION);
    setIsEditQuestion(INITIAL_STATE_EDIT_MODAL);
    setIsEditAnswer(INITIAL_STATE_EDIT_MODAL);
  };

  const onCancelModalStage = () => {
    setIsVisibleModalStage(!isVisibleModalStage);
    setStage(INITIAL_STATE_STAGE);
    setIsEditStage(INITIAL_STATE_EDIT_MODAL);
  };

  const onActiveModalStage = () => {
    setIsVisibleModalStage(!isVisibleModalStage);
    setStage({ ...INITIAL_STATE_STAGE, stage: millonaire.stages.length + 1 });
  };

  const onChangeVisibleModalAnswer = () => {
    setIsVisibleModalAnswer((prevState) => ({
      ...prevState,
      isVisibleAdd: !prevState.isVisibleAdd,
    }));
  };

  const onChangeVisibleModalAnswerList = () => {
    setIsVisibleModalAnswer((prevState) => ({
      ...prevState,
      isVisibleList: !prevState.isVisibleList,
    }));
  };

  //-------------------------------------- FUNCIONALIDAD DE VISIBILIDAD DE LA DINAMICA --------------------------------------//

  //-------------------FUNCION PARA CAMBIAR EL ESTADO DE LA DINAMICA-------------------//
  const onChangeVisibilityControl = async (name: string, value: boolean) => {
    const { id } = millonaire;
    if (id && id === '') {
      return DispatchMessageService({
        type: 'error',
        msj: 'No se encontro la dinamica',
        action: 'show',
      });
    }
    saveVisibilityControl(eventId, { ...visibilityControl, [name]: value }).then(() => {
      setVisibilityControl((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    });
  };

  //------------------- OBTENER EL ESTADO DE LA DINAMICA-------------------//
  const getVisibility = async () => {
    if (eventId === undefined && eventId === '') {
      return DispatchMessageService({
        type: 'error',
        msj: 'No se encontro el evento',
        action: 'show',
      });
    }
    const response = await getVisibilityControl(eventId!);
    if (response) {
      setVisibilityControl(response as IVisibility);
    }
  };

  //-------------------FUNCION PARA CAMBIAR EL ESTADO DE LA DINAMICA-------------------//
  const onResetProgressAll = async () => {
    setLoading(true);
    await deleteStatusStagesAndScoreAll(eventId);
    setLoading(false);
  };

  //------------------------ 🚀 FUNCIONES TAB ------------------------//
  const onChangeTab = (key: string) => {
    setTab(key);
  };

  return (
    <MillonaireCMSContext.Provider
      value={{
        event: cEvent,
        millonaire,
        loading,
        isNewGame,
        stage,
        question,
        answer,
        previusStage,
        laterStage,
        isVisibleModalQuestion,
        isVisibleModalStage,
        isEditAnswer: isEditAnswer.isEdit,
        isEditQuestion: isEditQuestion.isEdit,
        isEditStage: isEditStage.isEdit,
        isVisibleModalAnswer: isVisibleModalAnswer.isVisibleAdd,
        isVisibleModalAnswerList: isVisibleModalAnswer.isVisibleList,
        published: visibilityControl.published,
        active: visibilityControl.active,
        scores,
        tab,
        answers,
        onChangeAnswerFour,
        onChangeMillonaire,
        onChangeAppearance,
        onCreateMillonaire,
        onSubmit,
        onDelete,
        onSaveQuestion,
        onSaveStage,
        onCancelModalStage,
        onCancelModalQuestion,
        setIsVisibleModalQuestion,
        setIsVisibleModalStage,
        onChangeQuestion,
        onChangeAnswer,
        onSaveAnswerInQuestion,
        onDeleteQuestion,
        onChangeStage,
        onDeleteStage,
        onActionEditQuestion,
        onActionEditAnwser,
        onSubmitQuestion,
        onSubmitAnswer,
        onSubmitStage,
        onDeleteAnswer,
        onChangeVisibleModalAnswer,
        onChangeVisibleModalAnswerList,
        onActiveModalStage,
        onActionEditStage,
        onChangeVisibilityControl,
        onResetProgressAll,
        onChangeTab,
        onSaveAnswerFour,
      }}>
      {children}
    </MillonaireCMSContext.Provider>
  );
}
