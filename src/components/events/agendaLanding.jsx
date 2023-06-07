import { Component } from 'react'
import Moment from 'moment-timezone'
import { connect } from 'react-redux'
import withContext from '@context/withContext'
import {
  AgendaApi,
  SpacesApi,
  Activity,
  SurveysApi,
  DocumentsApi,
  AttendeeApi,
  discountCodesApi,
} from '@helpers/request'
import {
  Modal,
  Button,
  Card,
  Spin,
  notification,
  Input,
  Alert,
  Divider,
  Space,
  Badge,
  Row,
} from 'antd'

import AgendaActivityItem from './AgendaActivityItem/index'
import { CalendarOutlined } from '@ant-design/icons'
import * as notificationsActions from '../../redux/notifications/actions'
import { setTabs } from '../../redux/stage/actions'
import ActivitiesList from '../agenda/components/ActivitiesList'
import { FB } from '@helpers/firestore-request'

const attendee_states = {
  STATE_DRAFT: '5b0efc411d18160bce9bc706', //"DRAFT";
  STATE_INVITED: '5ba8d213aac5b12a5a8ce749', //"INVITED";
  STATE_RESERVED: '5ba8d200aac5b12a5a8ce748', //"RESERVED";
  ROL_ATTENDEE: '5d7ac3f56b364a4042de9b08', //"rol id";
  STATE_BOOKED: '5b859ed02039276ce2b996f0', //"BOOKED";
}

const { setNotification } = notificationsActions

class AgendaLanding extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],

      listDay: [],
      days: [],
      day: '',
      space: '',
      spaces: [],
      nameSpace: '',
      filtered: [],
      toShow: [],
      userAgenda: [],
      data: [],
      value: '',
      currentActivity: null,
      survey: [],
      visible: false,

      //Modal en caso que el usuario no este registrado
      visibleModal: false,

      visibleModalRestricted: false,
      visibleModalExchangeCode: false,
      visibleModalRegisteredDevices: false,
      discountCode: '',
      exchangeCodeMessage: null,

      redirect: false,
      disabled: false,
      loading: false,
      documents: [],
      show_inscription: false,
      status: 'in_progress',
      hideBtnDetailAgenda: true,
      userId: null,
    }

    this.returnList = this.returnList.bind(this)
    this.selectionSpace = this.selectionSpace.bind(this)
    this.survey = this.survey.bind(this)
    this.gotoActivity = this.gotoActivity.bind(this)
    this.gotoActivityList = this.gotoActivityList.bind(this)
  }

  async componentDidMount() {
    this.props.setVirtualConference(false)
    this.setState({ loading: true })
    await this.fetchAgenda()

    //Si hay currentUser pasado por props entonces inicializamos el estado userId
    if (this.props.currentUser) {
      const { currentUser } = this.props
      this.setState({ userId: currentUser._id })
    }

    this.setState({ loading: false })

    this.setState({
      show_inscription:
        this.props.cEvent.value.styles && this.props.cEvent.value.styles.show_inscription
          ? this.props.cEvent.value.styles.show_inscription
          : false,
      hideBtnDetailAgenda:
        this.props.cEvent.value.styles &&
        this.props.cEvent.value.styles.hideBtnDetailAgenda
          ? this.props.cEvent.value.styles.hideBtnDetailAgenda
          : true,
    })

    const surveysData = await SurveysApi.getAll(this.props.cEvent.value._id)
    const documentsData = await DocumentsApi.getAll(this.props.cEvent.value._id)

    if (surveysData.data.length >= 1) {
      this.setState({ survey: surveysData.data })
    }

    if (documentsData.data.length >= 1) {
      this.setState({ documents: documentsData.data })
    }

    this.getAgendaUser()
  }

  componentWillUnmount() {
    this.props.setVirtualConference(true)
  }
  /** extraemos los días en los que pasan lecciones */
  setDaysWithAllActivities = (data) => {
    const dayswithactivities = []
    data.map((activity) => {
      const datestring = Moment.tz(
        activity.datetime_start,
        'YYYY-MM-DD HH:mm',
        'America/Bogota',
      )
        .tz(Moment.tz.guess())
        .format('YYYY-MM-DD')

      //Revisamos que no hayamos extraido el día de otra lección previa
      const result = dayswithactivities.filter((item) => item === datestring)
      if (result.length === 0) {
        if (data.isPublished || data.isPublished == undefined) {
          dayswithactivities.push(datestring)
        }
      }
    })
    this.setState({ days: dayswithactivities })
  }

  componentDidUpdate(prevProps) {
    const { data } = this.state
    //Cargamos solamente los espacios virtuales de la agenda

    //Si aún no ha cargado el curso no podemos hacer nada más
    if (!this.props.cEvent.value) return

    //Revisamos si el curso sigue siendo el mismo, no toca cargar nada
    if (prevProps.event && this.props.cEvent.value._id === prevProps.event._id) return

    //Después de traer la info se filtra por el primer día por defecto y se mandan los espacios al estado
    const filtered = this.filterByDay(this.state.days[0], this.state.list)
    // this.setState({ data, filtered, toShow: filtered });
  }

  async listeningStateMeetingRoom(list) {
    list.forEach((activity, index, arr) => {
      FB.Activities.ref(this.props.cEvent.value._id, activity._id).onSnapshot(
        (infoActivity) => {
          if (!infoActivity.exists) return
          const data = infoActivity.data()
          const { habilitar_ingreso, isPublished, meeting_id, platform } = data
          const updatedActivityInfo = {
            ...arr[index],
            habilitar_ingreso,
            isPublished,
            meeting_id,
            platform,
          }
          arr[index] = updatedActivityInfo
          const filtered = this.filterByDay(this.state.days[0], arr)
          this.setState({ list: arr, filtered, toShow: filtered })
        },
      )
    })
  }

  async filterStateMeetingRoom(list) {
    const lista = await Promise.all(
      list.map(async (activity) => {
        const data = await FB.Activities.get(this.props.cEvent.value._id, activity._id)
        const habilitar_ingreso = data?.habilitar_ingreso
        const isPublished = data?.isPublished
        const meeting_id = data?.meeting_id
        const platform = data?.platform

        const updatedActivityInfo = {
          ...activity,
          habilitar_ingreso,
          isPublished,
          meeting_id,
          platform,
        }
        return updatedActivityInfo
      }),
    )

    return lista.filter((lf) => lf.isPublished || lf.isPublished == undefined)
  }

  exchangeCode = async () => {
    const code = this.state.discountCode
    const codeTemplateId = '5fc93d5eccba7b16a74bd538'

    try {
      await discountCodesApi.exchangeCode(codeTemplateId, {
        code: code,
        event_id: this.props.cEvent.value._id,
      })
      const eventUser = this.props.this.props.cUser
      const eventId = this.props.cEvent.value._id
      const data = { state_id: attendee_states.STATE_BOOKED }
      AttendeeApi.update(eventId, data, eventUser._id)

      this.setState({
        exchangeCodeMessage: {
          type: 'success',
          message: 'Código canjeado, habilitando el acceso...',
        },
      })
      setTimeout(() => window.location.reload(), 500)
    } catch (e) {
      const { status } = e.response
      let msg = 'Tuvimos un problema canjenado el código intenta nuevamente'
      if (status == '404') {
        msg = 'Código no encontrado'
      } else {
        msg = 'Código ya fue usado'
      }
      this.setState({
        exchangeCodeMessage: {
          type: 'error',
          message: msg,
        },
      })
    }
  }

  fetchAgenda = async () => {
    // Se consulta a la api de agenda

    const { data } = await AgendaApi.byEvent(this.props.cEvent.value._id)
    //se consulta la api de espacios para
    const space = await SpacesApi.byEvent(this.props.cEvent.value._id)
    // Filtro

    const listFiltered = await this.filterStateMeetingRoom(data)
    //Después de traer la info se filtra por el primer día por defecto y se mandan los espacios al estado
    await this.listeningStateMeetingRoom(data)

    this.setState({ data, spaces: space }, () =>
      this.setDaysWithAllActivities(listFiltered),
    )
  }

  returnList() {
    //con la lista previamente cargada en el estado se retorna a la constante to Show para mostrar la lista completa
    this.setState({ toShow: this.state.listDay, nameSpace: 'inicio' })
  }

  filterByDay = (day, agenda) => {
    //Se trae el filtro de dia para poder filtar por fecha y mostrar los datos
    const list = agenda
      .filter(
        (a) =>
          day &&
          day.format &&
          a.datetime_start &&
          a.datetime_start.includes(day.format('YYYY-MM-DD')),
      )
      .sort(
        (a, b) =>
          Moment(a.datetime_start, 'h:mm:ss a').format('dddd, MMMM DD YYYY') -
          Moment(b.datetime_start, 'h:mm:ss a').format('dddd, MMMM DD YYYY'),
      )
    // this.setState({ listDay: list });

    for (let i = 0; list.length > i; i++) {
      list[i].hosts.sort((a, b) => {
        return a.order - b.order
      })
    }

    //Se mapea la lista para poder retornar los datos ya filtrados
    list.map((item) => {
      item.restriction =
        item.access_restriction_type === 'EXCLUSIVE'
          ? 'Exclusiva para: '
          : item.access_restriction_type === 'SUGGESTED'
          ? 'Sugerida para: '
          : 'Abierta'
      item.roles = item.access_restriction_roles.map(({ name }) => name)
      return item
    })
    return list
  }

  //Se realiza funcion para filtrar mediante dropdown
  selectionSpace() {
    const space = document.getElementById('selectedSpace').value

    const filtered = this.filterBySpace(space, this.state.list)
    this.setState({ filtered, toShow: filtered, space })
  }

  //Funcion que realiza el filtro por espacio, teniendo en cuenta el dia
  // eslint-disable-next-line no-unused-vars
  filterBySpace = (space) => {
    //Se filta la lista anterior para esta vez filtrar por espacio
    const list = this.state.listDay.filter((a) => a.space.name === space)

    this.setState({ nameSpace: space })

    //Se mapea la lista para poder retornar la lista filtrada por espacio
    list.map((item) => {
      item.restriction =
        item.access_restriction_type === 'EXCLUSIVE'
          ? 'Exclusiva para: '
          : item.access_restriction_type === 'SUGGESTED'
          ? 'Sugerida para: '
          : 'Abierta'
      item.roles = item.access_restriction_roles.map(({ name }) => name)
      return item
    })
    return list
  }

  //Fn para el resultado de la búsqueda
  searchResult = (data) => this.setState({ toShow: !data ? [] : data })

  // Funcion para registrar usuario en la lección
  registerInActivity = async (activityId, eventId, userId, callback) => {
    Activity.Register(eventId, userId, activityId)
      .then(() => {
        notification.open({
          message: 'Inscripción realizada',
        })
        callback(true)
      })
      .catch((err) => {
        notification.open({
          message: err,
        })
      })
  }

  redirect = () => this.setState({ redirect: true })

  async selected() {}

  gotoActivity(activity) {
    this.setState({ currentActivity: activity })
    this.props.activeActivity(activity)

    //Se trae la funcion survey para pasarle el objeto activity y asi retornar los datos que consulta la funcion survey
    this.survey(activity)
  }

  gotoActivityList = () => {
    this.setState({ currentActivity: null })
  }

  //Funcion survey para traer las encuestas de a lección
  async survey(activity) {
    //Con el objeto activity se extrae el _id para consultar la api y traer la encuesta de ese curso
    const survey = await SurveysApi.getByActivity(
      this.props.cEvent.value._id,
      activity._id,
    )
    this.setState({ survey: survey })
  }

  handleOk = () => {
    this.setState({ visible: false })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  async getAgendaUser() {
    try {
      const infoUserAgenda = await Activity.GetUserActivity(
        this.props.cEvent.value._id,
        this.props.cUser._id,
      )
      this.setState({ userAgenda: infoUserAgenda.data })
    } catch (e) {
      console.error(e)
    }
  }

  checkInscriptionStatus(activityId) {
    const { userAgenda } = this.state
    if (!userAgenda) return false
    const checkInscription = userAgenda.filter(
      (activity) => activity.activity_id === activityId,
    )
    const statusInscription = !!checkInscription.length
    return statusInscription
  }

  //Start modal methods

  handleCancelModal = () => {
    this.setState({ visibleModal: false })
  }
  handleCancelModalRestricted = () => {
    this.setState({ visibleModalRestricted: false })
  }
  handleCancelModalExchangeCode = () => {
    this.setState({ visibleModalExchangeCode: false })
  }

  handleOpenModal = () => {
    this.setState({ visibleModal: true })
  }

  handleOpenModalRestricted = () => {
    this.setState({ visibleModalRestricted: true })
  }
  handleOpenModalExchangeCode = () => {
    this.setState({ visibleModalExchangeCode: true })
  }

  handleCloseModalRestrictedDevices = () => {
    this.setState({ visibleModalRegisteredDevices: false })
  }

  validationRegisterAndExchangeCode = (activity) => {
    const hasPayment =
      this.props.cEvent.value.has_payment ||
      this.props.cEvent.value.has_payment === 'true'
        ? true
        : false

    // Listado de cursos que requieren validación
    if (hasPayment) {
      if (this.props.cUser === null) {
        this.handleOpenModal()
        return false
      }

      if (this.props.cUser.state_id !== attendee_states.STATE_BOOKED) {
        this.handleOpenModalRestricted()
        return false
      }

      if (this.props.cUser.registered_devices) {
        const checkRegisterDevice = window.localStorage.getItem('eventUser_id')
        if (this.props.cUser.registered_devices < 2) {
          if (!checkRegisterDevice || checkRegisterDevice !== this.props.cUser._id) {
            this.props.cUser.registered_devices = this.props.cUser.registered_devices + 1
            window.localStorage.setItem('eventUser_id', this.props.cUser._id)
            AttendeeApi.update(event._id, this.props.cUser, this.props.cUser._id)
          }
        } else {
          if (!checkRegisterDevice) {
            this.setState({ visibleModalRegisteredDevices: true })
            return false
          }
        }
      } else {
        this.props.cUser.registered_devices = 1
        window.localStorage.setItem('eventUser_id', this.props.cUser._id)
        AttendeeApi.update(event._id, this.props.cUser, this.props.cUser._id)
      }

      this.gotoActivity(activity)
    } else {
      this.gotoActivity(activity)
    }
  }

  getActivitiesByDay = (date) => {
    const { toggleConference } = this.props
    const { hideBtnDetailAgenda, show_inscription, data, survey, documents } = this.state

    //Se trae el filtro de dia para poder filtar por fecha y mostrar los datos
    const list =
      date != null
        ? data
            .filter(
              (a) =>
                date &&
                date.format &&
                a.datetime_start &&
                a.datetime_start.includes(date.format('YYYY-MM-DD')),
            )
            .sort(
              (a, b) =>
                Moment(a.datetime_start, 'h:mm:ss a').format('dddd, MMMM DD YYYY') -
                Moment(b.datetime_start, 'h:mm:ss a').format('dddd, MMMM DD YYYY'),
            )
        : data

    const renderList = list.map((item, index) => {
      const isRegistered = this.checkInscriptionStatus(item._id) && true

      return (
        <div
          key={index}
          className="container_agenda-information"
          style={{ marginBottom: 0 }}
        >
          {(item.requires_registration || item.requires_registration === 'true') &&
          !this.props.cUser ? (
            <Badge.Ribbon color="red" placement="end" text="Requiere registro">
              <AgendaActivityItem
                hasDate={
                  this.props.cEvent.value.styles.hideDatesAgendaItem == 'true' ||
                  this.props.cEvent.value.styles.hideDatesAgendaItem == undefined
                    ? true
                    : false
                }
                item={item}
                key={index}
                Documents={documents}
                Surveys={survey}
                toggleConference={toggleConference}
                event_image={this.props.cEvent.value.styles.event_image}
                // gotoActivity={this.gotoActivity}
                registerInActivity={this.registerInActivity}
                registerStatus={isRegistered}
                eventId={this.props.cEvent.value._id}
                event={this.props.cEvent.value}
                userId={this.props.cUser._id}
                btnDetailAgenda={hideBtnDetailAgenda}
                show_inscription={show_inscription}
                userEntered={this.props.cUser}
                handleOpenModal={this.handleOpenModal}
                hideHours={this.props.cEvent.value.styles.hideHoursAgenda}
                handleValidatePayment={this.validationRegisterAndExchangeCode}
                eventUser={this.props.cEventUser.value}
                zoomExternoHandleOpen={this.props.zoomExternoHandleOpen}
              />
            </Badge.Ribbon>
          ) : (
            <AgendaActivityItem
              hasDate={
                this.props.cEvent.value.styles.hideDatesAgendaItem == 'true' ||
                this.props.cEvent.value.styles.hideDatesAgendaItem == undefined
                  ? true
                  : false
              }
              item={item}
              key={index}
              Documents={documents}
              Surveys={survey}
              toggleConference={toggleConference}
              event_image={this.props.cEvent.value.styles.event_image}
              // gotoActivity={this.gotoActivity}
              registerInActivity={this.registerInActivity}
              registerStatus={isRegistered}
              eventId={this.props.cEvent.value._id}
              event={this.props.cEvent.value}
              userId={this.props.cUser._id}
              btnDetailAgenda={hideBtnDetailAgenda}
              show_inscription={show_inscription}
              userEntered={this.props.cUser}
              handleOpenModal={this.handleOpenModal}
              hideHours={this.props.cEvent.value.styles.hideHoursAgenda}
              handleValidatePayment={this.validationRegisterAndExchangeCode}
              eventUser={this.props.cEventUser.value}
              zoomExternoHandleOpen={this.props.zoomExternoHandleOpen}
            />
          )}
        </div>
      )
    })
    return renderList
  }
  //End modal methods

  render() {
    const { toggleConference, currentActivity } = this.props
    const { days, loading, survey } = this.state

    {
      Moment.locale(window.navigator.language)
    }

    return (
      <div>
        <Modal
          visible={this.state.visibleModal}
          title="Información"
          // onOk={this.handleOk}
          onCancel={this.handleCancelModal}
          onClose={this.handleCancelModal}
          footer={[
            <Button key="cancel" onClick={this.handleCancelModal}>
              Cancelar
            </Button>,
            <Button key="login" onClick={this.props.handleOpenLogin}>
              Iniciar sesión
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.props.handleOpenRegisterForm}
            >
              Registrarme
            </Button>,
          ]}
        >
          <p>
            Para poder disfrutar de este contenido debes estar registrado e iniciar sesión
          </p>
        </Modal>

        <Modal
          visible={this.state.visibleModalRestricted}
          title="Información"
          // onOk={this.handleOk}
          onCancel={this.handleCancelModalRestricted}
          onClose={this.handleCancelModalRestricted}
          footer={[
            <Button key="cancel" onClick={this.handleCancelModalRestricted}>
              Cancelar
            </Button>,
            <Button key="login" onClick={this.handleOpenModalExchangeCode}>
              Canjear código
            </Button>,
          ]}
        >
          <p>
            Para poder disfrutar de este contenido debes haber pagado y tener un código
            por favor ingresalo a continuación, Si aún no has comprado el código lo puedes
            comprar en el siguiente link
            <a href="https://www.eticketablanca.com/evento/magic-land/">
              https://www.eticketablanca.com/evento/magic-land/
            </a>
          </p>
        </Modal>

        <Modal
          visible={this.state.visibleModalRegisteredDevices}
          title="Información"
          // onOk={this.handleOk}
          onCancel={this.handleCloseModalRestrictedDevices}
          onClose={this.handleCloseModalRestrictedDevices}
          footer={[
            <Button key="cancel" onClick={this.handleCloseModalRestrictedDevices}>
              Cancelar
            </Button>,
          ]}
        >
          <p>Has excedido el número de dispositivos permitido</p>
        </Modal>

        <Modal
          visible={this.state.visibleModalExchangeCode}
          title="Información"
          // onOk={this.handleOk}
          onCancel={this.handleCancelModalExchangeCode}
          onClose={this.handleCancelModalExchangeCode}
          footer={[
            <Button key="cancel" onClick={this.handleCancelModalExchangeCode}>
              Cancelar
            </Button>,
            <Button key="login" onClick={this.exchangeCode}>
              Canjear código
            </Button>,
          ]}
        >
          <div>
            {this.state.exchangeCodeMessage && (
              <Alert
                message={this.state.exchangeCodeMessage.message}
                type={this.state.exchangeCodeMessage.type}
                showIcon
              />
            )}
            <p>Ingresa el código de pago</p>
            <Input
              value={this.state.discountCode}
              onChange={(e) => this.setState({ discountCode: e.target.value })}
            />
          </div>
        </Modal>

        {/* FINALIZA EL DETALLE DE LA AGENDA */}
        {!currentActivity && loading && (
          <Row justify="center" align="middle">
            <Card>
              <Spin tip="Cargando..."></Spin>
            </Card>
          </Row>
        )}

        {!currentActivity && !loading && (
          <div className="container-calendar-section">
            <Row justify="center">
              <div className="container-calendar ">
                {/* LECCIONES SIN AGRUPAR */}
                {this.props.cEvent.value &&
                  this.props.cEvent.value.styles &&
                  (this.props.cEvent.value.styles.hideDatesAgenda === 'false' ||
                    this.props.cEvent.value.styles.hideDatesAgenda === false) &&
                  days.map((day) => (
                    <>
                      {this.props.cEvent.value.styles.hideDatesAgendaItem === 'true' ||
                      this.props.cEvent.value.styles.hideDatesAgendaItem ? (
                        this.getActivitiesByDay(day)
                      ) : (
                        <>
                          <Card style={{ marginBottom: '20px', height: 'auto' }}>
                            <Divider
                              orientation="left"
                              style={{ fontSize: '18px', color: '#f7981d' }}
                            >
                              <p>
                                <Space>
                                  <CalendarOutlined />
                                  {Moment(day).format('LL').toUpperCase()}
                                </Space>
                              </p>
                            </Divider>
                          </Card>
                          {this.getActivitiesByDay(day)}
                        </>
                      )}
                    </>
                  ))}
                {/* AGRUPAR LECCIONES POR FECHA*/}

                {this.props.cEvent.value &&
                  this.props.cEvent.value.styles &&
                  (this.props.cEvent.value.styles.hideDatesAgenda === 'true' ||
                    this.props.cEvent.value.styles.hideDatesAgenda ||
                    this.props.cEvent.value.styles.hideDatesAgenda == undefined) && (
                    <>
                      <div
                        style={{
                          backgroundColor: 'white',
                        }}
                      >
                        <ActivitiesList
                          agendaList={this.state.data}
                          eventId={this.props.cEvent.value._id}
                          eventUserId={this.props.cEventUser.value?._id}
                          eventProgressPercent={this.props.eventProgressPercent}
                        />
                      </div>
                    </>
                  )}
              </div>
            </Row>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  currentActivity: state.stage.data.currentActivity,
})
const mapDispatchToProps = {
  setNotification,
  setTabs,
}

const AgendaWithContext = withContext(AgendaLanding)
export default connect(mapStateToProps, mapDispatchToProps)(AgendaWithContext)
