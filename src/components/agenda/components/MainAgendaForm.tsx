import dayjs, { Dayjs } from 'dayjs';
import { SetStateAction, Dispatch } from 'react';
import { useEffect, useRef, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Row, Col, Space, Typography, Button, Form, Input, InputRef, Switch, Card, TimePicker, Modal } from 'antd';
import { Select as SelectAntd } from 'antd';
import { ExclamationCircleOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';

import { CategoriesAgendaApi, SpeakersApi } from '@/helpers/request';
import { fieldsSelect, handleRequestError, handleSelect } from '@/helpers/utils';

import Select from 'react-select';
import Creatable from 'react-select';

import { DispatchMessageService } from '../../../context/MessageService';
import useCreatableStyles from '../hooks/useCreatableStyles';
import useValideChangesInFormData from '../hooks/useValideChangesInFormData';
import useProcessDateFromAgendaDocument from '../hooks/useProcessDateFromAgendaDocument';
import ImageUploaderDragAndDrop from '../../imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import EviusReactQuill from '../../shared/eviusReactQuill';
import BackTop from '../../../antdComponents/BackTop';
import Loading from '../../profile/loading';
import RequiredStar from './RequiredStar';

import SelectOptionType from '../types/SelectOptionType';
import EventType from '../types/EventType';
import AgendaType from '@Utilities/types/AgendaType';

import ActivityTypeSelector from '../activityType/ActivityTypeSelector';

import Speaker from '../../speakers/speaker';
import useLoadExtraAgendaData from '../hooks/useLoadExtraAgendaData';
import useHourWithAdditionalMinutes from '../hooks/useHourWithAdditionalMinutes';

const { Text } = Typography;
const { Option } = SelectAntd;

const creatableStyles = { menu: (styles: object) => ({ ...styles, maxHeight: 'inherit' }) };

export interface FormDataType {
  name: string;
  date: string;
  description: string;
  space_id: string;
  image: string;
  hour_start: Dayjs | string;
  hour_end: Dayjs | string;
  isPhysical: boolean;
  length: string;
  latitude: string;
  selectedCategories: SelectOptionType[];
  selectedHosts: SelectOptionType[];
  selectedRol: SelectOptionType[];
  selectedTickets: SelectOptionType[];
  selectedDocuments: SelectOptionType[];
}

// NOTE: mmm... what's happen with selectedRol and allRoles? where are they used and how?

export interface MainAgendaFormProps {
  agendaContext: any;
  matchUrl: string;
  event: EventType;
  activityId: string | null;
  formdata: FormDataType;
  savedFormData: FormDataType;
  agenda: AgendaType | null;
  setFormData: (x: FormDataType) => void;
  previousFormData: FormDataType,
  setShowPendingChangesModal: (b: boolean) => void;
}

function MainAgendaForm(props: MainAgendaFormProps) {
  const { agendaContext, formdata, savedFormData, agenda, setFormData, setShowPendingChangesModal } = props;
  const { previousFormData } = props;

  const [isLoaded, setIsLoaded] = useState(false);
  const [thisIsLoading, setThisIsLoading] = useState<{ [key: string]: boolean }>({ categories: true });
  const [allDays, setAllDays] = useState<SelectOptionType[]>([]);
  const [allHosts, setAllHosts] = useState<SelectOptionType[]>([]);
  const [allSpaces, setAllSpaces] = useState<SelectOptionType[]>([]); // info.space_id loads this with data
  const [allCategories, setAllCategories] = useState<SelectOptionType[]>([]); // info.selectedCategories modifies that
  const [allRoles, setAllRoles] = useState<SelectOptionType[]>([]);
  const [allTickets, setAllTickets] = useState<SelectOptionType[]>([]);
  const [isNameInputFocused, setIsNameInputFocused] = useState(false);

  // aux states
  const [isSpeakerModalShown, setIsSpeakerModalShown] = useState(false);

  const history = useHistory();
  const nameInputRef = useRef<InputRef>(null);

  const processDateFromAgendaDocument = useProcessDateFromAgendaDocument();
  const hourWithAdditionalMinutes = useHourWithAdditionalMinutes();

  useEffect(() => {
    if (!props.event?._id) return;

    const loading = async () => {
      useLoadExtraAgendaData(props.event, {
        setCategories: setAllCategories,
        setDays: setAllDays,
        setHosts: setAllHosts,
        setRoles: setAllRoles,
        setSpaces: setAllSpaces,
        setTickets: setAllTickets,
      });

      setIsLoaded(true);

      // Finish loading this:
      setThisIsLoading((previous) => ({ ...previous, categories: false }));
    };

    loading().then();
  }, [props.event]);

  // If agenda is not null, load data to form
  useEffect(() => {
    if (agenda === null) return;

    const processedDate = processDateFromAgendaDocument(agenda);

    setFormData({
      ...previousFormData,
      name: agenda.name,
      date: processedDate.date,
      description: agenda.description,
      image: agenda.image,
      space_id: agenda.space_id || '',
      hour_start: dayjs(processedDate.hour_start),
      hour_end: dayjs(processedDate.hour_end),
      length: agenda.length,
      latitude: agenda.latitude,
      selectedTickets: agenda.selectedTicket ? agenda.selectedTicket : [],
      selectedDocuments: agenda.selected_document || [],
      selectedCategories: fieldsSelect(agenda.activity_categories_ids, allCategories) || [],
      selectedHosts: fieldsSelect(agenda.host_ids, allHosts) || [],
      selectedRol: fieldsSelect(agenda.access_restriction_rol_ids, allRoles) || [],
    });
  }, [agenda, allCategories, allHosts, allRoles]);

  useEffect(() => {
    // Focus the first field
    if (nameInputRef.current && !isNameInputFocused) {
      nameInputRef.current?.focus();
      setIsNameInputFocused(true);
      window.scrollTo(0, 0);
    }
  }, [nameInputRef.current, isNameInputFocused]);

  /**
   * Custom hooks
   */
  const catStyles = useCreatableStyles();
  const valideChangesInFormData = useValideChangesInFormData(
    savedFormData, // The order matter
    formdata,
    agendaContext.isPublished,
    setShowPendingChangesModal
  );

  /**
   * This method edit the state info, that has various attributes.
   *
   * You have to pass the name of this attribute to edit, and the value. This
   * method overwrite the attribute asked only.
   *
   * @param name The key name.
   * @param value The value.
   */
  const handleChangeFormData = (name: keyof FormDataType, value: any) => {
    const newFormData: FormDataType = { ...previousFormData };
    newFormData[name] = value as never; // ignore it
    setFormData(newFormData);
    valideChangesInFormData();
  };

  const handleChangeReactQuill = (value: string, target: string) => {
    if (target === 'description') {
      setFormData({ ...previousFormData, description: value });
    } else if (target === 'registration_message') {
      // It seems be never used, the value should be save in `agenda` but this
      // component don't receive a setter for agenda. Something like:
      // setAgenda({ ...previousAgenda, registration_message: value });
      console.warn(`ignored handleChangeReactQuill("${value}", "${target}")`);
    }
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
    setFormData({ ...previousFormData, image: files });
  };

  /**
   * Mask as select a category.
   * @param selectedCategories SelectOptionType[].
   */
  const onSelectedCategoryChange = (selectedCategories: any[]) => {
    setFormData({ ...previousFormData, selectedCategories });
  };

  const handlerCreateCategories = async (value: any, name: string) => {
    // Last handleCreate method
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras guarda la información...',
      action: 'show',
    });

    try {
      // Show as loading...
      setThisIsLoading((previous) => ({ ...previous, [name]: true }));

      const item = name === 'categories' && (await CategoriesAgendaApi.create(props.event._id, { name: value }));

      const newOption = {
        label: value,
        value: item._id,
        item,
      };

      // Stop showing as loading.
      setThisIsLoading((previous) => ({ ...previous, [name]: false }));

      // Update categories list
      setAllCategories((previous) => [...previous, newOption]);
      setFormData({
        ...previousFormData,
        selectedCategories: [...previousFormData.selectedCategories, newOption],
      });

      // Show this messages
      DispatchMessageService({ type: 'loading', msj: '', key: 'loading', action: 'destroy' });
      DispatchMessageService({ type: 'success', msj: 'Información guardada correctamente!', action: 'show' });
    } catch (e) {
      // Stop showing as loading and hide the messages
      setThisIsLoading((previous) => ({ ...previous, [name]: false }));
      DispatchMessageService({ type: 'loading', msj: '', key: 'loading', action: 'destroy' });
      DispatchMessageService({ msj: handleRequestError(e).message, type: 'error', action: 'show' });
    }
  };

  const currentHourStart = useMemo(() => {
    if (typeof formdata.hour_start === 'string' && formdata.hour_start.trim() !== '') {
      return dayjs(formdata.hour_start, 'HH:mm:ss');
    }
    if (typeof formdata.hour_start === 'object' && formdata.hour_start !== null) {
      if (formdata.hour_start.isValid && !formdata.hour_start.isValid()) {
        return dayjs(formdata.hour_start, 'HH:mm:ss');
      }
      return formdata.hour_start;
    }
    const newHour = hourWithAdditionalMinutes(10);
    setFormData({ ...previousFormData, hour_start: newHour });
    return newHour;
  }, [formdata.hour_start]);

  const currentHourEnd = useMemo(() => {
    if (typeof formdata.hour_end === 'string' && formdata.hour_end.trim() !== '') {
      return dayjs(formdata.hour_end, 'HH:mm:ss');
    }
    if (typeof formdata.hour_end === 'object' && formdata.hour_end !== null) {
      if (formdata.hour_end.isValid && !formdata.hour_end.isValid()) {
        return dayjs(formdata.hour_end, 'HH:mm:ss');
      }
      return formdata.hour_end;
    }
    const newHour = hourWithAdditionalMinutes(15);
    setFormData({ ...previousFormData, hour_end: newHour });
    return newHour;
  }, [formdata.hour_end]);

  return (
    <>
    { isLoaded ? (
      <Row justify="center" wrap gutter={12}>
        <Col span={20}>
          {props.activityId && (
          <ActivityTypeSelector/>
          )}
        </Col>
        <Col span={20}>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }}>
                Nombre <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'Nombre de la lección requerida' }]}
          >
            <Input
              autoFocus
              ref={nameInputRef}
              type="text"
              name="name"
              value={formdata.name}
              onChange={(value) => handleChangeFormData('name', value.target.value)}
              placeholder="Nombre de la lección"
            />
          </Form.Item>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }}>
                Día <RequiredStar/>
              </label>
            }
            rules={[{ required: true, message: 'La fecha es requerida' }]}
          >
            <SelectAntd
              options={allDays}
              value={formdata.date}
              defaultValue={formdata.date}
              onChange={(value) => handleChangeFormData('date', value)}
            />
          </Form.Item>
          <Row wrap justify="center" gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item
                style={{ width: '100%' }}
                label={
                  <label style={{ marginTop: '2%' }}>
                    Hora Inicio <RequiredStar/>
                  </label>
                }
                rules={[{ required: true, message: 'La hora de inicio es requerida' }]}
              >
                <TimePicker
                  use12Hours
                  format="h:mm a"
                  allowClear={false}
                  style={{ width: '100%' }}
                  value={currentHourStart as any}
                  onChange={(value) => handleChangeFormData('hour_start', value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ width: '100%' }}
                label={
                  <label style={{ marginTop: '2%' }}>
                    Hora Fin <RequiredStar/>
                  </label>
                }
                rules={[{ required: true, message: 'La hora final es requerida' }]}
              >
                <TimePicker
                  use12Hours
                  style={{ width: '100%' }}
                  allowClear={false}
                  value={currentHourEnd as any}
                  format="h:mm a"
                  onChange={(value) => handleChangeFormData('hour_end', value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Conferencista">
            <Row wrap gutter={[8, 8]}>
              <Col span={22}>
                <Select
                  isMulti
                  id="hosts"
                  isClearable
                  styles={creatableStyles}
                  onChange={(value: any) => handleChangeFormData('selectedHosts', value)}
                  options={allHosts}
                  value={formdata.selectedHosts}
                />
              </Col>
              <Col span={1}>
                <Button
                  onClick={() => {
                    // goSection(props.matchUrl.replace('agenda', 'speakers'), { child: true })
                    setIsSpeakerModalShown(true);
                    console.log('Open the speaker modal');
                  }}
                  title="Agregar conferencista"
                  icon={<PlusOutlined />}
                />
              </Col>
              <Col span={1}>
                <Button
                  onClick={() => goSection(props.matchUrl.replace('agenda', 'speakers'), { child: true })}
                  icon={<SettingOutlined />}
                  title="Configurar en otra página"
                />
              </Col>
              {/* The speaker modal */}
              <Modal
                visible={isSpeakerModalShown}
                onCancel={()=> setIsSpeakerModalShown(false)}
                okButtonProps={{disabled: true}}
              >
                <Speaker
                  eventID={props.event._id}
                  matchUrl={props.matchUrl}
                  onCreated={()=> {
                    const loading = async () => {
                      const incommingHosts = await SpeakersApi.byEvent(props.event._id);
                      const hosts = handleSelect(incommingHosts);
                      setAllHosts(hosts);
                    }
                    loading().then(() => console.log('hosts reloaded'));
                    setIsSpeakerModalShown(false);
                  }}
                  justCreate />
              </Modal>
            </Row>
          </Form.Item>
          <Form.Item label="Espacio">
            <Row wrap gutter={[8, 8]}>
              <Col span={23}>
                <SelectAntd
                  value={formdata.space_id}
                  onChange={(value) => handleChangeFormData('space_id', value)}>
                  <Option value="">Seleccione un lugar/salón ...</Option>
                  {allSpaces.map((space) => (
                    <Option key={space.value} value={space.value}>{space.label}</Option>
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
          <Form.Item label="Categorías">
            <Row wrap gutter={[8, 8]}>
              <Col span={23}>
                <Creatable
                  isClearable
                  isMulti
                  styles={catStyles}
                  onChange={onSelectedCategoryChange}
                  onCreateOption={(value: string) => handlerCreateCategories(value, 'categories')}
                  isDisabled={thisIsLoading.categories}
                  isLoading={thisIsLoading.categories}
                  options={allCategories}
                  value={formdata.selectedCategories}
                  placeholder="Sin categoría..."
                />
              </Col>
              <Col span={1}>
                <Button onClick={() => goSection(`${props.matchUrl}/categorias`)} icon={<SettingOutlined />} />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="¿Tiene espacio físico?">
            <Switch
              checked={formdata.isPhysical}
              checkedChildren="Sí"
              unCheckedChildren="No"
              onChange={(chosen) => handleChangeFormData('isPhysical', chosen)}
            />
          </Form.Item>
          {formdata.isPhysical &&
          <>
          <Form.Item label="Longitud">
            <Input
              type="number"
              name="length"
              value={formdata.length}
              onChange={(event) => handleChangeFormData('length', event.target.value)}
              placeholder="Ej. 4.677027"
            />
          </Form.Item>
          <Form.Item label="Latitud">
            <Input
              type="number"
              name="latitude"
              value={formdata.latitude}
              onChange={(event) => handleChangeFormData('latitude', event.target.value)}
              placeholder="Ej. -74.094086"
            />
          </Form.Item>
          </>
          }
          <Form.Item label="Descripción">
            <Space>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} />
              <Text type="secondary">
                Esta información no es visible en la Agenda/Lección en versión Mobile.
              </Text>
            </Space>
            <EviusReactQuill
              name="description"
              data={formdata.description}
              handleChange={(value: string) => handleChangeReactQuill(value, 'description')}
            />
          </Form.Item>
          <Form.Item label="Imagen">
            <Card style={{ textAlign: 'center', borderRadius: '20px' }}>
              <Form.Item noStyle>
                <p>
                  Dimensiones:
                  {' '}
                  <b>
                    <small>600px X 400px, 400px X 600px, 200px X 200px, 400px X 400px ...</small>
                  </b>
                  {' '}
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
                  imageUrl={formdata.image}
                  width="1080"
                  height="1080"
                />
              </Form.Item>
            </Card>
          </Form.Item>
          <BackTop />
        </Col>
      </Row> ) : ( <Loading /> ) }
    </>
  );
}

export default MainAgendaForm;
