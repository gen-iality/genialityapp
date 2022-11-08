import MillonaireCMSContext from './MillonaireCMSContext';
import { CurrentEventContext } from '@/context/eventContext';
import React, { useContext, useEffect, useState } from 'react';
import { IMillonaire, IQuestions, IEditModal, IStages } from '../interfaces/Millonaire';
import {
  INITIAL_STATE_MILLONAIRE,
  INITIAL_STATE_QUESTION,
  INITIAL_STATE_STAGE,
  INITIAL_STATE_EDIT_MODAL,
} from '../constants/formData';
import { DispatchMessageService } from '@/context/MessageService';
import { CreateMillonaireApi, GetMillonaireAPi, UpdateMillonaireApi, DeleteMillonairApi } from '../services/api';
import createMillonaireAdapter from '../adapters/createMillonaireAdapter';
import getMillonaireAdapter from '../adapters/getMillonaireAdapter';

export default function MillonaireCMSProvider({ children }: { children: React.ReactNode }) {
  const cEvent = useContext(CurrentEventContext);
  const [loading, setLoading] = useState(false);
  const [millonaire, setMillonaire] = useState<IMillonaire>(INITIAL_STATE_MILLONAIRE);
  const [question, setQuestion] = useState<IQuestions>(INITIAL_STATE_QUESTION);
  const [stage, setStage] = useState<IStages>(INITIAL_STATE_STAGE);
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
      console.log(
        '🚀 ~ file: MillonaireCMSProvider.tsx ~ line 62 ~ onGetMillonaire ~ millonaireAdapter',
        millonaireAdapter
      );
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

  const onSaveQuestion = () => {
    //setLoading(true);
    setMillonaire((prevState) => ({
      ...prevState,
      questions: [...prevState.questions, question],
    }));
    // setLoading(false);
  };
  const onSaveStage = () => {
    //setLoading(true);
    setMillonaire((prevState) => ({
      ...prevState,
      stages: [...prevState.stages, stage],
    }));
    // setLoading(false);
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

  return (
    <MillonaireCMSContext.Provider
      value={{
        event: cEvent,
        millonaire,
        loading,
        isNewGame,
        stage,
        question,
        isVisibleModalQuestion,
        isVisibleModalStage,
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
      }}>
      {children}
    </MillonaireCMSContext.Provider>
  );
}
