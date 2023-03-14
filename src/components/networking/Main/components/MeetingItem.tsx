import { CaretDownOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
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
  Form,
} from 'antd';
import React from 'react';
import { IMeeting } from '../interfaces/meetings.interfaces';
import Countdown from 'antd/lib/statistic/Countdown';
import moment from 'moment';

export default function MeetingItem({ date, name, place, participants }: IMeeting) {
  const dateFormat = moment(date).format('DD/MM/YYYY hh:mm:ss');
  const prueba = () =>{

  }
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
          <Typography.Text style={{ fontSize: '20px', fontWeight: '700', color: '#6F737C' }}>{name}</Typography.Text>
        }
        extra={
          <Space>
            <Avatar.Group maxCount={4} maxStyle={{ color: 'white', backgroundColor: '#333F44' }}>
              {participants.map((participant, key) => (
                <Tooltip key={key} title={participant.name} placement='top'>
                  <Avatar style={{ backgroundColor: '#333F44', color: 'white' }}>
                    {participant.name && participant.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </Avatar.Group>
            <Button icon={<EditOutlined />} onClick={prueba}/>
            <Button icon={<DeleteOutlined />} onClick={prueba}/>
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
                    value={date.toString()}
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
                    <pre>{place}</pre>
                  </Typography>
                </Form.Item>
                </Form>                
              </Row>
            </Card>
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  );
}
