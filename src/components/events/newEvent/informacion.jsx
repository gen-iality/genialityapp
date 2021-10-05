import React, { useContext } from 'react';
import EviusReactQuill from '../../shared/eviusReactQuill'; /* Se debe usar este componente para la descripcion */
import { DateTimePicker } from 'react-widgets';
import EventImage from '../../../eventimage.png';
import { Badge, Card, Col, Input, Row, Space, Tooltip, Typography,Form } from 'antd';
import { CalendarOutlined, CheckCircleFilled, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { useContextNewEvent } from '../../../Context/newEventContext';

const { Text, Link, Title, Paragraph } = Typography;

const Informacion = (props) => {
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
    containsError
  } = useContextNewEvent();

 
  return (
    
    <div className='step-information'>
      <Space direction='vertical' size='middle'>
        <div>
        {console.log("EINPUTS==>",errorInputs)}
          <Text>
            Nombre del evento <span className='text-color'>*</span>
          </Text>
          <Input  onChange={(e)=>handleInput(e,"name")} placeholder='Nombre del evento' />
          {containsError('name') &&  <Col> <small className='text-color'>Ingrese un nombre correcto para el evento</small></Col> }
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
              <Input.TextArea onChange={(e)=> handleInput(e,'description')}></Input.TextArea>
              {containsError('description') &&  <Col> <small className='text-color'>Ingrese una descripción válida</small></Col> }
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
          <Input value={dateEvent || ""} onClick={showModal} suffix={<CalendarOutlined />} placeholder='Clic para agregar fecha' />
        </div>
        <div>
          <Space direction='vertical'>
            <Text>
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
            </Row>
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
                      onChange={(hours) => changeSelectHours({...selectedHours,from:hours})}
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
                      onChange={(hours) => changeSelectHours({...selectedHours,at:hours})}
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
