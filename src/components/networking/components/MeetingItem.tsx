import {
  CaretDownOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Collapse,
  Result,
  Row,
  Space,
  Typography,
  Avatar,
  Tooltip,
  Modal,
  List,
  Divider,
  Checkbox,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { IParticipants, IMeentingItem } from '../interfaces/Meetings.interfaces';
import Countdown from 'antd/lib/statistic/Countdown';
// eslint-disable-next-line no-use-before-define
import moment from 'moment';
import { useContext } from 'react';
import { NetworkingContext } from '../context/NetworkingContext';
import useDateFormat from '../hooks/useDateFormat';
import useMeetingState from '../hooks/useMeetingState';

const { confirm } = Modal;

export default function MeetingItem({ meenting }: IMeentingItem) {
  const [participants, setParticipants] = useState<IParticipants[]>(meenting.participants);
  const { dateFormat, hoursFormat } = useDateFormat();
  const [startTime] = hoursFormat([meenting.start]);

  const { editMeenting, deleteMeeting, updateMeeting } = useContext(NetworkingContext);
  const { resultStatus, messageByState, stateMeeting } = useMeetingState(meenting.start, meenting.end);

  useEffect(() => {
    setParticipants(meenting.participants);
  }, [meenting.participants]);

  const handleChange = async (participant: IParticipants, confirmed : boolean) => {
    const tempParticipants = participants.map((item) => {
      if(item.id === participant.id){
        return {...item, confirmed : confirmed}
      }else {
        return item
      }
    })
    await updateMeeting(meenting.id, { ...meenting, participants: tempParticipants });
  };

  const onDelete = () => {
    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        deleteMeeting(meenting.id);
      },
    });
  };
  
  return (
    <Collapse
      expandIcon={({ isActive }) => (
        <div style={{ paddingTop: '6px' }}>
          <CaretDownOutlined rotate={isActive ? 180 : 0} />
        </div>
      )}
      bordered={false}
      collapsible='header'
      style={{ backgroundColor: '#F9FAFE' }}>
      <Collapse.Panel
        key='1'
        header={
          <Space style={{ userSelect: 'none' }}>
            <Typography.Text style={{ fontSize: '20px', fontWeight: '700', color: '#6F737C' }}>
              {meenting.name}
            </Typography.Text>
            <Typography.Text style={{ fontSize: '14px', fontWeight: '500', color: '#6F737C' }}>{`${dateFormat(
              meenting.start
            )} - ${startTime}`}</Typography.Text>
          </Space>
        }
        extra={
          <Row gutter={4}>
            <Col>
              <Avatar.Group maxCount={4} maxStyle={{ color: 'white', backgroundColor: '#333F44' }}>
                {participants.map((participant, key) => (
                  <Tooltip key={key} title={participant.name} placement='top'>
                    <Avatar style={{ backgroundColor: '#333F44', color: 'white' }}>
                      {participant.name && participant.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </Col>
            <Col>
              <Tooltip placement='topLeft' title='Editar'>
                <Button icon={<EditOutlined />} onClick={() => editMeenting(meenting)} />
              </Tooltip>
            </Col>
            <Col>
              <Tooltip placement='topLeft' title='Eliminar'>
                <Button icon={<DeleteOutlined />} onClick={() => onDelete()} danger type='primary' />
              </Tooltip>
            </Col>
          </Row>
        }>
        <Row justify='center' align='middle' gutter={[16, 16]}>
          <Col span={24}>
            <Card bordered={false} style={{ backgroundColor: 'transparent' }} bodyStyle={{ padding: '5px' }}>
              <Result
                style={{ paddingTop: '2px', paddingBottom: '20px' }}
                status={resultStatus}
                title={messageByState}
                icon={stateMeeting === 'completed' && <SmileOutlined />}
                extra={
                  stateMeeting === 'scheduled' && (
                    <Countdown
                      style={{ margin: 'auto' }}
                      value={dateFormat(meenting.start, 'MM/DD/YYYY hh:mm A')}
                      format='D [días] H [horas] m [minutos] s [segundos]'
                    />
                  )
                }
              />
              <Row justify='center' align='middle' gutter={[16, 16]} wrap>
                <Col>
                  <Space wrap>
                    <Typography.Text strong>Fecha incio:</Typography.Text>
                    <Typography.Text code>{dateFormat(meenting.start, 'MM/DD/YYYY hh:mm A')}</Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Space wrap>
                    <Typography.Text strong>Fecha fin: </Typography.Text>
                    <Typography.Text code>{dateFormat(meenting.end, 'MM/DD/YYYY hh:mm A')}</Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Space wrap>
                    <Typography.Text strong>Lugar: </Typography.Text>
                    <Typography.Text code style={{ textTransform: 'uppercase' }}>
                      {meenting.place}
                    </Typography.Text>
                  </Space>
                </Col>
              </Row>
            </Card>
            <Row justify='center' gutter={8} style={{ paddingTop: '15px' }}>
              <Col span={23}>
                <Card hoverable>
                  <Divider orientation='left'>
                    <Typography.Title level={5}>Lista de asistencia</Typography.Title>
                  </Divider>
                  <List
                    dataSource={participants}
                    pagination={participants.length > 5 && { pageSize: 5 }}
                    renderItem={(participant) => (
                      <List.Item
                        key={participant.email}
                        extra={
                          <Checkbox
                             checked={participant.confirmed}
                             onChange={(check)=>{
                              handleChange(participant,check.target.checked)
                             }}
                             style={{transform: 'scale(1.3)'}}
                          />
                        }>
                        <List.Item.Meta
                          title={<Typography.Text strong>{participant.name}</Typography.Text>}
                          description={participant.email}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  );
}
