import * as React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
import { Redirect, withRouter, Link, useLocation, useHistory } from 'react-router-dom';
import Select from 'react-select';
import Creatable from 'react-select';
import EviusReactQuill from '../shared/eviusReactQuill';
import BackTop from '../../antdComponents/BackTop';
import TipeOfActivity from './typeActivity';
import SurveyManager from './surveyManager';
import SurveyExternal from './surveyExternal';
import RoomController from '../agenda/roomManager/controller';
import ImageUploaderDragAndDrop from '../imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { DispatchMessageService } from '../../context/MessageService';
import { Select as SelectAntd } from 'antd';
import * as Moment from 'moment';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
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

const { TabPane } = Tabs;
const { confirm } = Modal;
const { Text } = Typography;
const { Option } = SelectAntd;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const creatableStyles = {
  menu: (styles: object) => ({ ...styles, maxHeight: 'inherit' }),
};

// Some select styles
const catStyles = {
  menu: (styles: object) => ({ ...styles, maxHeight: 'inherit' }),
  multiValue: (styles: object, param: ParamType) => ({ ...styles, ...dot(param.data.item.color) }),
};

interface ParamType {
  data: {
    item: {
      color: any
    }
  }
};

// TODO: put this type in some site
interface EventType {
  _id: string,
  name: string,
};

interface LocationStateType {
  edit: string | null,
};

interface SelectOptionType {
  label: string,
  value: any,
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

export interface FormularyType {
  name: string,
  date: any,
  hour_start: string | Moment.Moment,
  hour_end: string | Moment.Moment,
  selectedHosts: any[],
  space_id: string,
  selectedCategories: any[],
  isPhysical: boolean,
  length: string,
  latitude: string,
  description: string,
  image: string,
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

// TODO: hook-able
const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',
  ':before': {
    backgroundColor: color,
    content: '" "',
    display: 'block',
    margin: 8,
    height: 10,
    width: 10,
  },
});

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
  
  const location = useLocation<LocationStateType>();
  const history = useHistory();

  const nameInputRef = useRef(null);

  const agendaContext = useContext(AgendaContext);

  const submit = (changePathWithoutSaving: boolean) => {}
  const remove = () => {}

  /**
   * This method edit the state info, that has various attributes.
   * 
   * You have to pass the name of this attribute to edit, and the value. This
   * method overwrite the attribute asked only.
   * 
   * @param name The key name.
   * @param value The value.
   */
  const handleChangeFormulary = (name: keyof FormularyType, value: any) => {
    setFormulary((last) => {
      const newFormulary: FormularyType = { ...last };
      newFormulary[name] = value as never; // ignore it
      return newFormulary;
    });
    setPendingChangesSave(true);
    // TODO: valid field
  }

  const handleChangeReactQuill = (value: string, target: string) => {
    if (target === 'description') {
      setFormulary((last) => (
        { ...last, description: value}
      ))
    } else if (target === 'registration_message') {
      setFormulary((last) => (
        { ...last, registration_message: value}
      ))
    }
  };

  // TODO: this method is hook-able. Or not, just the beginning!!
  const startOrEndHourWithAdditionalMinutes = (minutes: number, isStart: boolean) => {
    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() + minutes);

    if (isStart) {
      setFormulary((last) => (
        { ...last, hour_start: Moment(fecha, 'HH:mm:ss') }
      ));
    } else {
      setFormulary((last) => (
        { ...last, hour_end: Moment(fecha, 'HH:mm:ss') }
      ));
    }

    return Moment(fecha, 'HH:mm:ss');
  };

  const goSection = (path: string, state?: any) => {
    history.push(path, state);
  };

  const handleImageChange = (files: any) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras carga la imagen...',
      action: 'show',
    });
    setFormulary((last) => (
      { ...last, image: files }
    ));
  }
  const handleGamesSelected = () => {}
  const handleTabsController = () => {}

  // TODO: copy from edit.jsx
  const handleCreate = async (value: any, name: string) => {};
  
  const onSelectedCategoryChange = () => {}

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

      {isLoading ? <Loading /> : (
        <Tabs activeKey={currentTab} onChange={(key) => setCurrentTab(key)}>
          <TabPane tab='Agenda' key='1'>
            <Row justify='center' wrap gutter={12}>
              <Col span={20}>
                <Form.Item
                  label={
                    <label style={{ marginTop: '2%' }}>
                      Nombre <label style={{ color: 'red' }}>*</label>
                    </label>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Nombre de la actividad requerida',
                    },
                  ]}>
                  <Input
                    autoFocus
                    ref={nameInputRef}
                    type='text'
                    name={'name'}
                    value={formulary.name}
                    onChange={(value) => handleChangeFormulary('name', value.target.value)}
                    placeholder={'Nombre de la actividad'}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <label style={{ marginTop: '2%' }}>
                      Día <label style={{ color: 'red' }}>*</label>
                    </label>
                  }
                  rules={[{ required: true, message: 'La fecha es requerida' }]}>
                  <SelectAntd
                    options={days}
                    value={formulary.date}
                    defaultValue={formulary.date}
                    onChange={(value) => handleChangeFormulary('date', value)}
                  />
                </Form.Item>
                <Row wrap justify='center' gutter={[8, 8]}>
                  <Col span={12}>
                    <Form.Item
                      style={{ width: '100%' }}
                      label={
                        <label style={{ marginTop: '2%' }}>
                          Hora Inicio <label style={{ color: 'red' }}>*</label>
                        </label>
                      }
                      rules={[
                        {
                          required: true,
                          message: 'La hora de inicio es requerida',
                        },
                      ]}>
                      <TimePicker
                        use12Hours
                        format='h:mm a'
                        allowClear={false}
                        style={{ width: '100%' }}
                        value={
                          formulary.hour_start !== ''
                          ? Moment(formulary.hour_start)
                          : startOrEndHourWithAdditionalMinutes(1, true)
                        }
                        onChange={(value) => handleChangeFormulary('hour_start', value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      style={{ width: '100%' }}
                      label={
                        <label style={{ marginTop: '2%' }}>
                          Hora Fin <label style={{ color: 'red' }}>*</label>
                        </label>
                      }
                      rules={[
                        {
                          required: true,
                          message: 'La hora final es requerida',
                        },
                      ]}>
                      <TimePicker
                        use12Hours
                        style={{ width: '100%' }}
                        allowClear={false}
                        value={
                          formulary.hour_end !== ''
                          ? Moment(formulary.hour_end)
                          : startOrEndHourWithAdditionalMinutes(5, false)
                        }
                        format='h:mm a'
                        onChange={(value) => handleChangeFormulary('hour_end', value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label={'Conferencista'}>
                  <Row wrap gutter={[8, 8]}>
                    <Col span={23}>
                      <Select
                        isMulti
                        id={'hosts'}
                        isClearable
                        styles={creatableStyles}
                        onChange={setSelectedHosts}
                        options={allHosts}
                        value={selectedHosts}
                      />
                    </Col>
                    <Col span={1}>
                      <Button
                        onClick={() => goSection(props.matchUrl.replace('agenda', 'speakers'), { child: true })}
                        icon={<SettingOutlined />}
                      />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item label={'Espacio'}>
                  <Row wrap gutter={[8, 8]}>
                    <Col span={23}>
                      <SelectAntd
                        value={formulary.space_id}
                        onChange={(value) => handleChangeFormulary('space_id', value)}>
                        <Option value="">Seleccione un lugar/salón ...</Option>
                        {spaces.map((space) => (
                          <Option key={space.value} value={space.value}>
                            {space.label}
                          </Option>
                        ))}
                      </SelectAntd>
                    </Col>
                    <Col span={1}>
                      <Link to={props.matchUrl.replace('agenda', 'espacios')}>
                        <Button icon={<SettingOutlined />} />
                      </Link>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item label={'Categorías'}>
                  <Row wrap gutter={[8, 8]}>
                    <Col span={23}>
                      <Creatable
                        isClearable
                        isMulti
                        styles={catStyles}
                        onChange={onSelectedCategoryChange}
                        // TODO: this should edit the object state of thisIsLoading, and
                        // the onCreateOption must be implemented
                        onCreateOption={(value) => handleCreate(value, 'categories')}
                        isDisabled={!thisIsLoading.categories}
                        isLoading={!thisIsLoading.categories}
                        options={allCategories}
                        placeholder={'Sin categoría....'}
                        value={formulary.selectedCategories}
                      />
                    </Col>
                    <Col span={1}>
                      <Button onClick={() => goSection(`${props.matchUrl}/categorias`)} icon={<SettingOutlined />} />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item label={'¿Tiene espacio físico?'}>
                  <Switch
                    checked={formulary.isPhysical}
                    checkedChildren='Si'
                    unCheckedChildren='No'
                    onChange={(yon) => handleChangeFormulary('isPhysical', yon)}
                  />
                </Form.Item>
                {formulary.isPhysical && (
                  <>
                    <Form.Item label={'Longitud'}>
                      <Input
                        // ref={formulary.longitud}
                        autoFocus
                        type='number'
                        name={'length'}
                        value={formulary.length}
                        onChange={(event) => handleChangeFormulary('length', event.target.value)}
                        placeholder={'Ej. 4.677027'}
                      />
                    </Form.Item>
                    <Form.Item label={'Latitud'}>
                      <Input
                        // Here was a ref called 'this.latitude'
                        autoFocus
                        type='number'
                        name={'latitude'}
                        value={formulary.latitude}
                        onChange={(event) => handleChangeFormulary('latitude', event.target.value)}
                        placeholder={'Ej. -74.094086'}
                      />
                    </Form.Item>
                  </>
                )}
                <Form.Item label={'Descripción'}>
                  <Space>
                    <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                    <Text type='secondary'>
                      Esta información no es visible en la Agenda/Actividad en versión Mobile.
                    </Text>
                  </Space>
                  <EviusReactQuill
                    name='description'
                    data={formulary.description}
                    handleChange={(value: string) => handleChangeReactQuill(value, 'description')}
                  />
                </Form.Item>
                <Form.Item label={'Imagen'}>
                  <Card style={{ textAlign: 'center', borderRadius: '20px' }}>
                    <Form.Item noStyle>
                      <p>
                        Dimensiones:{' '}
                        <b>
                          <small>600px X 400px, 400px X 600px, 200px X 200px, 400px X 400px ...</small>
                        </b>{' '}
                      </p>
                      <p>
                        <small>
                          Se recomienda que la imagen debe tener dimensiones iguales (cuadradas) para su mejor
                          funcionamiento
                        </small>
                      </p>
                      <p>
                        <small>La imagen tarda unos segundos en cargar</small>
                      </p>
                      <ImageUploaderDragAndDrop
                        imageDataCallBack={handleImageChange}
                        imageUrl={formulary.image}
                        width='1080'
                        height='1080'
                      />
                    </Form.Item>
                  </Card>
                </Form.Item>
                <BackTop />
              </Col>
            </Row>
          </TabPane>
          {isEditing && (
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
          )}
        </Tabs>
      )}
    </Form>
    </>
  );
}

export default AgendaEdit;