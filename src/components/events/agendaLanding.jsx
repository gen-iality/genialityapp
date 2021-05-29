import React, { Component } from 'react';
import Moment from 'moment-timezone';
import { connect } from 'react-redux';
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
import { CalendarOutlined } from '@ant-design/icons';
import * as notificationsActions from '../../redux/notifications/actions';
//context
import { WithEviusContext } from '../../Context/withContext';
import { UseUserEvent } from '../../Context/eventUserContext';
import { PropTypes } from 'react';

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
  // static contextTypes = UsuarioContext;

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
    };

    this.returnList = this.returnList.bind(this);
    this.selectionSpace = this.selectionSpace.bind(this);
    this.survey = this.survey.bind(this);
    this.gotoActivity = this.gotoActivity.bind(this);
    this.gotoActivityList = this.gotoActivityList.bind(this);
  }

  async componentDidMount() {
    console.info('CONTEXT agenda landing', this.props);

    //Se carga esta funcion para cargar los datos

    this.setState({ loading: true });
    await this.fetchAgenda();

    this.setState({ loading: false });

    const { event } = this.props;

    this.setState({
      show_inscription: event.styles && event.styles.show_inscription ? event.styles.show_inscription : false,
      hideBtnDetailAgenda: event.styles && event.styles.hideBtnDetailAgenda ? event.styles.hideBtnDetailAgenda : true,
    });

    let surveysData = await SurveysApi.getAll(event._id);
    let documentsData = await DocumentsApi.getAll(event._id);

    if (surveysData.data.length >= 1) {
      this.setState({ survey: surveysData.data });
    }

    if (documentsData.data.length >= 1) {
      this.setState({ documents: documentsData.data });
    }

    this.getAgendaUser();
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
    if (!this.eventContext) return;

    //Después de traer la info se filtra por el primer día por defecto y se mandan los espacios al estado
    const filtered = this.filterByDay(this.state.days[0], this.state.list);
    this.setState({ data, filtered, toShow: filtered });
  }

  async listeningStateMeetingRoom(list) {
    list.forEach((activity, index, arr) => {
      firestore
        .collection('events')
        .doc('5ea23acbd74d5c4b360ddde2')
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
      await discountCodesApi.exchangeCode(codeTemplateId, { code: code, event_id: '5ea23acbd74d5c4b360ddde2' });
      let eventId = '5ea23acbd74d5c4b360ddde2';
      let data = { state_id: attendee_states.STATE_BOOKED };
      AttendeeApi.update(eventId, data, this.userEventContext._id);

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
      '5ea23acbd74d5c4b360ddde2',
      '5ea23acbd74d5c4b360ddde2' === '5f99a20378f48e50a571e3b6'
        ? `?orderBy=[{"field":"datetime_start","order":"desc"}]`
        : null
    );

    //se consulta la api de espacios para
    let space = await SpacesApi.byEvent('5ea23acbd74d5c4b360ddde2');

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
    this.setState({ listDay: list });

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
  registerInActivity = async (activityId, eventId, callback) => {
    Activity.Register(eventId, this.userCurrentContext._id, activityId)
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
    const survey = await SurveysApi.getByActivity('5ea23acbd74d5c4b360ddde2', activity._id);
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
    const { event } = this.props;
    try {
      const infoUserAgenda = await Activity.GetUserActivity(event._id, this.userCurrentContext._id);
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
      this.eventContext.has_payment === true || this.eventContext.has_payment === 'true' ? true : false;

    // Listado de eventos que requieren validación
    if (hasPayment) {
      if (this.userCurrentContext === null) {
        this.handleOpenModal();
        return false;
      }

      if (this.userCurrentContext.state_id !== attendee_states.STATE_BOOKED) {
        this.handleOpenModalRestricted();
        return false;
      }

      if (this.userCurrentContext.registered_devices) {
        const checkRegisterDevice = window.localStorage.getItem('this.userEventContext_id');
        if (this.userCurrentContext.registered_devices < 2) {
          if (!checkRegisterDevice || checkRegisterDevice !== this.userCurrentContext._id) {
            this.userCurrentContext.registered_devices = this.userCurrentContext.registered_devices + 1;
            window.localStorage.setItem('this.userEventContext_id', this.userCurrentContext._id);
            AttendeeApi.update('5ea23acbd74d5c4b360ddde2', this.userCurrentContext, this.userCurrentContext._id);
          }
        } else {
          if (!checkRegisterDevice) {
            this.setState({ visibleModalRegisteredDevices: true });
            return false;
          }
        }
      } else {
        this.userCurrentContext.registered_devices = 1;
        window.localStorage.setItem('this.userEventContext_id', this.userCurrentContext._id);
        AttendeeApi.update('5ea23acbd74d5c4b360ddde2', this.userCurrentContext, this.userCurrentContext._id);
      }

      this.gotoActivity(activity);
    } else {
      this.gotoActivity(activity);
    }
  };

  getActivitiesByDay = (date) => {
    const { toggleConference, event } = this.props;
    const { hideBtnDetailAgenda, show_inscription, data, survey, documents } = this.state;

    //Se trae el filtro de dia para poder filtar por fecha y mostrar los datos
    const list = data
      .filter((a) => date && date.format && a.datetime_start && a.datetime_start.includes(date.format('YYYY-MM-DD')))
      .sort(
        (a, b) =>
          Moment(a.datetime_start, 'h:mm:ss a').format('dddd, MMMM DD YYYY') -
          Moment(b.datetime_start, 'h:mm:ss a').format('dddd, MMMM DD YYYY')
      );

    const renderList = list.map((item, index) => {
      const isRegistered = this.checkInscriptionStatus(item._id) && true;

      return (
        <div key={index} className='container_agenda-information'>
          {(item.requires_registration || item.requires_registration === 'true') &&
          !this.props.this.userCurrentContext ? (
            <Badge.Ribbon color='red' placement='end' text='Requiere registro'>
              <AgendaActivityItem
                item={item}
                key={index}
                Documents={documents}
                Surveys={survey}
                toggleConference={toggleConference}
                event_image={this.props.event.styles.event_image}
                gotoActivity={this.gotoActivity}
                registerInActivity={this.registerInActivity}
                registerStatus={isRegistered}
                eventId={this.props.eventId}
                event={this.props.event}
                btnDetailAgenda={hideBtnDetailAgenda}
                show_inscription={show_inscription}
                handleOpenModal={this.handleOpenModal}
                hideHours={event.styles.hideHoursAgenda}
                handleValidatePayment={this.validationRegisterAndExchangeCode}
                zoomExternoHandleOpen={this.props.zoomExternoHandleOpen}
              />
            </Badge.Ribbon>
          ) : (
            <AgendaActivityItem
              item={item}
              key={index}
              Documents={documents}
              Surveys={survey}
              toggleConference={toggleConference}
              event_image={this.props.event.styles.event_image}
              gotoActivity={this.gotoActivity}
              registerInActivity={this.registerInActivity}
              registerStatus={isRegistered}
              eventId={this.props.eventId}
              event={this.props.event}
              btnDetailAgenda={hideBtnDetailAgenda}
              show_inscription={show_inscription}
              handleOpenModal={this.handleOpenModal}
              hideHours={event.styles.hideHoursAgenda}
              handleValidatePayment={this.validationRegisterAndExchangeCode}
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
    const { toggleConference, event, currentActivity } = this.props;
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
          cv '// '
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

        {currentActivity && (
          <AgendaActividadDetalle
            visible={this.state.visible}
            onClose={this.onClose}
            showDrawer={this.showDrawer}
            matchUrl={this.props.matchUrl}
            survey={survey}
            activity={this.props.activity}
            userEntered={this.props.userEntered}
            currentActivity={currentActivity}
            image_event={this.props.event.styles.event_image}
            gotoActivityList={this.gotoActivityList}
            toggleConference={toggleConference}
            currentUser={this.props.currentUser}
            collapsed={this.props.collapsed}
            toggleCollapsed={this.props.toggleCollapsed}
            event={event}
            showSection={this.props.showSection}
            zoomExternoHandleOpen={this.props.zoomExternoHandleOpen}
            eventSurveys={this.props.eventSurveys}
          />
        )}

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
                {/* {spaces && spaces.length > 1 && (
                  <>
                    <p className='is-size-5'>Seleccióne el espacio</p>
                    <div
                      className='select is-fullwidth is-three-fifths has-margin-bottom-20'
                      style={{ height: '3rem' }}>
                      <select
                        id='selectedSpace'
                        onClick={this.selectionSpace}
                        className='has-text-black  is-pulled-left'
                        style={{ height: '3rem' }}>
                        <option onClick={this.returnList}>Todo</option>
                        {spaces.map((space, key) => (
                          <option
                            onClick={() => this.selectSpace(space.name, space.datetime_start, space.datetime_start)}
                            key={key}>
                            {space.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )} */}

                {!(event && event.styles && event.styles.hideDatesAgenda) &&
                  days.map((day) => (
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
                  ))}

                {event && event.styles && event.styles.hideDatesAgenda && (
                  <Tabs defaultActiveKey='0' size='large'>
                    {days.map((day, index) => (
                      <TabPane
                        style={{ paddingLeft: '25px', paddingRight: '25px' }}
                        tab={
                          <span style={{ fontWeight: 'bolder', color: event.styles.color_tab_agenda }}>
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
  userContext: UseUserEvent,
});
const mapDispatchToProps = {
  setNotification,
  setTabs,
};

// const AgendaWithContext = WithEviusContext(Agenda);

export default connect(mapStateToProps, mapDispatchToProps)(Agenda);
// connect(s => ({data: s.value}))(({data, ...props}) => (<AgendaWithContext value={data} {...props} />))
