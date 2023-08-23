import { StateMessage } from '@context/MessageService'
import { FB } from '@helpers/firestore-request'
import { Button } from 'antd'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'

interface IActivityPublishingStatusProps {
  eventId: string
  activityId: string
  onChange?: (isPublished?: boolean) => void
}

const ActivityPublishingStatus: FunctionComponent<IActivityPublishingStatusProps> = (
  props,
) => {
  const { eventId, activityId } = props
  const [isPublished, setIsPublished] = useState<boolean | undefined>(undefined)
  const [pendingPublishStatus, setPendingPublishStatus] = useState<boolean | undefined>(
    undefined,
  )

  const toggleStatus = () => {
    if (typeof pendingPublishStatus === 'undefined') {
      setPendingPublishStatus(false)
    } else {
      setPendingPublishStatus((previous) => !previous)
    }
  }

  useEffect(() => {
    if (
      typeof pendingPublishStatus === 'undefined' ||
      typeof isPublished === 'undefined' ||
      pendingPublishStatus === isPublished
    )
      return
    const newIsPublished = pendingPublishStatus

    FB.Activities.update(eventId, activityId, { isPublished: newIsPublished }).catch(
      (err) => {
        console.error(err)
        StateMessage.show(
          null,
          'error',
          'No se ha podido actualizar la configuración de la actividad',
        )
      },
    )
  }, [pendingPublishStatus, isPublished])

  useEffect(() => {
    if (!eventId || !activityId) return

    FB.Activities.get(eventId, activityId).then((document) => {
      // typeof pendingPublishStatus === 'undefined' &&
      //   setPendingPublishStatus(document?.isPublished)
      setIsPublished(document?.isPublished)
    })
  }, [eventId, activityId])

  useEffect(() => {
    if (typeof props.onChange === 'function') {
      props.onChange(isPublished)
    }
  }, [isPublished])

  useEffect(() => {
    if (
      typeof pendingPublishStatus === 'boolean' &&
      typeof isPublished === 'boolean' &&
      pendingPublishStatus !== isPublished
    ) {
      setIsPublished(pendingPublishStatus)
      console.log('update publish status to', pendingPublishStatus)
    }
  }, [isPublished, pendingPublishStatus])

  const status = useMemo(() => {
    if (
      typeof isPublished === 'undefined' &&
      typeof pendingPublishStatus === 'undefined'
    ) {
      return 'público'
    } else if (
      typeof isPublished === 'undefined' &&
      typeof pendingPublishStatus === 'boolean'
    ) {
      return pendingPublishStatus ? 'público' : 'oculto'
    } else if (typeof isPublished === 'boolean') {
      if (typeof pendingPublishStatus === 'undefined')
        setPendingPublishStatus(isPublished)
      return pendingPublishStatus ?? isPublished ? 'público' : 'oculto'
    }
  }, [isPublished, pendingPublishStatus])

  return (
    <Button
      type="link"
      onClick={toggleStatus}
      style={{ color: isPublished ? '#618a89' : '#994b53' }}
    >
      {status}
    </Button>
  )
}

export default ActivityPublishingStatus
