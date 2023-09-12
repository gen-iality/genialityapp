import {
  AgendaApi,
  BadgeApi,
  EventsApi,
  OrganizationApi,
  RolAttApi,
} from '@helpers/request'
import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react'

import { fieldNameEmailFirst, parseData2Excel } from '@helpers/utils'

import Header from '@antdComponents/Header'
import {
  Button,
  Col,
  Image,
  Input,
  InputRef,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from 'antd'

import { IDynamicFieldData } from '@components/dynamic-fields/types'
import { ColumnsType } from 'antd/lib/table'
import { fireRealtime, firestore } from '@helpers/firebase'
import { ColumnType } from 'antd/es/table'
import AttendeeCheckInCheckbox from '@components/checkIn/AttendeeCheckInCheckbox'
import dayjs from 'dayjs'
import Highlighter from 'react-highlight-words'

import { utils, writeFileXLSX } from 'xlsx'

import {
  DownloadOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  StarOutlined,
  UploadOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import UserModal from '../modal/modalUser'
import { Link, useParams } from 'react-router-dom'
import { StateMessage } from '@context/MessageService'
import { useIntl } from 'react-intl'
import LessonsInfoModal from './LessonsInfoModal'
import { FB } from '@helpers/firestore-request'
import EventProgressWrapper from '@/wrappers/EventProgressWrapper'
import EnrollEventUserFromOrganizationMember from './EnrollEventUserFromOrganizationMember'
import ModalPassword from './ModalPassword'
import { FilterConfirmProps } from 'antd/lib/table/interface'
import filterActivitiesByProgressSettings from '@Utilities/filterActivitiesByProgressSettings'

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

interface IListEventUserPageProps {
  event: any
}

const ListEventUserPage: FunctionComponent<IListEventUserPageProps> = (props) => {
  const { event } = props
  const { activityId } = useParams<{ activityId: string }>()

  const [isLoading, setIsLoading] = useState(false)
  const [extraFields, setExtraFields] = useState<IDynamicFieldData[]>([])
  const [columns, setColumns] = useState<ColumnsType<any>>([])
  const [rolesList, setRolesList] = useState<any[]>([])
  const [simplifyOrgProperties, setSimplifyOrgProperties] = useState<any[]>([])
  const [badgeEvent, setBadgeEvent] = useState<any>()
  const [dataSource, setDataSource] = useState<undefined | any[]>(undefined) // We NEED the initial undefined value
  const [filteredDataSource, setFilteredDataSource] = useState<any[]>([])

  const [isProgressLoading, setIsProgressLoading] = useState(false)

  const [progressMap, setProgressMap] = useState<any>({})

  const [isProgressingModalOpened, setIsProgressingModalOpened] = useState(false)
  const [isRegistrationModalOpened, setIsRegistrationModalOpened] = useState(false)
  const [isEnrollingModalOpened, setIsEnrollingModalOpened] = useState(false)
  const [watchedUserInProgressingModal, setWatchedUserInProgressingModal] =
    useState<any>()
  const [nonPublishedActivityIDs, setNonPublishedActivityIDs] = useState<string[]>([])

  // TODO: if activity_id, then load to activity
  const [activity, setActivity] = useState<any | undefined>()

  const [allActivities, setAllActivities] = useState<any[]>([])

  const [eventUsersRef] = useState(firestore.collection(`${event._id}_event_attendees`))

  // Utiful to able the searcher thing
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const inputRef = useRef<InputRef>(null)

  const intl = useIntl()

  const ButtonThatOpenActivityProgressesModal: FunctionComponent<{
    item: any
    progressAsString?: string
    viewedActivities?: any[]
    totalActivities?: any[]
  }> = (props) => {
    const { item, progressAsString, viewedActivities, totalActivities } = props
    return (
      <Button
        onClick={() => {
          setIsProgressingModalOpened(true)
          setWatchedUserInProgressingModal(item)
        }}
      >
        {progressAsString ??
          `${(viewedActivities ?? []).length}/${Math.max(
            (totalActivities ?? []).length,
            allActivities.filter(
              ({ _id }: { _id: string }) => !nonPublishedActivityIDs.includes(_id),
            ).length,
          )}`}
      </Button>
    )
  }

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

  const checkIn = async (id: string, item: any) => {
    let checkInStatus = null

    const eventIdSearch = activityId ?? event._id

    let userRef = null
    try {
      userRef = firestore.collection(`${eventIdSearch}_event_attendees`).doc(id)
    } catch (error) {
      checkInStatus = false
      return
    }

    // Actualiza el usuario en la base de datos

    await userRef
      .update({
        ...item,
        updated_at: new Date(),
        checkedin_at: new Date(),
        checked_in: true,
      })
      .then(() => {
        StateMessage.show(null, 'success', 'Usuario inscrito exitosamente...')
        checkInStatus = true
      })
      .catch((error) => {
        console.error('Error updating document: ', error)
        StateMessage.show(
          null,
          'error',
          intl.formatMessage({
            id: 'toast.error',
            defaultMessage: 'Sry :(',
          }),
        )
        checkInStatus = false
      })
    return checkInStatus
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: string,
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (
    alias: string,
    howToRender: (value: any) => string,
  ): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={inputRef}
          placeholder={`Search ${alias}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, alias)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, alias)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(alias)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      return (howToRender(record) ?? '')
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase())
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => inputRef.current?.select(), 100)
      }
    },
    render: (item) => {
      const renderedText = howToRender(item)
      return searchedColumn === alias ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={renderedText ? renderedText.toString() : ''}
        />
      ) : (
        renderedText
      )
    },
  })

  const buildColumns = () => {
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
      sorter: (a: any, b: any) =>
        a.activity_progresses?.viewed_activities?.length /
          Math.max(a.activity_progresses?.activities?.length, 1) -
        b.activity_progresses?.viewed_activities?.length /
          Math.max(b.activity_progresses?.activities?.length, 1),
      ...getColumnSearchProps('progreso', (value) => value.postprocess_progress),
      render: (item) => (
        <>
          <EventProgressWrapper
            event={event}
            eventUser={item}
            onLoading={(isLoading) => {
              setIsProgressLoading(isLoading)
            }}
            render={({ isLoading, activities, viewedActivities }) => {
              return (
                <>
                  {isLoading && progressMap[item._id] !== undefined ? (
                    <ButtonThatOpenActivityProgressesModal
                      item={item}
                      progressAsString={progressMap[item._id]}
                    />
                  ) : isLoading ? (
                    <Spin />
                  ) : activityId === undefined ? (
                    <ButtonThatOpenActivityProgressesModal
                      item={item}
                      viewedActivities={viewedActivities}
                      totalActivities={activities}
                    />
                  ) : (
                    <>{viewedActivities.length > 0 ? 'Visto' : 'No visto'}</>
                  )}
                </>
              )
            }}
          />
        </>
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
      sorter: (a, b) => a.rol?.name?.length - b.rol?.name?.length,
      ...getColumnSearchProps('rol', (value) => value.rol?.name || 'Sin rol'),
    }

    const createdAtColumn: ColumnType<any> = {
      title: 'Creado',
      width: 140,
      ellipsis: true,
      sorter: (a, b) => a.created_at - b.created_at,
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
          ellipsis: true,
          sorter: (a, b) => a[item.name]?.length - b[item.name]?.length,
          ...getColumnSearchProps(item.label, (value) => value[item.name]),
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

    const editColumnRender = (item: any) => {
      const badColumns = simplifyOrgProperties.map((item) => item.name)
      const newItem = JSON.parse(JSON.stringify(item))
      const filteredProperties = Object.fromEntries(
        Object.entries(newItem.properties).filter(([key, value]) => {
          return !badColumns.includes(key)
        }),
      )
      newItem.properties = filteredProperties
      return (
        <Space>
          <Tooltip placement="topLeft" title="Editar">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setWatchedUserInProgressingModal(newItem)
                setIsRegistrationModalOpened(true)
              }}
            />
          </Tooltip>
          {/* Improve this component */}
          <ModalPassword
            onOk={() => {
              EventsApi.changePasswordUser(item.email, window.location.href)
                .then((response) => {
                  if (response) {
                    StateMessage.show(
                      null,
                      'success',
                      `Se ha enviado correo nueva contraseña a: ${item.email}`,
                    )
                  }
                })
                .catch((err) => {
                  console.error(err)
                  StateMessage.show(
                    null,
                    'error',
                    'Ocurrió un error al enviar el correo de recuperación de contraseña',
                  )
                })
            }}
          />
        </Space>
      )
    }
    const editColumn: ColumnType<any> = {
      title: 'Editar',
      fixed: 'right',
      width: 60,
      render: editColumnRender,
    }

    setColumns([
      checkInColumn,
      ...extraColumns,
      progressingColumn,
      timeTrackingStatsColumn,
      rolColumn,
      createdAtColumn,
      updatedAtColumn,
      editColumn,
    ])
  }

  const getAllAttendees = async () => {
    const orgId = event.organizer._id
    const org = await OrganizationApi.getOne(orgId)

    const eventActivities = await AgendaApi.byEvent(event._id)
    const preAllActivities = eventActivities.data
    setAllActivities(eventActivities.data)

    const newSimplifyOrgProperties = (org.user_properties || []).filter(
      (property: any) => !['email', 'password', 'names'].includes(property.name),
    )
    const newRolesList: any[] = await RolAttApi.byEventRolsGeneral()
    const newBadgeEvent = await BadgeApi.get(event._id)

    setSimplifyOrgProperties(newSimplifyOrgProperties)
    setRolesList(newRolesList)
    setBadgeEvent(newBadgeEvent)

    const unsubscribe = eventUsersRef.onSnapshot((observer) => {
      const allEventUserData: any[] = []

      const eventUserAndUserPairIds: { eu: string; u: string }[] = []

      // Save the progress as string to be request by the XLSX exporter
      let newProgressMap: { [key: string]: string } = {}

      observer.forEach((result) => {
        const data = result.data()

        // Fix the date
        if (data.checkedin_at) data.checkedin_at = dayjs(data.checkedin_at.toDate())
        if (data.created_at) data.created_at = dayjs(data.created_at.toDate())
        if (data.updated_at) data.updated_at = dayjs(data.updated_at.toDate())

        // Ant Design wont calc progresses of non-rendered component, then we have
        // to pre-calc this value in a way non-reactable
        type ActivityProgressesType = {
          activities?: any[]
          viewed_activities?: any[]
        }
        const { activities, viewed_activities }: ActivityProgressesType =
          data.activity_progresses ?? {}
        // Use % or n/N? ... use n/N for now
        data.postprocess_progress = `${(viewed_activities ?? []).length}/${Math.max(
          (activities ?? []).length,
          (preAllActivities ?? []).length,
        )}`
        allEventUserData.push({
          // the organization user properties here... (for now, nothing)
          ...data.properties,
          ...data,
        })

        // Add the progress
        if (!data.activity_progresses || !Array.isArray(viewed_activities)) {
          newProgressMap[data._id] = 'Sin progreso'
        } else {
          const itsActivities = filterActivitiesByProgressSettings(
            preAllActivities,
            event.progress_settings || {},
          )
          newProgressMap[data._id] = `${(viewed_activities ?? []).length}/${Math.max(
            (activities ?? []).length,
            (itsActivities ?? []).length,
          )}`
        }

        eventUserAndUserPairIds.push({ eu: data._id, u: data.account_id })
      })
      setProgressMap((previous: any) => ({ ...previous, ...newProgressMap }))

      Promise.all(
        eventUserAndUserPairIds.map(async ({ eu, u }) => {
          return {
            eu,
            u,
            ap: await FB.ActivityProgresses.get(event._id, u),
          }
        }),
      )
        .then((euup) => {
          return euup.filter(({ ap }) => typeof ap !== 'undefined')
        })
        .then((euup) => {
          let newProgressMap: { [key: string]: string } = {}
          euup.forEach((euu) => {
            if (!euu.ap) {
              newProgressMap[euu.eu] = 'Sin progreso'
              return
            }
            const itsActivities = filterActivitiesByProgressSettings(
              preAllActivities,
              event.progress_settings || {},
            )
            newProgressMap[euu.eu] = `${
              (euu.ap.viewed_activities ?? []).length
            }/${Math.max((euu.ap.activities ?? []).length, (itsActivities ?? []).length)}`
          })
          // Disable because we use the saved in DB. But, if you wanna redundancy, then able that
          // setProgressMap((previous: any) => ({ ...previous, ...newProgressMap }))
          console.log(newProgressMap)
        })

      setDataSource(allEventUserData)
    })

    return unsubscribe
  }

  const handleExportFile = async () => {
    // To take filtered data source when user use filters or sort the content
    const source =
      Array.isArray(filteredDataSource) && filteredDataSource.length > 0
        ? filteredDataSource
        : dataSource || []
    let attendees = [...source].sort((a, b) => b.created_at - a.created_at)

    console.info('attendees', attendees)

    const joint = [...extraFields, ...simplifyOrgProperties]

    // Inject the progress
    attendees = attendees.map((attendee) => {
      const finalValue = progressMap[attendee._id] ?? attendee.postprocess_progress
      return {
        ...attendee,
        properties: {
          ...attendee.properties,
          eventProgress: finalValue ?? 'Sin dato',
        },
      }
    })
    joint.push({
      name: 'eventProgress',
      label: 'Progreso de curso',
    })

    const data = await parseData2Excel(attendees, joint, rolesList)
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Asistentes')
    writeFileXLSX(wb, `asistentes_${event.name}.xls`)
  }

  const activityStats = useMemo(() => {
    const total = (dataSource || []).length
    const checkedInTotal = (dataSource || []).filter(
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
    if (!activityId) return

    AgendaApi.getOne(activityId, event._id)
      .then((data) => setActivity(data))
      .catch((err) => console.error(err))
  }, [activityId])

  useEffect(() => {
    setIsLoading(true)
    let unsubscribe: any
    getAllAttendees()
      .then((callback) => {
        unsubscribe = callback
        buildColumns()
      })
      .finally(() => setIsLoading(false))

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    buildColumns()
  }, [allActivities, progressMap])

  useEffect(() => {
    allActivities.forEach((activity) => {
      FB.Activities.ref(event._id, activity._id!).onSnapshot((snapshot) => {
        const data = snapshot.data()
        if (!data) return
        const flag = !!data.isPublished

        if (!flag) {
          setNonPublishedActivityIDs((previous) => [...previous, activity._id!])
        } else {
          setNonPublishedActivityIDs((previous) =>
            previous.filter((id) => id !== activity._id!),
          )
        }
      })
    })
  }, [allActivities])

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
            ? 'Inscripción a ' + activity.name
            : 'Inscripción al curso'
        }
        back
      />
      {isProgressLoading && <>...</>}
      <Table
        size="small"
        loading={isLoading || dataSource === undefined}
        dataSource={dataSource || []}
        scroll={{ x: 'max-content' }}
        columns={columns}
        onChange={(pagination, filters, sorter, extra) => {
          setFilteredDataSource(extra.currentDataSource)
        }}
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
              <Link to="../invitados/importar-excel" state={activityId}>
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
                onClick={() => setIsEnrollingModalOpened(true)}
                disabled={
                  !Boolean(
                    'legacy checked if the event is active (eventIsActive) via HelperContext',
                  )
                }
              >
                Agregar usuario
              </Button>
              {isEnrollingModalOpened && (
                <EnrollEventUserFromOrganizationMember
                  eventId={event._id}
                  orgId={event.organizer._id}
                  onClose={() => setIsEnrollingModalOpened(false)}
                />
              )}
            </Col>
          </Row>
        )}
      />

      {isRegistrationModalOpened && !!watchedUserInProgressingModal && (
        <UserModal
          handleModal={() => setIsRegistrationModalOpened(false)}
          modal={!!watchedUserInProgressingModal}
          ticket={null}
          tickets={[]}
          rolesList={rolesList}
          value={watchedUserInProgressingModal}
          checkIn={checkIn}
          badgeEvent={badgeEvent}
          extraFields={extraFields}
          spacesEvent={[]}
          edit={watchedUserInProgressingModal}
          substractSyncQuantity={(...args) => console.log(args)}
          activityId={activityId}
        />
      )}
    </>
  )
}

export default ListEventUserPage
