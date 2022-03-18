import React from 'react';
import { Modal } from 'antd';
import LayoutTypeActivity from './components/layout/LayoutTypeActivity';
import ContentTypeActivity from '../typeActivity/components/layout/ContentTypeActivity';
import ResultTypeActivity from '../typeActivity/components/ResultTypeActivity';
import LoadingTypeActivity from '../typeActivity/components/LoadingTypeActivity';
import ContentSource from '../typeActivity/components/layout/ContentSource';
import ContentInformative from '../typeActivity/components/layout/ContentInformative';
import { LinkOutlined, YoutubeOutlined } from '@ant-design/icons'; //Este icono para el addonBefore
import { useTypeActivity } from '../../../context/typeactivity/hooks/useTypeActivity';

const newContentSource = {
  title: 'Titulo principal',
  addonBefore: <LinkOutlined />, // o la url que se encuentra en el componente
  subtitle: 'Descripción del contenido',
  placeholder: 'llene el campo',
  icon: <YoutubeOutlined />,
};

const ModalStepByStep = () => {
  const { openModal, closeModal, activityOptions, selectActivitySteps } = useTypeActivity();
  console.log('🚀 debug ~ =================>', activityOptions, openModal);

  return (
    <Modal visible={openModal} onCancel={closeModal} centered width={1000} footer={null}>
      <LayoutTypeActivity title={activityOptions?.MainTitle}>
        <ContentTypeActivity options={activityOptions.typeOptions} />
        {/* <ResultTypeActivity title={'Transmisión creada correctamente'} status={'success'} /> */}
        {/* <LoadingTypeActivity /> */}
        {/* <ContentSource addonBefore={newContentSource.addonBefore} placeholder={newContentSource.placeholder} icon={newContentSource.icon} subtitle={newContentSource.subtitle} /> */}
        {/* <ContentInformative
          title={'Buenas tardes'}
          description={'Quiero hamburguesas'}
          image={'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg'}
        /> */}
      </LayoutTypeActivity>
    </Modal>
  );
};

export default ModalStepByStep;
