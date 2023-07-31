import { Component, useState, useEffect } from 'react'
import { FormattedDate, FormattedTime } from 'react-intl'
import { fireRealtime, firestore } from '@helpers/firebase'
import { BadgeApi, EventsApi, RolAttApi, UsersApi } from '@helpers/request'
import { AgendaApi, OrganizationApi } from '@helpers/request'
// import { checkinAttendeeInActivity } from '@helpers/HelperAuth'
import ModalPassword from './ModalPassword'

import UserModal from '../modal/modalUser'
import ErrorServe from '../modal/serverError'
import { utils, writeFileXLSX } from 'xlsx'
import {
  fieldNameEmailFirst,
  handleRequestError,
  parseData2Excel,
  sweetAlert,
} from '@helpers/utils'
import dayjs from 'dayjs'
import {
  Button,
  Card,
  Col,
  Drawer,
  Image,
  Row,
  Statistic,
  Typography,
  Tag,
  Input,
  Space,
  Tooltip,
  Select,
  Spin,
  message,
} from 'antd'

import updateAttendees from './eventUserRealTime'
import { Link, withRouter } from 'react-router-dom'
import {
  EditOutlined,
  FullscreenOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
  StarOutlined,
} from '@ant-design/icons'
import QrModal from './qrModal'

import Header from '@antdComponents/Header'
import TableA from '@antdComponents/Table'
import Highlighter from 'react-highlight-words'
import { StateMessage } from '@context/MessageService'
import Loading from '../profile/loading'
import AttendeeCheckInCheckbox from '../checkIn/AttendeeCheckInCheckbox'
import { HelperContext } from '@context/helperContext/helperContext'
import AttendeeCheckInButton from '../checkIn/AttendeeCheckInButton'
import { UsersPerEventOrActivity } from './utils/utils'
import LessonsInfoModal from './LessonsInfoModal'
import { FB } from '@helpers/firestore-request'
import EventProgressWrapper from '@/wrappers/EventProgressWrapper'
import EnrollEventUserFromOrganizationMember from './EnrollEventUserFromOrganizationMember'

const { Title } = Typography
const { Option } = Select

const TimeTrackingStats = ({ user }) => {
  const [timing, setTiming] = useState(0)

  useEffect(() => {
    const localRef = fireRealtime.ref(`user_sessions/local/${user._id}`)
    localRef.get().then((result) => {
      const logDict = result && result.exists() ? result.val() : {}

      if (!logDict) {
        setTiming(0)
        return
      }

      const filteredLogDict = Object.values(logDict)
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

/**
 * @deprecated use ListEventUserPage (ListEventUserPage.tsx) instead. This class will be removed
 */
class ListEventUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      columns: null,
      usersReq: [],
      pageOfItems: [],
      listTickets: [],
      usersRef: firestore.collection(`${props.event._id}_event_attendees`),
      total: 0,
      totalCheckedIn: 0,
      totalCheckedInWithWeight: 0,
      extraFields: [],
      simplifyOrgProperties: [],
      spacesEvents: [],
      addUser: false,
      editUser: false,
      deleteUser: false,
      loading: true,
      importUser: false,
      modalPoints: false,
      pages: null,
      message: { class: '', content: '' },
      sorted: [],
      rolesList: [],
      facingMode: 'user',
      qrData: {},
      clearSearch: false,
      changeItem: false,
      errorData: {},
      badgeEvent: {},
      serverError: false,
      stage: '',
      ticket: '',
      tabActive: 'camera',
      ticketsOptions: [],
      scanner: 'first',
      localChanges: null,
      quantityUsersSync: 0,
      lastUpdate: new Date(),
      disabledPersistence: false,
      percent_checked: 0,
      percent_unchecked: 0,
      totalPesoVoto: 0,
      configfast: {},
      isModalVisible: false,
      fieldsForm: [],
      typeScanner: 'CheckIn options',
      nameActivity: props.location.state?.item?.name || '',
      qrModalOpen: false,
      unSusCribeConFigFast: () => {},
      unSuscribeAttendees: () => {},
      progressMap: {},
    }
  }
  static contextType = HelperContext

  /* The above code is defining a function called `handleRecoveryPass` that takes an email as a
parameter. The function calls an API method `changePasswordUser` with the email and the current URL
as parameters. If the API call is successful, the function sets the state with a success message and
hides a confirmation modal. If the API call fails, the function sets the state with an error message
and displays an error message using the `message` component from the antd library. */
  handleRecoveryPass = async (email) => {
    try {
      let resp = await EventsApi.changePasswordUser(email, window.location.href)
      if (resp) {
        this.setState({
          recoveryMessage: `Se ha enviado correo nueva contraseña a: ${email}`,
          resul: 'OK',
          status: 'success',
          showConfirm: false,
        })
        message.success(
          `Se ha enviado el correo de recuperación de contraseña a: ${email}`,
        )
      }
    } catch (error) {
      this.setState({
        recoveryMessage:
          'Ocurrió un error al enviar el correo de recuperación de contraseña',
        resul: 'Error',
        status: 'error',
        showConfirm: false,
      })
      message.error('Ocurrió un error al enviar el correo de recuperación de contraseña')
    }
  }

  openModal = () => {
    // Lógica a ejecutar cuando se abre el modal
    this.setState({ showConfirm: true })
  }

  handleOk = () => {
    // Lógica a ejecutar cuando se confirme el modal
    this.setState({ showConfirm: false })
  }

  handleCancel = () => {
    // Lógica a ejecutar cuando se cancele el modal
    this.setState({ showConfirm: false })
  }

  // eslint-disable-next-line no-unused-vars
  editcomponent = (text, item, index, badColumns) => {
    const newItem = JSON.parse(JSON.stringify(item))
    const filteredProperties = Object.fromEntries(
      Object.entries(newItem.properties).filter(([key, value]) => {
        return !badColumns.includes(key)
      }),
    )
    newItem.properties = filteredProperties
    const { eventIsActive } = this.context
    return (
      <Space>
        <Tooltip placement="topLeft" title="Editar">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => this.openEditModalUser(newItem)}
            disabled={!eventIsActive && window.location.toString().includes('eventadmin')}
          />
        </Tooltip>
        <ModalPassword onOk={() => this.handleRecoveryPass(item.email)} />
      </Space>
    )
  }

  // eslint-disable-next-line no-unused-vars
  created_at_component = (text, item, index) => {
    if (item.created_at !== null) {
      const createdAt = item?.created_at || new Date()

      return (
        <>
          {createdAt ? <span>{dayjs(createdAt).format('D/MMM/YY h:mm:ss A ')}</span> : ''}
        </>
      )
    } else {
      return ''
    }
  }

  rol_component = (text, item, index) => {
    if (this.state.rolesList) {
      for (const role of this.state.rolesList) {
        if (item.rol_id == role._id) {
          item['rol_name'] = role.name
          return <span>{role.name}</span>
        }
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  updated_at_component = (text, item, index) => {
    if (item.updated_at !== null) {
      const updatedAt = item?.updated_at

      return (
        <>
          {updatedAt ? <span>{dayjs(updatedAt).format('D/MMM/YY h:mm:ss A ')}</span> : ''}
        </>
      )
    } else {
      return ''
    }
  }

  // eslint-disable-next-line no-unused-vars
  checkedincomponent = (text, item, index) => {
    const activityId = this.props.match.params.id

    return <AttendeeCheckInCheckbox attendee={item} activityId={activityId} />
  }

  physicalCheckInComponent = (text, item, index) => {
    const activityId = this.props.match.params.id
    return <AttendeeCheckInButton attendee={item} activityId={activityId} />
  }

  checkInTypeComponent = (text, item, index) => {
    return <>{item?.checkedin_type ? <b>{item?.checkedin_type}</b> : <b>Ninguno</b>}</>
  }

  addDefaultLabels = (extraFields) => {
    extraFields = extraFields.map((field) => {
      field['label'] = field['label'] ? field['label'] : field['name']
      return field
    })
    return extraFields
  }

  orderFieldsByWeight = (extraFields) => {
    extraFields = extraFields.sort((a, b) =>
      (a.order_weight && !b.order_weight) ||
      (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
        ? -1
        : 1,
    )
    return extraFields
  }
  /** Sorting to show users with checkIn first in descending order, and users who do not have checkIn as last  */
  sortUsersArray = async (users) => {
    const sortedResult = users.sort((itemA, itemB) => {
      let aParameter = ''
      let bParameter = ''

      try {
        aParameter = itemA?.checkedin_at?.toDate()
        bParameter = itemB?.checkedin_at?.toDate()
      } catch (error) {}

      if (!aParameter) return 1
      if (!bParameter) return -1
      if (dayjs(aParameter) === dayjs(bParameter)) return 0
      return dayjs(aParameter) > dayjs(bParameter) ? -1 : 1
    })

    return sortedResult
  }

  getAttendes = async () => {
    const self = this
    const activityId = this.props.match.params.id

    this.checkFirebasePersistence()
    try {
      const event = await EventsApi.getOne(this.props.event._id)
      const orgId = event.organizer._id
      const org = await OrganizationApi.getOne(orgId)

      const properties = event.user_properties
      const simplifyOrgProperties = (org.user_properties || []).filter(
        (property) => !['email', 'password', 'names'].includes(property.name),
      )
      const rolesList = await RolAttApi.byEventRolsGeneral()
      const badgeEvent = await BadgeApi.get(this.props.event._id)

      let extraFields = fieldNameEmailFirst(properties)

      extraFields = this.addDefaultLabels(extraFields)
      extraFields = this.orderFieldsByWeight(extraFields)
      const fieldsForm = Array.from(extraFields)
      // Agregar extrafields de rol y checkin
      const rolesOptions = rolesList.map((rol) => {
        return {
          label: rol.name,
          value: rol._id,
        }
      })
      fieldsForm.push({
        author: null,
        categories: [],
        label: 'Rol',
        mandatory: true,
        name: 'rol_id',
        organizer: null,
        tickets: [],
        type: 'list',
        fields_conditions: [],
        unique: false,
        options: rolesOptions,
        visibleByAdmin: false,
        visibleByContacts: 'public',
        _id: { $oid: '614260d226e7862220497eac1' },
      })

      fieldsForm.push({
        author: null,
        categories: [],
        label: 'El usuario asistió al curso.',
        mandatory: false,
        name: 'checked_in',
        organizer: null,
        tickets: [],
        type: 'boolean',
        fields_conditions: [],
        unique: false,
        visibleByAdmin: false,
        visibleByContacts: 'public',
        _id: { $oid: '614260d226e7862220497eac2' },
      })

      const columns = []
      const checkInColumn = {
        title: 'Fecha de ingreso',
        dataIndex: 'checkedin_at',
        key: 'checkedin_at',
        width: '120px',
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
        render: self.checkedincomponent,
      }

      const checkInType = {
        title: 'Tipo de checkIn',
        dataIndex: 'checkedin_type',
        key: 'checkedin_type',
        width: '120px',
        ellipsis: true,
        ...self.getColumnSearchProps('checkedin_type'),
        render: self.checkInTypeComponent,
      }

      const physicalCheckIn = {
        title: 'Registrar checkIn físico',
        dataIndex: 'physicalCheckIn',
        key: 'physicalCheckIn',
        width: '120px',
        ellipsis: true,
        render: self.physicalCheckInComponent,
      }

      const editColumn = {
        title: 'Editar',
        key: 'edit',
        fixed: 'right',
        width: 60,
        render: (...args) =>
          self.editcomponent(
            ...args,
            simplifyOrgProperties.map((item) => item.name),
          ),
      }
      /* columns.push(editColumn); */
      /** Additional columns for hybrid events */
      if (self.props.event?.type_event === 'hybridEvent')
        columns.push(checkInType, physicalCheckIn)

      columns.push(checkInColumn)

      const extraColumns = extraFields
        .filter((item) => {
          return item.type !== 'tituloseccion' && item.type !== 'password'
        })
        .map((item) => {
          return {
            title: item.label,
            dataIndex: item.name,
            key: item.name,
            ellipsis: true,
            sorter: (a, b) => a[item.name]?.length - b[item.name]?.length,
            ...self.getColumnSearchProps(item.name),
            render: (record, key) => {
              switch (item.type) {
                /** When using the ant datePicker it saves the date with the time, therefore, since only the date is needed, the following split is performed */
                case 'date':
                  const date = key[item.name]
                  const dateSplit =
                    date && typeof date.split === 'function' ? date?.split('T') : ''
                  return dateSplit[0]

                case 'file':
                  return (
                    <a target="__blank" download={item?.name} href={key[item?.name]}>
                      {this.obtenerName(key[item?.name])}
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
      columns.push(...extraColumns)

      // Inject the organization member properties here
      const orgExtraColumns = simplifyOrgProperties.map((property) => {
        return {
          title: property.label,
          dataIndex: property.name,
          key: property.name,
          ellipsis: true,
          sorter: (a, b) => a[property.name]?.length - b[property.name]?.length,
          ...self.getColumnSearchProps(property.name),
          render: (record, item) => {
            const value = item.properties[property.name]
            if (property.type === 'boolean') {
              return typeof value === 'undefined' ? 'N/A' : value ? 'Sí' : 'No'
            }
            // TODO: we need check other type, and parse
            return (item.properties || [])[property.name]
          },
        }
      })
      columns.push(...orgExtraColumns)
      this.setState({ simplifyOrgProperties })

      const { data: allActivities } = await AgendaApi.byEvent(this.props.event._id)
      this.setState({ allActivities })
      const progressing = {
        title: 'Progreso',
        dataIndex: 'progress_id',
        key: 'progress_id',
        ellipsis: true,
        sorter: (a, b) => true,
        render: (text, item, index) => (
          <>
            <EventProgressWrapper
              event={this.props.event}
              eventUser={item}
              render={({ isLoading, activities, checkedInActivities }) => (
                <>
                  {this.setState({
                    ...this.state,
                    progressMap: {
                      ...this.state.progressMap,
                      [item._id]: `${
                        checkedInActivities.filter((attendee) => attendee.checked_in)
                          .length
                      }/${activities.length}`,
                    },
                  })}
                  {isLoading && <Spin />}
                  {this.props.shownAll ? (
                    <Button
                      onClick={() => {
                        this.setState({
                          attendee: checkedInActivities,
                          currentUser: item,
                          showModalOfProgress: true,
                        })
                      }}
                    >{`${checkedInActivities.length}/${activities.length}`}</Button>
                  ) : (
                    <>{checkedInActivities.length > 0 ? 'Visto' : 'No visto'}</>
                  )}
                </>
              )}
            />
          </>
        ),
      }

      const timeTrackingStatsColumn = {
        title: 'Tiempo registrado',
        key: 'time-tracking-stats',
        dataIndex: 'user',
        ellipsis: true,
        render: (user) => <TimeTrackingStats user={user} />,
      }

      const rol = {
        title: 'Rol',
        dataIndex: 'rol_id',
        key: 'rol_id',
        ellipsis: true,
        sorter: (a, b) => a.rol_id.length - b.rol_id.length,
        ...self.getColumnSearchProps('rol_name'),
        render: self.rol_component,
      }

      const created_at = {
        title: 'Creado',
        dataIndex: 'created_at',
        key: 'created_at',
        width: '140px',
        ellipsis: true,
        sorter: (a, b) => a.created_at - b.created_at,
        ...self.getColumnSearchProps('created_at'),
        render: self.created_at_component,
      }
      const updated_at = {
        title: 'Actualizado',
        dataIndex: 'updated_at',
        key: 'updated_at',
        width: '140px',
        ellipsis: true,
        sorter: (a, b) => a.updated_at - b.updated_at,
        ...self.getColumnSearchProps('updated_at'),
        render: self.updated_at_component,
      }
      columns.push(progressing)
      columns.push(timeTrackingStatsColumn)
      columns.push(rol)
      columns.push(created_at)
      columns.push(updated_at)
      columns.push(editColumn)

      this.setState({ columns: columns })

      this.setState({ extraFields, rolesList, badgeEvent, fieldsForm })
      const { usersRef } = this.state

      const unSusCribeConFigFast = firestore
        .collection(`event_config`)
        .doc(event._id)
        .onSnapshot((doc) => {
          this.setState({ ...this.state, configfast: doc.data() })
        })

      const unSuscribeAttendees = usersRef.orderBy('updated_at', 'desc').onSnapshot(
        {
          // Listen for document metadata changes
          //includeMetadataChanges: true
        },
        async (snapshot) => {
          const currentAttendees = [...this.state.usersReq]
          // This block requests event user data from MongoDB because they have
          // the activity_progresses, Firestore does not. Also, Firestore usage
          // is going to be deprecated soon
          const updatedAttendees = await Promise.all(
            updateAttendees(currentAttendees, snapshot).map(async (attendee) => {
              const moreFkData = await UsersApi.getOne(this.props.event._id, attendee._id)
              return {
                ...moreFkData,
                ...attendee,
              }
            }),
          )
          console.log('updatedAttendees', updatedAttendees)

          const totalCheckedIn = updatedAttendees.reduce(
            (acc, item) => acc + (item.checkedin_at ? 1 : 0),
            0,
          )

          const totalCheckedInWithWeight =
            Math.round(
              updatedAttendees.reduce(
                (acc, item) =>
                  acc +
                  (item.checkedin_at ? parseFloat(item.pesovoto ? item.pesovoto : 1) : 0),
                0,
              ) * 100,
            ) / 100
          //total de pesos
          const totalWithWeight =
            Math.round(
              updatedAttendees.reduce(
                (acc, item) => acc + parseFloat(item.pesovoto ? item.pesovoto : 1),
                0,
              ) * 100,
            ) / 100
          this.setState({
            totalCheckedIn: totalCheckedIn,
            totalCheckedInWithWeight: totalCheckedInWithWeight,
            totalWithWeight,
          })

          for (let i = 0; i < updatedAttendees.length; i++) {
            // Arreglo temporal para que se muestre el listado de usuarios sin romperse
            // algunos campos no son string y no se manejan bien
            extraFields.forEach(function (key) {
              if (
                !(
                  (updatedAttendees[i][key.name] &&
                    updatedAttendees[i][key.name].getMonth) ||
                  typeof updatedAttendees[i][key.name] == 'string' ||
                  typeof updatedAttendees[i][key.name] == 'boolean' ||
                  typeof updatedAttendees[i][key.name] == 'number' ||
                  Number(updatedAttendees[i][key.name]) ||
                  updatedAttendees[i][key.name] === null ||
                  updatedAttendees[i][key.name] === undefined
                )
              ) {
                {
                  console.log(
                    'entro',
                    updatedAttendees[i].user ? updatedAttendees[i].user[key.name] : '',
                  )
                }
                updatedAttendees[i]['properties'][key.name] =
                  updatedAttendees[i].user[key.name] ||
                  JSON.stringify(updatedAttendees[i][key.name])
              }
              if (extraFields) {
                const codearea = extraFields?.filter((field) => field.type == 'codearea')
                if (
                  codearea[0] &&
                  updatedAttendees[i] &&
                  Object.keys(updatedAttendees[i]).includes(codearea[0].name) &&
                  key.name == codearea[0].name
                ) {
                  updatedAttendees[i][codearea[0].name] = updatedAttendees[i]['code']
                    ? '(' +
                      updatedAttendees[i]['code'] +
                      ')' +
                      updatedAttendees[i].properties[codearea[0].name]
                    : updatedAttendees[i].properties[codearea[0].name]
                } else {
                  if (updatedAttendees[i][key.name]) {
                    updatedAttendees[i][key.name] = Array.isArray(
                      updatedAttendees[i]['properties'][key.name],
                    )
                      ? updatedAttendees[i]['properties'][key.name][0]
                      : updatedAttendees[i]['properties'][key.name]
                    updatedAttendees[i][
                      'textodeautorizacionparaimplementarenelmeetupfenalcoycolsubsidio'
                    ] = ''
                  }
                }
              }
            })

            if (updatedAttendees[i].payment) {
              updatedAttendees[i].payment =
                'Status: ' +
                updatedAttendees[i].payment.status +
                ' Fecha de transaccion: ' +
                updatedAttendees[i].payment.date +
                ' Referencia PayU: ' +
                updatedAttendees[i].payment.payuReference +
                ' Transaccion #: ' +
                updatedAttendees[i].payment.transactionID
            } else {
              updatedAttendees[i].payment = 'No se ha registrado el pago'
            }
          }

          const attendees = await UsersPerEventOrActivity(updatedAttendees, activityId)

          // The attribute `activityProperties` looks like unused, so I get the
          // attendee from Firebase... That's awful, but this is the effect non-thinking
          if (activityId) {
            const docs = await FB.Attendees.docs(activityId)

            const userDataList = []
            docs.forEach((doc) => userDataList.push(doc.data()))

            const userDataIds = userDataList.map((user) => user.account_id)

            while (attendees.length > 0) {
              attendees.pop()
            }
            attendees.push(
              ...updatedAttendees.filter((user) => userDataIds.includes(user.account_id)),
            )
          }

          // Inject here the org member data
          const extendedAttendees = []
          {
            // TODO: This can crashs, but I am so busy to fix
            if (!orgId) {
              console.warn('cannot get organization ID from event data')
            }
            const { data: orgUsers } = await OrganizationApi.getUsers(orgId)
            console.log('orgUsers', orgUsers)

            extendedAttendees.push(
              ...attendees.map((eventUser) => {
                // Find this event user in the organization member list
                const orgMember = orgUsers.find(
                  (member) => member.account_id === eventUser.account_id,
                )
                if (!orgMember) {
                  console.warn(
                    'event user',
                    eventUser,
                    'not found as organization member',
                  )
                  return eventUser
                }

                return {
                  ...eventUser, // Normal data
                  properties: {
                    ...orgMember.properties, // organization member properties,
                    ...eventUser.properties, // Overwritten event user properties
                  },
                }
              }),
            )
          }

          console.info('extendedAttendees', extendedAttendees)

          this.setState({
            unSusCribeConFigFast,
            unSuscribeAttendees,
            users: extendedAttendees, // attendees,
            usersReq: updatedAttendees,
            auxArr: attendees,
            loading: false,
          })
        },
        () => {},
      )
    } catch (error) {
      const errorData = handleRequestError(error)
      this.setState({ timeout: true, errorData })
    }
  }

  async componentDidMount() {
    this.getAttendes()
  }

  async componentWillUnmount() {
    this.state.unSusCribeConFigFast()
    this.state.unSuscribeAttendees()
  }

  obtenerName = (fileUrl) => {
    if (typeof fileUrl == 'string') {
      const splitUrl = fileUrl.split('/')
      return splitUrl[splitUrl.length - 1]
    } else {
      return null
    }
  }

  exportFile = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    let attendees = [...this.state.users].sort((a, b) => b.created_at - a.created_at)

    console.info('attendees', attendees)

    const joint = [...this.state.extraFields, ...this.state.simplifyOrgProperties]

    // Inject the progress
    attendees = attendees.map((attendee) => {
      return {
        ...attendee,
        properties: {
          ...attendee.properties,
          eventProgress: this.state.progressMap[attendee._id] ?? 'Sin dato',
        },
      }
    })
    joint.push({
      name: 'eventProgress',
      label: 'Progreso de curso',
    })

    const data = await parseData2Excel(attendees, joint, this.state.rolesList)
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Asistentes')
    writeFileXLSX(wb, `asistentes_${this.props.event.name}.xls`)
  }

  addUser = () => {
    this.setState({ edit: false }, () => {
      this.setState((prevState) => {
        return { editUser: !prevState.editUser, selectedUser: null }
      })
    })
  }

  modalUser = () => {
    this.setState((prevState) => {
      return { editUser: !prevState.editUser, edit: undefined }
    })
  }

  checkModal = () => {
    // this.setState((prevState) => {
    //   return { qrModal: !prevState.qrModal };
    // });
    this.setState((prevState) => {
      return { qrModalOpen: !prevState.qrModalOpen }
    })
  }
  closeQRModal = () => {
    this.setState((prevState) => {
      return { qrModalOpen: !prevState.qrModalOpen }
    })
  }

  checkIn = async (id, item) => {
    let checkInStatus = null
    const { qrData } = this.state
    const { event } = this.props
    qrData.another = true

    const eventIdSearch = this.props.match.params.id
      ? this.props.match.params.id
      : this.props.event._id

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
        if (this.props.intl) {
          StateMessage.show(
            null,
            'error',
            this.props.intl.formatMessage({
              id: 'toast.error',
              defaultMessage: 'Sry :(',
            }),
          )
        } else {
          StateMessage.show(null, 'error', 'Algo salió mal. Intentalo de nuevo')
        }
        checkInStatus = false
      })
    return checkInStatus
  }

  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems })
  }

  // Funcion para disminuir el contador y pasarlo como prop al modalUser
  substractSyncQuantity = () => {
    this.setState((prevState) => ({ quantityUsersSync: prevState.quantityUsersSync - 1 }))
    this.setState({ lastUpdate: new Date() })
  }

  showMetaData = (value) => {
    let content = ''
    Object.keys(value).map((key) => (content += `<p><b>${key}:</b> ${value[key]}</p>`))
    sweetAlert.simple('Información', content, 'Cerrar', '#1CDCB7', () => {})
  }

  // Function to check the firebase persistence and load page if this return false
  checkFirebasePersistence = () => {
    let { disabledPersistence } = this.state

    disabledPersistence = window.eviusFailedPersistenceEnabling
    this.setState({ disabledPersistence })
  }

  openEditModalUser = (item) => {
    item = {
      ...item,
      checked_in: item.checked_in,
      checkedin_at: item.checkedin_at,
    }
    this.setState({ editUser: true, selectedUser: item, edit: true })
  }

  changeStage = (e) => {
    const { value } = e.target
    const {
      event: { tickets },
    } = this.props
    if (value === '') {
      let check = 0,
        acompanates = 0
      this.setState({ checkIn: 0, total: 0 }, () => {
        const list = this.state.usersReq
        list.forEach((user) => {
          if (user.checked_in) check += 1
          if (user.properties.acompanates && /^\d+$/.test(user.properties.acompanates))
            acompanates += parseInt(user.properties.acompanates, 10)
        })
        this.setState((state) => {
          return {
            users: state.auxArr.slice(0, 50),
            ticket: '',
            stage: value,
            total: list.length + acompanates,
            checkIn: check,
          }
        })
      })
    } else {
      const options = tickets.filter((ticket) => ticket.stage_id === value)
      this.setState({ stage: value, ticketsOptions: options })
    }
  }

  changeTicket = (e) => {
    const { value } = e.target
    let check = 0,
      acompanates = 0
    this.setState({ checkIn: 0, total: 0 }, () => {
      const list =
        value === ''
          ? this.state.usersReq
          : [...this.state.usersReq].filter((user) => user.ticket_id === value)
      list.forEach((user) => {
        if (user.checked_in) check += 1
        if (user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/))
          acompanates += parseInt(user.properties.acompanates, 10)
      })
      const users = value === '' ? [...this.state.auxArr].slice(0, 50) : list

      this.setState({
        users,
        ticket: value,
        checkIn: check,
        total: list.length + acompanates,
      })
    })
  }

  //Search records at third column
  searchResult = (data) => {
    !data ? this.setState({ users: [] }) : this.setState({ users: data })
  }

  handleChange = (e) => {
    this.setState({ typeScanner: e })
    this.checkModal()
  }

  // Set options in dropdown list
  clearOption = () => {
    this.setState({ typeScanner: 'options' })
  }

  showModal = () => {
    this.setState({ isModalVisible: true })
  }
  hideModal = () => {
    this.setState({ isModalVisible: false })
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100)
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }

  handleReset = (clearFilters) => {
    clearFilters()
    this.setState({ searchText: '' })
  }
  printUser = () => {
    const resp = this.props.badgeEvent
    if (resp._id) {
      const badges = resp.BadgeFields
      console.log(this.ifrmPrint, badges)
      if (this.props.value && !this.props.value.checked_in && this.props.edit)
        this.props.checkIn(this.state.userId)
      const printBagdeUser = (...args) => {
        console.warn('printBagdeUser function was copied here but not its definition. F')
      }
      printBagdeUser(this.ifrmPrint, badges, this.state.user)
    } else this.setState({ noBadge: true })
  }

  render() {
    const {
      timeout,
      usersReq,
      users,
      totalCheckedIn,
      totalCheckedInWithWeight,
      extraFields,
      spacesEvent,
      editUser,
      stage,
      ticket,
      ticketsOptions,
      localChanges,
      quantityUsersSync,
      lastUpdate,
      disabledPersistence,
      nameActivity,
      columns,
      fieldsForm,
    } = this.state

    const activityId = this.props.match.params.id

    const { type, loading, componentKey } = this.props
    const { eventIsActive } = this.context

    const inscritos =
      this.state.configfast && this.state.configfast.totalAttendees
        ? this.state.configfast.totalAttendees
        : usersReq.length

    const participantes =
      inscritos != 0 ? Math.round((totalCheckedIn / inscritos) * 100) : 0
    const asistenciaCoeficientes = Math.round((totalCheckedInWithWeight / 100) * 100)

    return (
      <>
        <LessonsInfoModal
          show={this.state.showModalOfProgress}
          onHidden={() => {
            this.setState({ showModalOfProgress: false })
          }}
          allActivities={this.state.allActivities || []}
          user={this.state.currentUser}
          event={this.props.event}
        />
        <Header
          title={
            type == 'activity' ? 'Inscripción a ' + nameActivity : 'Inscripción al curso'
          }
          back
          titleToMergingOrAdaptIt={
            componentKey === 'activity-checkin'
              ? 'Check-in actividad: ' + nameActivity
              : `Check-in evento: ${this.props.event?.name}`
          }
        />

        {disabledPersistence && (
          <div style={{ margin: '5%', textAlign: 'center' }}>
            <label>
              El almacenamiento local de lso datos esta deshabilitado. Cierre otras
              pestañanas de la plataforma para pode habilitar el almacenamiento local
            </label>
          </div>
        )}

        {
          // localChanges &&
          quantityUsersSync > 0 && localChanges === 'Local' && (
            <Row gutter={8}>
              <Col>
                <p>
                  <small>
                    Cambios sin sincronizar :{' '}
                    {quantityUsersSync < 0 ? 0 : quantityUsersSync}
                  </small>
                </p>
              </Col>
            </Row>
          )
        }

        {this.state.qrModalOpen && (
          <QrModal
            fields={fieldsForm}
            typeScanner={this.state.typeScanner}
            clearOption={this.clearOption}
            closeModal={this.closeQRModal}
            openModal={this.state.qrModalOpen}
            badgeEvent={this.state.badgeEvent}
            activityId={activityId}
          />
        )}

        <TableA
          list={users.length > 0 && users}
          header={columns}
          takeOriginalHeader
          scroll={{ x: 'max-content' }} //auto funciona de la misma forma, para ajustar el contenido
          loading={this.state.loading}
          footer={
            <div
              style={{
                background: '#D3D3D3',
                paddingRight: '20px',
                textAlign: 'end',
                borderRadius: '3px',
              }}
            >
              <strong> Última Sincronización: </strong>{' '}
              <FormattedDate value={lastUpdate} /> <FormattedTime value={lastUpdate} />
            </div>
          }
          titleTable={
            <Row gutter={[6, 6]}>
              {!activityId && (
                <React.Fragment>
                  <Col>
                    <Tag
                      style={{ color: 'black', fontSize: '13px', borderRadius: '4px' }}
                      color="lightgrey"
                      icon={<UsergroupAddOutlined />}
                    >
                      <strong>Inscritos: </strong>
                      <span style={{ fontSize: '13px' }}>{inscritos}</span>
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
                        {totalCheckedIn + '/' + inscritos + ' (' + participantes + '%)'}{' '}
                      </span>
                    </Tag>
                  </Col>
                </React.Fragment>
              )}

              <Col>
                {extraFields.reduce(
                  (acc, item) => acc || item.name === 'pesovoto',
                  false,
                ) && (
                  <>
                    <Tag>
                      <small>
                        Asistencia por Coeficientes:
                        {totalCheckedInWithWeight +
                          '/100' +
                          ' (' +
                          asistenciaCoeficientes +
                          '%)'}
                      </small>
                    </Tag>
                  </>
                )}
              </Col>

              {!activityId && (
                <Col>
                  <Button
                    type="ghost"
                    icon={<FullscreenOutlined />}
                    onClick={this.showModal}
                  >
                    Expandir
                  </Button>
                </Col>
              )}

              <Col>
                <Select
                  name="type-scanner"
                  value={this.state.typeScanner}
                  defaultValue={this.state.typeScanner}
                  onChange={(e) => this.handleChange(e)}
                  style={{ width: 220 }}
                >
                  <Option value="scanner-qr">Escanear QR</Option>
                  {fieldsForm.map((item, index) => {
                    if (item.type === 'checkInField')
                      return (
                        <Option key={index} value="scanner-document">
                          Escanear {item.label}
                        </Option>
                      )
                  })}
                </Select>
              </Col>
              <Col>
                {usersReq.length > 0 && (
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={this.exportFile}
                  >
                    Exportar
                  </Button>
                )}
              </Col>
              <Col>
                <Link
                  to={{
                    pathname:
                      !eventIsActive && window.location.toString().includes('eventadmin')
                        ? ''
                        : `/eventadmin/${this.props.event._id}/invitados/importar-excel`,
                    state: { activityId },
                  }}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    disabled={
                      !eventIsActive && window.location.toString().includes('eventadmin')
                    }
                  >
                    Importar usuarios
                  </Button>
                </Link>
              </Col>
              <Col>
                {/* <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="middle"
                  onClick={this.addUser}
                  disabled={
                    !eventIsActive && window.location.toString().includes('eventadmin')
                  }
                >
                  Agregar usuario
                </Button> */}
                <Button
                  icon={<PlusCircleOutlined />}
                  type="primary"
                  size="middle"
                  onClick={() => this.setState({ btn: true })}
                  disabled={
                    !eventIsActive && window.location.toString().includes('eventadmin')
                  }
                >
                  Agregar usuario
                </Button>
                {this.state.btn && (
                  <EnrollEventUserFromOrganizationMember
                    eventId={this.props.event._id}
                    orgId={this.props.event.organizer._id}
                    onClose={() => this.setState({ btn: false })}
                  />
                )}
              </Col>
            </Row>
          }
        />

        {!loading && editUser && (
          <UserModal
            handleModal={this.modalUser}
            modal={editUser}
            ticket={ticket}
            tickets={this.state.listTickets}
            rolesList={this.state.rolesList}
            value={this.state.selectedUser}
            checkIn={this.checkIn}
            badgeEvent={this.state.badgeEvent}
            extraFields={fieldsForm}
            spacesEvent={spacesEvent}
            edit={this.state.edit}
            substractSyncQuantity={this.substractSyncQuantity}
            componentKey={componentKey}
            activityId={activityId}
          />
        )}

        {timeout && <ErrorServe errorData={this.state.errorData} />}

        <Drawer
          title={
            <>
              <Title level={3}>Estadísticas</Title>
              {this.props.event.name ? (
                <Title level={5}>{this.props.event.name}</Title>
              ) : (
                ''
              )}
            </>
          }
          open={this.state.isModalVisible}
          closable={false}
          footer={[
            <Button
              style={{ float: 'right' }}
              type="primary"
              size="large"
              onClick={this.hideModal}
              key="close"
            >
              Cerrar
            </Button>,
            <div key="fecha" style={{ float: 'left' }}>
              <Title level={5}>
                Última Sincronización : <FormattedDate value={lastUpdate} />{' '}
                <FormattedTime value={lastUpdate} />
              </Title>
            </div>,
          ]}
          style={{ top: 0, textAlign: 'center' }}
          width="100vw"
        >
          <Row align="middle" justify="center" style={{ width: '80vw' }}>
            <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
              <Row align="middle">
                <Card
                  bodyStyle={{ paddingLeft: '0px', paddingRight: '0px' }}
                  cover={
                    this.props.event.styles.event_image ? (
                      <img
                        style={{ objectFit: 'cover', width: '96vw' }}
                        src={this.props.event.styles.event_image}
                        alt="Logo curso"
                      />
                    ) : (
                      ''
                    )
                  }
                ></Card>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={20} xl={20} xxl={20}>
              <Row align="middle">
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Card bodyStyle={{}} style={{}} bordered={false}>
                    <Statistic
                      valueStyle={{ fontSize: '80px', textAlign: 'center' }}
                      title={
                        <Title
                          level={2}
                          style={{ textAlign: 'center', color: '#b5b5b5' }}
                        >
                          Inscritos
                        </Title>
                      }
                      value={inscritos || 0}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Card bodyStyle={{}} style={{}} bordered={false}>
                    <Statistic
                      valueStyle={{ fontSize: '80px', textAlign: 'center' }}
                      title={
                        <Title
                          level={2}
                          style={{ textAlign: 'center', color: '#b5b5b5' }}
                        >
                          Participantes
                        </Title>
                      }
                      value={
                        totalCheckedIn + '/' + inscritos + ' (' + participantes + '%)'
                      }
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Card bodyStyle={{}} style={{}} bordered={false}>
                    <Statistic
                      valueStyle={{ fontSize: '80px', textAlign: 'center' }}
                      title={
                        <Title
                          level={2}
                          style={{ textAlign: 'center', color: '#b5b5b5' }}
                        >
                          Asistencia por Coeficientes
                        </Title>
                      }
                      value={
                        totalCheckedInWithWeight +
                        '/' +
                        this.state.totalWithWeight +
                        ' (' +
                        Math.round(
                          (totalCheckedInWithWeight / this.state.totalWithWeight) * 100,
                        ) +
                        '%)'
                      }
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Drawer>
      </>
    )
  }
}

/**
 * @deprecated use ListEventUserPage (ListEventUserPage.tsx) instead. This class will be removed
 */
export default withRouter(ListEventUser)
