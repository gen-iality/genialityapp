import { Button, Grid, Result, Row, Typography } from 'antd';
import { useEffect } from 'react';
import useSharePhoto from '../../hooks/useSharePhoto';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';

const { useBreakpoint } = Grid;

export default function Introduction() {
  const { sharePhoto } = useSharePhoto();
  const { goTo } = useSharePhotoInLanding();
  const screens = useBreakpoint();

  useEffect(() => {
    // Here goes the listener
    // return () => unsubscribe();
  }, []);

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
          <Typography.Title level={5}>Instrucciones</Typography.Title>
          <Typography.Paragraph style={{ textAlign: 'justify' }}>
            Debes de tomarte una fotografía o cargarla desde tu galería conforme a la temática propuesta para la
            dinámica, podrás cargar una sola foto así que queremos poner a prueba tu creatividad e ingenio, en caso de
            que quieras remplazarla podrás eliminarla y cargar una nueva, sin embargo, ¡Ten cuidado! Porque perderás
            todos los me gustas con los que ya cuentes. Podrás dar un solo me gusta a todas las fotos que desees, no
            olvides darte un recorrido por toda la galería para apoyar las fotos que más te gusten. Recuerda que entre
            más me gustas tengas más posibilidades tendrás ganar.
          </Typography.Paragraph>
        </Result>
      </Row>
    </>
  );
}
