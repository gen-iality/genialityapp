import { Button, Result, Grid, Typography } from 'antd';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';
const { useBreakpoint } = Grid;

export default function Introduction() {
  const { goTo } = useWhereIsInLanding();
  const handleStart = () => {
    goTo('game');
  };
  const screens = useBreakpoint();
  return (
    <Result
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
        <Button onClick={handleStart} size='large' type='primary' style={{ letterSpacing: '0.1em' }}>
          ¡Jugar!
        </Button>
      }></Result>
  );
}
