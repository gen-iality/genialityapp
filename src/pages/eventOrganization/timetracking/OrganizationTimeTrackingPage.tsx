import { useState, useEffect, useMemo, type FunctionComponent, useCallback } from 'react'
import {
  Avatar,
  Card,
  Divider,
  Result,
  Select,
  Space,
  Typography,
  Table,
  Modal,
  Button,
  Tooltip,
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import { fireRealtime } from '@helpers/firebase'
import Logger from '@Utilities/logger'
import Online from '@components/online/Online'
import { AgendaApi, OrganizationApi, UsersApi } from '@helpers/request'
import { LoadingOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons'
import { type SessionPayload } from '@components/presence/types'

const { LOG, ERROR, WARN } = Logger('time-tracking-page')

type TimeInfo = {
  time: number
  description: string
}

type RowDataByEvent = {
  key: string
  name: string
  logCount: number
  timeInfo: TimeInfo
  timeInfoWithoutActivities: TimeInfo
  event: any
}

type RowDataByActivity = {
  key: string
  name: string
  logCount: number
  timeInfo: TimeInfo
}

export interface OrganizationTimeTrackingPageProps {
  match: any
  org: any
}

export type OrganizationUserInfo = {
  name: string
  isOnline?: boolean
  picture?: string
}

const OrganizationTimeTrackingPage: FunctionComponent<
  OrganizationTimeTrackingPageProps
> = (props) => {
  const { org: organization } = props
  // From URI we take the member ID.
  const [memberId] = useState(props.match.params.memberIdParam)
  // Then, we ask for the User ID
  const [userId, setUserId] = useState<string | undefined>()
  // And build a user info
  const [userInfo, setUserInfo] = useState({} as OrganizationUserInfo)

  // This is info about all the events in this organization where member is into
  const [events, setEvents] = useState<any[]>([])
  // All is loaded?
  const [isLoading, setIsLoading] = useState(true)

  // Global logs records all the global session logs for an specify user
  const [globalLogs, setGlobalLogs] = useState<SessionPayload[]>([])
  // To display how many the user has used the platform
  const [closedGlobalSessionLogs, setClosedGlobalSessionLogsLogs] = useState<
    SessionPayload[]
  >([])
  // This saves info about each logs by event
  const [localLogs, setLocalLogs] = useState<SessionPayload[]>([])

  // To control the time mode: whether the time should be adapt to human format
  const [timeMode, setTimeMode] = useState<'minutes' | 'hours' | 'days'>('minutes')

  // These states save data about the table data source
  const [eventDataSource, setEventDataSource] = useState<RowDataByEvent[]>([])
  const [activityDataSource, setActivityDataSource] = useState<RowDataByActivity[]>([])
  // The selected event to load data about an specify logs of event
  const [selectedEvent, setSelectedEvent] = useState<any>()

  // Modal controller
  const [isModalShown, setIsModalShown] = useState(false)

  const openModal = useCallback(() => setIsModalShown(true), [])
  const closeModal = useCallback(() => setIsModalShown(false), [])

  const closeModalAndResetSelectedEvent = () => {
    closeModal()
    setSelectedEvent(undefined)
  }

  const eventColumns: ColumnsType<RowDataByEvent> = [
    {
      title: 'Curso',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ingresos',
      dataIndex: 'logCount',
      key: 'logCount',
    },
    // This gene has decided not to express itself
    // {
    //   title: 'Tiempo en el landing',
    //   dataIndex: 'timeInfoWithoutActivities',
    //   key: 'timeInfoWithoutActivities',
    //   render: (item: TimeInfo) => {
    //     return `${item.time.toFixed(2)} ${item.description}`;
    //   },
    // },
    {
      title: 'Tiempo en actividades',
      dataIndex: 'timeInfo',
      key: 'timeInfo',
      render: (item: TimeInfo) => {
        return `${item.time.toFixed(2)} ${item.description}`
      },
    },
    {
      title: 'Opción',
      dataIndex: 'event',
      key: 'event',
      render: (item: any) => {
        return (
          <Tooltip title="Abrir información de esta actividad">
            <Button
              icon={<UnorderedListOutlined />}
              type="primary"
              size="small"
              onClick={() => {
                setSelectedEvent(item)
                openModal()
              }}
            ></Button>
          </Tooltip>
        )
      },
    },
  ]

  const activityColumns: ColumnsType<RowDataByActivity> = [
    {
      title: 'Actividad',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ingresos',
      dataIndex: 'logCount',
      key: 'logCount',
    },
    {
      title: 'Tiempo',
      dataIndex: 'timeInfo',
      key: 'timeInfo',
      render: (item: TimeInfo) => {
        return `${item.time.toFixed(2)} ${item.description}`
      },
    },
  ]

  useEffect(() => {
    if (!memberId) return
    if (!organization?._id) return
    const beaconRef = fireRealtime.ref('user_sessions/beacon')
    ;(async () => {
      // Get all events
      try {
        const allEvents = await OrganizationApi.events(organization._id)
        setEvents(allEvents.data)
      } catch (err) {
        ERROR('Cannot get all organization events:', err)
      }

      // Get the member data
      try {
        const member = await OrganizationApi.getEpecificUser(organization._id, memberId)
        setUserId(member.user._id)

        userInfo.name = member.user.names
        userInfo.picture = member.user.picture

        // Get info about the beacon status
        try {
          const snapshot = await beaconRef.child(member.user._id).get()
          const beacon = snapshot.val()
          userInfo.isOnline = beacon
          LOG('userId:', member.user._id, 'beacon:', beacon)
        } catch (err) {
          ERROR('Cannot get beacon status to userId', member.user._id, 'getting:', err)
        } finally {
          setUserInfo(userInfo)
        }

        const globalRef = await fireRealtime.ref(
          `user_sessions/global/${member.user._id}`,
        )
        const result = await globalRef.get()
        const logDict = result && result.exists() ? result.val() : {}
        LOG('logDict', logDict)
        setGlobalLogs(Object.values(logDict))
      } catch (err) {
        ERROR(
          'Cannot get the organization member to orgId and userId:',
          organization._id,
          memberId,
          'getting:',
          err,
        )
      }

      setIsLoading(false)
    })()
  }, [memberId])

  useEffect(() => {
    if (!events.length) return
    if (!userId) return

    const request = async () => {
      const localRef = await fireRealtime.ref(`user_sessions/local/${userId}`)
      const result = await localRef.get()
      if (!result.exists()) {
        LOG('no have user sessions for local')
        return
      }
      const allDocuments: { [x: string]: SessionPayload } = result.val()
      // We need all logs that are offline, have time, are type activity
      setLocalLogs(Object.values(allDocuments))
    }
    request().catch((err) => ERROR('error to request events', err))
  }, [events, userId])

  useEffect(() => {
    LOG('update from globalLogs')
    const filteredLogDict = globalLogs
      .filter((log: any) => log.status === 'offline')
      .filter((log: any) => log.startTimestamp !== undefined)
      .filter((log: any) => log.endTimestamp !== undefined)
    LOG(filteredLogDict.length, 'logs loaded', filteredLogDict)
    setClosedGlobalSessionLogsLogs(filteredLogDict as SessionPayload[])
  }, [globalLogs])

  useEffect(() => {
    LOG('update from localLogs')
    const tableList: typeof eventDataSource = []
    const filteredAllDocuments = localLogs
      .filter((document) => document.status === 'offline')
      .filter((document) => document.startTimestamp !== undefined)
      .filter((document) => document.endTimestamp !== undefined)
      .filter((document) => document.data?.type === 'activity')
      .filter((document) => document.data?.eventId !== undefined)
      .filter((document) => document.data?.activityId !== undefined)

    const filteredGlobalDocuments = globalLogs //
      .filter((document) => document.status === 'offline')
      .filter((document) => document.startTimestamp !== undefined)
      .filter((document) => document.endTimestamp !== undefined)
      .filter((document) => document.data?.type === 'activity')
      .filter((document) => document.data?.eventId !== undefined)
      .filter((document) => document.data?.activityId !== undefined)

    for (const event of events) {
      const logsByEvent = filteredAllDocuments.filter(
        (document) => document.data?.eventId === event._id,
      )
      const eventWithoutActivityLogs = filteredGlobalDocuments //
        .filter((document) => document.data?.eventId === event._id)
      LOG(event._id, 'has', logsByEvent.length, 'logs')
      LOG('eventWithoutActivityLogs', eventWithoutActivityLogs)

      // Create stats
      const rowData: RowDataByEvent = {
        key: event._id,
        name: event.name,
        logCount: logsByEvent.length,
        timeInfo: processTime(logsByEvent, timeMode),
        timeInfoWithoutActivities: processTime(eventWithoutActivityLogs, timeMode),
        event: event,
      }
      tableList.push(rowData)
    }

    const sorttedTableList = tableList
      .sort((a, b) => {
        if (a.timeInfo.time > b.timeInfo.time) return 1
        if (a.timeInfo.time < b.timeInfo.time) return -1
        return 0
      })
      .reverse()

    setEventDataSource(sorttedTableList)
  }, [localLogs, timeMode])

  useEffect(() => {
    if (!selectedEvent) return

    const filteredLocalDocuments = localLogs //
      .filter((document) => document.status === 'offline')
      .filter((document) => document.startTimestamp !== undefined)
      .filter((document) => document.endTimestamp !== undefined)
      .filter((document) => document.data?.type === 'activity')
      .filter((document) => document.data?.eventId !== undefined)
      .filter((document) => document.data?.activityId !== undefined)

    const filteredGlobalDocuments = globalLogs //
      .filter((document) => document.status === 'offline')
      .filter((document) => document.startTimestamp !== undefined)
      .filter((document) => document.endTimestamp !== undefined)
      .filter((document) => document.data?.type === 'activity')
      .filter((document) => document.data?.eventId !== undefined)
      .filter((document) => document.data?.activityId !== undefined)

    const request = async () => {
      const currentEvent = events.filter((event) => event._id === selectedEvent._id)[0]
      if (!currentEvent) {
        ERROR('cannot get the event', selectedEvent)
        return
      }

      // Get only the logs for the current selected event
      const eventLogs = filteredLocalDocuments //
        .filter((document) => document.data?.eventId === selectedEvent._id)

      const eventWithoutActivityLogs = filteredGlobalDocuments //
        .filter((document) => document.data?.eventId === selectedEvent._id)

      // Get all the activities
      const { data: activities } = await AgendaApi.byEvent(selectedEvent._id)

      const dataRows: typeof activityDataSource = []

      // Add info about event-without-activity logs
      dataRows.push({
        key: 'without',
        logCount: eventWithoutActivityLogs.length,
        name: 'Registro en el landing del curso',
        timeInfo: processTime(eventWithoutActivityLogs, timeMode),
      })

      for (const activity of activities) {
        // Filter by activity ID
        const itsLogs = eventLogs.filter((log) => log.data?.activityId === activity._id)
        // Calc stuffs with this set of logs
        const dataRow: RowDataByActivity = {
          key: activity._id,
          logCount: itsLogs.length,
          name: activity.name,
          timeInfo: processTime(itsLogs, timeMode),
        }
        dataRows.push(dataRow)
      }

      setActivityDataSource(dataRows)
      LOG('dataRows', dataRows)
    }
    request().catch((err) => ERROR('error to request activities', err))
  }, [localLogs, selectedEvent, timeMode, globalLogs])

  /**
   * Given logs and timeMode, will return an object with information about time
   */
  const processTime = useCallback(
    (_logs: typeof closedGlobalSessionLogs, _timeMode: typeof timeMode): TimeInfo => {
      let divisor = 1
      let description = 'minuto(s)'
      switch (_timeMode) {
        case 'minutes':
          divisor = 60
          description = 'minuto(s)'
          break
        case 'hours':
          divisor = 3600
          description = 'hora(s)'
          break
        case 'days':
          divisor = 3600 * 24
          description = 'día(s)'
          break
        default:
          WARN('the prop', _timeMode, 'is unknown')
      }
      const time = _logs
        .map((log) => (log.endTimestamp - log.startTimestamp) / 1000 / divisor)
        .reduce((a, b) => a + b, 0)
      return { time, description }
    },
    [],
  )

  const loggedTime: TimeInfo = useMemo(() => {
    return processTime(closedGlobalSessionLogs, timeMode)
  }, [closedGlobalSessionLogs, timeMode])

  if (isLoading) {
    return (
      <Result
        title="Cargando..."
        subTitle="Recuperando información del miembro"
        icon={<LoadingOutlined />}
      />
    )
  }

  return (
    <>
      <Typography.Title>Usuario en {organization.name}</Typography.Title>
      <Card
        title={
          <Space
            direction="horizontal"
            style={{ justifyContent: 'space-between', display: 'flex' }}
          >
            <Space direction="horizontal">
              <Online isOnline={userInfo.isOnline} />
              <Avatar
                style={{ backgroundColor: '#87d068' }}
                icon={<UserOutlined />}
                src={userInfo.picture}
              >
                {userInfo.name}
              </Avatar>
              <Typography.Text>{userInfo.name}</Typography.Text>
            </Space>
            <Space direction="horizontal">
              <Typography.Text>Modo:</Typography.Text>
              <Select
                onChange={(mode) => setTimeMode(mode)}
                defaultValue={timeMode}
                style={{ minWidth: 120 }}
              >
                <Select.Option value="minutes">Minutos</Select.Option>
                <Select.Option value="hours">Horas</Select.Option>
                <Select.Option value="days">Días</Select.Option>
              </Select>
            </Space>
          </Space>
        }
      >
        <Space
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        ></Space>
        <Space direction="vertical">
          <Typography.Text>{closedGlobalSessionLogs.length} ingresos</Typography.Text>
          <Space direction="horizontal">
            <Card>
              {loggedTime.time.toFixed(2)} {loggedTime.description}
            </Card>
          </Space>
        </Space>
        <Divider />
        <Space direction="vertical">
          <Typography.Text>{events.length} registros por área:</Typography.Text>
          {events.length === 0 ? (
            <Typography.Text italic>Sin datos.</Typography.Text>
          ) : (
            <Table columns={eventColumns} dataSource={eventDataSource} />
          )}
        </Space>
      </Card>
      <Modal
        visible={isModalShown}
        title={(selectedEvent?.name && `Evento: ${selectedEvent.name}`) || 'Cargando...'}
        footer={null}
        onCancel={closeModalAndResetSelectedEvent}
        onOk={closeModalAndResetSelectedEvent}
      >
        {activityDataSource.length ? (
          <Table columns={activityColumns} dataSource={activityDataSource} />
        ) : (
          <Result
            title="Cargando..."
            subTitle="Recuperando información del curso"
            icon={<LoadingOutlined />}
          />
        )}
      </Modal>
    </>
  )
}

export default OrganizationTimeTrackingPage
