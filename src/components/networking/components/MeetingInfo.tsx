import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Col, Row, Space, Typography, List, Divider, Checkbox, Badge, Avatar, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { IParticipants, IMeentingItem } from '../interfaces/Meetings.interfaces';
import Countdown from 'antd/lib/statistic/Countdown';
import { useContext } from 'react';
import { NetworkingContext } from '../context/NetworkingContext';
import useDateFormat from '../hooks/useDateFormat';
import useMeetingState from '../hooks/useMeetingState';
import MapMarkerRadiusOutlineIcon from '@2fd/ant-design-icons/lib/MapMarkerRadiusOutline';

export default function MeetingInfo({ meenting }: IMeentingItem) {
  const [participants, setParticipants] = useState<IParticipants[]>(meenting.participants);
  const { dateFormat } = useDateFormat();
  const { updateMeeting } = useContext(NetworkingContext);
  const { resultStatus, messageByState, stateMeeting } = useMeetingState(meenting.start, meenting.end);

  useEffect(() => {
    setParticipants(meenting.participants);
  }, [meenting.participants]);

  const handleChange = async (participant: IParticipants, confirmed: boolean) => {
    const tempParticipants = participants.map((item) => {
      if (item.id === participant.id) {
        return { ...item, confirmed: confirmed };
      } else {
        return item;
      }
    });
    await updateMeeting(meenting.id, { ...meenting, participants: tempParticipants });
  };

  return (
    <>
      <List>
        <List.Item
          extra={
            stateMeeting && stateMeeting === 'scheduled' ?
            <Space direction='vertical' align='center'>
              <ClockCircleOutlined style={{fontSize: 35, color: 'rgba(0, 0, 0, 0.45)'}}/>
              <Typography.Text type='secondary'>Pronto iniciará</Typography.Text>
              <Countdown
                  valueStyle={{fontSize: '11px', color: 'rgba(0, 0, 0, 0.45)'}}
                  value={dateFormat(meenting.start, 'MM/DD/YYYY hh:mm A')}
                  format='D [días] H [horas] m [minutos] '
                />
            </Space> : stateMeeting === 'in-progress' ?
            <Space direction='vertical' align='center'>
              <Badge dot>
                <VideoCameraOutlined style={{fontSize: 35, color: '#1890ff'}}/>
              </Badge>
              <Typography.Text type='secondary'>En progreso</Typography.Text>
            </Space> : stateMeeting === 'completed' ? 
            <Space direction='vertical' align='center'>
              <CheckCircleOutlined style={{fontSize: 35, color: '#52c41a'}}/>
              <Typography.Text type='secondary'>Ha finalizado</Typography.Text>
            </Space> : 
            <></>
          }
        >
          <List.Item.Meta 
            title={<Typography.Title level={4}>{meenting.name}</Typography.Title>}
            description={
              <Space direction='vertical'>
                <Space align='center'>
                  <Button icon={<CalendarOutlined /> } type='text'/>
                  
                  <Typography.Text /* type='secondary' */ style={{fontSize: 13}}>
                    {dateFormat(meenting.start, 'lll A')} - {dateFormat(meenting.end, 'lll A')}
                  </Typography.Text>
                </Space>
                <Space align='center'>
                  <Button icon={<MapMarkerRadiusOutlineIcon style={{fontSize: 18}}/>} type='text'/>
                  
                  <Typography.Text type={meenting.place === 'no especificado' ? 'secondary' : undefined} style={{ textTransform: 'uppercase'}}>
                    {meenting.place}
                  </Typography.Text>
                </Space>
              </Space>
            }
          />
        </List.Item>
      </List>
      <Row justify='center' align='middle' gutter={[16, 16]}>
        <Col span={23}>
          <Divider orientation='left' style={{marginBottom: 0}}>
            <Typography.Text strong>Lista de asistencia</Typography.Text>
          </Divider>
          <List
            style={{padding: '0px 10px'}}
            dataSource={participants}
            pagination={participants.length > 5 && { pageSize: 5 }}
            renderItem={(participant) => (
              <List.Item
                key={participant?.email}
                extra={
                  <Checkbox
                    checked={participant?.confirmed}
                    onChange={(check) => {
                      handleChange(participant, check.target.checked);
                    }}
                    style={{transform: 'scale(1.3)'}}
                  />
                }>
                <List.Item.Meta
                  avatar={
                    participant?.picture ? 
                      <Avatar key={'img' + participant?.id} src={participant?.picture} style={{marginTop:7}} /> : 
                      <Avatar icon={<UserOutlined />} style={{marginTop:7}}/>
                    
                  }
                  title={<Typography.Text>{participant?.name}</Typography.Text>}
                  description={participant?.email}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
}
