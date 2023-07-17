import { StateMessage } from '@context/MessageService'

import { AgendaApi } from '@helpers/request'
import { fireRealtime } from '@helpers/firebase'
import Service from '../roomManager/service'

import { handleRequestError } from '@helpers/utils'

export default function useDeleteActivity() {
  const service = new Service()

  const deleteActivity = async (
    eventId: string,
    activityId: string,
    activityName: string,
  ) => {
    try {
      const refActivity = `request/${eventId}/activities/${activityId}`
      const refActivityViewers = `viewers/${eventId}/activities/${activityId}`
      const configuration = await service.getConfiguration(eventId, activityId)
      if (configuration && configuration.typeActivity === 'eviusMeet') {
        console.warn('you are using a activity of eviusMeet, but this was removed')
      }
      await fireRealtime.ref(refActivity).remove()
      await fireRealtime.ref(refActivityViewers).remove()
      await service.deleteActivity(eventId, activityId)
      await AgendaApi.deleteOne(activityId, eventId)
      StateMessage.destroy('loading')
      StateMessage.show(null, 'success', 'Se eliminó la información correctamente!')
    } catch (e) {
      StateMessage.destroy('loading')
      StateMessage.show(null, 'error', handleRequestError(e).message)
    }
  }

  return deleteActivity
}
