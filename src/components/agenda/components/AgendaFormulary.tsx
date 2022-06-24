import * as React from 'react';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

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
import { Select as SelectAntd } from 'antd';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

import Select from 'react-select';
import Creatable from 'react-select';

import * as Moment from 'moment';

import { DispatchMessageService } from '../../../context/MessageService';
import useCreatableStyles from '../hooks/useCreatableStyles';
import useValideChangesInFormulary from '../hooks/useValideChangesInFormulary';
import ImageUploaderDragAndDrop from '../../imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import EviusReactQuill from '../../shared/eviusReactQuill';
import BackTop from '../../../antdComponents/BackTop';
import SelectOptionType from '../types/SelectOptionType';

const { Text } = Typography;
const { Option } = SelectAntd;

const creatableStyles = {
  menu: (styles: object) => ({ ...styles, maxHeight: 'inherit' }),
};

export interface FormularyType {
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

export interface FormularyProps {
  formulary: FormularyType,
  savedFormulary: FormularyType,
  setFormulary: React.Dispatch<React.SetStateAction<FormularyType>>,
  setPendingChangesSave: React.Dispatch<React.SetStateAction<boolean>>,
  setShowPendingChangesModal: React.Dispatch<React.SetStateAction<boolean>>,
  agendaContext: any,
  matchUrl: string,
  allDays: SelectOptionType[],
  allHosts: SelectOptionType[],
  allSpaces: SelectOptionType[],
  allCategories: SelectOptionType[],
  thisIsLoading: {[key: string]: any},
};

function AgendaFormulary(props: FormularyProps) {
  const {
    formulary,
    savedFormulary,
    setFormulary,
    setPendingChangesSave,
    setShowPendingChangesModal,
    agendaContext,
    allDays,
    allHosts,
    allSpaces,
    allCategories,
    thisIsLoading,
  } = props;

  const history = useHistory();

  /**
   * Custom hooks
   */
   const catStyles = useCreatableStyles();
   const valideChangesInFormulary = useValideChangesInFormulary(
     savedFormulary, // The order matter
     formulary,
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
   const handleChangeFormulary = (name: keyof FormularyType, value: any) => {
    setFormulary((last) => {
      const newFormulary: FormularyType = { ...last };
      newFormulary[name] = value as never; // ignore it
      return newFormulary;
    });
    setPendingChangesSave(true);
    valideChangesInFormulary();
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

  // TODO: copy from edit.jsx
  const handleCreate = async (value: any, name: string) => {};
  
  const onSelectedCategoryChange = () => {}

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
            // ref={nameInputRef}
            type="text"
            name="name"
            value={formulary.name}
            onChange={(value) => handleChangeFormulary('name', value.target.value)}
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
            value={formulary.date}
            defaultValue={formulary.date}
            onChange={(value) => handleChangeFormulary('date', value)}
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
              ]}
            >
              <TimePicker
                use12Hours
                style={{ width: '100%' }}
                allowClear={false}
                value={
                  formulary.hour_end !== ''
                  ? Moment(formulary.hour_end)
                  : startOrEndHourWithAdditionalMinutes(5, false)
                }
                format="h:mm a"
                onChange={(value) => handleChangeFormulary('hour_end', value)}
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
                onChange={(value: any) => handleChangeFormulary('selectedHosts', value)}
                options={allHosts}
                value={formulary.selectedHosts}
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
                value={formulary.space_id}
                onChange={(value) => handleChangeFormulary('space_id', value)}>
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
                // TODO: this should edit the object state of thisIsLoading, and
                // the onCreateOption must be implemented
                onCreateOption={(value: string) => handleCreate(value, 'categories')}
                isDisabled={!thisIsLoading.categories}
                isLoading={!thisIsLoading.categories}
                options={allCategories}
                placeholder="Sin categoría...."
                value={formulary.selectedCategories}
              />
            </Col>
            <Col span={1}>
              <Button onClick={() => goSection(`${props.matchUrl}/categorias`)} icon={<SettingOutlined />} />
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="¿Tiene espacio físico?">
          <Switch
            checked={formulary.isPhysical}
            checkedChildren="Sí"
            unCheckedChildren="No"
            onChange={(chosen) => handleChangeFormulary('isPhysical', chosen)}
          />
        </Form.Item>
        {formulary.isPhysical &&
        <>
        <Form.Item label="Longitud">
          <Input
            // ref={formulary.longitud}
            autoFocus
            type="number"
            name="length"
            value={formulary.length}
            onChange={(event) => handleChangeFormulary('length', event.target.value)}
            placeholder="Ej. 4.677027"
          />
        </Form.Item>
        <Form.Item label="Latitud">
          <Input
            // Here was a ref called 'this.latitude'
            autoFocus
            type="number"
            name="latitude"
            value={formulary.latitude}
            onChange={(event) => handleChangeFormulary('latitude', event.target.value)}
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
            data={formulary.description}
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
                imageUrl={formulary.image}
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

export default AgendaFormulary;
