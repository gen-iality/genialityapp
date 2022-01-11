import React, { Component } from 'react';
import { message as Message, message } from 'antd';
import RoomConfig from './config';
import Service from './service';
import Moment from 'moment';
import AgendaContext from '../../../Context/AgendaContext';
import { GetTokenUserFirebase } from 'helpers/HelperAuth';

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
      //juegos disponibles
      avalibleGames: [],

      // si este valor esta en false no se muestra el listado de host
      // tambien se termina a partir del valor de la variable si se envia un array por host_ids o un string por host_id
      //select_host_manual: true,

      // campo para pasar por el request de crear room
      //host_id: null,
      host_ids: [],
      host_list: [
        {
          host_id: 'KthHMroFQK24I97YoqxBZw',
          host_name: 'host1@evius.co',
        },
        {
          host_id: '15DKHS_6TqWIFpwShasM4w',
          host_name: 'host2@evius.co',
        },
        {
          host_id: 'FIRVnSoZR7WMDajgtzf5Uw',
          host_name: 'host3@evius.co',
        },
        /* {  Esto está en ucronio
          host_id: 'YaXq_TW2f791cVpP8og',
          host_name: 'host4@evius.co',
        },
        {
          host_id: 'mSkbi8PmSSqQEWsm6FQiAA',
          host_name: 'host5@evius.co',
        }, */
      ],

      // Estado de los tabs
      chat: true,
      surveys: false,
      games: false,
      attendees: false,
    };
  }
  static contextType = AgendaContext;

  componentDidMount = async () => {
    const { event_id } = this.props;
    const activity_id = this.context.activityEdit;
    const { host_list } = this.state;

    const host_ids = host_list.map((host) => host.host_id);
    this.setState({ host_ids });

    if (typeof event_id === 'undefined' || typeof activity_id === 'undefined' || activity_id === false) return;

    this.setState({ loading: true });

    // Si valida si existe informacion en Firebase del espacio virtual
    const validation = await this.validationRoom();

    // Si no existe información del espacio virtual en firebase se procede inicializa el documento
    if (!validation) {
      await this.saveConfig();
    }

    this.setState({ loading: false });
  };

  /*componentDidUpdate = async (prevProps) => {
    // Se escucha el cambio de activity_id esto sucede cuando se crea una actividad nueva
    if (prevProps.activity_id !== this.context.activityEdit) {
      // Si valida si existe informacion en Firebase del espacio virtual
      const validation = await this.validationRoom();

      // Si no existe información del espacio virtual en firebase se procede inicializa el documento
      if (!validation) {
        await this.saveConfig();
      }
    }
  };*/

  // validacion de existencia de sala e inicializacion de estado
  validationRoom = async () => {
    const { event_id } = this.props;
    const activity_id = this.context.activityEdit;
    const { service } = this.state;
    const hasVideoconference = await service.validateHasVideoconference(event_id, activity_id);

    if (hasVideoconference) {
      // Si en firebase ya esta inicializado el campo platfom y meeting_id se habilita el tab controller
      if (
        this.context.platform !== null &&
        this.context.platform !== '' &&
        this.context.meeting_id !== null &&
        this.context.meeting_id !== ''
      ) {
        this.setState({ hasVideoconference: true, activeTab: 'controller' });
      }
      return true;
    } else {
      return false;
    }
  };

  // Engargado de la navegacion entre los tabs del administrado de salas
  handleTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  // Encargado de gestionar los estados de la videoConferencia
  // Estados: open_meeting_room, closed_meeting_room, ended_meeting_room
  handleRoomState = (e) => {
    this.setState({ roomStatus: e }, async () => await this.saveConfig());
  };

  // Encargado de gestionar los juegos seleccionados
  handleGamesSelected = async (status, itemId, listOfGames) => {
    if (status === 'newOrUpdate') {
      this.setState({ avalibleGames: listOfGames }, async () => await this.saveConfig());
    } else {
      const newData = [];
      listOfGames.forEach((items) => {
        if (items.id === itemId) {
          newData.push({ ...items, showGame: status });
        } else {
          newData.push({ ...items });
        }
      });
      this.setState({ avalibleGames: newData }, async () => await this.saveConfig());
    }
  };
  // Encargado de gestionar los tabs de la video conferencia
  handleTabsController = (e, tab) => {
    const valueTab = e;
    const { chat, surveys, games, attendees } = this.state;
    const tabs = { chat, surveys, games, attendees };

    //
    // return true;

    if (tab === 'chat') {
      tabs.chat = valueTab;
      this.setState({ chat: valueTab }, async () => await this.saveConfig());
    } else if (tab === 'surveys') {
      tabs.surveys = valueTab;
      this.setState({ surveys: valueTab }, async () => await this.saveConfig());
    } else if (tab === 'games') {
      tabs.games = valueTab;
      this.setState({ games: valueTab }, async () => await this.saveConfig());
    } else if (tab === 'attendees') {
      tabs.attendees = valueTab;
      this.setState({ attendees: valueTab }, async () => await this.saveConfig());
    }
  };

  // Encargado de recibir los cambios de los input y select
  handleChange = (e, nameS) => {
    let { name } = e.target ? e.target : nameS;
    let { value } = e.target ? e.target : e;

    this.setState({ [name]: value });
    if (nameS === 'select_host_manual') {
      this.context.select_host_manual = e;
    }
    if (nameS === 'host_id') {
      this.context.host_id = e;
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
      avalibleGames,
      transmition,
    } = this.context;
    const roomInfo = {
      habilitar_ingreso: roomStatus,
      platform,
      meeting_id,
      isPublished,
      host_id,
      host_name,
      avalibleGames,
      transmition,
    };
    const tabs = { chat, surveys, games, attendees };
    return { roomInfo, tabs };
  };

  // Se usa al eliminar una sala de zoom, elimnar la informacion asociada a ella, se mantiene la configuración de la misma
  restartData = () => {
    this.context.setPlatform('wowza');
    this.context.setMeetingId('');
    this.context.setHostId(null);
    this.context.setHostName(null);
    this.context.setRoomStatus('');
    this.setState(
      {
        hasVideoconference: false,
      },

      async () => await this.saveConfig()
    );
  };

  // Método para guarda la información de la configuración
  saveConfig = async () => {
    const { event_id } = this.props;
    const activity_id = this.context.activityEdit;

    /* Se valida si hay cambios pendientes por guardar en la fecha/hora de la actividad */
    const { roomInfo, tabs } = this.prepareData();
    const { service } = this.state;
    try {
      const result = await service.createOrUpdateActivity(event_id, activity_id, roomInfo, tabs);
      if (result) Message.success(result.message);
      return result;
    } catch (err) {
      Message.error('Error', err);
    }
  };

  //
  handleClickSaveConfig = async () => {
    const { event_id, activity_id, pendingChangesSave } = this.props;

    /* Se valida si hay cambios pendientes por guardar en la fecha/hora de la actividad */
    if (!pendingChangesSave) {
      const { service, platform, meeting_id } = this.state;

      // Validación de los campos requeridos
      if (platform === '' || platform === null || meeting_id === '' || meeting_id === null) {
        message.warning('Seleccione una plataforma e ingrese el id de la videoconferencia');
        return false;
      }

      // Se utiliza solo cuando el usuario guarda de manera manual el id del evento en zoom o zoomExterno
      if (platform === 'zoom' || platform === 'zoomExterno') {
        const data = {
          event_id,
          activity_id,
          meeting_id,
        };
        console.log('data', data);
        const response = await service.getZoomRoom(data);
        if (
          Object.keys(response).length > 0 &&
          typeof response.meeting_id !== 'undefined' &&
          typeof response.zoom_host_id !== 'undefined' &&
          typeof response.zoom_host_name !== 'undefined'
        ) {
          this.setState({ host_id: response.zoom_host_id, host_name: response.zoom_host_name });
        } else {
          message.error('El id de la videoconferencia NO es valido');
          return false;
        }
      }

      //Si las validaciones  son aprobadas  se procede a salvar en firebase
      const result = await this.saveConfig();

      if (result.state === 'created' || result.state === 'updated') {
        this.setState({ hasVideoconference: true });
      }
    } else {
      message.warning('Cambios pendientes por guardar en la fecha y hora de la actividad');
    }
  };

  // Create Room Zoom
  createZoomRoom = async () => {
    this.validateForCreateZoomRoom();
    const evius_token = await GetTokenUserFirebase();

    const { activity_id, activity_name, event_id, date_start_zoom, date_end_zoom } = this.props;
    const { select_host_manual, host_ids } = this.state;
    const { host_id } = this.context;

    // Se valida si es el host se selecciona de manera manual o automáticamente
    // Si la seleccion del host es manual se envia el campo host_id con el id del host tipo string
    // Si la seleccion del host es automática se envia el campo host_ids con un array de strings con los ids de los hosts
    const host_field = select_host_manual ? 'host_id' : 'host_ids';
    const host_value = select_host_manual ? host_id : host_ids;

    const body = {
      token: evius_token,
      activity_id,
      activity_name,
      event_id: event_id,
      agenda: activity_name,
      date_start_zoom,
      date_end_zoom,
      [host_field]: host_value,
    };
    const response = await this.state.service.setZoomRoom(evius_token, body);

    if (
      Object.keys(response).length > 0 &&
      typeof response.meeting_id !== 'undefined' &&
      typeof response.zoom_host_id !== 'undefined' &&
      typeof response.zoom_host_name !== 'undefined'
    ) {
      const { meeting_id, zoom_host_id, zoom_host_name } = response;
      this.context.setMeetingId(meeting_id);
      this.context.setHostId(zoom_host_id);
      this.context.setHostName(zoom_host_name);
      this.setState(
        {
          hasVideoconference: true,
        },
        async () => await this.saveConfig()
      );
    } else {
      Message.warning(response.message);
    }
  };

  // Se ejecuta cuando se solicita la creación de una trasmisión de manera automática
  validateForCreateZoomRoom = () => {
    const { pendingChangesSave } = this.props;

    /* Se valida si hay cambios pendientes por guardar en la fecha/hora de la actividad */
    if (pendingChangesSave) {
      message.warning('Cambios pendientes por guardar en la fecha y hora de la actividad');
      return false;
    }
    //Esta validacion aplcia para actividades creadas antes de el backend devolviera los campos date_start_zoom y date_end_zoom
    if (typeof this.props.date_start_zoom === 'undefined' || typeof this.props.date_end_zoom === 'undefined') {
      Message.error('Guarde primero la actividad antes de continuar');
      return false;
    }
    if (!Moment(this.props.date_start_zoom).isValid()) {
      Message.error('La fecha de inicio no es valida');
      return false;
    }
    if (!Moment(this.props.date_end_zoom).isValid()) {
      Message.error('La fecha de finalización no es valida');
      return false;
    }
  };

  //Eliminar trasmisión de zoom
  deleteRoom = async () => {
    const { service, meeting_id, platform } = this.state;
    const { event_id } = this.props;

    // Si es una sala de zoom se elimina de la agenda de la api zoom
    if (platform === 'zoom' || platform === 'zoomExterno') {
      const updatedData = await service.deleteZoomRoom(event_id, meeting_id);
      if (updatedData.status === 200) {
        message.success('Transmisión de Zoom eliminada!');
      }
    }

    this.restartData();
  };

  render() {
    const { hasVideoconference, /* select_host_manual, */ host_list } = this.state;
    return (
      <>
        <RoomConfig
          host_list={host_list}
          /* select_host_manual={this.context.select_host_manual}
          host_id={this.context.host_id} */
          hasVideoconference={hasVideoconference}
          handleChange={this.handleChange}
          handleClick={this.handleClickSaveConfig}
          createZoomRoom={this.createZoomRoom}
          deleteRoom={this.deleteRoom}
          saveConfig={this.saveConfig}
        />
      </>
    );
  }
}

export default RoomManager;
