import React, { Component } from 'react';
import { Card, Tabs, Alert, Spin } from 'antd';
import RoomController from './controller';
import RoomConfig from './config';
import { validateHasVideoconference, createOrUpdateActivity, getConfiguration } from './service';

const { TabPane } = Tabs;

class RoomManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Configuracion del gestor de salas
      hasVideoconference: false,
      activeTab: 'config',
      loading: false,

      // Configuracion de sala
      platform: null,
      meeting_id: null,
      roomStatus: null,
      host_id: null,

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

    const hasVideoconference = await validateHasVideoconference(event_id, activity_id);

    if (hasVideoconference) {
      this.setState({ hasVideoconference: true, activeTab: 'controller' });

      const configuration = await getConfiguration(event_id, activity_id);
      console.log('configuration', configuration);

      this.setState({
        platform: configuration.platform ? configuration.platform : null,
        meeting_id: configuration.meeting_id ? configuration.meeting_id : null,
        roomStatus: configuration.habilitar_ingreso,
        chat: configuration.tabs && configuration.tabs.chat ? configuration.tabs.chat : false,
        surveys: configuration.tabs && configuration.tabs.surveys ? configuration.tabs.surveys : false,
        games: configuration.tabs && configuration.tabs.games ? configuration.tabs.games : false,
        attendees: configuration.tabs && configuration.tabs.attendees ? configuration.tabs.attendees : false,
      });
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
    this.setState({ [e.target.name]: e.target.value });
  };

  //Preparacion de la data para guardar en firebase
  prepareData = () => {
    const { roomStatus, platform, meeting_id, chat, surveys, games, attendees } = this.state;
    const roomInfo = { roomStatus, platform, meeting_id };
    const tabs = { chat, surveys, games, attendees };
    return { roomInfo, tabs };
  };

  // Método para guarda la información de la configuración
  handleSaveConfig = async () => {
    const { roomInfo, tabs } = this.prepareData();
    const { event_id, activity_id } = this.props;
    const result = await createOrUpdateActivity(event_id, activity_id, roomInfo, tabs);
    console.log('el resultado', result);

    if (result.state && result.state === 'created') {
      this.setState({ hasVideoconference: true });
    }
    // notification.open({
    //   message: result.message,
    // });
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
