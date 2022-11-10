import MillonaireCMSContext from './MillonaireCMSContext';
import { CurrentEventContext } from '@/context/eventContext';
import React, { useContext, useEffect, useState } from 'react';
import { IMillonaire, IQuestions, IEditModal, IStages, IAnswers } from '../interfaces/Millonaire';
import {
  INITIAL_STATE_MILLONAIRE,
  INITIAL_STATE_QUESTION,
  INITIAL_STATE_STAGE,
  INITIAL_STATE_EDIT_MODAL,
  INITIAL_STATE_ANSWER,
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
} from '../services/api';
import createMillonaireAdapter from '../adapters/createMillonaireAdapter';
import getMillonaireAdapter from '../adapters/getMillonaireAdapter';
import createQuestionAdapter from '../adapters/createQuestionAdapter';
import createStageAdapter from '../adapters/createStageAdapter';

export default function MillonaireCMSProvider({ children }: { children: React.ReactNode }) {
  const cEvent = useContext(CurrentEventContext);
  const [loading, setLoading] = useState(false);
  const [millonaire, setMillonaire] = useState<IMillonaire>(INITIAL_STATE_MILLONAIRE);
  const [question, setQuestion] = useState<IQuestions>(INITIAL_STATE_QUESTION);
  const [answer, setAnswer] = useState<IAnswers>(INITIAL_STATE_ANSWER);
  const [stage, setStage] = useState<IStages>(INITIAL_STATE_STAGE);
  const [isEditQuestion, setIsEditQuestion] = useState(false);
  const [isEditStage, setIsEditStage] = useState(false);
  const [isEditAnswer, setIsEditAnswer] = useState(false);
  const [isNewGame, setIsNewGame] = useState(true);
  const eventId = cEvent?.value?._id || '';

  //-------------------STATE-MODALS---------------------------------------//
  const [isVisibleModalQuestion, setIsVisibleModalQuestion] = useState(false);
  const [isVisibleModalStage, setIsVisibleModalStage] = useState(false);
  const [canEditQuestion, setCanEditQuestion] = useState<IEditModal>(INITIAL_STATE_EDIT_MODAL);
  const [canEditStage, setCanEditStage] = useState<IEditModal>(INITIAL_STATE_EDIT_MODAL);
  //-------------USEEFECTS---------------------------------------//

  useEffect(() => {
    onGetMillonaire();
    return () => {
      setLoading(false);
      setMillonaire(INITIAL_STATE_MILLONAIRE);
    };
  }, [eventId]);

  //--------------FUNCIONES-------------------------------------//
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
  const onSubmit = () => {
    if (isNewGame) {
      onCreateMillonaire();
    } else {
      onUpdateMillonaire();
    }
  };
  //--------------------Funciones para banco de pregunta-----------------------//
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

  const onEditAnswer = () => {
    setQuestion((prevState) => ({
      ...prevState,
      answers: prevState.answers.map((item) => (item.id === answer.id ? answer : item)),
    }));
    setAnswer(INITIAL_STATE_ANSWER);
  };

  const onEditStage = () => {
    setMillonaire((prevState) => ({
      ...prevState,
      stages: prevState.stages.map((item) => (item.id === stage.id ? stage : item)),
    }));
    setStage(INITIAL_STATE_STAGE);
  };

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
        msj: 'Se elimino la pregunta correctamente',
        action: 'show',
      });
      setIsNewGame(true);
    }

    setLoading(false);
  };

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
    const response = await DeleteMillonairApi(id!, stage.id!);
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

  const onSubmitStage = () => {
    if (isEditStage) {
      onEditStage();
    } else {
      onSaveStage();
    }
  };

  const onSubmitQuestion = () => {
    if (isEditQuestion) {
      onEditQuestion();
    } else {
      onSaveQuestion();
    }
  };

  const onSubmitAnswer = () => {
    if (isEditAnswer) {
      onEditAnswer();
    } else {
      onSaveAnswerInQuestion();
    }
  };

  const onActionEditQuestion = (question: IQuestions) => {
    setQuestion(question);
    setIsEditQuestion(!isEditQuestion);
    setIsVisibleModalQuestion(!isVisibleModalQuestion);
  };

  const onActionEditAnwser = (answer: IAnswers) => {
    setAnswer(answer);
    setIsEditAnswer(isEditAnswer);
  };

  //-------------------------------------------FUNCIONES MODAL-------------------------------------------//
  const onCancelModalQuestion = () => {
    setIsVisibleModalQuestion(!isVisibleModalQuestion);
    setQuestion(INITIAL_STATE_QUESTION);
    setCanEditQuestion(INITIAL_STATE_EDIT_MODAL);
  };

  const onCancelModalStage = () => {
    setIsVisibleModalStage(!isVisibleModalStage);
    setStage(INITIAL_STATE_STAGE);
    setCanEditStage(INITIAL_STATE_EDIT_MODAL);
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

  const onSaveAnswerInQuestion = () => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      answers: [...prevQuestion.answers, answer],
    }));
    setAnswer(INITIAL_STATE_ANSWER);
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
        isVisibleModalQuestion,
        isVisibleModalStage,
        isEditAnswer,
        isEditQuestion,
        isEditStage,
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
      }}>
      {children}
    </MillonaireCMSContext.Provider>
  );
}
