import * as Moment from 'moment';
import * as React from 'react';
import { useEffect, useRef, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import {
  Row,
  Col,
  Space,
  Typography,
  Button,
  Form,
  Input,
  InputRef,
  Switch,
  Card,
  TimePicker,
} from 'antd';
import { Select as SelectAntd } from 'antd';
import {
  ExclamationCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import {
  RolAttApi,
  SpacesApi,
  SpeakersApi,
  CategoriesAgendaApi,
  eventTicketsApi,
} from '@/helpers/request';
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
import AgendaDocumentType from '../types/AgendaDocumentType';

import ActivityTypeSelector from '../activityType/ActivityTypeSelector';

const { Text } = Typography;
const { Option } = SelectAntd;

const creatableStyles = { menu: (styles: object) => ({ ...styles, maxHeight: 'inherit' }) };

export interface FormDataType {
  name: string,
  date: string,
  description: string,
  space_id: string,
  image: string,
  hour_start: Moment.Moment | string,
  hour_end: Moment.Moment | string,
  isPhysical: boolean,
  length: string,
  latitude: string,
  selectedCategories: SelectOptionType[],
  selectedHosts: SelectOptionType[],
  selectedRol: SelectOptionType[],
  selectedTickets: SelectOptionType[],
  selectedDocuments: SelectOptionType[],
};

export interface MainAgendaFormProps {
  agendaContext: any,
  matchUrl: string,
  event: EventType,
  activityId: string | null,
  formdata: FormDataType,
  savedFormData: FormDataType,
  agenda: AgendaDocumentType | null,
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
  setShowPendingChangesModal: React.Dispatch<React.SetStateAction<boolean>>,
};

function MainAgendaForm(props: MainAgendaFormProps) {
  const {
    agendaContext,
    formdata,
    savedFormData,
    agenda,
    setFormData,
    setShowPendingChangesModal,
  } = props;

  const [isLoaded, setIsLoaded] = useState(false);
  const [thisIsLoading, setThisIsLoading] = useState<{ [key: string]: boolean }>({ categories: true });
  const [allDays, setAllDays] = useState<SelectOptionType[]>([]);
  const [allHosts, setAllHosts] = useState<SelectOptionType[]>([]);
  const [allSpaces, setAllSpaces] = useState<SelectOptionType[]>([]); // info.space_id loads this with data
  const [allCategories, setAllCategories] = useState<SelectOptionType[]>([]); // info.selectedCategories modifies that
  const [allRoles, setAllRoles] = useState<SelectOptionType[]>([]);
  const [allTickets, setAllTickets] = useState<SelectOptionType[]>([]);

  const history = useHistory();
  const nameInputRef = useRef<InputRef>(null);

  const processDateFromAgendaDocument = useProcessDateFromAgendaDocument();

  useEffect(() => {
    if (!props.event?._id) return;

    const loading = async () => {
      try {
        // NOTE: The tickets are not used
        const remoteTickets = await eventTicketsApi.getAll(props.event?._id);
        const newAllTickets = remoteTickets.map((ticket: any) => ({
          item: ticket,
          label: ticket.title,
          value: ticket._id,
        }));
        setAllTickets(newAllTickets);
      } catch (e) {
        console.error(e);
      }

      // If dates exist, then iterate the specific dates array, formating specially.
      if (props.event.dates && props.event.dates.length > 0) {
        const newDays = props.event.dates.map((dates) => {
          const formatDate = Moment(dates, ['YYYY-MM-DD']).format('YYYY-MM-DD');
          return { value: formatDate, label: formatDate };
        });
        setAllDays(newDays);
      } else {
        // Si no, recibe la fecha inicio y la fecha fin y le da el formato
        // especifico a mostrar
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

      // Get more data from this event
      const remoteHosts = await SpeakersApi.byEvent(props.event._id);
      const remoteRoles = await RolAttApi.byEvent(props.event._id);
      const remoteSpaces = await SpacesApi.byEvent(props.event._id);
      const remoteCategories = await CategoriesAgendaApi.byEvent(props.event._id);

      // The object struct should be like [{ label, value }] for the Select components
      const newAllHosts = handleSelect(remoteHosts);
      const newAllRoles = handleSelect(remoteRoles);
      const newAllSpaces = handleSelect(remoteSpaces);
      const newAllCategories = handleSelect(remoteCategories);

      setAllHosts(newAllHosts);
      setAllRoles(newAllRoles);
      setAllSpaces(newAllSpaces);
      setAllCategories(newAllCategories);

      setIsLoaded(true);

      // Finish loading this:
      setThisIsLoading((previous) => ({ ...previous, categories: false }));
    }

    loading().then();
  }, [props.event]);

  // If agenda is not null, load data to form
  useEffect(() => {
    if (agenda === null) return;

    const processedDate = processDateFromAgendaDocument(agenda);

    setFormData((previous) => ({
      ...previous,
      name: agenda.name,
      date: processedDate.date,
      description: agenda.description,
      image: agenda.image,
      space_id: agenda.space_id || '',
      hour_start: Moment(processedDate.hour_start),
      hour_end: Moment(processedDate.hour_end),
      length: agenda.length,
      latitude: agenda.latitude,
      selectedTickets: agenda.selectedTicket ? agenda.selectedTicket : [],
      selectedDocuments: agenda.selected_document,
      selectedCategories: fieldsSelect(agenda.activity_categories_ids, allCategories),
      selectedHosts: fieldsSelect(agenda.host_ids, allHosts),
      selectedRol: fieldsSelect(agenda.access_restriction_rol_ids, allRoles),
    }));

  }, [agenda, allCategories, allHosts, allRoles]);

  useEffect(() => {
    // Focus the first field
    if (!formdata.name) nameInputRef.current?.focus();
  }, [nameInputRef.current]);

  /**
   * Custom hooks
   */
   const catStyles = useCreatableStyles();
   const valideChangesInFormData = useValideChangesInFormData(
     savedFormData, // The order matter
     formdata,
     agendaContext.isPublished,
     setShowPendingChangesModal,
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
    setFormData((previous) => {
      const newFormData: FormDataType = { ...previous };
      newFormData[name] = value as never; // ignore it
      return newFormData;
    })
    valideChangesInFormData();
  }

  const handleChangeReactQuill = (value: string, target: string) => {
    if (target === 'description') {
      setFormData((previous) => (
        { ...previous, description: value}
      ))
    } else if (target === 'registration_message') {
      setFormData((previous) => (
        { ...previous, registration_message: value}
      ))
    }
  };

  const hourWithAdditionalMinutes = (minutes: number) => {
    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() + minutes);
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
    setFormData((previous) => ({ ...previous, image: files }));
  }
  
  /**
   * Mask as select a category.
   * @param selectedCategories SelectOptionType[].
   */
  const onSelectedCategoryChange = (selectedCategories: any[]) => {
    setFormData((previous) => ({ ...previous, selectedCategories }));
  }

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
      setFormData((previous) => ({
        ...previous,
        selectedCategories: [...previous.selectedCategories, newOption],
      }));

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
    if (formdata.hour_start instanceof Moment) {
      return Moment(formdata.hour_start, 'HH:mm:ss');
    }
    const newHour = hourWithAdditionalMinutes(1);
    setFormData((previous) => ({ ...previous, hour_start: newHour }));
    return newHour;
  }, [formdata.hour_start])

  const currentHourEnd = useMemo(() => {
    if (formdata.hour_end instanceof Moment) {
      return Moment(formdata.hour_end, 'HH:mm:ss');
    }
    const newHour = hourWithAdditionalMinutes(5);
    setFormData((previous) => ({ ...previous, hour_end: newHour }));
    return newHour;
  }, [formdata.hour_end])

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
            rules={[{ required: true, message: 'Nombre de la actividad requerida' }]}
          >
            <Input
              autoFocus
              ref={nameInputRef}
              type="text"
              name="name"
              value={formdata.name}
              onChange={(value) => handleChangeFormData('name', value.target.value)}
              placeholder="Nombre de la actividad"
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
                  value={currentHourStart}
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
                  value={currentHourEnd}
                  format="h:mm a"
                  onChange={(value) => handleChangeFormData('hour_end', value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Conferencista">
            <Row wrap gutter={[8, 8]}>
              <Col span={23}>
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
                  onClick={() => goSection(props.matchUrl.replace('agenda', 'speakers'), { child: true })}
                  icon={<SettingOutlined />}
                />
              </Col>
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
                  placeholder="Sin categoría...."
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
              autoFocus
              type="number"
              name="length"
              value={formdata.length}
              onChange={(event) => handleChangeFormData('length', event.target.value)}
              placeholder="Ej. 4.677027"
            />
          </Form.Item>
          <Form.Item label="Latitud">
            <Input
              autoFocus
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
                Esta información no es visible en la Agenda/Actividad en versión Mobile.
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
