import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Col, Row, Space, Typography, List, Divider, Checkbox, Badge, Avatar, Button, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { IParticipants, IMeentingItem } from '../interfaces/Meetings.interfaces';
import Countdown from 'antd/lib/statistic/Countdown';
import { useContext } from 'react';
import { NetworkingContext } from '../context/NetworkingContext';
import useDateFormat from '../hooks/useDateFormat';
import useMeetingState from '../hooks/useMeetingState';
import MapMarkerRadiusOutlineIcon from '@2fd/ant-design-icons/lib/MapMarkerRadiusOutline';
import CalendarTodayIcon from '@2fd/ant-design-icons/lib/CalendarToday';
import CalendarIcon from '@2fd/ant-design-icons/lib/Calendar';
import moment from 'moment';

export default function MeetingInfo({ meenting }: IMeentingItem) {
  const [participants, setParticipants] = useState<IParticipants[]>(meenting.participants);
  const { dateFormat } = useDateFormat();
  const { updateMeeting } = useContext(NetworkingContext);
  const { stateMeeting } = useMeetingState(meenting.start, meenting.end);

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
      <Row justify='center' align='middle' gutter={[16, 16]}>
        <Col span={24}>
          <Space direction='vertical'>
            <Space align='center'>
              <Typography.Text>
                <Typography.Text strong style={{fontSize: 20, color: 'rgba(0, 0, 0, 0.85)'}}>{meenting.name}</Typography.Text>
                <Tag style={{marginLeft: 5}} color={
                  stateMeeting && stateMeeting === 'scheduled' ? 'cyan'
                  : stateMeeting === 'in-progress' ? 'geekblue'
                  : stateMeeting === 'completed' ? 'default'
                  : 'cyan'
                }>
                  {
                    stateMeeting && stateMeeting === 'scheduled' ? 
                    <span>Inicia {moment(meenting.start).from(moment())}</span> 
                    : stateMeeting === 'in-progress' ?
                    <span>En progreso</span> 
                    : stateMeeting === 'completed' ?
                    <span>Finalizado</span>
                    : 
                    <></>
                  }
                </Tag>
              </Typography.Text>
            </Space>
            <Space align='center'>
              <Button icon={<CalendarTodayIcon style={{fontSize: 20, color: 'rgba(0, 0, 0, 0.45)'}}/> } type='text' style={{cursor: 'default'}}/>
              <Typography.Text>
                {dateFormat(meenting.start, 'lll A')}
              </Typography.Text>
            </Space>
            <Space align='center'>
              <Button icon={<CalendarIcon style={{fontSize: 20, color: 'rgba(0, 0, 0, 0.45)'}}/> } type='text' style={{cursor: 'default'}}/>
              <Typography.Text>
                {dateFormat(meenting.end, 'lll A')}
              </Typography.Text>
            </Space>
            <Space align='center'>
              <Button icon={<MapMarkerRadiusOutlineIcon style={{fontSize: 20, color: 'rgba(0, 0, 0, 0.45)'}}/>} type='text' style={{cursor: 'default'}}/>
              <Typography.Text type={meenting.place === 'no especificado' ? 'secondary' : undefined} style={{ textTransform: 'uppercase'}}>
                {meenting.place}
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <List
            header={<Typography.Text strong>Lista de asistencia</Typography.Text>}
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
                  /* avatar={
                    participant?.picture ? 
                      <Avatar key={'img' + participant?.id} src={participant?.picture} style={{marginTop:7}} /> : 
                      <Avatar icon={<UserOutlined />} style={{marginTop:7}}/>
                    
                  } */
                  avatar={
                    <Avatar style={{ backgroundColor: '#333F44', color: 'white', marginTop:7 }}>
                      {participant.name && participant.name.charAt(0).toUpperCase()}
                    </Avatar>
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
