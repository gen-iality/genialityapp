import React, { useContext, useEffect, useState } from 'react';
import EviusReactQuill from '../../shared/eviusReactQuill'; /* Se debe usar este componente para la descripcion */
import { DateTimePicker } from 'react-widgets';
import EventImage from '../../../eventimage.png';
import { Badge, Card, Col, Input, Row, Space, Tooltip, Typography, Form, Modal, List, Button, Spin } from 'antd';
import { CalendarOutlined, CheckCircleFilled, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { useContextNewEvent } from '../../../Context/newEventContext';
import { OrganizationApi } from '../../../helpers/request';

const { Text, Link, Title, Paragraph } = Typography;

const Informacion = (props) => {
  const [organizations, setOrganizations] = useState([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const {
    addDescription,
    showModal,
    isModalVisible,
    handleCancel,
    handleOk,
    typeTransmission,
    visibilityDescription,
    changetypeTransmision,
    changeSelectHours,
    changeSelectDay,
    selectedDay,
    selectedHours,
    dateEvent,
    handleInput,
    valueInputs,
    errorInputs,
    containsError,
    changeOrganization,
    organization,
    selectOrganization,
    selectedOrganization,
    isbyOrganization,
    isLoadingOrganization,
    createOrganizationF,
    newOrganization,
  } = useContextNewEvent();

  useEffect(() => {
    if (props.currentUser && !props.orgId) {
      obtainOrganizations();     
    } // console.log("ISBYORGANIZATION==>",isbyOrganization)
  }, [props.orgId, props.currentUser]);
  async function obtainOrganizations() {    
    isLoadingOrganization(true);
    let organizations = await OrganizationApi.mine(); 
    if (organizations.length == 0) {    
      await createOrganization();
      organizations = await OrganizationApi.mine();
    }

    setOrganizations(organizations);
    selectedOrganization(organizations && organizations[0]);
    isLoadingOrganization(false);
  }
  const createNewOrganization = async (value) => {
    //alert(value);
    //console.log(value);
    setLoadingAdd(true)
    const addOrganization = await createOrganization(value.name);
    if (addOrganization) {
      await obtainOrganizations();      
      newOrganization(false);
      setLoadingAdd(false)
    }
  };
  const createOrganization = async (name) => {
    let newOrganization = {
      name: !name ? props.currentUser?.names || props.currentUser?.name : name,
    };
    //CREAR ORGANIZACION------------------------------
    let create = await OrganizationApi.createOrganization(newOrganization);
    console.log('CREATE==>', create);
    if (create) {
      return create;
    }
    return null;
  };

  const selectOrganizationOK = () => {
    if (!selectOrganization || selectOrganization == null) {
      message.error('Por favor seleccione una organización');
    } else {
      changeOrganization(false);
    }
  };

  return (
    <div className='step-information'>
      <Space direction='vertical' size='middle'>
        <div>
          <Text>
            Nombre del evento <span className='text-color'>*</span>
          </Text>
          <Input
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
          {addDescription ? (
            <div>
              <Text>
                Descripción{' '}
                <Link onClick={() => visibilityDescription(false)}>
                  |{' '}
                  <Tooltip title='Eliminar descripción'>
                    <DeleteOutlined className='text-color' /> <small className='text-color'>Eliminar descripción</small>
                  </Tooltip>
                </Link>
              </Text>
              <Input.TextArea
                value={valueInputs['description'] || ''}
                onChange={(e) => handleInput(e, 'description')}></Input.TextArea>
              {containsError('description') && (
                <Col>
                  {' '}
                  <small className='text-color'>Ingrese una descripción válida</small>
                </Col>
              )}
            </div>
          ) : (
            <Link onClick={() => visibilityDescription(true)}>
              <PlusCircleOutlined /> Agregar descripción
            </Link>
          )}
        </div>
        <div>
          <Text>
            Fecha del evento <span className='text-color'>*</span>
          </Text>
          <Input
            value={dateEvent || ''}
            onClick={showModal}
            suffix={<CalendarOutlined />}
            placeholder='Clic para agregar fecha'
          />
        </div>
        <div>
          <Space direction='vertical'>
            {<a onClick={() => { newOrganization(false); changeOrganization(true);}}>Organización: {selectOrganization?.name}</a>}
            {organization && !isbyOrganization && (
              <Modal
                footer={
                  createOrganizationF
                    ? null
                    : [
                        <Button key='back' onClick={() => changeOrganization(false)}>
                          Cerrar
                        </Button>,
                        <Button key='submit' type='primary' onClick={selectOrganizationOK}>
                          Seleccionar
                        </Button>,
                      ]
                }
                onOk={selectOrganizationOK}
                okText='Seleccionar'
                cancelText='Cerrar'
                title='Organización'
                visible={organization && !isbyOrganization}
                onCancel={() => changeOrganization(false)}>
                {!createOrganizationF && (
                  <Row style={{ marginBottom: 10 }} justify={'end'}>
                    <Button onClick={() => newOrganization(true)}><PlusCircleOutlined /> Agregar</Button>
                  </Row>
                )}
                {createOrganizationF && (
                  <Row style={{ marginBottom: 10 }} justify={'end'}>
                    <Button onClick={() => newOrganization(false)}>Ver organizaciones</Button>
                  </Row>
                )}
                {!createOrganizationF && (
                  <List
                    style={{ height: 400, overflowY: 'auto' }}
                    size='small'
                    bordered
                    dataSource={organizations}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          cursor: 'pointer',
                          color: selectOrganization?.id == item.id ? 'white' : 'rgba(0, 0, 0, 0.85)',
                          background: selectOrganization?.id == item.id ? '#40a9ff' : 'white',
                        }}
                        onClick={() => selectedOrganization(item)}>
                        {item.name}
                      </List.Item>
                    )}
                  />
                )}
                {createOrganizationF && (
                  <div style={{ minHeight: 450 }}>
                    {' '}
                    <Form
                      name='basic'
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      initialValues={{ remember: false }}
                      onFinish={createNewOrganization}
                      onFinishFailed={null}
                      autoComplete='off'>
                      <Form.Item
                        label='Nombre'
                        name='name'
                        rules={[{ required: true, message: 'Ingrese un nombre válido' }]}>
                        <Input></Input>
                      </Form.Item>
                     {!loadingAdd && <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type='primary' htmlType='submit'>
                          Agregar
                        </Button>
                      </Form.Item>}
                      {loadingAdd && <Row justify={'center'}><Spin /></Row>}
                    </Form>
                  </div>
                )}
              </Modal>
            )}
            {/* <Text>
              Tipo de transmisión <span className='text-color'>*</span>
            </Text>
            <Row gutter={[16, 16]} justify='center'>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <Row justify='center'>
                  <Badge count={typeTransmission == 0 ? <CheckCircleFilled className='icon-checkout' /> : 0}>
                    <div className='cards-type-information' onClick={() => changetypeTransmision(0)}>
                      <Space direction='vertical'>
                        <img src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/ceStreaming.png?alt=media&token=e36eac64-5d14-4a3a-995f-b7d239b6bbc1' />
                        <Text strong>Streaming</Text>
                        <Text type='secondary'>
                          Tienes hasta 20 invitados que pueden interactuar con cámara y micrófono y los asistentes
                          podrán solamente ver la conferencia. La cantidad de asistentes es ilimitada
                        </Text>
                      </Space>
                    </div>
                  </Badge>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <Row justify='center'>
                  <Badge count={typeTransmission == 1 ? <CheckCircleFilled className='icon-checkout' /> : 0}>
                    <div className='cards-type-information' onClick={() => changetypeTransmision(1)}>
                      <Space direction='vertical'>
                        <img src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/ceConferencia.png?alt=media&token=a1242e00-2d12-41dc-8ced-82d54db447ba' />

                        <Text strong>Conferencia interactiva</Text>

                        <Text type='secondary'>
                          Todos los asistentes podrán interactuar entre sí. Se podrán conectar hasta 50 participantes
                        </Text>
                      </Space>
                    </div>
                  </Badge>
                </Row>
              </Col>
           </Row>*/}
          </Space>
        </div>
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
              Si tu evento incluye varias actividades las podras crear en la seccion agenda despues de crear el evento.
            </Paragraph>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Informacion;