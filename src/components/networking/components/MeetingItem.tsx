import {
  CaretDownOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Collapse, Result, Row, Space, Typography, Avatar, Tooltip, Form, Table, Modal } from 'antd';
import React, { useState } from 'react';
import { IParticipants, typeAttendace, IMeentingItem } from '../interfaces/Meetings.interfaces';
import Countdown from 'antd/lib/statistic/Countdown';
import moment, { now } from 'moment';
import { useContext } from 'react';
import { NetworkingContext } from '../context/NetworkingContext';
import { columnsParticipants } from '../utils/utils';
import useDateFormat from '../hooks/useDateFormat';
const { confirm } = Modal;

export default function MeetingItem({ meenting }: IMeentingItem) {
  const [participants, setParticipants] = useState<IParticipants[]>(meenting.participants);
  const { dateFormat, hoursFormat } = useDateFormat();
  const [startTime] = hoursFormat([meenting.start]);
  const [meentingStart, setmeentingStart] = useState(
    moment(now()).isAfter(dateFormat(meenting.start, 'MM/DD/YYYY hh:mm A'))
  );
  const { editMeenting, deleteMeeting, updateMeeting } = useContext(NetworkingContext);

  const handleChange = (participants: IParticipants[]) => {
    const confirmedIds = participants.map((part) => part.id);
    const temp = meenting.participants.map((part) =>
      confirmedIds.includes(part.id)
        ? { ...part, attendance: typeAttendace.confirmed }
        : { ...part, attendance: typeAttendace.unconfirmed }
    );
    setParticipants(temp);
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

  const onUpdate = async () => {
    await updateMeeting(meenting.id, { ...meenting, participants: participants });
  };
  return (
    <Collapse
      /* collapsible='header' */
      expandIcon={({ isActive }) => <div style={{paddingTop: '6px'}}><CaretRightOutlined rotate={isActive ? 90 : 0} /></div>}
      /* expandIcon={({ isActive }) => (
        <Button type='text' shape='circle' icon={<CaretDownOutlined rotate={isActive ? 180 : 0} />}></Button>
      )} */
      bordered={false}
      style={{ backgroundColor: '#F9FAFE' }}>
      <Collapse.Panel
        key='1'
        header={
          <Space style={{userSelect : 'none'}}>
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
            <Col><Avatar.Group maxCount={4} maxStyle={{ color: 'white', backgroundColor: '#333F44' }}>
              {participants.map((participant, key) => (
                <Tooltip key={key} title={participant.name} placement='top'>
                  <Avatar style={{ backgroundColor: '#333F44', color: 'white'}}>
                    {participant.name && participant.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </Avatar.Group></Col>
            <Col><Button icon={<EditOutlined />} onClick={() => editMeenting(meenting)} /></Col>
            <Col><Button icon={<DeleteOutlined />} onClick={() => onDelete()} type='danger' /></Col>            
          </Row>
        }>
        <Row justify='center' align='middle' gutter={[16, 16]}>
          <Col span={24}>
            <Card bordered={false} style={{ backgroundColor: 'transparent' }} bodyStyle={{ padding: '5px' }}>
              <Result
                style={{ paddingTop: '2px', paddingBottom: '15px' }}
                status={meentingStart ? 'success' : 'info'}
                title={meentingStart ? 'La reunión ya inicio' : 'La reunión iniciará en :'}
                extra={
                  !meentingStart && (
                    <Countdown
                      style={{ margin: 'auto' }}
                      value={dateFormat(meenting.start, 'MM/DD/YYYY hh:mm A')}
                      format='D [días] H [horas] m [minutos] s [segundos]'
                      onFinish={() => setmeentingStart(true)}
                    />
                  )
                }
              />
              <Row justify='center' align='middle' gutter={[16, 16]}>
                <Form layout='inline'>
                  <Space wrap>
                    <Form.Item label='Fecha incio'>
                      <Typography>
                        <pre style={{margin: 0}}>{dateFormat(meenting.start, 'MM/DD/YYYY hh:mm A')}</pre>
                      </Typography>
                    </Form.Item>
                    <Form.Item label='Fecha fin'>
                      <Typography>
                        <pre style={{margin: 0}}>{dateFormat(meenting.end, 'MM/DD/YYYY hh:mm A')}</pre>
                      </Typography>
                    </Form.Item>
                    <Form.Item label='Lugar'>
                      <Typography>
                        <pre style={{margin: 0, textTransform: 'uppercase'}}>{meenting.place}</pre>
                      </Typography>
                    </Form.Item>
                  </Space>
                </Form>
              </Row>
            </Card>
            <Table
              rowSelection={{
                type: 'checkbox',
                defaultSelectedRowKeys: participants
                  .filter((partici) => partici.attendance === typeAttendace.confirmed)
                  .map((item) => item.id),
                onChange(_selectkey, participants) {
                  handleChange(participants);
                },
              }}
              dataSource={participants.map((partici) => ({ ...partici, key: partici.id }))}
              columns={columnsParticipants}
              scroll={{x: 'auto'}}
            />
            <Button disabled={!meentingStart} icon={<SaveOutlined />} onClick={() => onUpdate()} />
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  );
}
