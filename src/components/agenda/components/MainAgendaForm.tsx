import * as React from 'react';
import * as Moment from 'moment';
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
import ImageUploaderDragAndDrop from '../../imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import EviusReactQuill from '../../shared/eviusReactQuill';
import BackTop from '../../../antdComponents/BackTop';

import useProcessDateFromAgendaDocument from '../hooks/useProcessDateFromAgendaDocument';

import SelectOptionType from '../types/SelectOptionType';
import EventType from '../types/EventType';
import AgendaDocumentType from '../types/AgendaDocumentType';

const { Text } = Typography;
const { Option } = SelectAntd;

const creatableStyles = {
  menu: (styles: object) => ({ ...styles, maxHeight: 'inherit' }),
};

export interface FormDataType {
  name: string,
  date: any,
  hour_start: string | Moment.Moment | Date,
  hour_end: string | Moment.Moment | Date,
  space_id: string,
  selectedCategories: SelectOptionType[],
  selectedHosts: SelectOptionType[],
  selectedRol: SelectOptionType[],
  selectedTickets: SelectOptionType[],
  selectedDocuments: SelectOptionType[],
  isPhysical: boolean,
  length: string,
  latitude: string,
  description: string,
  image: string,
  isExternal: boolean,
  externalSurveyID: string,
  roomStatus: string,
};

export interface MainAgendaFormProps {
  event: EventType,
  formdata: FormDataType,
  agendaInfo: AgendaDocumentType,
  savedFormData: FormDataType,
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
  setPendingChangesSave: React.Dispatch<React.SetStateAction<boolean>>,
  setShowPendingChangesModal: React.Dispatch<React.SetStateAction<boolean>>,
  agendaContext: any,
  matchUrl: string,
};

function MainAgendaForm(props: MainAgendaFormProps) {
  const {
    formdata,
    agendaInfo,
    savedFormData,
    setFormData,
    setPendingChangesSave,
    setShowPendingChangesModal,
    agendaContext,
  } = props;

  const [thisIsLoading, setThisIsLoading] = useState<{ [key: string]: boolean }>({ categories: true });
  const [allDays, setAllDays] = useState<SelectOptionType[]>([]);
  const [allHosts, setAllHosts] = useState<SelectOptionType[]>([]);
  const [allSpaces, setAllSpaces] = useState<SelectOptionType[]>([]); // info.space_id loads this with data
  const [allCategories, setAllCategories] = useState<SelectOptionType[]>([]); // info.selectedCategories modifies that
  const [allTickets, setAllTickets] = useState<SelectOptionType[]>([]);
  const [allRoles, setAllRoles] = useState<SelectOptionType[]>([]);

  const history = useHistory();
  const nameInputRef = useRef<InputRef>(null);

  const processDateFromAgendaDocument = useProcessDateFromAgendaDocument();

  useEffect(() => {
    if (!props.event) return;
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

      setFormData((last) => ({
        ...last,
        selectedCategories: fieldsSelect(agendaInfo.activity_categories_ids, newAllCategories),
        selectedHosts: fieldsSelect(agendaInfo.host_ids, newAllHosts),
        selectedRol: fieldsSelect(agendaInfo.access_restriction_rol_ids, newAllRoles),
      }));

      // Finish loading this:
      setThisIsLoading((last) => ({ ...last, categories: false }));
    }

    loading().then();
  }, [props.event]);

  useEffect(() => {
    const processedDate = processDateFromAgendaDocument(agendaInfo);

    // Load data to formdata
    setFormData((last) => ({
      ...last,
      name: agendaInfo.name,
      date: processedDate.date,
      hour_start: processedDate.hour_start,
      hour_end: processedDate.hour_end,
      space_id: agendaInfo.space_id || '',
      length: agendaInfo.length,
      latitude: agendaInfo.latitude,
      description: agendaInfo.description,
      image: agendaInfo.image,
      selectedTickets: agendaInfo.selectedTicket ? agendaInfo.selectedTicket : [],
      selectedDocuments: agendaInfo.selected_document,
    }));
  }, [agendaInfo]);

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

  // @done
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
    setFormData((last) => {
      const newFormData: FormDataType = { ...last };
      newFormData[name] = value as never; // ignore it
      return newFormData;
    });
    setPendingChangesSave(true);
    valideChangesInFormData();
  }

  // @done
  const handleChangeReactQuill = (value: string, target: string) => {
    if (target === 'description') {
      setFormData((last) => (
        { ...last, description: value}
      ))
    } else if (target === 'registration_message') {
      setFormData((last) => (
        { ...last, registration_message: value}
      ))
    }
  };

  // @done
  const startOrEndHourWithAdditionalMinutes = (minutes: number, isStart: boolean) => {
    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() + minutes);

    if (isStart) {
      setFormData((last) => (
        { ...last, hour_start: Moment(fecha, 'HH:mm:ss') }
      ));
    } else {
      setFormData((last) => (
        { ...last, hour_end: Moment(fecha, 'HH:mm:ss') }
      ));
    }

    return Moment(fecha, 'HH:mm:ss');
  };

  // @done
  const goSection = (path: string, state?: any) => {
    history.push(path, state);
  };

  // @done
  const handleImageChange = (files: any) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras carga la imagen...',
      action: 'show',
    });
    setFormData((last) => (
      { ...last, image: files }
    ));
  }
  
  // @done
  /**
   * Mask as select a category.
   * @param selectedCategories SelectOptionType[].
   */
  const onSelectedCategoryChange = (selectedCategories: any[]) => {
    setFormData((last) => ({ ...last, selectedCategories }));
  }

  // @testable
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
      setThisIsLoading((last) => ({ ...last, [name]: true }));

      const item = name === 'categories' && (await CategoriesAgendaApi.create(props.event._id, { name: value }));

      const newOption = {
        label: value,
        value: item._id,
        item,
      };

      // Stop showing as loading.
      setThisIsLoading((last) => ({ ...last, [name]: false }));

      // Update categories list
      setAllCategories((last) => [...last, newOption]);
      setFormData((last) => ({
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

  const currentHourStart = useMemo(() => {
    if (formdata.hour_start === '') {
      return startOrEndHourWithAdditionalMinutes(1, true)
    }
    return Moment(formdata.hour_start)
  }, [formdata.hour_start])

  const currentHourEnd = useMemo(() => {
    if (formdata.hour_end === '') {
      return startOrEndHourWithAdditionalMinutes(5, false)
    }
    return Moment(formdata.hour_end)
  }, [formdata.hour_end])

  return (
    <>
    <Row justify="center" wrap gutter={12}>
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
          ]}
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
              Día <label style={{ color: 'red' }}>*</label>
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
                  Hora Inicio <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[
                {
                  required: true,
                  message: 'La hora de inicio es requerida',
                },
              ]}
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
                  Hora Fin <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[
                {
                  required: true,
                  message: 'La hora final es requerida',
                },
              ]}
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
                placeholder="Sin categoría...."
                value={formdata.selectedCategories}
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
            // ref={formdata.longitud}
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
            // Here was a ref called 'this.latitude'
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
                {" "}
                <b>
                  <small>600px X 400px, 400px X 600px, 200px X 200px, 400px X 400px ...</small>
                </b>
                {" "}
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
    </Row>
    </>
  );
}

export default MainAgendaForm;
