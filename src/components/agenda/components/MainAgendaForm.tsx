import * as React from 'react';
import * as Moment from 'moment';
import { useEffect, useRef } from 'react';
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

import Select from 'react-select';
import Creatable from 'react-select';

import { DispatchMessageService } from '../../../context/MessageService';
import useCreatableStyles from '../hooks/useCreatableStyles';
import useValideChangesInFormData from '../hooks/useValideChangesInFormData';
import ImageUploaderDragAndDrop from '../../imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import EviusReactQuill from '../../shared/eviusReactQuill';
import BackTop from '../../../antdComponents/BackTop';
import SelectOptionType from '../types/SelectOptionType';

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
  formdata: FormDataType,
  savedFormData: FormDataType,
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
  setPendingChangesSave: React.Dispatch<React.SetStateAction<boolean>>,
  setShowPendingChangesModal: React.Dispatch<React.SetStateAction<boolean>>,
  agendaContext: any,
  matchUrl: string,
  allDays: SelectOptionType[],
  allHosts: SelectOptionType[],
  allSpaces: SelectOptionType[],
  allCategories: SelectOptionType[],
  thisIsLoading: {[key: string]: any},
  handlerCreateCategories: (value: any, name: string) => void,
};

function MainAgendaForm(props: MainAgendaFormProps) {
  const {
    formdata,
    savedFormData,
    setFormData,
    setPendingChangesSave,
    setShowPendingChangesModal,
    agendaContext,
    allDays,
    allHosts,
    allSpaces,
    allCategories,
    thisIsLoading,
    handlerCreateCategories,
  } = props;

  const history = useHistory();
  const nameInputRef = useRef<InputRef>(null);

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
                value={
                  formdata.hour_start !== ''
                  ? Moment(formdata.hour_start)
                  : startOrEndHourWithAdditionalMinutes(1, true)
                }
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
                value={
                  formdata.hour_end !== ''
                  ? Moment(formdata.hour_end)
                  : startOrEndHourWithAdditionalMinutes(5, false)
                }
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
