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
import { IParticipants, typeAttendace, IMeentingItem } from '../interfaces/Meetings.interfaces';
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
  const [meentingStart, setmeentingStart] = useState(
    moment(new Date()).isAfter(dateFormat(meenting.start, 'MM/DD/YYYY hh:mm A'))
  );
  const { editMeenting, deleteMeeting, updateMeeting } = useContext(NetworkingContext);
  const { resultStatus, messageByState } = useMeetingState(meenting.start, meenting.end);


  const finish = dateFormat(new Date(), 'MM/DD/YYYY hh:mm A') >= dateFormat(meenting.end, 'MM/DD/YYYY hh:mm A');

  useEffect(() => {
    setParticipants(meenting.participants);
  }, [meenting.participants]);

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
      expandIcon={({ isActive }) => (
        <div style={{ paddingTop: '6px' }}>
          <CaretDownOutlined rotate={isActive ? 180 : 0} />
        </div>
      )}
      bordered={false}
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
                icon={finish && <SmileOutlined />}
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
            {/* <Row justify='end' style={{paddingTop: '15px'}}>
              <Col>
                <Tooltip placement='topLeft' title='Guardar'>
                  <Button type='primary' disabled={!meentingStart} icon={<SaveOutlined />} onClick={() => onUpdate()} />
                </Tooltip>
              </Col>
            </Row> */}
            {/* <Table
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
            /> */}

            <Row justify='center' gutter={8} style={{ paddingTop: '15px' }}>
              <Col span={23}>
                <Card hoverable>
                  <Divider orientation='left'>
                    <Typography.Title level={5}>Lista de asistencia</Typography.Title>
                  </Divider>
                  <List
                    dataSource={participants.map((partici) => ({ ...partici, key: partici.id }))}
                    pagination={participants.length > 5 && { pageSize: 5 }}
                    renderItem={(participant) => (
                      <List.Item
                        key={participant.email}
                        extra={
                          <Checkbox
                            checked={participant.attendance === typeAttendace.confirmed}
                            /* onChange={} //logica del cambio para la confirmacion */
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
