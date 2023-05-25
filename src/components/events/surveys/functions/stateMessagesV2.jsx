import { FrownOutlined, SmileOutlined, MehOutlined } from '@ant-design/icons'

// Componente que nos muesta mensajes correspondientes segun el estado
function stateMessages(state) {
  const objMessage = {
    title: '',
    subTitle: '',
    status: state,
  }

  switch (state) {
    case 'success':
      return {
        ...objMessage,
        title: <div>¡Respuesta correcta!</div>,
        subTitle: '',
        icon: <SmileOutlined />,
      }

    case 'error':
      return {
        ...objMessage,
        title: <div>¡Respuesta incorrecta!</div>,
        subTitle: '',
        icon: <FrownOutlined />,
      }

    case 'warning':
      return {
        ...objMessage,
        title: 'No has escogido ninguna opción',
        subTitle: `No has ganado ningun punto debido a que no marcaste ninguna opción.`,
        icon: <MehOutlined />,
      }

    case 'info':
      return {
        ...objMessage,
        title: 'Estamos en una pausa',
        subTitle: `El juego se encuentra en pausa. Espera hasta el moderador reanude el juego`,
        icon: <MehOutlined />,
      }

    default:
      return { type: state }
  }
}

export default stateMessages
