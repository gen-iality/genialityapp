import { AgendaApi } from '@helpers/request'
import { useEffect, useState } from 'react'
import { firestore, fireRealtime } from '@helpers/firebase'
import { StateMessage } from '@context/MessageService'
import { FB } from '@helpers/firestore-request'
import { handleRequestError } from '@helpers/utils'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import useOrderUpdater from './useOrderUpdater'
import orderActivities from '../utils/order-activities'

export default function useRequestActivities(eventId: string) {
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { getOrder } = useOrderUpdater()

  const getActivities = async (eventId: string) => {
    const data = (await AgendaApi.byEvent(eventId)) as { data: any[] }
    return data.data
  }

  const refreshActivities = async () => {
    const _activities = await getActivities(eventId)

    const __activities = await Promise.all(
      _activities.map(async (activity) => {
        const order = await getOrder(eventId, activity._id)
        return {
          order,
          ...activity,
        }
      }),
    )

    setActivities(
      orderActivities(__activities).map((it, index) => {
        return { ...it, key: `table_cms_${index}`, order: index }
      }),
    )
  }

  const forceDeleteActivityById = async (activityId: string, quitMode?: boolean) => {
    try {
      const refActivity = `request/${eventId}/activities/${activityId}`
      await fireRealtime.ref(refActivity).remove()
      await FB.Activities.delete(eventId, activityId)
      await AgendaApi.deleteOne(activityId, eventId)
      if (!quitMode) {
        StateMessage.destroy('loading')
        StateMessage.show(null, 'success', 'Se eliminó la información correctamente!')
      }
    } catch (err) {
      console.error(err)
      if (!quitMode) {
        StateMessage.destroy('loading')
        StateMessage.show(null, 'error', handleRequestError(err).message)
      }
    }
  }

  const deleteActivityById = (
    activityId: string,
    config?: {
      quitMode?: boolean
      useConfirmation?: boolean
      onDelete?: () => void
    },
  ) => {
    if (config?.useConfirmation) {
      Modal.confirm({
        title: '¿Está seguro de eliminar la información?',
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          if (!config?.quitMode) {
            StateMessage.show(
              'loading',
              'loading',
              'Por favor espere mientras se borra la información...',
            )
          }
          forceDeleteActivityById(activityId, config?.quitMode).then(
            () => typeof config?.onDelete === 'function' && config?.onDelete(),
          )
        },
      })
    } else {
      forceDeleteActivityById(activityId, config?.quitMode).then(
        () => typeof config?.onDelete === 'function' && config?.onDelete(),
      )
    }
  }

  useEffect(() => {
    if (!eventId) return
    setIsLoading(true)
    refreshActivities().finally(() => {
      setIsLoading(false)
    })
  }, [eventId])

  return {
    activities,
    isLoading,
    getActivities,
    forceDeleteActivityById,
    refreshActivities,
    deleteActivityById,
  }
}
