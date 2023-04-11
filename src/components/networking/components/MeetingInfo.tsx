import { SmileOutlined } from '@ant-design/icons';
import { Card, Col, Result, Row, Space, Typography, List, Divider, Checkbox } from 'antd';
import React, { useState, useEffect } from 'react';
import { IParticipants, IMeentingItem } from '../interfaces/Meetings.interfaces';
import Countdown from 'antd/lib/statistic/Countdown';
import { useContext } from 'react';
import { NetworkingContext } from '../context/NetworkingContext';
import useDateFormat from '../hooks/useDateFormat';
import useMeetingState from '../hooks/useMeetingState';

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
                        onChange={(check) => {
                          handleChange(participant, check.target.checked);
                        }}
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
  );
}
