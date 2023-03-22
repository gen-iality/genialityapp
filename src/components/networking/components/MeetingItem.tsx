import {
  CaretDownOutlined,
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
import useDateForm from '../hooks/useDateFormat';
const { confirm } = Modal;

export default function MeetingItem({ meenting }: IMeentingItem) {
  const [participants, setParticipants] = useState<IParticipants[]>(meenting.participants);
  const { dateFormat, hoursFormat } = useDateForm();
  const [startTime, endTime] = hoursFormat([meenting.start, meenting.end]);

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
            <Typography.Text style={{ fontSize: '14px', fontWeight: '500', color: '#6F737C' }}>{`${dateFormat(
              meenting.start
            )} - ${startTime}`}</Typography.Text>
          </Space>
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
            <Button icon={<EditOutlined />} onClick={() => editMeenting(meenting)} />
            <Button icon={<DeleteOutlined />} onClick={() => onDelete()} />
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
                      value={dateFormat(meenting.start, 'MM/DD/YYYY hh:mm A')}
                      format='D [días] H [horas] m [minutos] s [segundos]'
                      onFinish={() => setmeentingStart(true)}
                    />
                  )
                }
              />
              <Row justify='center' gutter={[16, 16]}>
                <Form layout='inline'>
                  <Form.Item label='Fecha incio'>
                    <Typography>
                      <pre>{dateFormat(meenting.start, 'MM/DD/YYYY hh:mm A')}</pre>
                    </Typography>
                  </Form.Item>
                  <Form.Item label='Fecha fin'>
                    <Typography>
                      <pre>{dateFormat(meenting.end, 'MM/DD/YYYY hh:mm A')}</pre>
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
                defaultSelectedRowKeys: participants
                  .filter((partici) => partici.attendance === typeAttendace.confirmed)
                  .map((item) => item.id),
                onChange(_selectkey, participants) {
                  handleChange(participants);
                },
              }}
              dataSource={participants.map((partici) => ({ ...partici, key: partici.id }))}
              columns={columnsParticipants}
            />
            <Button disabled={!meentingStart} icon={<SaveOutlined />} onClick={() => onUpdate()} />
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  );
}
