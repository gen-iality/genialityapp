import * as React from 'react';

import { useState, useContext, useEffect } from 'react';
import { Redirect, useLocation, useHistory } from 'react-router-dom';

import { Tabs, Row, Col, Form, Switch, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import AgendaContext from '@/context/AgendaContext';
import Header from '@/antdComponents/Header';
import BackTop from '@/antdComponents/BackTop';
import { RouterPrompt } from '@/antdComponents/RoutePrompt';
import { DispatchMessageService } from '@/context/MessageService';

import { handleRequestError } from '@/helpers/utils';
import {
  AgendaApi,
  DocumentsApi,
} from '@/helpers/request';
import { firestore } from '@/helpers/firebase';

import Loading from '../profile/loading';
import RoomController from './roomManager/controller';
import Service from './roomManager/service';

import TipeOfActivity from './typeActivity';
import SurveyManager from './surveyManager';
import MainAgendaForm, { FormDataType } from './components/MainAgendaForm';
import usePrepareRoomInfoData from './hooks/usePrepareRoomInfoData';
import useBuildInfo from './hooks/useBuildInfo';
import useValidForm from './hooks/useValidAgendaForm';
import useDeleteActivity from './hooks/useDeleteActivity';
import EventType from './types/EventType';
import AgendaDocumentType from './types/AgendaDocumentType';
import AgendaDocumentForm from './components/AgendaDocumentForm';

import ActivityContentSelector from './activityType/ActivityContentSelector';

const { TabPane } = Tabs;
const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

interface LocationStateType {
  edit: string | null;
}

export interface AgendaEditProps {
  event: EventType;
  matchUrl: string;
}

const initialInfoState = {
  name: '',
  subtitle: '',
  bigmaker_meeting_id: null,
  datetime_start: null,
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
  selectedTicket: [],
  platform: null,
  start_url: null,
  join_url: null,
  name_host: null,
  key: '',
  requires_registration: false,
  isPublished: true,
  host_ids: [],
  length: '',
  latitude: '',
} as AgendaDocumentType;

const initialFormDataState = {
  name: '',
  // date: Moment(new Date()).format('YYYY-MM-DD')??new Date().,
  date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
  space_id: '',
  hour_end: '',
  hour_start: '',
  isPhysical: false,
  length: '',
  latitude: '',
  description: '',
  image: '',
  selectedRol: [],
  selectedHosts: [],
  selectedTickets: [],
  selectedDocuments: [],
  selectedCategories: [],
} as FormDataType;

function AgendaEdit(props: AgendaEditProps) {
  const [currentActivityID, setCurrentActivityID] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [isLoading, setIsLoading] = useState(true);
  const [showPendingChangesModal, setShowPendingChangesModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avalibleGames, setAvalibleGames] = useState<any[]>([]); // Used in Games
  const [service] = useState(new Service(firestore));

  const [loadedAgenda, setLoadedAgenda] = useState<AgendaDocumentType | null>(null);
  const [formdata, setFormData] = useState<FormDataType>(initialFormDataState);
  const [savedFormData, setSavedFormData] = useState<FormDataType>({} as FormDataType);

  /**
   * This states are used as config, I think...
   */
  const [chat, setChat] = useState<boolean>(false);
  const [surveys, setSurveys] = useState<boolean>(false);
  const [games, setGames] = useState<boolean>(false);
  const [attendees, setAttendees] = useState<boolean>(false);

  const agendaContext = useContext(AgendaContext);

  const location = useLocation<LocationStateType>();
  const history = useHistory();

  const buildInfo = useBuildInfo(formdata, loadedAgenda, initialInfoState);
  const deleteActivity = useDeleteActivity();
  const validForm = useValidForm(formdata);

  useEffect(() => {
    /**
     * This method will load data from API and will save in formdata, and info.
     *
     * It is needed save in formdata to show the info in the page.
     */
    const loading = async () => {
      // Check if the previous page passed an activity_id via route state.
      if (location.state?.edit) {
        setIsEditing(true); // We are editing
        // Update the activityEdit of agendaContext from passed activity_id
        agendaContext.setActivityEdit(location.state.edit);

        // Get the agenda document from current activity_id
        const agendaInfo: AgendaDocumentType = await AgendaApi.getOne(location.state.edit, props.event._id);
        
        // Take the vimeo_id and save in info.
        const vimeo_id = props.event.vimeo_id ? props.event.vimeo_id : '';
        setLoadedAgenda({
          ...agendaInfo,
          vimeo_id,
          space_id: agendaInfo.space_id || '',
          requires_registration: agendaInfo.requires_registration || false
        });

        // Save the activity name
        agendaContext.setActivityName(agendaInfo.name);

        // Object.keys(this.state).map((key) => (agendaInfo[key] ? this.setState({ [key]: agendaInfo[key] }) : ''));
        // Edit the current activity ID from passed activity ID via route
        setCurrentActivityID(location.state.edit);
      }

      await validateRoom();
      setIsLoading(false);
    };

    loading().then();

    // This function is running when the component will unmount
    return () => {
      agendaContext.setActivityEdit(null);
    };
  }, [props.event]);

  useEffect(() => {
    saveConfig();
  }, [attendees, games, surveys, chat, avalibleGames]);

  const validateRoom = async () => {
    const activity_id = agendaContext.activityEdit;
    const hasVideoconference = await service.validateHasVideoconference(props.event._id, activity_id);

    if (hasVideoconference) {
      const configuration = await service.getConfiguration(props.event._id, activity_id);
      setFormData((previous) => ({
        ...previous,
        platform: configuration.platform || null,
        meeting_id: configuration.meeting_id || null,
        host_id: configuration.host_id || null,
      }));

      if (loadedAgenda !== null) {
        setLoadedAgenda({
          ...loadedAgenda,
          isPublished: !!configuration.isPublished,
        });
      }

      setAvalibleGames(configuration.avalibleGames || []);
      setChat(configuration.tabs && configuration.tabs.chat ? configuration.tabs.chat : false);
      setSurveys(configuration.tabs && configuration.tabs.surveys ? configuration.tabs.surveys : false);
      setGames(configuration.tabs && configuration.tabs.games ? configuration.tabs.games : false);
      setAttendees(configuration.tabs && configuration.tabs.attendees ? configuration.tabs.attendees : false);
    }
  };

  const submit = async (changePathWithoutSaving: boolean) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se guarda la información...',
      action: 'show',
    });

    if (validForm()) {
      // Save the activity name
      agendaContext.setActivityName(formdata.name);
      try {
        const builtInfo = buildInfo();
        // setIsLoading(true);
        let agenda: AgendaDocumentType | null = null;
        if (location.state.edit || currentActivityID) {
          const data = {
            activity_id: location.state.edit || currentActivityID,
          };
          const edit = location.state.edit || currentActivityID;
          await AgendaApi.editOne(builtInfo, edit, props.event._id);

          await Promise.all(builtInfo.selected_document.map(
            (selected) => DocumentsApi.editOne(data, selected, props.event._id)
          ));
        } else {
          agenda = await AgendaApi.create(props.event._id, builtInfo);
          setLoadedAgenda(agenda);
        }
        if (changePathWithoutSaving) setShowPendingChangesModal(false);

        DispatchMessageService({ action: 'destroy', type: 'loading', key: 'loading', msj: '' });

        if (agenda?._id) {
          /** Si es un evento recien creado se envia a la misma ruta con el
           * estado edit el cual tiene el id de la actividad para poder editar
           * */
          agendaContext.setActivityEdit(agenda._id);
          setCurrentActivityID(agenda._id);
          setIsEditing(true);
          setLoadedAgenda({ ...agenda, isPublished: false });
          await saveConfig();
        } else if (changePathWithoutSaving) {
          history.push(`${props.matchUrl}`);
        }
        DispatchMessageService({ msj: 'Información guardada correctamente!', type: 'success', action: 'show' });
      } catch (e) {
        DispatchMessageService({ action: 'destroy', type: 'loading', key: 'loading', msj: '' });
        DispatchMessageService({ msj: handleRequestError(e).message, type: 'error', action: 'show' });
      }
    }
  };

  const remove = async () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras borra la información...',
      action: 'show',
    });
    if (currentActivityID && loadedAgenda) {
      confirm({
        title: '¿Está seguro de eliminar la información?',
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          deleteActivity(props.event._id, currentActivityID, loadedAgenda.name)
            .then(() => {
              setShouldRedirect(true);
              history.push(`${props.matchUrl}`);
            });
        },
      });
    }
  };

  const handleGamesSelected = async (status: string, itemId: string, listOfGames: any[]) => {
    if (status === 'newOrUpdate') {
      setAvalibleGames(listOfGames);
      // await saveConfig(); // did by useEffect (avalibleGames)
    } else {
      const newData: object[] = listOfGames.map((items) => {
        if (items.id === itemId) return { ...items, showGame: status };
        else return { ...items };
      });
      agendaContext.setAvailableGames(newData);
      setAvalibleGames(newData);
      // await saveConfig(); // did by useEffect (avalibleGames)
    }
  };

  const handleDocumentChange = (value: any) => {
    setFormData((previous) => ({ ...previous, selectedDocuments: value }));
  };

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
        break;
      case 'surveys':
        tabs.surveys = valueTab;
        agendaContext.setSurveys(valueTab);
        setSurveys(valueTab);
        break;
      case 'games':
        tabs.games = valueTab;
        agendaContext.setGames(valueTab);
        setGames(valueTab);
        break;
      case 'attendees':
        tabs.attendees = valueTab;
        agendaContext.setAttendees(valueTab);
        setAttendees(valueTab);
        break;
    }
  };

  // Método para guarda la información de la configuración
  const saveConfig = async () => {
    const { roomInfo, tabs } = usePrepareRoomInfoData(agendaContext);
    const activity_id = agendaContext.activityEdit || currentActivityID;
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

  if (!location.state || shouldRedirect) return <Redirect to={props.matchUrl} />;

  return (
    <>
      <Form onFinish={() => submit(true)} {...formLayout}>
        <RouterPrompt
          save
          form={false}
          when={showPendingChangesModal}
          title='Tienes cambios sin guardar.'
          description='¿Qué deseas hacer?'
          okText='No guardar'
          okSaveText='Guardar'
          cancelText='Cancelar'
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
          title={formdata.name ? `Actividad - ${formdata.name}` : 'Actividad'}
          saveName={location.state.edit || currentActivityID ? '' : 'Crear'}
          edit={location.state.edit || currentActivityID}
          extra={
            isEditing && (
              <Form.Item label='Publicar' labelCol={{ span: 14 }}>
                <Switch
                  checkedChildren='Sí'
                  unCheckedChildren='No'
                  checked={agendaContext.isPublished}
                  onChange={(value) => {
                    agendaContext.setIsPublished(value);
                    saveConfig();
                  }}
                />
              </Form.Item>
            )
          }
        />

        {/*
      This is hidden during loading
      */}

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Tabs activeKey={currentTab} onChange={(key) => setCurrentTab(key)}>
              <TabPane tab='Agenda' key='1'>
                {/*
          This component will handle the formdata and save the data using
          the provided methods:
          */}
                <MainAgendaForm
                  event={props.event}
                  activityId={currentActivityID}
                  formdata={formdata}
                  agenda={loadedAgenda}
                  savedFormData={savedFormData}
                  setFormData={setFormData}
                  setShowPendingChangesModal={setShowPendingChangesModal}
                  agendaContext={agendaContext}
                  matchUrl={props.matchUrl}
                />
              </TabPane>

              {/*
        If the agenda is editing, this section gets be showed:
        */}

              {isEditing && (
                <>
                  <TabPane tab='Contenido' key='2'>
                    <Row wrap gutter={12}>
                      <Col span={24}>
                        {currentActivityID && (
                        <ActivityContentSelector
                          activityId={currentActivityID}
                          activityName={formdata.name}
                          eventId={props.event._id}
                          shouldLoad={currentTab === '2'}
                        />
                        )}
                        <BackTop/>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab='Juegos' key='3'>
                    <Row justify='center' wrap gutter={12}>
                      <Col span={20}>
                        <RoomController
                          handleGamesSelected={handleGamesSelected}
                          handleTabsController={handleTabsController}
                        />
                        <BackTop />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab='Encuestas' key='4'>
                    <Row justify='center' wrap gutter={12}>
                      <Col span={20}>
                        <SurveyManager event_id={props.event._id} activity_id={currentActivityID} />
                        <BackTop />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab='Documentos' key='5'>
                    <Row justify='center' wrap gutter={12}>
                      <Col span={20}>
                        <Form.Item>
                          <AgendaDocumentForm
                            eventId={props.event._id}
                            selectedDocuments={formdata.selectedDocuments}
                            onSelectedDocuments={(changed) => handleDocumentChange(changed)}
                          />
                        </Form.Item>
                        <BackTop />
                      </Col>
                    </Row>
                  </TabPane>
                </>
              )}
            </Tabs>
          </>
        )}
      </Form>
    </>
  );
}

export default AgendaEdit;
