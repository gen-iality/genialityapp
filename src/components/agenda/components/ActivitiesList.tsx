import { FunctionComponent, useContext, useMemo } from 'react'
import { Spin, Collapse } from 'antd'
import { useState, useEffect } from 'react'
import { AgendaApi } from '@helpers/request'
import dayjs from 'dayjs'
import { ExtendedAgendaType, TruncatedAgenda } from '@Utilities/types/AgendaType'
import { ActivityType } from '@context/activityType/types/activityType'
import { firestore } from '@helpers/firebase'
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

interface ActivitiesListProps {
  eventId: string
  eventUserId?: string
  agendaList?: ExtendedAgendaType[] // If parent has this, why have we to re-do?
  setActivitiesAttendee?: any
}

const ActivitiesList = (props: ActivitiesListProps) => {
  const {
    eventId, // The event ID
    eventUserId, // The event user ID
    setActivitiesAttendee,
  } = props

  const service = new Service(firestore)

  const [isLoading, setIsLoading] = useState(true)
  const [truncatedAgendaList, setTruncatedAgendaList] = useState<TruncatedAgenda[]>([])
  const [isAnswersDeleted, setAnswersIsDeleted] = useState(false)
  const [isActivitiesAttendeeDeleted, setActivitiesAttendeeIsDeleted] = useState(false)

  const currentUser = useCurrentUser()
  const currentEventUser = useContext(CurrentEventUserContext)

  const location = useLocation<any>()

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

    ;(async () => {
      setIsLoading(true)
      setTruncatedAgendaList([])

      let agendaList: ExtendedAgendaType[] = []
      if (props.agendaList === undefined) {
        const { data } = (await AgendaApi.byEvent(eventId)) as {
          data: ExtendedAgendaType[]
        }
        agendaList = data
      } else {
        agendaList = props.agendaList
      }

      setTruncatedAgendaList([
        ...agendaList.map((agenda) => {
          // Logic here
          let diff = Math.floor(Math.random() * 60 * 60)

          try {
            diff = dayjs(agenda.datetime_end).diff(dayjs(agenda.datetime_start))
          } catch (err) {
            console.error(err)
          }

          const result: TruncatedAgenda = {
            title: agenda.name,
            datetime_start: agenda.datetime_start,
            isInfoOnly: agenda.is_info_only,
            module_name: agenda.module?.module_name,
            module_order: agenda.module?.order || 0,
            type: agenda.type?.name as ActivityType.ContentValue,
            timeString: dayjs(diff).format('h:mm').concat(' min'),
            link: `/landing/${eventId}/activity/${agenda._id}`,
            host_picture: agenda.hosts[0]?.image,
            name_host: agenda.hosts[0]?.name,
            short_description: agenda.short_description,
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
                ![activityContentValues.quizing, activityContentValues.survey].includes(
                  agenda.type?.name as any,
                ) ? (
                  <></>
                ) : (
                  <ButtonToDeleteSurveyAnswers
                    userId={currentUser.value._id}
                    eventId={eventId}
                    activityId={agenda._id!}
                    onDelete={() => setAnswersIsDeleted(true)}
                  />
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

      setIsLoading(false)
    })()
  }, [eventId, eventUserId, isActivitiesAttendeeDeleted])

  if (isLoading) return <Spin />

  const ModuledActivityHOC: FunctionComponent<{
    list: TruncatedAgenda[]
    render: (nameToFilter: string) => any
  }> = (props) => {
    const moduleNames = useMemo(() => {
      const uniqueNames = Array.from(
        new Set(props.list.map((item) => item.module_name)),
      ).filter((item) => item !== undefined) as string[]

      const sorttedNames = uniqueNames
        .map((name) => {
          const data = props.list.find((item) => item.module_name == name)
          if (!data) return { name, order: 0 }
          return {
            name,
            order: data.module_order,
          }
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((item) => item.name)
      return sorttedNames
    }, [props.list])

    return (
      <Collapse>
        {moduleNames.map((name: string, index: number) => (
          <Collapse.Panel
            header={`Módulo: ${name}`}
            key={index}
            extra={`${
              props.list.filter((item) => item.module_name === name).length
            } elemento(s)`}
          >
            {props.render(name)}
          </Collapse.Panel>
        ))}
      </Collapse>
    )
  }

  return (
    <>
      {currentEventUser.value?.rol.type === 'admin' ? (
        <>
          <DeleteActivitiesTakenButton
            eventId={eventId}
            cEventUserId={eventUserId}
            setActivitiesAttendeeIsDeleted={setActivitiesAttendeeIsDeleted}
            setActivitiesAttendee={setActivitiesAttendee}
          />
        </>
      ) : undefined}
      <ModuledActivityHOC
        list={truncatedAgendaList}
        render={(nameToFilter) => (
          <ListTheseActivities
            dataSource={truncatedAgendaList.filter(
              (item) => item.module_name === nameToFilter,
            )}
          />
        )}
      />

      {/* Without modules: */}
      <ListTheseActivities
        dataSource={truncatedAgendaList.filter((item) => item.module_name === undefined)}
      />
    </>
  )
}

export default ActivitiesList
