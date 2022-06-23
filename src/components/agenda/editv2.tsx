import * as React from 'react';
import { useState, useContext, useRef } from 'react';
import { Redirect, withRouter, useLocation } from 'react-router-dom';
import BackTop from '../../antdComponents/BackTop';
import TipeOfActivity from './typeActivity';
import SurveyManager from './surveyManager';
import SurveyExternal from './surveyExternal';
import RoomController from '../agenda/roomManager/controller';
import Service from './roomManager/service';
import { firestore, fireRealtime } from '../../helpers/firebase';
import { Select as SelectAntd } from 'antd';
import * as Moment from 'moment';

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
import Loading from '../profile/loading';
import Header from '../../antdComponents/Header';
import AgendaContext from '../../context/AgendaContext';
import { RouterPrompt } from '../../antdComponents/RoutePrompt';
import SelectOptionType from './types/SelectOptionType';

import AgendaFormulary, { FormularyType } from './components/AgendaFormulary';

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
  const [days, setDays] = useState<SelectOptionType[]>([]);
  const [hosts, setHosts] = useState<SelectOptionType[]>([]);
  const [spaces, setSpaces] = useState<SelectOptionType[]>([// info.space_id loads this with data
    {label: 'space 1', value: 'space_1'},
    {label: 'space 2', value: 'space_2'},
    {label: 'space 3', value: 'space_3'},
  ]);
  const [categories, setCategories] = useState<SelectOptionType[]>([]);
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

  const [roles, setRoles] = useState([]);
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

  const [info, setInfo] = useState<AgendaDocumentType>(initialInfoState);
  const [formulary, setFormulary] = useState<FormularyType>(initialFormularyState);
  const [savedFormulary, setSavedFormulary] = useState<FormularyType>({} as FormularyType);
  
  const agendaContext = useContext(AgendaContext);
  
  const location = useLocation<LocationStateType>();

  const nameInputRef = useRef(null);

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
            days={days}
            selectedHosts={selectedHosts}
            setSelectedHosts={setSelectedHosts}
            allHosts={allHosts}
            spaces={spaces}
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