import { Modal } from 'antd';
import LayoutTypeActivity from './components/layout/LayoutTypeActivity';
import ContentTypeActivity from '../typeActivity/components/layout/ContentTypeActivity';
import ResultTypeActivity from '../typeActivity/components/ResultTypeActivity';
import LoadingTypeActivity from '../typeActivity/components/LoadingTypeActivity';
import ContentSource from '../typeActivity/components/layout/ContentSource';
import ContentInformative from '../typeActivity/components/layout/ContentInformative';
import { LinkOutlined, YoutubeOutlined } from '@ant-design/icons'; //Este icono para el addonBefore
import { useTypeActivity } from '@context/typeactivity/hooks/useTypeActivity';
import InputUploadVideo from './components/InputUploadVideo';

const newContentSource = {
  title: 'Titulo principal',
  addonBefore: '🔗', // o la url que se encuentra en el componente
  subtitle: 'Descripción del contenido',
  placeholder: 'llene el campo',
  icon: <YoutubeOutlined />,
};
interface mapContentSource {
  key: string;
  addonBefore: string;
  placeholder: string;
  title: string;
  subtitle: string;
  image: string;
}

const ModalStepByStep = (props: any) => {
  const { openModal, closeModal, typeOptions, selectedKey } = useTypeActivity();

  return (
    <Modal visible={openModal} onCancel={closeModal} centered width={1200} footer={null}>
      <LayoutTypeActivity title={typeOptions?.MainTitle}>
        {typeOptions.key !== 'vimeo' && typeOptions.key !== 'youTube' && typeOptions.key !== 'url' ? (
          <ContentTypeActivity options={typeOptions.typeOptions} />
        ) : null}
        {typeOptions.key === 'cargarvideo' ? <InputUploadVideo activityName={props.activityName} /> : null}
        {typeOptions.key === 'vimeo' || typeOptions.key === 'youTube' || typeOptions.key === 'url'
          ? typeOptions.typeOptions.map((options: mapContentSource) => {
              if (options.key === typeOptions.key) {
                return (
                  <ContentSource
                    type={options.key}
                    addonBefore={options.addonBefore}
                    placeholder={options.placeholder}
                    icon={options.image}
                    subtitle={options.subtitle}
                  />
                );
              }
            })
          : null}

        {typeOptions.key === 'meeting' && (
          <ContentInformative
            title={'GEN Connect'}
            description={
              'La herramienta para videoconferencias, comparte tu cámara, habla con tus participantes y presenta lo que quieras desde tu PC. Puedes personalizar el escenario a tu gusto, imágenes de fondo, recuadros o marcos para el escenario, muestra mensajes para todos, usa los colores de tu marca. Controla el acceso y lo que comparten tus participantes. Descubre esto y mucho más con GEN Connect.'
            }
            image={
              'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fmeeting.png?alt=media&token=02a6259b-3c30-436f-b0b0-f4cf1eecdfd6'
            }
          />
        )}
      </LayoutTypeActivity>
    </Modal>
  );
};

export default ModalStepByStep;
