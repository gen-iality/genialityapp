import { StateMessage } from '@context/MessageService'
import { FB } from '@helpers/firestore-request'
import { useState } from 'react'

export default function useOrderUpdater() {
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false)

  const getOrder = async (eventId: string, activityId: string) => {
    const data = await FB.Activities.get(eventId, activityId)
    if (!data) return

    return data.order
  }

  const updateOrder = (eventId: string, activityId: string, order: number) => {
    setIsUpdatingOrder(true)
    FB.Activities.edit(eventId, activityId, { order }, { merge: true })
      .then(() => {
        console.debug(
          `update order for event ${eventId}, activity ${activityId}, to order ${order}`,
        )
      })
      .catch((err) => {
        console.error(err)
        StateMessage.show(
          null,
          'error',
          'No se ha podido actualizar la configuración de la actividad',
        )
      })
      .finally(() => {
        setIsUpdatingOrder(true)
      })
  }

  return {
    isUpdatingOrder,
    updateOrder,
    getOrder,
  }
}
