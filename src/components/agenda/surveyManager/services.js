import { SurveysApi } from '@helpers/request'
import { StateMessage } from '@/context/MessageService'
export const sendCommunicationOpen = async (survey_id) => {
  try {
    const response = await SurveysApi.sendCommunicationOpen(survey_id)
    if (response) {
      StateMessage.show(null, 'success', 'Comunicado enviado con exito')
    }
    return
  } catch (error) {
    StateMessage.show(null, 'error', 'No se pudo enviar el comunicado')
    console.error(error)
  }
}

export const sendCommunicationUser = async (survey_id, evenUserID) => {
  try {
    const response = await SurveysApi.sendCommunicationUser(survey_id, evenUserID)
    if (response) {
      StateMessage.show(null, 'success', 'Enviado con exito')
    }
    return
  } catch (error) {
    StateMessage.show(null, 'error', 'No se pudo enviar')
    console.error(error)
  }
}
