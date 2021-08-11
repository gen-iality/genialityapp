import React, { Component } from 'react';
import Moment from 'moment-timezone';
import { connect } from 'react-redux';
import withContext from '../../Context/withContext';
import {
  AgendaApi,
  SpacesApi,
  Activity,
  SurveysApi,
  DocumentsApi,
  AttendeeApi,
  discountCodesApi,
} from '../../helpers/request';
import AgendaActividadDetalle from './agendaActividadDetalle';
import { Modal, Button, Card, Spin, notification, Input, Alert, Divider, Space, Tabs, Badge } from 'antd';
import { firestore } from '../../helpers/firebase';
import AgendaActivityItem from './AgendaActivityItem';
import { ArrowRightOutlined, CalendarOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import * as notificationsActions from '../../redux/notifications/actions';
import { setTabs } from '../../redux/stage/actions';
const { TabPane } = Tabs;
let attendee_states = {
  STATE_DRAFT: '5b0efc411d18160bce9bc706', //"DRAFT";
  STATE_INVITED: '5ba8d213aac5b12a5a8ce749', //"INVITED";
  STATE_RESERVED: '5ba8d200aac5b12a5a8ce748', //"RESERVED";
  ROL_ATTENDEE: '5d7ac3f56b364a4042de9b08', //"rol id";
  STATE_BOOKED: '5b859ed02039276ce2b996f0', //"BOOKED";
};

const { setNotification } = notificationsActions;

class Agenda extends Component {
  constructor(props) {
    super(props);
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
    };

    this.returnList = this.returnList.bind(this);
    this.selectionSpace = this.selectionSpace.bind(this);
    this.survey = this.survey.bind(this);
    this.gotoActivity = this.gotoActivity.bind(this);
    this.gotoActivityList = this.gotoActivityList.bind(this);
  }

  async componentDidMount() {

    this.props.setVirtualConference(false);
    this.setState({ loading: true });
    await this.fetchAgenda();

    //Si hay currentUser pasado por props entonces inicializamos el estado userId
    if (this.props.currentUser) {
      let { currentUser } = this.props;
      this.setState({ userId: currentUser._id });
    }

    this.setState({ loading: false });

    this.setState({
      show_inscription:
        this.props.cEvent.value.styles && this.props.cEvent.value.styles.show_inscription
          ? this.props.cEvent.value.styles.show_inscription
          : false,
      hideBtnDetailAgenda:
        this.props.cEvent.value.styles && this.props.cEvent.value.styles.hideBtnDetailAgenda
          ? this.props.cEvent.value.styles.hideBtnDetailAgenda
          : true,
    });

    let surveysData = await SurveysApi.getAll(this.props.cEvent.value._id);
    let documentsData = await DocumentsApi.getAll(this.props.cEvent.value._id);

    if (surveysData.data.length >= 1) {
      this.setState({ survey: surveysData.data });
    }

    if (documentsData.data.length >= 1) {
      this.setState({ documents: documentsData.data });
    }

    this.getAgendaUser();
    
  }


  componentWillUnmount(){
    this.props.setVirtualConference(true)
  }
  /** extraemos los días en los que pasan actividades */
  setDaysWithAllActivities = () => {
    const { data } = this.state;
    const dayswithactivities = [];
    data.map((activity) => {
      const datestring = Moment.tz(activity.datetime_start, 'YYYY-MM-DD HH:mm', 'America/Bogota')
        .tz(Moment.tz.guess())
        .format('YYYY-MM-DD');

      //Revisamos que no hayamos extraido el día de otra actividad previa
      const result = dayswithactivities.filter((item) => item === datestring);
      if (result.length === 0) {
        dayswithactivities.push(datestring);
      }
    });
    this.setState({ days: dayswithactivities });
  };

  componentDidUpdate(prevProps) {
    const { data } = this.state;
    //Cargamos solamente los espacios virtuales de la agenda

    //Si aún no ha cargado el evento no podemos hacer nada más
    if (!this.props.cEvent.value) return;

    //Revisamos si el evento sigue siendo el mismo, no toca cargar nada
    if (prevProps.event && this.props.cEvent.value._id === prevProps.event._id) return;

    //Después de traer la info se filtra por el primer día por defecto y se mandan los espacios al estado
    const filtered = this.filterByDay(this.state.days[0], this.state.list);
    // this.setState({ data, filtered, toShow: filtered });
  }

  async listeningStateMeetingRoom(list) {
    list.forEach((activity, index, arr) => {
      firestore
        .collection('events')
        .doc(this.props.cEvent.value._id)
        .collection('activities')
        .doc(activity._id)
        .onSnapshot((infoActivity) => {
          if (!infoActivity.exists) return;
          const data = infoActivity.data();
          let { habilitar_ingreso, isPublished, meeting_id, platform } = data;
          let updatedActivityInfo = { ...arr[index], habilitar_ingreso, isPublished, meeting_id, platform };
          //this.props.setTabs(tabs);
          arr[index] = updatedActivityInfo;
          const filtered = this.filterByDay(this.state.days[0], arr);
          this.setState({ list: arr, filtered, toShow: filtered });
        });
    });
  }

  exchangeCode = async () => {
    //this.state.discountCode
    let code = this.state.discountCode;
    let codeTemplateId = '5fc93d5eccba7b16a74bd538';

    try {
      await discountCodesApi.exchangeCode(codeTemplateId, { code: code, event_id: this.props.cEvent.value._id });
      let eventUser = this.props.this.props.cUser;
      let eventId = this.props.cEvent.value._id;
      let data = { state_id: attendee_states.STATE_BOOKED };
      AttendeeApi.update(eventId, data, eventUser._id);

      this.setState({
        exchangeCodeMessage: {
          type: 'success',
          message: 'Código canjeado, habilitando el acceso...',
        },
      });
      setTimeout(() => window.location.reload(), 500);
    } catch (e) {
      const { status } = e.response;
      let msg = 'Tuvimos un problema canjenado el código intenta nuevamente';
      if (status == '404') {
        msg = 'Código no encontrado';
      } else {
        msg = 'Código ya fue usado';
      }
      this.setState({
        exchangeCodeMessage: {
          type: 'error',
          message: msg,
        },
      });
    }
  };

  fetchAgenda = async () => {
    // Se consulta a la api de agenda
   
    const { data } = await AgendaApi.byEvent(
      this.props.cEvent.value._id,
      this.props.cEvent.value._id === '5f99a20378f48e50a571e3b6'
        ? `?orderBy=[{"field":"datetime_start","order":"desc"}]`
        : null
    );  
    //se consulta la api de espacios para
    let space = await SpacesApi.byEvent(this.props.cEvent.value._id);

    //Después de traer la info se filtra por el primer día por defecto y se mandan los espacios al estado
    //const filtered = this.filterByDay(this.state.days[0], data);
    await this.listeningStateMeetingRoom(data);

    //this.setState({ data, filtered, toShow: filtered, spaces: space });
    this.setState({ data, spaces: space }, () => this.setDaysWithAllActivities(this.state.data));
  };

  returnList() {
    //con la lista previamente cargada en el estado se retorna a la constante toShow Para mostrar la lista completa
    this.setState({ toShow: this.state.listDay, nameSpace: 'inicio' });
  }

  filterByDay = (day, agenda) => {
    //Se trae el filtro de dia para poder filtar por fecha y mostrar los datos
    const list = agenda
      .filter((a) => day && day.format && a.datetime_start && a.datetime_start.includes(day.format('YYYY-MM-DD')))
      .sort(
        (a, b) =>
          Moment(a.datetime_start, 'h:mm:ss a').format('dddd, MMMM DD YYYY') -
          Moment(b.datetime_start, 'h:mm:ss a').format('dddd, MMMM DD YYYY')
      );
    // this.setState({ listDay: list });

    for (let i = 0; list.length > i; i++) {
      list[i].hosts.sort((a, b) => {
        return a.order - b.order;
      });
    }

    //Se mapea la lista para poder retornar los datos ya filtrados
    list.map((item) => {
      item.restriction =
        item.access_restriction_type === 'EXCLUSIVE'
          ? 'Exclusiva para: '
          : item.access_restriction_type === 'SUGGESTED'
          ? 'Sugerida para: '
          : 'Abierta';
      item.roles = item.access_restriction_roles.map(({ name }) => name);
      return item;
    });
    return list;
  };

  //Fn para manejar cuando se selecciona un dia, ejecuta el filtrado
  selectDay = (day) => {
    const filtered = this.filterByDay(day, this.state.data);
    this.setState({ filtered, toShow: filtered, day });
  };

  //Funcion para ejecutar el filtro por espacio y mandar el espacio a filtrar
  selectSpace(space) {
    const filtered = this.filterBySpace(space, this.state.list);
    this.setState({ filtered, toShow: filtered, space });
  }

  //Se realiza funcion para filtrar mediante dropdown
  selectionSpace() {
    let space = document.getElementById('selectedSpace').value;

    const filtered = this.filterBySpace(space, this.state.list);
    this.setState({ filtered, toShow: filtered, space });
  }

  //Funcion que realiza el filtro por espacio, teniendo en cuenta el dia
  // eslint-disable-next-line no-unused-vars
  filterBySpace = (space, dates) => {
    //Se filta la lista anterior para esta vez filtrar por espacio
    const list = this.state.listDay.filter((a) => a.space.name === space);

    this.setState({ nameSpace: space });

    //Se mapea la lista para poder retornar la lista filtrada por espacio
    list.map((item) => {
      item.restriction =
        item.access_restriction_type === 'EXCLUSIVE'
          ? 'Exclusiva para: '
          : item.access_restriction_type === 'SUGGESTED'
          ? 'Sugerida para: '
          : 'Abierta';
      item.roles = item.access_restriction_roles.map(({ name }) => name);
      return item;
    });
    return list;
  };

  //Fn para el resultado de la búsqueda
  searchResult = (data) => this.setState({ toShow: !data ? [] : data });

  // Funcion para registrar usuario en la actividad
  registerInActivity = async (activityId, eventId, userId, callback) => {
    Activity.Register(eventId, userId, activityId)
      .then(() => {
        notification.open({
          message: 'Inscripción realizada',
        });
        callback(true);
      })
      .catch((err) => {
        notification.open({
          message: err,
        });
      });
  };

  //Fn para el resultado de la búsqueda
  searchResult = (data) => this.setState({ toShow: !data ? [] : data });

  redirect = () => this.setState({ redirect: true });

  async selected() {}

  gotoActivity(activity) {
    this.setState({ currentActivity: activity });
    this.props.activeActivity(activity);

    //Se trae la funcion survey para pasarle el objeto activity y asi retornar los datos que consulta la funcion survey
    this.survey(activity);
  }

  gotoActivityList = () => {
    this.setState({ currentActivity: null });
  };

  //Funcion survey para traer las encuestas de a actividad
  async survey(activity) {
    //Con el objeto activity se extrae el _id para consultar la api y traer la encuesta de ese evento
    const survey = await SurveysApi.getByActivity(this.props.cEvent.value._id, activity._id);
    this.setState({ survey: survey });
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  capitalizeDate(val) {
    val = val.format('MMMM DD').toUpperCase();
    return val
      .toLowerCase()
      .trim()
      .split(' ')
      .map((v) => v[0].toUpperCase() + v.substr(1))
      .join(' ');
  }

  async getAgendaUser() {
    try {
      const infoUserAgenda = await Activity.GetUserActivity(this.props.cEvent.value._id, this.props.cUser._id);
      this.setState({ userAgenda: infoUserAgenda.data });
    } catch (e) {
      console.error(e);
    }
  }

  checkInscriptionStatus(activityId) {
    const { userAgenda } = this.state;
    if (!userAgenda) return false;
    const checkInscription = userAgenda.filter((activity) => activity.activity_id === activityId);
    const statusInscription = checkInscription.length ? true : false;
    return statusInscription;
  }

  //Start modal methods

  handleCancelModal = () => {
    this.setState({ visibleModal: false });
  };
  handleCancelModalRestricted = () => {
    this.setState({ visibleModalRestricted: false });
  };
  handleCancelModalExchangeCode = () => {
    this.setState({ visibleModalExchangeCode: false });
  };

  handleOpenModal = () => {
    this.setState({ visibleModal: true });
  };

  handleOpenModalRestricted = () => {
    this.setState({ visibleModalRestricted: true });
  };
  handleOpenModalExchangeCode = () => {
    this.setState({ visibleModalExchangeCode: true });
  };

  handleCloseModalRestrictedDevices = () => {
    this.setState({ visibleModalRegisteredDevices: false });
  };

  validationRegisterAndExchangeCode = (activity) => {
    const hasPayment =
      this.props.cEvent.value.has_payment === true || this.props.cEvent.value.has_payment === 'true' ? true : false;

    // Listado de eventos que requieren validación
    if (hasPayment) {
      if (this.props.cUser === null) {
        this.handleOpenModal();
        return false;
      }

      if (this.props.cUser.state_id !== attendee_states.STATE_BOOKED) {
        this.handleOpenModalRestricted();
        return false;
      }

      if (this.props.cUser.registered_devices) {
        const checkRegisterDevice = window.localStorage.getItem('eventUser_id');
        if (this.props.cUser.registered_devices < 2) {
          if (!checkRegisterDevice || checkRegisterDevice !== this.props.cUser._id) {
            this.props.cUser.registered_devices = this.props.cUser.registered_devices + 1;
            window.localStorage.setItem('eventUser_id', this.props.cUser._id);
            AttendeeApi.update(event._id, this.props.cUser, this.props.cUser._id);
          }
        } else {
          if (!checkRegisterDevice) {
            this.setState({ visibleModalRegisteredDevices: true });
            return false;
          }
        }
      } else {
        this.props.cUser.registered_devices = 1;
        window.localStorage.setItem('eventUser_id', this.props.cUser._id);
        AttendeeApi.update(event._id, this.props.cUser, this.props.cUser._id);
      }

      this.gotoActivity(activity);
    } else {
      this.gotoActivity(activity);
    }
  };

  getActivitiesByDay = (date) => {
    const { toggleConference } = this.props;
    const { hideBtnDetailAgenda, show_inscription, data, survey, documents } = this.state;

    //Se trae el filtro de dia para poder filtar por fecha y mostrar los datos
    const list =
      date != null
        ? data
            .filter(
              (a) => date && date.format && a.datetime_start && a.datetime_start.includes(date.format('YYYY-MM-DD'))
            )
            .sort(
              (a, b) =>
                Moment(a.datetime_start, 'h:mm:ss a').format('dddd, MMMM DD YYYY') -
                Moment(b.datetime_start, 'h:mm:ss a').format('dddd, MMMM DD YYYY')
            )
        : data;

    const renderList = list.map((item, index) => {
      const isRegistered = this.checkInscriptionStatus(item._id) && true;

      return (
        <div key={index} className='container_agenda-information'>
          {(item.requires_registration || item.requires_registration === 'true') && !this.props.cUser ? (
            <Badge.Ribbon color='red' placement='end' text='Requiere registro'>
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
      );
    });
    return renderList;
  };

  //End modal methods

  render() {
    const { toggleConference, currentActivity } = this.props;
    const { days, loading, survey } = this.state;

    {
      Moment.locale(window.navigator.language);
    }

    

    return (
      <div>
        <Modal
          visible={this.state.visibleModal}
          title='Información'
          // onOk={this.handleOk}
          onCancel={this.handleCancelModal}
          onClose={this.handleCancelModal}
          footer={[
            <Button key='cancel' onClick={this.handleCancelModal}>
              Cancelar
            </Button>,
            <Button key='login' onClick={this.props.handleOpenLogin}>
              Iniciar sesión
            </Button>,
            <Button key='submit' type='primary' loading={loading} onClick={this.props.handleOpenRegisterForm}>
              Registrarme
            </Button>,
          ]}>
          <p>Para poder disfrutar de este contenido debes estar registrado e iniciar sesión</p>
        </Modal>

        <Modal
          visible={this.state.visibleModalRestricted}
          title='Información'
          // onOk={this.handleOk}
          onCancel={this.handleCancelModalRestricted}
          onClose={this.handleCancelModalRestricted}
          footer={[
            <Button key='cancel' onClick={this.handleCancelModalRestricted}>
              Cancelar
            </Button>,
            <Button key='login' onClick={this.handleOpenModalExchangeCode}>
              Canjear código
            </Button>,
          ]}>
          <p>
            Para poder disfrutar de este contenido debes haber pagado y tener un código porfavor ingresalo a
            continuación, Si aún no has comprado el código lo puedes comprar en el siguiente link
            <a href='https://www.eticketablanca.com/evento/magic-land/'>
              https://www.eticketablanca.com/evento/magic-land/
            </a>
          </p>
        </Modal>

        <Modal
          visible={this.state.visibleModalRegisteredDevices}
          title='Información'
          // onOk={this.handleOk}
          onCancel={this.handleCloseModalRestrictedDevices}
          onClose={this.handleCloseModalRestrictedDevices}
          footer={[
            <Button key='cancel' onClick={this.handleCloseModalRestrictedDevices}>
              Cancelar
            </Button>,
          ]}>
          <p>Has excedido el número de dispositivos permitido</p>
        </Modal>

        <Modal
          visible={this.state.visibleModalExchangeCode}
          title='Información'
          // onOk={this.handleOk}
          onCancel={this.handleCancelModalExchangeCode}
          onClose={this.handleCancelModalExchangeCode}
          footer={[
            <Button key='cancel' onClick={this.handleCancelModalExchangeCode}>
              Cancelar
            </Button>,
            <Button key='login' onClick={this.exchangeCode}>
              Canjear código
            </Button>,
          ]}>
          {' '}
          <div>
            {this.state.exchangeCodeMessage && (
              <Alert
                message={this.state.exchangeCodeMessage.message}
                type={this.state.exchangeCodeMessage.type}
                showIcon
              />
            )}
            {/* <Alert message="" type="info" /> */}
            <p>Ingresa el código de pago</p>
            <Input value={this.state.discountCode} onChange={(e) => this.setState({ discountCode: e.target.value })} />
          </div>
        </Modal>

        {/* {currentActivity && (
          <AgendaActividadDetalle
            visible={this.state.visible}
            onClose={this.onClose}
            showDrawer={this.showDrawer}
            matchUrl={this.props.matchUrl}
            survey={survey}
            activity={this.props.activity}
            cUser={this.props.cUser}
            currentActivity={currentActivity}
            image_event={this.props.cEvent.value.styles.event_image}
            gotoActivityList={this.gotoActivityList}
            toggleConference={toggleConference}
            currentUser={this.props.cUser}
            collapsed={this.props.collapsed}
            toggleCollapsed={this.props.toggleCollapsed}
            cEventUser={this.props.cEventUser.value}
            cEvent={this.props.cEvent.value}
            showSection={this.props.showSection}
            zoomExternoHandleOpen={this.props.zoomExternoHandleOpen}
            eventSurveys={this.props.cEvent.valueSurveys}
          />
        )} */}

        {/* FINALIZA EL DETALLE DE LA AGENDA */}
        {!currentActivity && loading && (
          <div className='container-calendar-section'>
            <div className='columns is-centered'>
              <Card>
                <Spin tip='Cargando...'></Spin>
              </Card>
            </div>
          </div>
        )}

        {!currentActivity && !loading && (
          <div className='container-calendar-section'>
            <div className='columns is-centered'>
              <div className='container-calendar is-three-fifths'>
                {/* ACTIVIDADES SIN AGRUPAR */}
                {this.props.cEvent.value &&
                  this.props.cEvent.value.styles &&
                  (this.props.cEvent.value.styles.hideDatesAgenda === 'false' ||
                    this.props.cEvent.value.styles.hideDatesAgenda === false) &&
                  days.map((day) => (
                    <>
                      {this.props.cEvent.value.styles.hideDatesAgendaItem === 'true' ||
                      this.props.cEvent.value.styles.hideDatesAgendaItem === true ? (
                        this.getActivitiesByDay(day)
                      ) : (
                        <>
                          <Card style={{ marginBottom: '20px', height: 'auto' }}>
                            <Divider orientation='left' style={{ fontSize: '18px', color: '#1cdcb7' }}>
                              <p>
                                <Space>
                                  <CalendarOutlined />
                                  {Moment(day)
                                    .format('LL')
                                    .toUpperCase()}
                                </Space>
                              </p>
                            </Divider>
                          </Card>
                          {this.getActivitiesByDay(day)}
                        </>
                      )}
                    </>
                  ))}
                {/* AGRUPAR ACTIVIDADES POR FECHA*/}

                {this.props.cEvent.value &&
                  this.props.cEvent.value.styles &&
                  (this.props.cEvent.value.styles.hideDatesAgenda === 'true' ||
                    this.props.cEvent.value.styles.hideDatesAgenda === true ||
                    this.props.cEvent.value.styles.hideDatesAgenda == undefined) && (
                    <Tabs
                      //tabBarExtraContent={{right:<DoubleRightOutlined />, left:<DoubleLeftOutlined/>}}
                      defaultActiveKey='0'
                      size='large'
                      style={{paddingTop:'5px'}}
                      tabBarStyle={{
                        backgroundColor: this.props.cEvent.value.styles.toolbarDefaultBg,
                        borderRadius: '10px',
                        paddingLeft: '25px',
                      }}>
                      {days.map((day, index) => (
                        <TabPane
                          //style={{ paddingLeft: '25px', paddingRight: '25px' }}
                          tab={
                            <span
                              style={{
                                fontWeight: 'bolder',
                                color: this.props.cEvent.value.styles.textMenu,
                                backgroundColor: this.props.cEvent.value.styles.toolbarDefaultBg,
                              }}>
                              {Moment(day)
                                .format('LL')
                                .toUpperCase()}
                            </span>
                          }
                          key={index}>
                          {this.getActivitiesByDay(day)}
                        </TabPane>
                      ))}
                    </Tabs>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentActivity: state.stage.data.currentActivity,
});
const mapDispatchToProps = {
  setNotification,
  setTabs,
};

let AgendaWithContext = withContext(Agenda);
export default connect(mapStateToProps, mapDispatchToProps)(AgendaWithContext);
