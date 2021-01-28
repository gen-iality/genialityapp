import React, { Component } from 'react';
import { Card, Tabs, Alert } from 'antd';
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
    console.log('hasVideoconference', this.props);
    const { event_id, activity_id } = this.props;
    if (typeof event_id === 'undefined' || typeof activity_id === 'undefined') return;

    const hasVideoconference = await validateHasVideoconference(event_id, activity_id);

    if (hasVideoconference) {
      this.setState({ hasVideoconference: true, activeTab: 'controller' });

      const configuration = await getConfiguration(event_id, activity_id);
      console.log(configuration);

      this.setState({
        roomStatus: configuration.habilitar_ingreso,
        chat: configuration.tabs.chat ? configuration.tabs.chat : false,
        surveys: configuration.tabs.surveys ? configuration.tabs.surveys : false,
        games: configuration.tabs.games ? configuration.tabs.games : false,
        attendees: configuration.tabs.games ? configuration.tabs.games : false,
      });
    }
  };

  // Engargado de la navegacion entre los tabs del administrado de salas
  handleTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  async handleTabsController(e, tab) {
    const valueTab = e.target.value === 'true' ? true : false;
    const { chat, surveys, games, attendees } = this.state;
    const tabs = { chat, surveys, games, attendees };
    if (tab === 'chat') {
      tabs.chat = valueTab;
      this.setState({ chat: valueTab });
    } else if (tab === 'surveys') {
      tabs.surveys = valueTab;
      this.setState({ surveys: valueTab });
    } else if (tab === 'games') {
      tabs.games = valueTab;
      this.setState({ games: valueTab });
    } else if (tab === 'attendees') {
      tabs.attendees = valueTab;
      this.setState({ attendees: valueTab });
    }
    //await createOrUpdateActivity(this.props.location.state.edit, this.props.event._id, this.state.availableText, tabs);
  }

  // Encargado de gestionar los eventos del controlador de la sala
  handleRoomState = async (e) => {
    this.setState({ roomStatus: e.target.value });
    const { chat, surveys, games, attendees } = this.state;
    const tabs = { chat, surveys, games, attendees };
    const { event_id, activity_id } = this.props;

    await createOrUpdateActivity(event_id, activity_id, e.target.value, tabs);
    // notification.open({
    //   message: result.message,
    // });
  };

  // Encargado de recibir los cambios de los input y select
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { activeTab, hasVideoconference, platform, host_id, roomStatus } = this.state;
    const { event_id, activity_id } = this.props;
    return (
      <Card title='Administrador de salas'>
        {typeof event_id === 'undefined' || typeof activity_id === 'undefined' ? (
          <>
            <Alert
              message='Primero cree la actividad y luego podrá crear una conferencia virtual asociada'
              type='warning'
            />
          </>
        ) : (
          <Tabs defaultActiveKey={activeTab} activeKey={activeTab} onChange={this.handleTab}>
            <TabPane tab='Configuración' key='config'>
              <RoomConfig handleChange={this.handleChange} platform={platform} host_id={host_id} />
            </TabPane>
            {hasVideoconference && (
              <TabPane tab='Controlador' key='controller'>
                <RoomController
                  platform={platform}
                  handleRoomState={this.handleRoomState}
                  handleTabsController={this.handleTabsController}
                  roomStatus={roomStatus}
                />
              </TabPane>
            )}
          </Tabs>
        )}
      </Card>
    );
  }
}

export default RoomManager;
