import { Button, Grid, Result, Row, Typography } from 'antd';
import { useEffect } from 'react';
import useSharePhoto from '../../hooks/useSharePhoto';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';

const { useBreakpoint } = Grid;

export default function Introduction() {
  const { sharePhoto, listenSharePhoto } = useSharePhoto();
  const { goTo } = useSharePhotoInLanding();
  const screens = useBreakpoint();

  useEffect(() => {
    if (sharePhoto !== null) {
      const unSubscribe = listenSharePhoto();
      return () => unSubscribe();
    }
  }, [sharePhoto]);

  if (!sharePhoto) {
    return <p>Ups! esta dinamica no existe aun!</p>;
  }

  return (
    <>
      <Row gutter={[0, 0]} justify='center' align='middle' style={{ height: '100%' }}>
        <Result
          className='editAnt'
          icon={' '} // dejar el espacio en blanco para eliminar icono por defecto que trae el componente
          title={
            <Typography.Title level={screens.xs ? 3 : 1} style={{ letterSpacing: '0.1em' }}>
              {sharePhoto.title}
            </Typography.Title>
          }
          subTitle={
            <Typography.Text style={{ fontSize: screens.xs ? '18px' : '24px' }}>{sharePhoto.tematic}</Typography.Text>
          }
          extra={[
            <Button onClick={() => goTo('galery')} size='large' key='galery'>
              Ver Galería
            </Button>,
            <Button onClick={() => goTo('chooseAction')} size='large' key='photo'>
              Subir Foto
            </Button>,
          ]}>
          <Typography.Text strong>Instrucciones</Typography.Text>
          <Typography.Paragraph>
            Risus sed et gravida eleifend mauris vulputate egestas tempus. Magna est eu diam leo neque massa quis. Urna
            arcu massa vel fermentum. Est tortor, amet elit orci massa blandit tristique et faucibus. Amet nisi tortor,
            feugiat nec arcu sapien volutpat arcu quisque. Et vestibulum tristique sed ullamcorper viverra malesuada
            purus, arcu tortor. Maecenas interdum ornare faucibus donec id.
          </Typography.Paragraph>
        </Result>
      </Row>
    </>
  );
}
