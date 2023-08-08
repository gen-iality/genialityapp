import { FunctionComponent, useContext } from 'react'
import { Spin } from 'antd'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { ExtendedAgendaType, TruncatedAgenda } from '@Utilities/types/AgendaType'
import { ActivityType } from '@context/activityType/types/activityType'

import { activityContentValues } from '@context/activityType/constants/ui'
import { useCurrentUser } from '@context/userContext'
import Service from '@components/agenda/roomManager/service'
import { CurrentEventUserContext } from '@context/eventUserContext'
import ListTheseActivities from './ListTheseActivities'
import OnLiveRibbon from './OnLiveRibbon'
import QuizProgressFromActivity from './QuizProgressFromActivity'
import ButtonToDeleteSurveyAnswers from './ButtonToDeleteSurveyAnswers'
import TakenActivityBadge from './TakenActivityBadge'
import { useLocation } from 'react-router'
import { DeleteActivitiesTakenButton } from './DeleteActivitiesTakenButton'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import ModuledActivityDisplayer from './ModuledActivityDisplayer'
import { FB } from '@helpers/firestore-request'
import useIsDevOrStage from '@/hooks/useIsDevOrStage'

interface ActivitiesListProps {
  eventId: string
  eventUserId?: string
  agendaList?: ExtendedAgendaType[] // If parent has this, why have we to re-do?
  eventProgressPercent?: number
}

const ActivitiesList: FunctionComponent<ActivitiesListProps> = (props) => {
  const {
    eventId, // The event ID
    eventUserId, // The event user ID
    eventProgressPercent,
  } = props

  const service = new Service()

  const [isLoading, setIsLoading] = useState(true)
  const [loadedActivities, setLoadedActivities] = useState<ExtendedAgendaType[]>([])
  const [truncatedAgendaList, setTruncatedAgendaList] = useState<TruncatedAgenda[]>([])
  const [publishedTruncatedAgendaList, setPublishedTruncatedAgendaList] = useState<
    TruncatedAgenda[]
  >([])
  const [isAnswersDeleted, setAnswersIsDeleted] = useState(false)
  const [deletingTakenActivitiesCounter, setDeletingTakenActivitiesCounter] = useState(0)
  const [nonPublishedActivities, setNonPublishedActivities] = useState<string[]>([])

  const currentUser = useCurrentUser()
  const currentEventUser = useContext(CurrentEventUserContext)

  const { activitiesEvent } = useHelper()
  const { isDev, isStage } = useIsDevOrStage()

  const location = useLocation<any>()

  const onDeleteTakenActivities = () => {
    setDeletingTakenActivitiesCounter((previous) => previous + 1)
  }

  useEffect(() => {
    // We use the activities loaded by the HelperContext
    if (!Array.isArray(activitiesEvent)) {
      console.warn('activitiesEvent is not an array')
      setLoadedActivities([])
    } else {
      setLoadedActivities(activitiesEvent)
    }
  }, [activitiesEvent])

  useEffect(() => {
    ;(activitiesEvent as ExtendedAgendaType[]).map((activity) => {
      if (!activity._id) return
      FB.Activities.ref(eventId, activity._id).onSnapshot((snapshot) => {
        const data = snapshot.data()
        console.debug('snapshot', data)
        if (!data) return
        // Update the state of publishing of this activity ID
        const flag = !!data.isPublished

        if (!flag) {
          setNonPublishedActivities((previous) => [...previous, activity._id!])
        } else {
          setNonPublishedActivities((previous) =>
            previous.filter((id) => id !== activity._id!),
          )
        }
      })
      activity._id
    })
  }, [activitiesEvent, eventId])

  useEffect(() => {
    if (!eventId) return

    if (
      `/landing/${eventId}/evento` !== location.pathname &&
      `/landing/${eventId}/agenda` !== location.pathname
    ) {
      // This was added because the event context keeps the last event data
      // before the component notices that the pathname was changed. After the
      // event context sees that thhe pathname has changed and updates the
      // event data, but for some seconds the web shows the wrong activities
      console.warn('!!! the event cached is different of the pathname event ID')
      return
    }

    setIsLoading(true)
    setDeletingTakenActivitiesCounter((previous) => previous + 1)
    setIsLoading(false)
  }, [eventId])

  useEffect(() => {
    setTruncatedAgendaList([
      ...loadedActivities.map((agenda) => {
        // Logic here
        let diff = Math.floor(Math.random() * 60 * 60)

        try {
          diff = dayjs(agenda.datetime_end).diff(dayjs(agenda.datetime_start))
        } catch (err) {
          console.error(err)
        }

        const result: TruncatedAgenda = {
          _id: agenda._id,
          title: agenda.name,
          datetime_start: agenda.datetime_start,
          isInfoOnly: agenda.is_info_only,
          require_completion: agenda.require_completion,
          module_name: agenda.module?.module_name,
          module_order: agenda.module?.order || 0,
          type: agenda.type?.name as ActivityType.ContentValue,
          timeString: dayjs(diff).format('h:mm').concat(' min'),
          link: `/landing/${eventId}/activity/${agenda._id}`,
          host_picture: agenda.hosts[0]?.image,
          name_host: agenda.hosts[0]?.name,
          short_description: agenda.short_description,
          isPublished: !nonPublishedActivities.includes(agenda._id!),
          //categories: agenda.activity_categories.map((category: any) => category.name),
          categories: (agenda.activity_categories || []).map(({ name, color }) => ({
            name,
            color,
          })),
          endComponents: [
            () => (
              <TakenActivityBadge activityId={agenda._id!} eventUserId={eventUserId} />
            ),
            () =>
              ![activityContentValues.quizing, activityContentValues.survey].includes(
                agenda.type?.name as any,
              ) ? (
                <></>
              ) : (
                <QuizProgressFromActivity
                  activityId={agenda._id!}
                  eventId={eventId}
                  userId={currentUser.value._id}
                  isAnswersDeleted={isAnswersDeleted}
                />
              ),
            () =>
              [activityContentValues.quizing, activityContentValues.survey].includes(
                agenda.type?.name as any,
              ) ? (
                isDev || isStage ? (
                  <ButtonToDeleteSurveyAnswers
                    userId={currentUser.value._id}
                    eventId={eventId}
                    activityId={agenda._id!}
                    onDelete={() => setAnswersIsDeleted(true)}
                  />
                ) : (
                  (null as any)
                )
              ) : (
                <></>
              ),
          ],
          ItemWrapper: ({ children }) => (
            <OnLiveRibbon
              requestLiving={async () => {
                const config = await service.getConfiguration(eventId, agenda._id)
                const is = config?.habilitar_ingreso === 'open_meeting_room'
                return is
              }}
            >
              {children}
            </OnLiveRibbon>
          ),
        }
        return result
      }),
    ])
  }, [
    eventUserId,
    loadedActivities,
    deletingTakenActivitiesCounter,
    nonPublishedActivities,
  ])

  useEffect(() => {
    let shouldHide = true
    if (currentEventUser.value?._id) {
      // If the event user is admin, the activity is displayed. Else, it is hidden
      shouldHide = currentEventUser.value?.rol?.type !== 'admin'
    }

    // Now, we use the `shouldHide` value to know if the next activity list MUST be filtered or not
    setPublishedTruncatedAgendaList(
      truncatedAgendaList.filter((activity) => {
        if (activity.isPublished || !shouldHide) {
          // The activity is published, or the event user is admin
          return true
        }
        return false
      }),
    )
  }, [truncatedAgendaList, currentEventUser])

  if (isLoading) return <Spin />

  return (
    <>
      {currentEventUser.value?.rol.type === 'admin' ? (
        <>
          <DeleteActivitiesTakenButton
            eventId={eventId}
            cEventUserId={eventUserId}
            onDelete={onDeleteTakenActivities}
          />
        </>
      ) : undefined}
      <ModuledActivityDisplayer
        list={publishedTruncatedAgendaList}
        render={(nameToFilter) => (
          <ListTheseActivities
            eventProgressPercent={eventProgressPercent}
            dataSource={publishedTruncatedAgendaList.filter(
              (item) => item.module_name === nameToFilter,
            )}
          />
        )}
      />

      {/* Without modules: */}
      <ListTheseActivities
        eventProgressPercent={eventProgressPercent}
        dataSource={publishedTruncatedAgendaList.filter(
          (item) => item.module_name === undefined,
        )}
      />
    </>
  )
}

export default ActivitiesList
