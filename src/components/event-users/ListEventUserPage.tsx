import {
  AgendaApi,
  BadgeApi,
  EventsApi,
  OrganizationApi,
  RolAttApi,
} from '@helpers/request'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'

import {
  fieldNameEmailFirst,
  handleRequestError,
  parseData2Excel,
  sweetAlert,
} from '@helpers/utils'

import Header from '@antdComponents/Header'
import {
  Button,
  Checkbox,
  Col,
  Image,
  List,
  Modal,
  Result,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'

import { IDynamicFieldData } from '@components/dynamic-fields/types'
import { ColumnsType } from 'antd/lib/table'
import { fireRealtime, firestore } from '@helpers/firebase'
import { ColumnType } from 'antd/es/table'
import AttendeeCheckInCheckbox from '@components/checkIn/AttendeeCheckInCheckbox'
import dayjs from 'dayjs'

import { utils, writeFileXLSX } from 'xlsx'

import {
  CheckOutlined,
  DownloadOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  UploadOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import { checkinAttendeeInActivity } from '@helpers/HelperAuth'
import UserModal from '../modal/modalUser'
import { Link } from 'react-router-dom'
import { StateMessage } from '@context/MessageService'

interface ILessonsInfoModalProps {
  show: boolean
  onHidden: () => void
  allActivities: any[]
  user: any
  event: any
}

const LessonsInfoModal: FunctionComponent<ILessonsInfoModalProps> = (props) => {
  const { show, onHidden, allActivities, user, event } = props

  const [dataLoaded, setDataLoaded] = useState(false)
  const [viewedActivities, setViewedActivities] = useState<any[]>([])
  const [isSending, setIsSending] = useState(false)

  const requestAllData = async () => {
    const existentActivities = await allActivities.map(async (activity) => {
      const activity_attendee = await firestore
        .collection(`${activity._id}_event_attendees`)
        .doc(user._id)
        .get()
      if (activity_attendee.exists) {
        return activity
      }
      return null
    })
    // Filter non-null result that means that the user attendees them
    const viewedActivities = (await Promise.all(existentActivities)).filter(
      (item) => item !== null,
    )
    setViewedActivities(viewedActivities.map((activity) => activity.name))
  }

  const handleSendCertificate = async () => {
    setIsSending(true)
    const emailEncoded = encodeURIComponent(user.email)
    const redirect = `${window.location.origin}/landing/${event._id}/certificate`
    const url = `${window.location.origin}/direct-login?email=${emailEncoded}&redirect=${redirect}`

    try {
      await EventsApi.generalMagicLink(
        user.email,
        url,
        'Entra al ver el certificado en el siguiente link',
      )
      StateMessage.show(null, 'success', `Se ha enviado el mensaje a ${user.email}`)
    } catch (err) {
      console.error(err)
      Modal.error({
        title: 'Error en el envío',
        content: 'No se ha podido enviar el certificado por problemas de fondo',
      })
    }
    setIsSending(false)
  }

  useEffect(() => {
    if (!user) return
    if (allActivities.length == 0) return

    requestAllData().finally(() => setDataLoaded(true))

    // if (!show) setLoaded(false)
    return () => setDataLoaded(false)
  }, [allActivities, user, show])

  if (!user) return null

  return (
    <Modal centered footer={null} visible={show} closable onCancel={onHidden}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {dataLoaded ? (
          <List
            size="small"
            header={
              <Row justify="space-between">
                <Typography.Text strong>
                  Lecciones vistas por {user.names}
                </Typography.Text>
                <Button
                  type="primary"
                  disabled={
                    !allActivities.every((activity) =>
                      viewedActivities.includes(activity.name),
                    ) || isSending
                  }
                  onClick={() => handleSendCertificate()}
                  icon={isSending ? <LoadingOutlined /> : <SafetyCertificateOutlined />}
                >
                  Enviar certificado
                </Button>
              </Row>
            }
            // bordered
            dataSource={allActivities}
            renderItem={(item) => (
              <List.Item>
                {viewedActivities.filter((activityName) => activityName == item.name)
                  .length ? (
                  <CheckOutlined />
                ) : (
                  <Checkbox
                    onChange={async () => {
                      await checkinAttendeeInActivity(user, item._id)
                      requestAllData()
                    }}
                  />
                )}{' '}
                {item.name}
              </List.Item>
            )}
          />
        ) : (
          <Result
            icon={<LoadingOutlined />}
            title="Cargando"
            status="info"
            subTitle={`Cargando datos de ${user.names}...`}
          />
        )}
      </Space>
    </Modal>
  )
}

interface ITimeTrackingStatsProps {
  user: any
}

const TimeTrackingStats: FunctionComponent<ITimeTrackingStatsProps> = ({ user }) => {
  const [timing, setTiming] = useState(0)

  useEffect(() => {
    const localRef = fireRealtime.ref(`user_sessions/local/${user._id}`)
    localRef.get().then((result) => {
      const logDict = result && result.exists() ? result.val() : {}

      if (!logDict) {
        setTiming(0)
        return
      }

      const filteredLogDict = (Object.values(logDict) as any[])
        .filter((log) => log.status === 'offline')
        .filter((log) => log.startTimestamp !== undefined)
        .filter((log) => log.endTimestamp !== undefined)

      const divisor = 3600

      const time = filteredLogDict
        .map((log) => (log.endTimestamp - log.startTimestamp) / 1000 / divisor)
        .reduce((a, b) => a + b, 0)
      setTiming(time)
    })
  }, [user])

  return <>{timing.toFixed(2)} horas</>
}

interface IProgressingColumnProps {
  shownAll?: boolean
  item: any
  allActivities: any[]
  onOpen?: () => void
  updateWatchedUser: (user: any) => void
}

const ProgressingColumn: FunctionComponent<IProgressingColumnProps> = (props) => {
  const {
    shownAll,
    item,
    allActivities,
    onOpen,
    // updateAttendee,
    updateWatchedUser,
  } = props

  const [attendee, setAttendee] = useState<any[]>([])
  const [shouldUpdate, setShouldUpdate] = useState(0)

  const requestAttendees = async () => {
    // Get all existent activities, after will filter it
    const existentActivities = await allActivities.map(async (activity) => {
      const activity_attendee = await firestore
        .collection(`${activity._id}_event_attendees`)
        .doc(item._id)
        .get()
      if (activity_attendee.exists) {
        return activity_attendee.data()
      }
      return null
    })
    // Filter non-null result that means that the user attendees them
    const gotAttendee = (await Promise.all(existentActivities)).filter(
      (item) => item !== null,
    )

    return gotAttendee
  }

  useEffect(() => {
    requestAttendees().then((gotAttendee) => setAttendee(gotAttendee))
  }, [shouldUpdate])

  if (!onOpen) onOpen = () => {}

  if (shownAll) {
    return (
      <Button
        onClick={() => {
          // updateAttendee(attendee)
          updateWatchedUser(item)
          setShouldUpdate((previus) => previus + 1)
          onOpen && onOpen()
        }}
      >
        {`${attendee.length || 0}/${allActivities.length || 0}`}
      </Button>
    )
  }
  return <>{attendee.length > 0 ? 'Visto' : 'No visto'}</>
}

interface IListEventUserPageProps {
  event: any
  activityId?: string
  parentUrl: string
}

const ListEventUserPage: FunctionComponent<IListEventUserPageProps> = (props) => {
  const { event, activityId, parentUrl } = props

  const [isLoading, setIsLoading] = useState(false)
  const [extraFields, setExtraFields] = useState<IDynamicFieldData[]>([])
  const [columns, setColumns] = useState<ColumnsType<any>>([])
  const [rolesList, setRolesList] = useState<any[]>([])
  const [simplifyOrgProperties, setSimplifyOrgProperties] = useState<any[]>([])
  const [badgeEvent, setBadgeEvent] = useState<any>()
  const [dataSource, setDataSource] = useState<any[]>([])

  const [isProgressingModalOpened, setIsProgressingModalOpened] = useState(false)
  const [isRegistrationModalOpened, setIsRegistrationModalOpened] = useState(false)
  const [watchedUserInProgressingModal, setWatchedUserInProgressingModal] =
    useState<any>()

  // TODO: if activity_id, then load to activity
  const [activity, setActivity] = useState<any | undefined>()

  const [allActivities, setAllActivities] = useState<any[]>([])

  const [eventUsersRef] = useState(firestore.collection(`${event._id}_event_attendees`))

  const getNameFromURL = (fileUrl: string) => {
    if (typeof fileUrl == 'string') {
      const splitUrl = fileUrl?.split('/')
      return splitUrl[splitUrl.length - 1]
    } else {
      return null
    }
  }

  const addDefaultLabels = (extraFields: any[]) => {
    extraFields = extraFields.map((field) => {
      field['label'] = field['label'] ?? field['name']
      return field
    })
    return extraFields
  }

  const orderFieldsByWeight = (extraFields: any[]) => {
    extraFields = extraFields.sort(
      (a, b) => (a.order_weight || 0) - (b.order_weight || 0),
    )
    return extraFields
  }

  const getAllAttendees = async () => {
    const orgId = event.organizer._id
    const org = await OrganizationApi.getOne(orgId)

    const eventActivities = await AgendaApi.byEvent(event._id)
    setAllActivities(eventActivities.data)

    const newSimplifyOrgProperties = (org.user_properties || []).filter(
      (property: any[]) => !['email', 'password', 'names'].includes(property.name),
    )
    const newRolesList: any[] = await RolAttApi.byEventRolsGeneral()
    const newBadgeEvent = await BadgeApi.get(event._id)

    setSimplifyOrgProperties(newSimplifyOrgProperties)
    setRolesList(newRolesList)
    setBadgeEvent(newBadgeEvent)

    let newExtraFields: IDynamicFieldData[] = fieldNameEmailFirst(event.user_properties)
    newExtraFields = addDefaultLabels(newExtraFields)
    newExtraFields = orderFieldsByWeight(newExtraFields)

    setExtraFields(newExtraFields)

    // Set the columns

    const checkInColumn: ColumnType<any> = {
      title: 'Fecha de ingreso',
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.checkedin_at - b.checkedin_at,
      filters: [
        {
          text: 'Asistentes',
          value: 'attendees',
        },
        {
          text: 'No asistentes',
          value: 'not_attendees',
        },
      ],
      filterSearch: true,
      onFilter: (value, record) => {
        if (value === 'attendees') {
          return record.checkedin_at !== null
        } else return record.checkedin_at === null
      },
      render: (item) => (
        <AttendeeCheckInCheckbox
          attendee={item}
          activityId={activityId}
          checkInAttendeeCallbak={(attendee) => {
            throw new Error('Function not implemented.')
          }}
        />
      ),
    }

    const progressingColumn: ColumnType<any> = {
      title: 'Progreso',
      ellipsis: true,
      sorter: () => 0,
      render: (item) => (
        <ProgressingColumn
          shownAll={activityId === undefined}
          item={item}
          onOpen={() => setIsProgressingModalOpened(true)}
          // updateAttendee={(attendee) => this.setState({ attendee })}
          allActivities={allActivities}
          updateWatchedUser={setWatchedUserInProgressingModal}
        />
      ),
    }

    const timeTrackingStatsColumn: ColumnType<any> = {
      title: 'Tiempo registrado',
      dataIndex: 'user',
      ellipsis: true,
      render: (user) => <TimeTrackingStats user={user} />,
    }

    const rolColumn: ColumnType<any> = {
      title: 'Rol',
      ellipsis: true,
      sorter: (a, b) => a.rol_id.length - b.rol_id.length,
      // ...self.getColumnSearchProps('rol_name'),
      render: (item) => {
        for (const role of rolesList) {
          if (item.rol_id == role._id) {
            item['rol_name'] = role.name
            return <span>{role.name}</span>
          }
        }
      },
    }

    const createdAtColumn: ColumnType<any> = {
      title: 'Creado',
      width: 140,
      ellipsis: true,
      sorter: (a, b) => a.created_at - b.created_at,
      // ...self.getColumnSearchProps('created_at'),
      render: (item) => {
        if (item.created_at !== null) {
          const createdAt = item?.created_at || new Date()

          return (
            <>
              {createdAt ? (
                <span>{dayjs(createdAt).format('D/MMM/YY h:mm:ss A ')}</span>
              ) : (
                ''
              )}
            </>
          )
        } else {
          return ''
        }
      },
    }

    const updatedAtColumn: ColumnType<any> = {
      title: 'Actualizado',
      width: 140,
      ellipsis: true,
      sorter: (a, b) => a.updated_at - b.updated_at,
      // ...self.getColumnSearchProps('updated_at'),
      render: (item) => {
        const updatedAt = item?.updated_at

        return (
          <>
            {updatedAt ? (
              <span>{dayjs(updatedAt).format('D/MMM/YY h:mm:ss A ')}</span>
            ) : (
              ''
            )}
          </>
        )
      },
    }

    // Add columns from extra fields
    const extraColumns: ColumnsType<any> = newExtraFields
      .filter((item) => {
        return item.type !== 'tituloseccion' && item.type !== 'password'
      })
      .map((item) => {
        return {
          title: item.label,
          // dataIndex: item.name,
          ellipsis: true,
          sorter: (a, b) => a[item.name]?.length - b[item.name]?.length,
          // ...self.getColumnSearchProps(item.name),
          render: (key) => {
            switch (item.type) {
              /** When using the ant datePicker it saves the date with the time, therefore, since only the date is needed, the following split is performed */
              case 'date':
                const date = key[item.name]
                const dateSplit = date ? date?.split('T') : ''
                return dateSplit[0]

              case 'file':
                return (
                  <a target="__blank" download={item?.name} href={key[item?.name]}>
                    {getNameFromURL(key[item?.name])}
                  </a>
                )

              case 'avatar':
                return <Image width={40} height={40} src={key?.user?.picture} />

              default:
                return key[item.name]
            }
          },
        }
      })

    setColumns([
      checkInColumn,
      ...extraColumns,
      progressingColumn,
      timeTrackingStatsColumn,
      rolColumn,
      createdAtColumn,
      updatedAtColumn,
    ])

    eventUsersRef.onSnapshot((observer) => {
      const allEventUserData: any[] = []
      observer.forEach((result) => {
        const data = result.data()
        // console.log('result:', data)

        // Fix the date
        if (data.checkedin_at) data.checkedin_at = dayjs(data.checkedin_at.toDate())
        if (data.created_at) data.created_at = dayjs(data.created_at.toDate())
        if (data.updated_at) data.updated_at = dayjs(data.updated_at.toDate())

        allEventUserData.push({
          // the organization user properties here... (for now, nothing)
          ...data.properties,
          ...data,
        })
      })

      setDataSource(allEventUserData)
    })
  }

  const handleExportFile = async () => {
    const attendees = [...dataSource].sort((a, b) => b.created_at - a.created_at)

    console.info('attendees', attendees)

    const joint = [...extraFields, ...simplifyOrgProperties]

    const data = await parseData2Excel(attendees, joint, rolesList)
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Asistentes')
    writeFileXLSX(wb, `asistentes_${event.name}.xls`)
  }

  const activityStats = useMemo(() => {
    const total = dataSource.length
    const checkedInTotal = dataSource.filter(
      (data) => data.checkedin_at !== undefined,
    ).length
    const checkedInPercent = total === 0 ? 0 : Math.round((checkedInTotal / total) * 100)

    return {
      total,
      checkedInTotal,
      checkedInPercent,
    }
  }, [dataSource])

  useEffect(() => {
    setIsLoading(true)
    getAllAttendees().finally(() => setIsLoading(false))
  }, [])

  return (
    <>
      <LessonsInfoModal
        show={isProgressingModalOpened}
        onHidden={() => {
          setIsProgressingModalOpened(false)
        }}
        allActivities={allActivities}
        user={watchedUserInProgressingModal}
        event={event}
      />
      <Header
        title={
          activity !== undefined
            ? 'Inscripción de ' + activity.name
            : 'Inscripción de curso: '
        }
      />
      <Table
        size="small"
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        title={() => (
          <Row wrap justify="end" gutter={[8, 8]}>
            {!activityId && (
              <>
                <Col>
                  <Tag
                    style={{ color: 'black', fontSize: '13px', borderRadius: '4px' }}
                    color="lightgrey"
                    icon={<UsergroupAddOutlined />}
                  >
                    <strong>Inscritos: </strong>
                    <span style={{ fontSize: '13px' }}>{activityStats.total}</span>
                  </Tag>
                </Col>
                <Col>
                  <Tag
                    style={{ color: 'black', fontSize: '13px', borderRadius: '4px' }}
                    color="lightgrey"
                    icon={<StarOutlined />}
                  >
                    <strong>Participantes: </strong>
                    <span style={{ fontSize: '13px' }}>
                      {activityStats.checkedInTotal +
                        '/' +
                        activityStats.total +
                        ' (' +
                        activityStats.checkedInPercent +
                        '%)'}{' '}
                    </span>
                  </Tag>
                </Col>
              </>
            )}

            <Col>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleExportFile()
                }}
              >
                Exportar
              </Button>
            </Col>

            <Col>
              <Link
                to={{
                  pathname: `${parentUrl}/invitados/importar-excel`,
                  state: { activityId },
                }}
              >
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  disabled={
                    !Boolean(
                      'legacy checked if the event is active (eventIsActive) via HelperContext',
                    )
                  }
                >
                  Importar usuarios
                </Button>
              </Link>
            </Col>

            <Col>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                size="middle"
                onClick={() => setIsRegistrationModalOpened(true)}
                disabled={
                  !Boolean(
                    'legacy checked if the event is active (eventIsActive) via HelperContext',
                  )
                }
              >
                Agregar usuario
              </Button>
            </Col>
          </Row>
        )}
      />

      {isRegistrationModalOpened && (
        <UserModal
          handleModal={() => setIsRegistrationModalOpened(false)}
          modal={null}
          ticket={null}
          tickets={[]}
          rolesList={rolesList}
          value={watchedUserInProgressingModal}
          checkIn={(...args) => console.log(args)}
          badgeEvent={badgeEvent}
          extraFields={extraFields}
          spacesEvent={[]}
          edit={null}
          substractSyncQuantity={(...args) => console.log(args)}
          activityId={activityId}
        />
      )}
    </>
  )
}

export default ListEventUserPage
