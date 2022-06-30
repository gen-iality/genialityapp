import * as React from 'react';
import { useState, useContext, useRef, useEffect } from 'react';
import { Redirect, withRouter, useLocation, useHistory } from 'react-router-dom';
import { Select as SelectAntd } from 'antd';

import {
  Tabs,
  Row,
  Col,
  Checkbox,
  Space,
  Typography,
  Button,
  Form,
  Input,
  Switch,
  Empty,
  Card,
  Image,
  Modal,
  TimePicker,
} from 'antd';
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import * as Moment from 'moment';

import AgendaContext from '@/context/AgendaContext';
import Header from '@/antdComponents/Header';
import BackTop from '@/antdComponents/BackTop';
import { RouterPrompt } from '@/antdComponents/RoutePrompt';
import { DispatchMessageService } from '@/context/MessageService';
import { deleteLiveStream, deleteAllVideos } from '@/adaptors/gcoreStreamingApi';
import {
  fieldsSelect,
  handleRequestError,
  handleSelect,
  sweetAlert,
  uploadImage,
} from '@/helpers/utils';
import {
  AgendaApi,
  CategoriesAgendaApi,
  DocumentsApi,
  eventTicketsApi,
  RolAttApi,
  SpacesApi,
  SpeakersApi,
} from '@/helpers/request';
import { firestore, fireRealtime } from '@/helpers/firebase';

import Loading from '../profile/loading';
import RoomController from '../agenda/roomManager/controller';
import Service from './roomManager/service';

import TipeOfActivity from './typeActivity';
import SurveyManager from './surveyManager';
import SurveyExternal from './surveyExternal';
import AgendaFormulary, { FormularyType } from './components/AgendaFormulary';
import usePrepareRoomInfoData from './hooks/usePrepareRoomInfoData';
import SelectOptionType from './types/SelectOptionType';

const { TabPane } = Tabs;
const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

// TODO: put this type in some site
interface EventType {
  _id: string,
  name: string,
  vimeo_id: string,
  dates: string[],
  date_start: string,
  date_end: string,
};

interface LocationStateType {
  edit: string | null,
};

// NOTE: this type can be used by another instances
export interface AgendaDocumentType {
  _id?: string,
  name: string,
  subtitle: string,
  bigmaker_meeting_id: any,
  datetime_start: any,
  datetime_end: any,
  space_id: any,
  image: any,
  description: string,
  registration_message: string,
  capacity: number,
  activity_categories_ids: any[],
  access_restriction_type: string,
  access_restriction_rol_ids: any[],
  has_date: boolean,
  timeConference: any,
  selected_document: any[],
  meeting_id: any,
  vimeo_id: any,
  selectedTicket: any,
  platform: any,
  start_url: any,
  join_url: any,
  name_host: any,
  key: any,
  requires_registration: boolean,
  isPublished: boolean,
  host_ids: any[] | null,
  length: string,
  latitude: string,
  date_start_zoom?: string,
  date_end_zoom?: string,
};

export interface AgendaEditProps {
  event: EventType,
  matchUrl: string,
};

const initialInfoState = {
  name: '',
  subtitle: '',
  bigmaker_meeting_id: null,
  datetime_start: null, // TODO
  datetime_end: null,
  space_id: '',
  image: '',
  description: '<p><br></p>',
  registration_message: '',
  capacity: 0,
  activity_categories_ids: [],
  access_restriction_type: 'OPEN',
  access_restriction_rol_ids: [],
  has_date: false,
  timeConference: 0,
  selected_document: [],
  meeting_id: '',
  vimeo_id: '',
  selectedTicket: null,
  platform: null,
  start_url: null,
  join_url: null,
  name_host: null,
  key: '',
  requires_registration: false,
  isPublished: true,
  host_ids: null,
  length: '',
  latitude: '',
} as AgendaDocumentType;

const initialFormularyState = {
  name: '',
  date: Moment(new Date()).format('YYYY-MM-DD'),
  hour_start: '',
  hour_end: '',
  space_id: '',
  isPhysical: false,
  length: '',
  latitude: '',
  description: '',
  image: '',
  selectedCategories: [],
  selectedRol: [],
  selectedHosts: [
    // For test
    {label: 'one one', value: 'one#2'},
    {label: 'one one one', value: 'one#3'},
  ],
  selectedTickets: [],
  selectedDocuments: [],
  isExternal: false,
  externalSurveyID: '',
  roomStatus: '',
} as FormularyType;

function AgendaEdit(props: AgendaEditProps) {
  const [currentActivityID, setCurrentActivityID] = useState('');
  const [activityEdit, setActivityEdit] = useState<null | string>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [isLoading, setIsLoading] = useState(!true);
  const [showPendingChangesModal, setShowPendingChangesModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [thisIsLoading, setThisIsLoading] = useState<{ [key: string]: boolean }>({ categories: true });;
  const [pendingChangesSave, setPendingChangesSave] = useState(false);
  const [idNewlyCreatedActivity, setIdNewlyCreatedActivity] = useState<string | null>(null);
  const [avalibleGames, setAvalibleGames] = useState<any[]>([]); // NOTE: used in Games
  const [service] = useState(new Service(firestore));
  
  /**
   * This states are loaded from API
   */
  const [allDays, setAllDays] = useState<SelectOptionType[]>([]);
  const [allSpaces, setAllSpaces] = useState<SelectOptionType[]>([// info.space_id loads this with data
    {label: 'space 1', value: 'space_1'},
    {label: 'space 2', value: 'space_2'},
    {label: 'space 3', value: 'space_3'},
  ]);
  // This state is used in the 'Documentos' tab
  const [allNameDocuments, setAllNameDocuments] = useState<SelectOptionType[]>([]);
  
  /**
   * 'Documentos' states
   */
  // const [selectedDocument, setSelectedDocument] = useState<SelectOptionType[]>([]);

  const [allRoles, setAllRoles] = useState<SelectOptionType[]>([]);
  const [allCategories, setAllCategories] = useState<SelectOptionType[]>([// info.selectedCategories modifies that
    // { label: 'sample 1: label', value: 'sample 1 - value' },
    // { label: 'sample 2: label', value: 'sample 2 - value' },
    // { label: 'sample 3: label', value: 'sample 3 - value' },
  ]);
  // This enable to handles hosts, and select them
  const [allHosts, setAllHosts] = useState<SelectOptionType[]>([
    // {label: 'one', value: 'one#1'},
    // {label: 'one one', value: 'one#2'},
    // {label: 'one one one', value: 'one#3'},
    // {label: 'one one one one', value: 'one#4'},
  ]);

  const [info, setInfo] = useState<AgendaDocumentType>(initialInfoState);
  const [formulary, setFormulary] = useState<FormularyType>(initialFormularyState);
  const [savedFormulary, setSavedFormulary] = useState<FormularyType>({} as FormularyType);

  /**
   * This states are used as config, I think...
   */
  // TODO: check the function that defines these states and clue the types
  const [chat, setChat] = useState<any>(false);
  const [surveys, setSurveys] = useState<any>(false);
  const [games, setGames] = useState<any>(false);
  const [attendees, setAttendees] = useState<any>(false);
  
  const agendaContext = useContext(AgendaContext);
  
  const location = useLocation<LocationStateType>();
  const history = useHistory();

  const nameInputRef = useRef<HTMLInputElement>(null);

  function processDateFromAgendaDocument(document: AgendaDocumentType) {
    /* console.log(document, 'entro en handleDate'); */
    const date = Moment(document.datetime_end, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
    const hour_start = Moment(document.datetime_start, 'YYYY-MM-DD HH:mm').toDate();
    const hour_end = Moment(document.datetime_end, 'YYYY-MM-DD HH:mm').toDate();
    return { date, hour_start, hour_end };
  }

  useEffect(() => {
    /**
     * This method will load data from API and will save in formulary, and info.
     * 
     * It is needed save in formulary to show the info in the page.
     */
    const loading = async () => {
      const newDays = [];

      // Take the vimeo_id and save in info.
      const vimeo_id = props.event.vimeo_id ? props.event.vimeo_id : '';
      setInfo((last) => ({ ...last, vimeo_id: vimeo_id }));
      
      // If dates exist, then iterate the specific dates array, formating specially.
      if (props.event.dates && props.event.dates.length > 0) {
        const takenDates = props.event.dates;

        // NOTE: why do we use this?
        // Date.parse(takenDates);

        const newDays = takenDates.map((dates) => {
          const formatDate = Moment(dates, ['YYYY-MM-DD']).format('YYYY-MM-DD');
          return { value: formatDate, label: formatDate };
        });
        setAllDays(newDays);
        // Si no, recibe la fecha inicio y la fecha fin y le da el formato
        // especifico a mostrar
      } else {
        const initMoment = Moment(props.event.date_start);
        const endMoment = Moment(props.event.date_end);
        const dayDiff = endMoment.diff(initMoment, 'days');
        // Se hace un for para sacar los días desde el inicio hasta el fin, inclusivos
        const newDays = [];
        for (let i = 0; i < dayDiff + 1; i++) {
          const formatDate = Moment(initMoment)
            .add(i, 'd')
            .format('YYYY-MM-DD');
          newDays.push({ value: formatDate, label: formatDate });
        }
        setAllDays(newDays);
      }


      try {
        // NOTE: The tickets are not used
        // const remoteTickets = await eventTicketsApi.getAll(props.event?._id);
        // NOTE: Here was saved tickets in state, but this state was never used.
      } catch (e) {
        console.error(e);
      }

      /**
       * Load page states
       */

      const documents = await DocumentsApi.byEvent(props.event._id);

      // Load document names
      const newNameDocuments = documents.map((document: {_id: string, title: string}) => ({
        ...document,
        value: document._id,
        label: document.title,
      }))
      setAllNameDocuments(newNameDocuments);

      // Get more data from this event
      const remoteSpaces = await SpacesApi.byEvent(props.event._id);
      const remoteHosts = await SpeakersApi.byEvent(props.event._id);
      const remoteRoles = await RolAttApi.byEvent(props.event._id);
      const remoteCategories = await CategoriesAgendaApi.byEvent(props.event._id);

      // Check if the last page passed an activity_id via route state.
      if (location.state?.edit) {
        setIsEditing(true); // We are editing
        // Update the activityEdit of agendaContext from passed activity_id
        agendaContext.setActivityEdit(location.state?.edit);

        // Get the agenda document from current activity_id
        const agendaInfo: AgendaDocumentType = await AgendaApi.getOne(location.state.edit, props.event._id);
        console.log(agendaInfo)

        setInfo((last) => ({
          ...last,
          ...agendaInfo,
          selected_document: agendaInfo.selected_document,
          start_url: agendaInfo.start_url,
          join_url: agendaInfo.join_url,
          platform: agendaInfo.platform /*  || event.event_platform */,
          info: agendaInfo,
          space_id: agendaInfo.space_id || '',
          name_host: agendaInfo.name_host,
          date_start_zoom: agendaInfo.date_start_zoom,
          date_end_zoom: agendaInfo.date_end_zoom,
          requires_registration: agendaInfo.requires_registration || false,
        }));
  
        // Object.keys(this.state).map((key) => (agendaInfo[key] ? this.setState({ [key]: agendaInfo[key] }) : ''));
        
        const processedDate = processDateFromAgendaDocument(agendaInfo);

        // Edit the current activity ID from passed activity ID via route
        setCurrentActivityID(location.state.edit);

        // Load data to formulary
        setFormulary((last) => ({
          ...last,
          name: agendaInfo.name,
          date: processedDate.date,
          hour_start: processedDate.hour_start,
          hour_end: processedDate.hour_end,
          // selectedTickets: agendaInfo.selectedTicket ? agendaInfo.selectedTicket : [],
          selectedCategories: fieldsSelect(agendaInfo.activity_categories_ids, allCategories),
          selectedHosts: fieldsSelect(agendaInfo.host_ids, allHosts),
          selectedRol: fieldsSelect(agendaInfo.access_restriction_rol_ids, allRoles),
          selectedDocuments: agendaInfo.selected_document,
        }));
      }
  
      // Finish loading this:
      setThisIsLoading({ categories: false });

      // The object structu should be like [{ label, value }] for the Select components
      setAllSpaces(handleSelect(remoteSpaces));
      setAllHosts(handleSelect(remoteHosts));
      setAllRoles(handleSelect(remoteRoles));
      setAllCategories(handleSelect(remoteCategories));

      setIsLoading(false);
      setThisIsLoading((last) => ({ ...last, categories: false }));
  
      // Focus the first field
      nameInputRef.current?.focus();
      // validateRoom();
    }

    loading().then();

    // This function is running when the component will unmount
    return () => {
      agendaContext.setActivityEdit(null);
    }
  }, []);

  // @done
  const validForm: () => boolean = () => {
    const title = [];
    if (formulary.name.length <= 0)
      title.push('El nombre es requerido');

    if (formulary.date === '' || formulary.date === 'Invalid date')
      title.push('Seleccione el día');

    if (formulary.hour_start === '' || formulary.hour_start === 'Invalid date')
      title.push('Seleccione una hora de inicio valida');

    if (formulary.hour_end === '' || formulary.hour_end === 'Invalid date')
      title.push('Seleccione una hora de finalización valida');
    
    if (title.length > 0) {
      title.map((item) => {
        DispatchMessageService({
          type: 'warning',
          msj: item,
          action: 'show',
        });
      });
    } else return true;

    return false;
  }

  // TODO: this is hook-able
  const buildInfo = () => {
    const {
      name,
      hour_start,
      hour_end,
      date,
      space_id,
      selectedCategories,
      selectedHosts,
      selectedRol,
      selectedDocuments,
      description,
      image,
      length,
      latitude,
    } = formulary;

    const {
      meeting_id,
      selectedTicket,
      vimeo_id,
      platform,
      start_url,
      join_url,
      name_host,
      key,
      requires_registration,
      isPublished,
      registration_message,
      // selected_document,
      capacity,
      access_restriction_type,
      subtitle,
      bigmaker_meeting_id,
      has_date,
    } = info;

    // const registration_message_storage = window.sessionStorage.getItem('registration_message');
    // const description_storage = window.sessionStorage.getItem('description');
    /* console.log(date, '========================== date'); */
    const datetime_start = date + ' ' + Moment(hour_start).format('HH:mm');
    const datetime_end = date + ' ' + Moment(hour_end).format('HH:mm');

    const activity_categories_ids =
      selectedCategories !== undefined && selectedCategories !== null
        ? selectedCategories[0] === undefined
          ? []
          : selectedCategories.map(({ value }) => value)
        : [];

    const access_restriction_rol_ids = access_restriction_type !== 'OPEN' ? selectedRol.map(({ value }) => value) : [];
    const host_ids = selectedHosts.length >= 0 ? [] : selectedHosts?.filter((host) => host != null).map(({ value }) => value);
    return {
      name,
      subtitle,
      bigmaker_meeting_id,
      datetime_start,
      datetime_end,
      space_id,
      image,
      description,
      registration_message,
      capacity: parseInt(capacity.toString(), 10),
      activity_categories_ids,
      access_restriction_type,
      access_restriction_rol_ids,
      has_date,
      timeConference: '',
      // selected_document,
      meeting_id: meeting_id,
      vimeo_id: vimeo_id,
      selectedTicket,
      platform,
      start_url,
      join_url,
      name_host,
      key,
      requires_registration,
      isPublished,
      host_ids,
      length,
      latitude,
      selected_document: selectedDocuments,
    } as AgendaDocumentType;
  };

  // @testable
  const submit = async (changePathWithoutSaving: boolean) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se guarda la información...',
      action: 'show',
    });
    const validation = validForm();

    if (validation) {
      try {
        const builtInfo = buildInfo();
        const selected_document = info.selected_document; // TODO: check whether selected_document should be this
        setIsLoading(true);
        let agenda: AgendaDocumentType | null = null;
        let result: AgendaDocumentType;
        if (location.state.edit || activityEdit) {
          const data = {
            activity_id: location.state.edit || idNewlyCreatedActivity,
          };
          const edit = location.state.edit || idNewlyCreatedActivity;
          result = await AgendaApi.editOne(builtInfo, edit, props.event._id);

          // Se actualizan los estados date_start_zoom y date_end_zoom para que
          // componente de administracion actualice el valor pasado por props
          //
          // this.setState({
          //   date_start_zoom: result.date_start_zoom,
          //   date_end_zoom: result.date_end_zoom,
          // });
          setInfo((last) => ({
            ...last,
            date_start_zoom: result.date_start_zoom,
            date_end_zoom: result.date_end_zoom,
          }))

          for (let i = 0; i < selected_document?.length; i++) {
            await DocumentsApi.editOne(data, selected_document[i], props.event._id);
          }
        } else {
          agenda = await AgendaApi.create(props.event._id, builtInfo);

          // Al crear una actividad de la agenda se inicializa el id de la
          // actividad y las fechas de inicio y finalizacion como requisito
          // del componente de administrador de salas
          setInfo((last) => ({
            ...last,
            activity_id: (agenda as AgendaDocumentType)._id,
            date_start_zoom: (agenda as AgendaDocumentType).date_start_zoom,
            date_end_zoom: (agenda as AgendaDocumentType).date_end_zoom,
          }));
        }
        if (changePathWithoutSaving) setShowPendingChangesModal(false)

        // Se cambia el estado a pendingChangesSave encargado de detectar
        // cambios pendientes en la fecha/hora sin guardar
        setPendingChangesSave(false);

        DispatchMessageService({
          type: 'loading', // Added by types
          msj: '', // Added by types
          key: 'loading',
          action: 'destroy',
        });

        if (agenda?._id) {
          /** Si es un evento recien creado se envia a la misma ruta con el
           * estado edit el cual tiene el id de la actividad para poder editar
           * */
          agendaContext.setActivityEdit(agenda._id);
          setIdNewlyCreatedActivity(agenda._id);
          setActivityEdit(true as unknown as string); // TODO: check the right type
          setShouldRedirect(true); // reloadActivity: true,
          setInfo((last) => ({
            ...last,
            isPublished: false,
          }));
          await saveConfig();
        } else {
          if (changePathWithoutSaving) history.push(`/eventadmin/${props.event._id}/agenda`);
        }
        DispatchMessageService({
          type: 'success',
          msj: 'Información guardada correctamente!',
          action: 'show',
        });
      } catch (e) {
        DispatchMessageService({
          msj: '',
          type: 'loading',
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: handleRequestError(e).message,
          action: 'show',
        });
      }
    }
  }

  // @done
  const remove = async () => {
    // let self = this;
    const { removeAllRequest } = agendaContext;
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras borra la información...',
      action: 'show',
    });
    if (currentActivityID) {
      confirm({
        title: '¿Está seguro de eliminar la información?',
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              const refActivity = `request/${props.event._id}/activities/${currentActivityID}`;
              const refActivityViewers = `viewers/${props.event._id}/activities/${currentActivityID}`;
              const configuration = await service.getConfiguration(props.event._id, currentActivityID);
              if (configuration && configuration.typeActivity === 'eviusMeet') {
                await deleteAllVideos(info.name, configuration.meeting_id),
                  await deleteLiveStream(configuration.meeting_id);
              }
              await fireRealtime.ref(refActivity).remove();
              await fireRealtime.ref(refActivityViewers).remove();
              await service.deleteActivity(props.event._id, currentActivityID);
              await AgendaApi.deleteOne(currentActivityID, props.event._id);
              DispatchMessageService({
                type: 'loading', // Added by types
                msj: '', // Added by types
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
              setShouldRedirect(true);
              history.push(`${props.matchUrl}`);
            } catch (e) {
              DispatchMessageService({
                type: 'loading', // Added by types
                msj: '', // Added by types
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'error',
                msj: handleRequestError(e).message,
                action: 'show',
              });
            }
          };
          onHandlerRemove();
        },
      });
    }
  };

  // @done
  const handleGamesSelected = async (status: string, itemId: string, listOfGames: any[]) => {
    if (status === 'newOrUpdate') {
      setAvalibleGames(listOfGames);
      await saveConfig();
    } else {
      const newData: object[] = listOfGames.map((items) => {
        if (items.id === itemId) {
          return { ...items, showGame: status };
        } else {
          return { ...items };
        }
      });
      agendaContext.setAvailableGames(newData);
      setAvalibleGames(newData);
      await saveConfig();
    }
  };

  // @done
  const handleDocumentChange = (value: any) => {
    setFormulary((last) => ({ ...last, selectedDocuments: value }));
  }

  // @done
  // Encargado de gestionar los tabs de la video conferencia
  const handleTabsController = (e: any, tab: string) => {
    const valueTab = e;
    const { chat, surveys, games, attendees } = agendaContext;
    const tabs = { chat, surveys, games, attendees };

    switch (tab) {
      case 'chat':
        tabs.chat = valueTab;
        agendaContext.setChat(valueTab);
        setChat(valueTab);
        saveConfig();
        break;
      case 'surveys':
        tabs.surveys = valueTab;
        agendaContext.setSurveys(valueTab);
        setSurveys(valueTab);
        saveConfig();
        break;
      case 'games':
        tabs.games = valueTab;
        agendaContext.setGames(valueTab);
        setGames(valueTab);
        saveConfig();
        break;
      case 'attendees':
        tabs.attendees = valueTab;
        agendaContext.setAttendees(valueTab);
        setAttendees(valueTab);
        saveConfig();
        break;
    }
  };

  // @testable
  // Método para guarda la información de la configuración
  const saveConfig = async () => {
    const { roomInfo, tabs } = usePrepareRoomInfoData(agendaContext);
    const activity_id = agendaContext.activityEdit || idNewlyCreatedActivity;
    try {
      const result = await service.createOrUpdateActivity(props.event._id, activity_id, roomInfo, tabs);
      if (result) {
        DispatchMessageService({ msj: result.message, type: 'success', action: 'show' });
      }
      return result;
    } catch (err) {
      DispatchMessageService({ msj: 'Error en la configuración!', type: 'error', action: 'show' });
    }
  };

  // @testable
  const handlerCreateCategories = async (value: any, name: string) => {
    alert(`${value}: ${name}`);
    // Last handleCreate method
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras guarda la información...',
      action: 'show',
    });

    try {
      // Show as loading...
      setThisIsLoading((last) => ({ ...last, [name]: true }));

      const item = name === 'categories' && (await CategoriesAgendaApi.create(
          props.event._id, { name: value },
        )
      );
      const newOption = {
        label: value,
        value: item._id,
        item,
      };

      // Stop showing as loading.
      setThisIsLoading((last) => ({ ...last, [name]: false }));

      // Update categories list
      setAllCategories((last) => ([...last, newOption]));
      setFormulary((last) => ({
        ...last,
        selectedCategories: [...last.selectedCategories, newOption],
      }));

      // Show this messages
      DispatchMessageService({ type: 'loading', msj: '', key: 'loading', action: 'destroy' });
      DispatchMessageService({ type: 'success', msj: 'Información guardada correctamente!', action: 'show' });
    } catch (e) {
      // Stop showing as loading and hide the messages
      setThisIsLoading((last) => ({ ...last, [name]: false }));
      DispatchMessageService({ type: 'loading', msj: '', key: 'loading', action: 'destroy' });
      DispatchMessageService({ msj: handleRequestError(e).message, type: 'error', action: 'show' });
    }
  };

  if (!location.state || shouldRedirect) return <Redirect to={props.matchUrl} />;

  return (
    <>
    <Form onFinish={() => submit(true)} {...formLayout}>
      <RouterPrompt
        save
        form={false}
        when={showPendingChangesModal}
        title="Tienes cambios sin guardar."
        description="¿Qué deseas hacer?"
        okText="No guardar"
        okSaveText="Guardar"
        cancelText="Cancelar"
        onOK={() => true}
        onOKSave={submit}
        onCancel={() => false}
      />

      <Header
        back
        save
        form
        saveNameIcon
        remove={remove}
        customBack={props.matchUrl}
        title={`Actividad - ${formulary.name}`}
        saveName={location.state.edit || activityEdit ? '' : 'Crear'}
        edit={location.state.edit || activityEdit}
        extra={
          isEditing &&
          <Form.Item label="Publicar" labelCol={{ span: 14 }}>
            <Switch
              checkedChildren="Sí"
              unCheckedChildren="No"
              // name="isPublished"
              checked={agendaContext.isPublished}
              onChange={(value) => {
                agendaContext.setIsPublished(value);
                saveConfig();
                // this.setState({ isPublished: value }, async () => await this.saveConfig());
              }}
            />
          </Form.Item>
        }
      />

      {/*
      This is hidden during loading
      */}

      {isLoading ? <Loading /> :
      <>
      <Tabs activeKey={currentTab} onChange={(key) => setCurrentTab(key)}>
        <TabPane tab="Agenda" key="1">
          {/*
          This component will handle the formulary and save the data using
          the provided methods:
          */}
          <AgendaFormulary
            formulary={formulary}
            savedFormulary={savedFormulary}
            setFormulary={setFormulary}
            setPendingChangesSave={setPendingChangesSave}
            setShowPendingChangesModal={setShowPendingChangesModal}
            agendaContext={agendaContext}
            matchUrl={props.matchUrl}
            allDays={allDays}
            allHosts={allHosts}
            allSpaces={allSpaces}
            allCategories={allCategories}
            thisIsLoading={thisIsLoading}
            handlerCreateCategories={handlerCreateCategories}
          />
        </TabPane>

        {/*
        If the agenda is editing, this section gets be showed:
        */}

        {isEditing &&
        <>
        <TabPane tab="Tipo de actividad" key="2">
          <Row /* justify="center" */ wrap gutter={12}>
            <Col span={24}>
              <TipeOfActivity
                eventId={props.event._id}
                activityId={currentActivityID}
                activityName={formulary.name}
                tab={currentTab}
              />
              <BackTop />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Juegos" key="3">
          <Row justify="center" wrap gutter={12}>
            <Col span={20}>
              <RoomController
                handleGamesSelected={handleGamesSelected}
                handleTabsController={handleTabsController}
              />
              <BackTop />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Encuestas" key="4">
          <Row justify="center" wrap gutter={12}>
            <Col span={20}>
              <SurveyManager event_id={props.event._id} activity_id={currentActivityID} />
              {formulary.isExternal &&
              <SurveyExternal
                isExternal={formulary.isExternal}
                meeting_id={formulary.externalSurveyID}
                event_id={props.event._id}
                activity_id={currentActivityID}
                roomStatus={formulary.roomStatus}
              />
              }
              <BackTop />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Documentos" key="5">
          <Row justify="center" wrap gutter={12}>
            <Col span={20}>
              <Form.Item>
                <SelectAntd
                  showArrow
                  id="nameDocuments"
                  mode="multiple"
                  options={allNameDocuments}
                  onChange={(value) => handleDocumentChange(value)}
                  defaultValue={formulary.selectedDocuments}
                />
              </Form.Item>
              <BackTop />
            </Col>
          </Row>
        </TabPane>
        </>
        }
      </Tabs>
      </>
      }
    </Form>
    </>
  );
}

export default AgendaEdit;