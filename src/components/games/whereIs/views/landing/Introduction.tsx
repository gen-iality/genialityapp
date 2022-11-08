import { Button, Result, Grid, Typography, Space, Image } from 'antd';
import { isMobile } from 'react-device-detect';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';
const { useBreakpoint } = Grid;

export default function Introduction() {
  const {
    goTo,
    whereIsGame: { points },
  } = useWhereIsInLanding();
  const handleStart = () => {
    goTo('game');
  };
  const screens = useBreakpoint();
  return (
    <Result
      style={{ padding: '16px' }}
      icon={' '} // dejar el espacio en blanco para eliminar icono por defecto que trae el componente
      title={
        <Typography.Title level={screens.xs ? 3 : 1} style={{ letterSpacing: '0.1em' }}>
          BUSCANDO EL ELEMENTO
        </Typography.Title>
      }
      subTitle={
        <Typography.Paragraph style={{ fontSize: screens.xs ? '16px' : '18px' }}>
          El objetivo es que logres encontrar los logos de nuestros patrocinadores (FEC, Somos, Protección) que se
          encuentran escondidos dentro del mapa de Piscilago en el menor tiempo posible. Cuando encuentres un logo debes
          hacer clic para que se marque correctamente. Cuentas con 5 vidas para lograr el objetivo, perderás una vida en
          el momento que selecciones una ubicación equivocada. tu tiempo final va a determinar tu posición en el
          ranking. ¡Muchos éxitos en tu búsqueda!
        </Typography.Paragraph>
      }
      extra={
        <Space direction='vertical'>
          <Space size={0} direction='vertical'>
            <Typography.Text strong>Elementos a buscar</Typography.Text>
            <Space size={'large'}>
              {points.map((point) => (
                <Image
                  src={point.image}
                  height={isMobile ? 60 : 80}
                  preview={false}
                  style={{
                    filter: point.isFound ? 'grayscale(100%)' : '',
                  }}
                />
              ))}
            </Space>
          </Space>
          <Button onClick={handleStart} size='large' type='primary' style={{ letterSpacing: '0.1em' }}>
            ¡Jugar!
          </Button>
        </Space>
      }></Result>
  );
}
