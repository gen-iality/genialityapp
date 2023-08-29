import { FrownOutlined, SmileOutlined, MehOutlined } from '@ant-design/icons'
import { ReactNode, useEffect, useState } from 'react'

type Props = {
  title: ReactNode
  subTitle: ReactNode
  icon: ReactNode
  status: 'success' | 'error' | 'warning' | 'info'
}

export default function useResultProps(state: Props['status']) {
  const [props, setProps] = useState<Props>({
    title: '',
    subTitle: '',
    status: state,
    icon: null,
  })

  useEffect(() => {
    // Update the props according the state
    switch (state) {
      case 'success':
        setProps({
          ...props,
          title: <div>¡Respuesta correcta!</div>,
          subTitle: '',
          icon: <SmileOutlined />,
        })
        break

      case 'error':
        setProps({
          ...props,
          title: <div>¡Respuesta incorrecta!</div>,
          subTitle: '',
          icon: <FrownOutlined />,
        })
        break

      case 'warning':
        setProps({
          ...props,
          title: 'No has escogido ninguna opción',
          subTitle: `No has ganado ningun punto debido a que no marcaste ninguna opción.`,
          icon: <MehOutlined />,
        })
        break

      case 'info':
        setProps({
          ...props,
          title: 'Estamos en una pausa',
          subTitle: `El juego se encuentra en pausa. Espera hasta el moderador reanude el juego`,
          icon: <MehOutlined />,
        })
        break

      default:
        setProps({ title: '', subTitle: '', status: state, icon: null })
    }
  }, [state])

  return props
}
