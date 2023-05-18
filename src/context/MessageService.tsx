/**
 * TODO: rename this file to messageService
 */

import { message } from 'antd'

const positiveAnswer = [
  'Excelente',
  'Perfecto',
  'Genial',
  'Cool',
  'Lo haz hecho',
  'Éxito',
  'Bien',
]
const negativeAnswer = ['Ups', 'Error', 'Lo siento', 'Lo sentimos', 'Sorry']
const loadingAnswer = ['Cargando', 'Procesando', 'Espérame']

type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface OptionProps {
  type?: MessageType
  msj?: string
  duration?: number
  action: 'show' | 'destroy'
  key?: string
}

export const StateMessage = {
  show: (key: string, type: MessageType, textMessage: string, duration?: number) => {
    message.open({
      content: preProcessMessage(type, textMessage),
      key: key || '',
      duration: duration || 5,
      type: null as any,
    })
  },
  destroy: (key: string) => {
    message.destroy(key)
  },
}

/**
 * Show a message or destroy an existent message
 *
 * @deprecated use StateMessage instead
 * @param props OptionProps
 */
export const DispatchMessageService = (props: OptionProps) => {
  try {
    switch (props.action) {
      case 'show':
        StateMessage.show(props.key!, props.type!, props.msj!, props.duration)
        break

      case 'destroy':
        StateMessage.destroy(props.key!)
        break
    }
  } catch (error) {
    console.log(error)
  }
}

const preProcessMessage = (type: string | undefined, textMessage: string) => {
  const randomPositive = Math.floor(Math.random() * positiveAnswer.length)
  const ramdonNegative = Math.floor(Math.random() * negativeAnswer.length)
  const ramdonLoading = Math.floor(Math.random() * loadingAnswer.length)

  let iconRender = ''
  let finalMessage = ''

  switch (type) {
    case 'success':
      iconRender = '✅'
      break
    case 'error':
      iconRender = '❌'
      break
    case 'warning':
      iconRender = '⚠️'
      break
    case 'info':
      iconRender = 'ℹ️'
      break
    case 'loading':
      iconRender = '⏳'
      break
    default:
      iconRender = '🤷‍♂️'
  }

  // Convert captioncase to lowercase
  const formatUpperCaseMissing = (text: string) => {
    if (text.length === 0) return text

    if (text[0] === text[0].toUpperCase()) {
      return text[0].toLowerCase() + text.slice(1)
    } else {
      return text
    }
  }

  if (textMessage !== undefined) {
    if (type === 'success') {
      finalMessage = `${iconRender} ${
        positiveAnswer[randomPositive]
      }, ${formatUpperCaseMissing(textMessage)}`
    } else if (type === 'loading') {
      finalMessage = `${iconRender} ${
        loadingAnswer[ramdonLoading]
      }, ${formatUpperCaseMissing(textMessage)}`
    } else {
      finalMessage = `${iconRender} ${
        negativeAnswer[ramdonNegative]
      }, ${formatUpperCaseMissing(textMessage)}`
    }
  }

  return finalMessage
}
