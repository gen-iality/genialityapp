import { CaretDownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, Collapse, Result, Row, Space, Typography, Avatar, Tooltip, Form, Table } from 'antd';
import React , { useState } from 'react';
import { IMeeting, IParticipants, typeAttendace } from '../interfaces/meetings.interfaces';
import Countdown from 'antd/lib/statistic/Countdown';
import moment from 'moment';
import { ColumnsType } from 'antd/lib/table';


export default function MeetingItem(menting : IMeeting) {
  const [meentign, setMeentign] = useState<IMeeting>(menting)
  const dateFormat = moment(meentign.date).format('DD/MM/YYYY hh:mm:ss');

  const ParticipanConfirm = (participant: IParticipants, selected : boolean) => {
    console.log(participant)
    const temp = meentign.participants.map((part) => (part.id === participant.id ? {...part,attendance : selected ? typeAttendace.confirmed : typeAttendace.unconfirmed} : part))
    setMeentign({...meentign, participants : temp }) ;
  };
  const prueba = () => {};

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
      expandIcon={({ isActive }) => (
        <Button type='text' shape='circle' icon={<CaretDownOutlined rotate={isActive ? 180 : 0} />}></Button>
      )}
      bordered={false}
      style={{ backgroundColor: '#F9FAFE' }}>
      <Collapse.Panel
        key='1'
        header={
          <Space>
            <Typography.Text style={{ fontSize: '20px', fontWeight: '700', color: '#6F737C' }}>{name}</Typography.Text>
            <Typography.Text style={{ fontSize: '14px', fontWeight: '500', color: '#6F737C' }}>{dateFormat}</Typography.Text>
          </Space>
        }
        extra={
          <Space>
            <Avatar.Group maxCount={4} maxStyle={{ color: 'white', backgroundColor: '#333F44' }}>
              {meentign.participants.map((participant, key) => (
                <Tooltip key={key} title={participant.name} placement='top'>
                  <Avatar style={{ backgroundColor: '#333F44', color: 'white' }}>
                    {participant.name && participant.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </Avatar.Group>
            <Button icon={<EditOutlined />} onClick={prueba} />
            <Button icon={<DeleteOutlined />} onClick={prueba} />
          </Space>
        }>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card bordered={false} style={{ backgroundColor: 'transparent' }} bodyStyle={{ padding: '5px' }}>
              <Result
                style={{ padding: '10px' }}
                status={'info'}
                title='La reunion iniciara en :'
                extra={
                  <Countdown
                    style={{ margin: 'auto' }}
                    value={meentign.date.toString()}
                    format='D [días] H [horas] m [minutos] s [segundos]'
                  />
                }
              />
              <Row justify='center' gutter={[16, 16]}>
                <Form layout='inline'>
                  <Form.Item label='Fecha'>
                    <Typography>
                      <pre>{dateFormat}</pre>
                    </Typography>
                  </Form.Item>
                  <Form.Item label='Lugar'>
                    <Typography>
                      <pre>{meentign.place}</pre>
                    </Typography>
                  </Form.Item>
                </Form>
              </Row>
            </Card>
            <Table
              rowSelection={{
                type: 'checkbox',
                onSelect(participant,selected) {
                  ParticipanConfirm(participant,selected);
                },
              }}
              dataSource={meentign.participants.map((partici,index)=>({...partici,key : index}))}
              columns={columns}
            />
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  );
}
