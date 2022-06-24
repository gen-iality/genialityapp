import * as React from 'react';
import { useState, useContext, useRef, useEffect } from 'react';
import { Redirect, withRouter, useLocation } from 'react-router-dom';
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

import * as Moment from 'moment';

import AgendaContext from '@/context/AgendaContext';
import Header from '@/antdComponents/Header';
import BackTop from '@/antdComponents/BackTop';
import { RouterPrompt } from '@/antdComponents/RoutePrompt';
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
  name: string,
  subtitle: string,
  bigmaker_meeting_id: any,
  datetime_start: any,
  datetime_end: null,
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
  selectedHosts: [],
  space_id: '',
  selectedCategories: [],
  isPhysical: false,
  length: '',
  latitude: '',
  description: '',
  image: '',
} as FormularyType;


function AgendaEdit(props: AgendaEditProps) {
  const [activity_id, setActivity_id] = useState('');
  const [activityEdit, setActivityEdit] = useState<null | string>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [isLoading, setIsLoading] = useState(!true);
  const [showPendingChangesModal, setShowPendingChangesModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [thisIsLoading, setThisIsLoading] = useState({ categories: true });;
  const [pendingChangesSave, setPendingChangesSave] = useState(false);
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
  const [nameDocuments, setNameDocuments] = useState<SelectOptionType[]>([]);
  
  /**
   * 'Encuestas' states
   */
  const [isExternal, setIsExternal] = useState(false);
  const [externalSurveyID, setExternalSurveyID] = useState('');
  const [roomStatus, setRoomStatus] = useState('');

  /**
   * 'Documentos' states
   */
  const [selectedDocument, setSelectedDocument] = useState<SelectOptionType[]>([]);

  const [allRoles, setAllRoles] = useState<SelectOptionType[]>([]);
  const [allCategories, setAllCategories] = useState<SelectOptionType[]>([// info.selectedCategories modifies that
    { label: 'sample 1: label', value: 'sample 1 - value' },
    { label: 'sample 2: label', value: 'sample 2 - value' },
    { label: 'sample 3: label', value: 'sample 3 - value' },
  ]);
  // This enable to handles hosts, and select them
  const [allHosts, setAllHosts] = useState<SelectOptionType[]>([
    {label: 'one', value: 'one#1'},
    {label: 'one one', value: 'one#2'},
    {label: 'one one one', value: 'one#3'},
    {label: 'one one one one', value: 'one#4'},
  ]);
  const [selectedHosts, setSelectedHosts] = useState<SelectOptionType[]>([
    {label: 'one one', value: 'one#2'},
    {label: 'one one one', value: 'one#3'},
  ]);

  // Aux states
  const [selectedRol, setSelectedRol] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);

  const [info, setInfo] = useState<AgendaDocumentType>(initialInfoState);
  const [formulary, setFormulary] = useState<FormularyType>(initialFormularyState);
  const [savedFormulary, setSavedFormulary] = useState<FormularyType>({} as FormularyType);
  
  const agendaContext = useContext(AgendaContext);
  
  const location = useLocation<LocationStateType>();

  const nameInputRef = useRef<HTMLInputElement>(null);

  function processDateFromAgendaDocument(document: AgendaDocumentType) {
    /* console.log(document, 'entro en handleDate'); */
    let date, hour_start, hour_end;
    hour_start = Moment(document.datetime_start, 'YYYY-MM-DD HH:mm').toDate();
    hour_end = Moment(document.datetime_end, 'YYYY-MM-DD HH:mm').toDate();
    date = Moment(document.datetime_end, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
    return { date, hour_start, hour_end };
  }

  useEffect(() => {
    const loading = async () => {
      const newDays = [];
      let vimeo_id = '';

      try {
        // NOTE: The tickets are not used
        // const remoteTickets = await eventTicketsApi.getAll(props.event?._id);

        vimeo_id = props.event.vimeo_id ? props.event.vimeo_id : '';
        setInfo((last) => (
          { ...last, vimeo_id: vimeo_id,}
        ));

        // Si existe dates, itera sobre el array de fechas especificas, dandole el formato especifico
        if (props.event.dates && props.event.dates.length > 0) {
          const takenDates = props.event.dates;

          // NOTE: why do we use this?
          // Date.parse(takenDates);

          for (let i = 0; i < takenDates.length; i++) {
            const formatDate = Moment(takenDates[i], ['YYYY-MM-DD']).format('YYYY-MM-DD');
            /* if (Date.parse(formatDate) >= Date.parse(Moment(new Date()).format('YYYY-MM-DD'))) {
              newDays.push({ value: formatDate, label: formatDate });
            } */
            newDays.push({ value: formatDate, label: formatDate });
          }
          setAllDays(newDays);
          // Si no, recibe la fecha inicio y la fecha fin y le da el formato
          // especifico a mostrar
        } else {
          const init = Moment(props.event.date_start);
          const end = Moment(props.event.date_end);
          const diff = end.diff(init, 'days');
          // Se hace un for para sacar los días desde el inicio hasta el fin, inclusivos
          for (let i = 0; i < diff + 1; i++) {
            const formatDate = Moment(init)
              .add(i, 'd')
              .format('YYYY-MM-DD');
            newDays.push({ value: formatDate, label: formatDate });
          }
          setAllDays(newDays);
        }
      } catch (e) {
        console.error(e);
      }

      // Load page states
      let documents = await DocumentsApi.byEvent(props.event._id);

      // Load document names
      const newNameDocuments = documents.map((document: {_id: string, title: string}) => ({
        ...document,
        value: document._id,
        label: document.title,
      }))
      setNameDocuments(newNameDocuments);

      let remoteSpaces = await SpacesApi.byEvent(props.event._id);
      let remoteHosts = await SpeakersApi.byEvent(props.event._id);
      let remoteRoles = await RolAttApi.byEvent(props.event._id);
      let remoteCategories = await CategoriesAgendaApi.byEvent(props.event._id);

      if (location.state?.edit) {
        setIsEditing(true);
        agendaContext.setActivityEdit(location.state?.edit);
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

        setActivity_id(location.state.edit);
        setFormulary((last) => ({
          ...last,
          name: agendaInfo.name,
          date: processedDate.date,
          hour_start: processedDate.hour_start,
          hour_end: processedDate.hour_end,
          // selectedTickets: agendaInfo.selectedTicket ? agendaInfo.selectedTicket : [],
          selectedCategories: fieldsSelect(agendaInfo.activity_categories_ids, allCategories),
        }));
        setSelectedHosts(fieldsSelect(agendaInfo.host_ids, allHosts))
        setSelectedRol(fieldsSelect(agendaInfo.access_restriction_rol_ids, allRoles));
      } else {
        setAllDays(newDays);
      }
  
      setThisIsLoading({ categories: false });
      setAllDays(newDays);
      // La información se neceista de tipo [{ label, value }] para los select
      setAllSpaces(handleSelect(remoteSpaces));
      setAllHosts(handleSelect(remoteHosts));
      setAllRoles(handleSelect(remoteRoles));
      setAllCategories(handleSelect(remoteCategories));

      setIsLoading(false);
  
      nameInputRef.current?.focus();
      // validateRoom();
    }

    loading().then();
  }, []);

  const submit = (changePathWithoutSaving: boolean) => {}
  const remove = () => {}

  const handleGamesSelected = () => {}
  const handleTabsController = () => {}

  if (!location.state || shouldRedirect) return <Redirect to={props.matchUrl} />;

  return (
    <>
    <Form onFinish={() => submit(true)} {...formLayout}>
      <RouterPrompt
        when={showPendingChangesModal}
        title='Tienes cambios sin guardar.'
        description='¿Qué deseas hacer?'
        okText='No guardar'
        okSaveText='Guardar'
        cancelText='Cancelar'
        onOK={() => true}
        onOKSave={submit}
        onCancel={() => false}
        form={false}
        save
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
          isEditing && (
            <Form.Item label={'Publicar'} labelCol={{ span: 14 }}>
              <Switch
                checkedChildren='Sí'
                unCheckedChildren='No'
                // name={'isPublished'}
                checked={agendaContext.isPublished}
                onChange={(value) => {
                  agendaContext.setIsPublished(value);
                  // this.setState({ isPublished: value }, async () => await this.saveConfig());
                }}
              />
            </Form.Item>
          )
        }
      />

      {isLoading ? <Loading /> :
      <>
      <Tabs activeKey={currentTab} onChange={(key) => setCurrentTab(key)}>
        <TabPane tab='Agenda' key='1'>
          <AgendaFormulary
            formulary={formulary}
            savedFormulary={savedFormulary}
            setFormulary={setFormulary}
            setPendingChangesSave={setPendingChangesSave}
            setShowPendingChangesModal={setShowPendingChangesModal}
            agendaContext={agendaContext}
            matchUrl={props.matchUrl}
            allDays={allDays}
            selectedHosts={selectedHosts}
            setSelectedHosts={setSelectedHosts}
            allHosts={allHosts}
            allSpaces={allSpaces}
            allCategories={allCategories}
            thisIsLoading={thisIsLoading}
          />
        </TabPane>
        {isEditing &&
        <>
        <TabPane tab='Tipo de actividad' key='2'>
          <Row /* justify='center' */ wrap gutter={12}>
            <Col span={24}>
              <TipeOfActivity
                eventId={props.event._id}
                activityId={activity_id}
                activityName={formulary.name}
                tab={currentTab}
              />
              <BackTop />
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
              <SurveyManager event_id={props.event._id} activity_id={activity_id} />
              {isExternal && (
                <SurveyExternal
                  isExternal={isExternal}
                  meeting_id={externalSurveyID}
                  event_id={props.event._id}
                  activity_id={activity_id}
                  roomStatus={roomStatus}
                />
              )}
              <BackTop />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab='Documentos' key='5'>
          <Row justify='center' wrap gutter={12}>
            <Col span={20}>
              <Form.Item>
                <SelectAntd
                  id={'nameDocuments'}
                  showArrow
                  mode='multiple'
                  onChange={(value) => setSelectedDocument(value)}
                  options={nameDocuments}
                  // defaultValue={selectedDocument}
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