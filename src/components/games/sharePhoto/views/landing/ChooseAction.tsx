import { Button, Col, Grid, Result, Row, Typography } from 'antd';
import ChooseButton from '../../components/landing/ChooseButton';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';
import useSharePhoto from '../../hooks/useSharePhoto';
import CameraIcon from '@2fd/ant-design-icons/lib/Camera';
import ImagePlusIcon from '@2fd/ant-design-icons/lib/ImagePlus';

const { useBreakpoint } = Grid;
export default function ChooseAction() {
  const { goTo } = useSharePhotoInLanding();
  const { sharePhoto } = useSharePhoto();
  const screens = useBreakpoint();
  return (
    <>
      <Button onClick={() => goTo('introduction')}>Atras</Button>
      <Row gutter={[0, 0]} justify='center' align='middle' style={{ height: '100%' }}>
        <Result
          className='editAnt'
          icon={' '} // dejar el espacio en blanco para eliminar icono por defecto que trae el componente
          title={
            <Typography.Title level={screens.xs ? 3 : 1} style={{ letterSpacing: '0.1em' }}>
              {sharePhoto?.title}
            </Typography.Title>
          }
          subTitle={
            <Typography.Text style={{ fontSize: screens.xs ? '18px' : '24px' }}>{sharePhoto?.tematic}</Typography.Text>
          }
          extra={[
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <ChooseButton
                  onClick={() => goTo('takePhoto')}
                  icon={<CameraIcon style={{ fontSize: '30px', color: '#333F44' }} />}
                  label='Tomar foto'
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <ChooseButton
                  onClick={() => goTo('importPhoto')}
                  icon={<ImagePlusIcon style={{ fontSize: '30px', color: '#333F44' }} />}
                  label='Subir foto'
                />
              </Col>
            </Row>,
          ]}></Result>
      </Row>
    </>
  );
}
