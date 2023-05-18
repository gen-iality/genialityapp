import { createContext } from 'react'
export const MessageController = createContext({})
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

interface PropsOptions {
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading'
  msj?: string
  duration?: number
  action: 'show' | 'hide' | 'destroy'
  key?: string
}

export const DispatchMessageService = ({
  type,
  msj,
  duration,
  action,
  key,
}: PropsOptions) => {
  try {
    switch (action) {
      case 'show':
        message.open({
          content: MessageReducer({ type, msj, action }),
          key: key || '',
          duration: duration || 5,
          type: null as any,
        })
        break

      case 'destroy':
        message.destroy(key)
        break
    }
  } catch (error) {
    console.log(error)
  }
}

const MessageReducer = ({ type, msj: textMessage }: PropsOptions) => {
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
