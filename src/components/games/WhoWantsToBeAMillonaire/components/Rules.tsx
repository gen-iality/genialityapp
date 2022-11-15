import React, { useState } from 'react';
import { Button, Modal, Typography } from 'antd';

const { Title, Paragraph } = Typography;
export default function Rules({ rules }: { rules: string }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const onHandleModal = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <Button block size='large' onClick={() => setIsVisible(!isVisible)}>
        <Typography.Text strong> Reglas</Typography.Text>
      </Button>
      <Modal title='Reglas de la dinamica' visible={isVisible} onOk={onHandleModal}>
        <Paragraph>{rules}</Paragraph>
      </Modal>
    </>
  );
}

Rules.defaultProps = {
  rules:
    'Se presentarán preguntas con 4 opciones de respuesta, hasta un máximo de 10. Para responder se podrá establecer tiempo o no. El jugador dispondrá de cuatro comodines que podrá utilizar una sola vez a lo largo de la partida, que son: llamada, público, 50% y tiempo extra. Tras formularse cada pregunta el jugador podrá contestar o plantarse. Por cada respuesta correcta se ganarán puntos, asegurándose los puntos conseguidos en las preguntas 3 y 6. Si se falla a una pregunta el jugador quedará eliminado con los puntos que haya podido asegurar hasta el momento. Si se planta conservará los puntos conseguidos hasta la última respuesta acertada.',
};
