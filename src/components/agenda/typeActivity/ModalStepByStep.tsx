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
}

const ModalStepByStep = () => {
  const { openModal, closeModal, typeOptions, selectedKey } = useTypeActivity();
  console.log('🚀 TYPE OPTIONS ......', typeOptions.key);

  return (
    <Modal visible={openModal} onCancel={closeModal} centered width={1200} footer={null}>
      <LayoutTypeActivity title={typeOptions?.MainTitle}>
        {typeOptions.key !== 'vimeo' && typeOptions.key !== 'youTube' && typeOptions.key !== 'url' ? (
          <ContentTypeActivity options={typeOptions.typeOptions} />
        ) : null}
        {/* <ResultTypeActivity title={'Transmisión creada correctamente'} status={'success'} /> */}
        {/* <LoadingTypeActivity /> */}
        {typeOptions.key === 'cargarvideo' ? <h1>CARGAR VIDEO</h1> : null}
        {typeOptions.key === 'vimeo' || typeOptions.key === 'youTube' || typeOptions.key === 'url'
          ? typeOptions.typeOptions.map((options: mapContentSource) => {
            if (options.key === typeOptions.key) {
              return (
                <ContentSource
                  addonBefore={options.addonBefore}
                  placeholder={options.placeholder}
                  icon={options.title}
                  subtitle={options.subtitle}
                />
              );
            }
          })
          : null}

        {typeOptions.key === 'meeting' && (
          <ContentInformative
            title={'EviusMeet'}
            description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim sagittis, faucibus risus diam pretium. Est ligula egestas turpis donec nunc, feugiat in eget. Justo turpis metus quis.'}
            image={'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Evius_type_activity%2Fmeeting.png?alt=media&token=02a6259b-3c30-436f-b0b0-f4cf1eecdfd6'}
          />
        )}
      </LayoutTypeActivity>
    </Modal>
  );
};

export default ModalStepByStep;
