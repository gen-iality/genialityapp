import React, { Component } from 'react';
import { Card, Tabs, Alert, Spin, message as Message } from 'antd';
import RoomController from './controller';
import RoomConfig from './config';
import Service from './service';
import Moment from 'moment';
import * as Cookie from 'js-cookie';

const { TabPane } = Tabs;

class RoomManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Servicio de firebase
      service: new Service(this.props.firestore),

      // Configuracion del gestor de salas
      isPublished: true,
      hasVideoconference: false,
      activeTab: 'config',
      loading: false,

      // Configuracion de sala
      platform: null,
      meeting_id: null,
      roomStatus: null,
      host_id: null,
      host_name: null,

      // Estado de los tabs
      chat: true,
      surveys: false,
      games: false,
      attendees: false,
    };
  }

  componentDidMount = async () => {
    const { event_id, activity_id } = this.props;
    if (typeof event_id === 'undefined' || typeof activity_id === 'undefined' || activity_id === false) return;

    this.setState({ loading: true });

    await this.validationRoom();

    this.setState({ loading: false });
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.activity_id !== this.props.activity_id) {
      await this.validationRoom();
    }
  };

  // validacion de existencia de sala e inicializacion de estado
  validationRoom = async () => {
    const { event_id, activity_id } = this.props;
    const { service } = this.state;

    const hasVideoconference = await service.validateHasVideoconference(event_id, activity_id);

    if (hasVideoconference) {
      const configuration = await service.getConfiguration(event_id, activity_id);
      console.log('configuration room:', configuration);

      this.setState({
        isPublished: typeof configuration.isPublished !== 'undefined' ? configuration.isPublished : true,
        platform: configuration.platform ? configuration.platform : null,
        meeting_id: configuration.meeting_id ? configuration.meeting_id : null,
        roomStatus: configuration.habilitar_ingreso,
        chat: configuration.tabs && configuration.tabs.chat ? configuration.tabs.chat : false,
        surveys: configuration.tabs && configuration.tabs.surveys ? configuration.tabs.surveys : false,
        games: configuration.tabs && configuration.tabs.games ? configuration.tabs.games : false,
        attendees: configuration.tabs && configuration.tabs.attendees ? configuration.tabs.attendees : false,
        host_id: typeof configuration.host_id !== 'undefined' ? configuration.host_id : null,
        host_name: typeof configuration.host_name !== 'undefined' ? configuration.host_name : null,
      });

      // Si en firebase ya esta inicializado el campo platfom y meeting_id se habilita el tab controller
      if (configuration.platform !== null && configuration.meeting_id !== null) {
        this.setState({ hasVideoconference: true, activeTab: 'controller' });
      }
    } else {
      await this.handleSaveConfig();
    }
  };

  // Engargado de la navegacion entre los tabs del administrado de salas
  handleTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  // Encargado de gestionar los eventos del controlador de la sala
  handleRoomState = (e) => {
    this.setState({ roomStatus: e.target.value }, async () => await this.handleSaveConfig());
  };

  handleTabsController = (e, tab) => {
    const valueTab = e.target.value === 'true' ? true : false;
    const { chat, surveys, games, attendees } = this.state;
    const tabs = { chat, surveys, games, attendees };

    if (tab === 'chat') {
      tabs.chat = valueTab;
      this.setState({ chat: valueTab }, async () => await this.handleSaveConfig());
    } else if (tab === 'surveys') {
      tabs.surveys = valueTab;
      this.setState({ surveys: valueTab }, async () => await this.handleSaveConfig());
    } else if (tab === 'games') {
      tabs.games = valueTab;
      this.setState({ games: valueTab }, async () => await this.handleSaveConfig());
    } else if (tab === 'attendees') {
      tabs.attendees = valueTab;
      this.setState({ attendees: valueTab }, async () => await this.handleSaveConfig());
    }
  };

  // Encargado de recibir los cambios de los input y select
  handleChange = (e) => {
    console.log('handle change');
    if (e.target.name === 'isPublished') {
      const isPublished = e.target.value === 'true' ? true : false;
      this.setState({ [e.target.name]: isPublished }, async () => await this.handleSaveConfig());
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  //Preparacion de la data para guardar en firebase
  prepareData = () => {
    const {
      roomStatus,
      platform,
      meeting_id,
      chat,
      surveys,
      games,
      attendees,
      isPublished,
      host_id,
      host_name,
    } = this.state;
    const roomInfo = { roomStatus, platform, meeting_id, isPublished, host_id, host_name };
    const tabs = { chat, surveys, games, attendees };
    return { roomInfo, tabs };
  };

  // Método para guarda la información de la configuración
  handleSaveConfig = async () => {
    const { roomInfo, tabs } = this.prepareData();
    const { event_id, activity_id } = this.props;
    const { service } = this.state;
    const result = await service.createOrUpdateActivity(event_id, activity_id, roomInfo, tabs);

    if (result) Message.success(result.message);

    if (result.state && result.state === 'updated' && roomInfo.meeting_id !== null && roomInfo.platform !== null) {
      this.setState({ hasVideoconference: true });
    }
  };

  // Create Room Zoom
  createZoomRomm = async () => {
    this.validateForCreateZoomRoom();
    const evius_token = Cookie.get('evius_token');
    const { activity_id, activity_name, event_id, date_start_zoom, date_end_zoom } = this.props;
    const body = {
      token: evius_token,
      activity_id,
      activity_name,
      event_id: event_id,
      agenda: activity_name,
      date_start_zoom,
      date_end_zoom,
    };
    const response = await this.state.service.setZoomRoom(evius_token, body);
    console.log('Response:', response);
    if (
      Object.keys(response).length > 0 &&
      typeof response.meeting_id !== 'undefined' &&
      typeof response.zoom_host_id !== 'undefined' &&
      response.zoom_host_name !== 'undefined'
    ) {
      console.log('Request Success!!');
      const { meeting_id, zoom_host_id, zoom_host_name } = response;
      this.setState(
        {
          meeting_id,
          host_id: zoom_host_id,
          host_name: zoom_host_name,
        },
        async () => await this.handleSaveConfig()
      );
    }
  };

  validateForCreateZoomRoom = () => {
    // if (this.props.date_activity === '' || this.props.date_activity === 'Invalid date') {
    //   Message.error('La actividad no tiene una fecha seleccionada');
    //   return false;
    // }
    if (!Moment(this.props.date_start_zoom).isValid()) {
      Message.error('La fecha de inicio no es valida');
      return false;
    }
    if (!Moment(this.props.date_end_zoom).isValid()) {
      Message.error('La fecha de finalización no es valida');
      return false;
    }
  };

  render() {
    const {
      activeTab,
      hasVideoconference,
      platform,
      host_id,
      roomStatus,
      loading,
      chat,
      surveys,
      games,
      attendees,
      meeting_id,
      isPublished,
    } = this.state;
    const { event_id, activity_id } = this.props;
    return (
      <Card title='Administrador de salas'>
        {typeof event_id === 'undefined' || typeof activity_id === 'undefined' || activity_id === false ? (
          <>
            <Alert
              message='Primero cree la actividad y luego podrá crear una conferencia virtual asociada'
              type='warning'
            />
          </>
        ) : (
          <Tabs defaultActiveKey={activeTab} activeKey={activeTab} onChange={this.handleTab}>
            <TabPane tab='Configuración' key='config'>
              {loading ? (
                <Spin />
              ) : (
                <RoomConfig
                  handleChange={this.handleChange}
                  platform={platform}
                  meeting_id={meeting_id}
                  host_id={host_id}
                  handleSaveConfig={this.handleSaveConfig}
                  isPublished={isPublished}
                  createZoomRomm={this.createZoomRomm}
                  date_activity={this.props.date}
                />
              )}
            </TabPane>
            {hasVideoconference && (
              <TabPane tab='Controlador' key='controller'>
                {loading ? (
                  <Spin />
                ) : (
                  <RoomController
                    platform={platform}
                    handleRoomState={this.handleRoomState}
                    handleTabsController={this.handleTabsController}
                    roomStatus={roomStatus}
                    chat={chat}
                    surveys={surveys}
                    games={games}
                    attendees={attendees}
                  />
                )}
              </TabPane>
            )}
          </Tabs>
        )}
      </Card>
    );
  }
}

export default RoomManager;
