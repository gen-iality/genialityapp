import { CaretDownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, Collapse, Result, Row, Space, Typography, Avatar, Tooltip, Form, Table, Modal } from 'antd';
import React, { useState } from 'react';
import { IMeeting, IParticipants, typeAttendace, IMeentingItem } from '../interfaces/Meetings.interfaces';
import Countdown from 'antd/lib/statistic/Countdown';
import moment, { now } from 'moment';
import { ColumnsType } from 'antd/lib/table';
import { useContext } from 'react';
import { NetworkingContext } from '../context/NetworkingContext';
const { confirm } = Modal;
export default function MeetingItem({ menting: tempMeenting }: IMeentingItem) {
  const [meenting, setMeentign] = useState<IMeeting>(tempMeenting);
  const { editMeenting, deleteMeeting } = useContext(NetworkingContext);
  const fecha = moment(tempMeenting.date);
  const startTime = moment(tempMeenting.horas[0] || '00:00').format('hh:mm A');
  const endTime = moment(tempMeenting.horas[1] || '00:00').format('hh:mm A');
  const [meentingStart, setmeentingStart] = useState(
    moment(now()).isAfter(`${fecha.format('MM/DD/YYYY')} ${startTime}`)
  );

  console.log('debug component render', startTime, tempMeenting.horas);
  const handleChange = (participant: IParticipants, selected: boolean) => {
    const temp = meenting.participants.map((part) =>
      part.id === participant.id
        ? { ...part, attendance: selected ? typeAttendace.confirmed : typeAttendace.unconfirmed }
        : part
    );
    setMeentign({ ...meenting, participants: temp });
  };

  const columns: ColumnsType<IParticipants> = [
    {
      title: 'Participante',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Asistencia',
      dataIndex: 'attendance',
    },
  ];

  return (
    <Collapse
      collapsible='header'
      expandIcon={({ isActive }) => (
        <Button type='text' shape='circle' icon={<CaretDownOutlined rotate={isActive ? 180 : 0} />}></Button>
      )}
      bordered={false}
      style={{ backgroundColor: '#F9FAFE' }}>
      <Collapse.Panel
        key='1'
        header={
          <Space>
            <Typography.Text style={{ fontSize: '20px', fontWeight: '700', color: '#6F737C' }}>
              {meenting.name}
            </Typography.Text>
            <Typography.Text style={{ fontSize: '14px', fontWeight: '500', color: '#6F737C' }}>{`${fecha.format(
              'DD/MM/YYYY'
            )} - ${startTime}`}</Typography.Text>
          </Space>
        }
        extra={
          <Space>
            <Avatar.Group maxCount={4} maxStyle={{ color: 'white', backgroundColor: '#333F44' }}>
              {meenting.participants.map((participant, key) => (
                <Tooltip key={key} title={participant.name} placement='top'>
                  <Avatar style={{ backgroundColor: '#333F44', color: 'white' }}>
                    {participant.name && participant.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </Avatar.Group>
            <Button icon={<EditOutlined />} onClick={() => editMeenting(meenting)} />
            <Button icon={<DeleteOutlined />} onClick={() => deleteMeeting(meenting.id)} />
          </Space>
        }>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card bordered={false} style={{ backgroundColor: 'transparent' }} bodyStyle={{ padding: '5px' }}>
              <Result
                style={{ padding: '10px' }}
                status={meentingStart ? 'success' : 'info'}
                title={meentingStart ? 'la reunion ya inicio' : 'La reunion iniciara en :'}
                extra={
                  !meentingStart && (
                    <Countdown
                      style={{ margin: 'auto' }}
                      value={`${fecha.format('MM/DD/YYYY')} ${startTime}`}
                      format='D [días] H [horas] m [minutos] s [segundos]'
                      onFinish={() => setmeentingStart(true)}
                    />
                  )
                }
              />
              <Row justify='center' gutter={[16, 16]}>
                <Form layout='inline'>
                  <Form.Item label='Fecha'>
                    <Typography>
                      <pre>{fecha.format('DD/MM/YYYY')}</pre>
                    </Typography>
                  </Form.Item>
                  <Form.Item label='Hora incio'>
                    <Typography>
                      <pre>{startTime}</pre>
                    </Typography>
                  </Form.Item>
                  <Form.Item label='Hora fin'>
                    <Typography>
                      <pre>{endTime}</pre>
                    </Typography>
                  </Form.Item>
                  <Form.Item label='Lugar'>
                    <Typography>
                      <pre>{meenting.place}</pre>
                    </Typography>
                  </Form.Item>
                </Form>
              </Row>
            </Card>
            <Table
              rowSelection={{
                type: 'checkbox',
                onSelect(participant, selected) {
                  handleChange(participant, selected);
                },
              }}
              dataSource={meenting.participants.map((partici, index) => ({ ...partici, key: index }))}
              columns={columns}
            />
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  );
}
