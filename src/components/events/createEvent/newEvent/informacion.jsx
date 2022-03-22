import { useEffect } from 'react';
import { DateTimePicker } from 'react-widgets';
import { Card, Col, Input, Row, Space, Typography, Modal, Button, Select, message } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { useContextNewEvent } from '../../../../context/newEventContext';
import { OrganizationApi } from '../../../../helpers/request';
import ModalOrgListCreate from './modalOrgListCreate';

const { Text, Link, Title, Paragraph } = Typography;
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

  const handleChange = (value) => {
    selectTemplate(value);
  };

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
            <DayPicker onDayClick={changeSelectDay} selectedDays={selectedDay} value={selectedDay} />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
                    <DateTimePicker
                      value={selectedHours.from}
                      onChange={(hours) => changeSelectHours({ ...selectedHours, from: hours })}
                      date={false}
                    />
                  </Space>
                </div>
                <div>
                  <Space>
                    <div className='modal-horas'>
                      <span>a</span>
                    </div>
                    <DateTimePicker
                      value={selectedHours.at}
                      onChange={(hours) => changeSelectHours({ ...selectedHours, at: hours })}
                      date={false}
                    />
                  </Space>
                </div>
              </Space>
            </Card>
            <Paragraph type='secondary' style={{ marginTop: '10px' }}>
              Si tu evento se extiende por más de un día podrás ajustar las fechas en la sección{' '}
              <strong>Datos del evento</strong> una vez lo hayas creado.
            </Paragraph>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Informacion;
