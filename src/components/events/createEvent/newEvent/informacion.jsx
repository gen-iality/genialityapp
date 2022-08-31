import { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Input,
  Row,
  Space,
  Typography,
  Modal,
  Button,
  Select,
  TimePicker,
  DatePicker,
  Checkbox,
  Form,
  Popover,
} from 'antd';
import { CalendarOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { useContextNewEvent } from '../../../../context/newEventContext';
import { OrganizationApi, PlansApi } from '../../../../helpers/request';
import ModalOrgListCreate from './modalOrgListCreate';
import moment from 'moment';
import {
  disabledEndDateTime,
  disabledStartDate,
  disabledStartDateTime,
} from '@/Utilities/disableTimeAndDatePickerInEventDate';

const { Text, Title, Paragraph } = Typography;
const { Option } = Select;

const Informacion = (props) => {
  const {
    showModal,
    isModalVisible,
    handleCancel,
    handleOk,
    changeSelectHours,
    changeSelectDay,
    selectedDay,
    selectedHours,
    dateEvent,
    handleInput,
    valueInputs,
    containsError,
    selectOrganization,
    selectTemplate,
    templateId,
    dispatch,
    state,
  } = useContextNewEvent();
  const cUser = props?.currentUser;
  const eventDateStart = { date_start: selectedDay };
  const eventHourStart = { hour_start: selectedHours.from };

  const [userConsumption, setUserConsumption] = useState({});
  const handleChange = (value) => {
    selectTemplate(value);
  };

  const getCurrentConsumptionPlanByUsers = async () => {
    if (!cUser?._id) return;

    const consumption = await PlansApi.getCurrentConsumptionPlanByUsers(cUser?._id);
    setUserConsumption(consumption);
  };

  useEffect(() => {
    getCurrentConsumptionPlanByUsers();
  }, [cUser]);

  {
    useEffect(() => {
      if (state.selectOrganization) {
        selectTemplate(
          state.selectOrganization.template_properties
            ? state.selectOrganization?.template_properties[0]._id['$oid']
            : undefined
        );
      }
    }, [state.selectOrganization, selectTemplate]);
  }

  const obtainTemplates = async () => {
    const resp = await OrganizationApi.getTemplateOrganization(selectOrganization?.id);
    return resp;
  };

  return (
    <div className='step-information'>
      <Space direction='vertical' size='middle' style={{ marginBottom: '30px' }}>
        <div>
          <Text>
            Nombre del evento <span className='text-color'>*</span>
          </Text>
          <Input
            name={'name'}
            value={valueInputs['name'] || ''}
            onChange={(e) => handleInput(e, 'name')}
            placeholder='Nombre del evento'
          />
          {containsError('name') && (
            <Col>
              {' '}
              <small className='text-color'>Ingrese un nombre correcto para el evento</small>
            </Col>
          )}
        </div>
        <div>
          <Text>
            Fecha del evento <span className='text-color'>*</span>
          </Text>
          <Input
            value={dateEvent || ''}
            onClick={showModal}
            suffix={<CalendarOutlined onClick={showModal} />}
            placeholder='Clic para agregar fecha'
          />
        </div>
        <div>
          <Space direction='vertical'>
            {state.organizations.length > 0 && (
              <div>
                <p>
                  Este evento pertenecerá a la organización | <b>{state?.selectOrganization?.name}</b>
                </p>
                <Button onClick={() => dispatch({ type: 'VISIBLE_MODAL', payload: { visible: true } })} block>
                  Cambiar de organización
                </Button>
              </div>
            )}
            <ModalOrgListCreate orgId={props.orgId} />
          </Space>
        </div>
        <div>
          <Space>
            <Checkbox>Evento externo, solo landing informativa</Checkbox>
            <Popover
              content={
                <Typography.Paragraph style={{ width: '220px' }}>
                  Si marcas esta opción, solo se creará una landing informativa para tu evento, podrás configurar y
                  personalizar todos los aspectos de esta misma.
                </Typography.Paragraph>
              }>
              <QuestionCircleOutlined />
            </Popover>
          </Space>
        </div>
        {state.selectOrganization?.template_properties && (
          <div>
            <Space direction='vertical'>
              <Text>Template </Text>
              <Select value={templateId} style={{ minWidth: '400px' }} onChange={handleChange}>
                {state.selectOrganization.template_properties.map((template) => (
                  <Option key={template._id['$oid']} value={template._id['$oid']}>
                    {template.name}
                  </Option>
                ))}
              </Select>
            </Space>
          </div>
        )}
      </Space>

      {/* Modal de fecha */}
      <Modal
        className='modal-calendar'
        centered
        visible={isModalVisible}
        okText='Aceptar'
        onOk={handleOk}
        cancelText='Cancelar'
        onCancel={handleCancel}
        width={600}>
        <Row gutter={[16, 16]} justify='center' align='top'>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Title level={4} type='secondary'>
              Asignar fecha
            </Title>

            <DatePicker
              inputReadOnly={true}
              //RESTRICIONES
              // disabledDate={(date) => {
              //   if (cUser?.plan?._id) {
              //     const streamingHours = cUser?.plan?.availables?.streaming_hours;
              //     return disabledStartDate(date, streamingHours, userConsumption);
              //   }
              // }}
              style={{ width: '100%', marginTop: '20px' }}
              /* popupStyle={{ height: '50px !important', backgroundColor: 'blue' }} */
              allowClear={false}
              value={moment(selectedDay)}
              format={'DD/MM/YYYY'}
              onChange={(value) => changeSelectDay(value.toDate())}
            />

            {userConsumption?.end_date && (
              <Typography.Text strong type='secondary'>
                <small>Su plan finaliza el dia {userConsumption?.end_date}</small>
              </Typography.Text>
            )}

            <Title level={4} type='secondary'>
              Asignar hora
            </Title>
            <Card>
              <Space direction='vertical'>
                <div>
                  <Space>
                    <div className='modal-horas'>
                      <span>de</span>
                    </div>
                    <TimePicker
                      showNow={false}
                      inputReadOnly={true}
                      //RESTRICIONES
                      // disabledTime={(time) => {
                      //   const streamingHours = cUser?.plan?.availables?.streaming_hours;
                      //   return disabledStartDateTime(eventHourStart, streamingHours);
                      // }}
                      allowClear={false}
                      use12Hours
                      value={moment(selectedHours.from)}
                      onChange={(hours) => changeSelectHours({ ...selectedHours, from: hours, at: hours })}
                    />
                  </Space>
                </div>
                <div>
                  <Space>
                    <div className='modal-horas'>
                      <span>a</span>
                    </div>
                    <TimePicker
                      showNow={false}
                      inputReadOnly={true}
                      //RESTRICIONES
                      // disabledTime={(time) => {
                      //   const streamingHours = cUser?.plan?.availables?.streaming_hours;
                      //   return disabledEndDateTime(eventHourStart, streamingHours);
                      // }}
                      allowClear={false}
                      use12Hours
                      value={moment(selectedHours.at)}
                      onChange={(hours) => changeSelectHours({ ...selectedHours, at: hours })}
                    />
                  </Space>
                </div>
              </Space>
            </Card>
            <Paragraph type='secondary' style={{ marginTop: '10px' }}>
              Recuerda que podrás modificar las fechas de inicio y fin del evento, en la sección{' '}
              <strong>Datos del evento</strong>.
            </Paragraph>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Informacion;
