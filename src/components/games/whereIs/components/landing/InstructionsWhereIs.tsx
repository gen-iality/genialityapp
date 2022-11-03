import { Button, Grid, Result, Typography } from 'antd';
import React from 'react';
const { useBreakpoint } = Grid;

const InstructionsWhereIs = () => {
  const screens = useBreakpoint();
  return (
    <Result
      icon={' '}
      title={
        <Typography.Title level={screens.xs ? 3 : 1} style={{ letterSpacing: '0.1em' }}>
          BUSCANDO EL ELEMENTO ESCONDIDO
        </Typography.Title>
      }
      subTitle={
        <Typography.Paragraph style={{ fontSize: screens.xs ? '16px' : '18px' }}>
          El objetivo de la dinámica es que logres encontrar el logo de cada uno de nuestros patrocinadores (FEC, Somos,
          Protección) que se encuentran escondidos dentro del mapa de Piscilago, tu posición en el ranking dependerá del
          tiempo que tardes en encontrarlos, es necesario que identifiques la posición de todos los logos para que
          puedas registrar tu tiempo final. Una vez encuentres uno de los logos, debes de oprimirlo para que se marque
          correctamente. Cuentas con 5 vidas para lograr el objetivo, perderás una vida en el momento en que selecciones
          una ubicación del mapa donde no se encuentre escondido uno de los logos, en caso de que pierdas todas tus
          vidas, no se registrará tu tiempo. ¡Muchos éxitos en tu búsqueda!
        </Typography.Paragraph>
      }
      extra={
        <Button size='large' type='primary' style={{ letterSpacing: '0.1em' }}>
          ¡Jugar!
        </Button>
      }></Result>
  );
};

export default InstructionsWhereIs;
