import { Card, Result, Button, Spin } from 'antd';
import SmartModalStepByStep from './SmartModalStepByStep';
import ManagerView from './ManagerView';
import { useTypeActivity } from '@context/typeactivity/hooks/useTypeActivity';
import { useContext, useEffect, useState } from 'react';
import AgendaContext from '@context/AgendaContext';

import InitialSVG from './components/svg/InitialSVG';
import { AgendaApi } from '@helpers/request';
import { CurrentEventContext } from '@context/eventContext';
import ModalPreviewVideo from './ModalPreviewVideo';

const objecKeys: object = {
  url: 'Video',
  meeting: 'reunión',
  vimeo: 'vimeo',
  youTube: 'Youtube',
  eviusMeet: 'EviusMeet',
  RTMP: 'Transmisión',
  cargarvideo: 'Video',
  video: 'Video',
};

const SmartInitialView = (props: any) => {
  const {
    toggleActivitySteps,
    selectedKey,
    previewKey,
    createTypeActivity,
  } = useTypeActivity();
  const [loading, setLoading] = useState(true);
  const {
    typeActivity,
    meeting_id,
    setActivityName,
    activityEdit,
    roomStatus,
    saveConfig,
  } = useContext(AgendaContext);
  const cEvent = useContext(CurrentEventContext);

  useEffect(() => {
    if (activityEdit) {
      // Guardamos
      createTypeActivity();
    }
  }, [props.hasActivityName, activityEdit]);

  useEffect(() => {
    if (!props.hasActivityName) return;
    // Obtener detalles de la lección
    setActivityName(props.activityName);
    // if (typeActivity === null) {
    //   setLoading(false);
    // } else {
    //   setLoading(true);
    //   obtainDataInitial();
    //   // Mientras carga los componentes
    // }
  }, [props.hasActivityName]); // props.tabs ignored

  // Permite guardar la data en firebase y activar el snapshot cuando se cambia
  // el estado de la lección
  useEffect(() => {
    saveConfig(null, 1);
  }, [roomStatus]);

  // Show the popup via prop
  useEffect(() => {
    if (props.showForm) {
      toggleActivitySteps('type')
    }
  }, [props.showForm]);

  // Obtiene datos iniciales y guarda en el Reducer
  const obtainDataInitial = async () => {
    let urlVideo;
    if (typeActivity === 'url') {
      const dataActivity = await obtainUrlVideo();
      urlVideo = dataActivity.video || meeting_id;
    }
    toggleActivitySteps('initial', {
      openModal: false,
      disableNextButton: false,
      typeOptions: undefined,
      selectedKey: 'finish',
      previewKey: typeActivity,
      data: typeActivity !== 'url' ? meeting_id : urlVideo,
      buttonsTextNextOrCreate: '',
      buttonTextPreviousOrCancel: '',
    });
    setTimeout(() => setLoading(false), 500);
  };
  // (SE PUEDE OPTIMIZAR) X AHORA EL VIDEO SE ESTA GUARDANDO EN MONGO
  const obtainUrlVideo = async () => {
    const resp = await AgendaApi.getOne(activityEdit, cEvent?.value._id);
    return resp;
  };

  return (
    <>
      <ModalPreviewVideo />
      <SmartModalStepByStep
        onSetType={props.onSetType}
        activityName={props.activityName}
        onClosedForm={props.onClosedForm}
      />
      {/* {!loading ? renderComponet() : <Spin />} */}
    </>
  );
};

export default SmartInitialView;
