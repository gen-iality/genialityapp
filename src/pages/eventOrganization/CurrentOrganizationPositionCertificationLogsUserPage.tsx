import { EventsApi, PositionsApi, UsersApi, CerticationsApi } from '@helpers/request';
import {
  Typography,
  Table,
  Spin,
  Row,
  Col,
  Button,
  Tooltip,
  Tag,
  Modal,
  Form,
  Select,
  Switch,
  InputNumber,
  Input,
  DatePicker,
} from 'antd';
import Header from '@antdComponents/Header';
import { ColumnsType } from 'antd/lib/table';
import { useState, useEffect } from 'react';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export interface CurrentOrganizationPositionCertificationLogsUserPageProps {
  org: any;
  match: {
    params: {
      positionId: string;
      userId: string;
    };
    url: string;
  };
}

function CurrentOrganizationPositionCertificationLogsUserPage(
  props: CurrentOrganizationPositionCertificationLogsUserPageProps,
) {
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const [allPositionEvents, setAllPositionEvents] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentPosition, setCurrentPosition] = useState<any | null>(null);

  const [dataSource, setDataSource] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const organizationId: string = props.org._id;
  const positionId = props.match.params.positionId;
  const userId = props.match.params.userId;

  const loadData = async () => {
    const user = await UsersApi.getProfile(userId);
    setCurrentUser(user);

    const position = await PositionsApi.getOne(positionId);
    setCurrentPosition(position);
    console.debug('CurrentOrganizationPositionPage: loadPositionData', { position });

    const certifications = await CerticationsApi.getByPositionAndMaybeUser(position._id, user._id);

    const allEventIds = position.event_ids || [];
    const events = await Promise.all(allEventIds.map(async (eventId: string) => await EventsApi.getOne(eventId)));
    setAllEvents(events.filter((event) => event.is_certification));
    setAllPositionEvents(
      events.map((event) => {
        const filteredCertification = certifications.find((certification: any) => certification.event_id === event._id);
        return {
          ...event,
          certification: filteredCertification,
        };
      }),
    );
  };

  // Load all users for this position
  useEffect(() => {
    setIsLoading(true);

    loadData().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const data: any[] = []
    allPositionEvents.forEach((event) => {
      const { certification } = event
      // If there is not certification, ignore this event
      if (!certification) return
      // Build a data with: event, certification, certification log, to use in the table
      (certification.certification_logs || []).forEach((log: any) => {
        data.push({ event, certification, log })
      })
    })
    setDataSource(data)
  }, [allPositionEvents])

  useEffect(() => {
    const newColumns: ColumnsType = [
      {
        title: 'Certificación de',
        dataIndex: 'event',
        render: (event: any) => <span>{event.name}</span>,
      },
      {
        title: 'Estado',
        align: 'center',
        width: 100,
        dataIndex: 'log',
        render: (log: any) => (
          <Tag color={log?.success ? 'green' : 'red'}>
            {log?.success ? 'Aprobado' : 'No aprobado'}
          </Tag>
        ),
      },
      {
        title: 'Fecha de emisión',
        align: 'center',
        width: 100,
        dataIndex: 'log',
        render: (log: any) => (
          <>
            {log?.approved_from_date
              ? dayjs(log?.approved_from_date).format('DD/MM/YYYY')
              : 'sin fecha'}
          </>
        ),
      },
      {
        title: 'Fecha de vencimiento',
        align: 'center',
        width: 100,
        dataIndex: 'log',
        render: (log: any) => (
          <>
            {log?.approved_until_date
              ? dayjs(log?.approved_until_date).format('DD/MM/YYYY')
              : 'sin fecha'}
          </>
        ),
      },
      {
        title: 'Estado de vigencia',
        align: 'center',
        width: 100,
        dataIndex: 'log',
        render: (log: any) => {
          let lema = 'Inactivo';
          if (log?.approved_until_date) {
            if (dayjs(log?.approved_until_date) > dayjs(Date.now())) {
              lema = 'Activo';
            }
          }
          return (
            <>
              <Tag color={lema === 'Inactivo' ? 'red' : 'green'}>{lema}</Tag>
            </>
          );
        },
      },
    ];

    setColumns(newColumns);
  }, [dataSource]);

  return (
    <>
      <Header
        title={(
          <>
          {`Historial de certificados de `}
          {currentUser ? <>{currentUser.names}</> : <Spin />}
          {` en el cargo de `}
          {currentPosition ? <>{currentPosition.position_name}</> : <Spin />}
          </>
        )}
      />
      <Typography.Paragraph>Este es el historial de certificaciones.</Typography.Paragraph>

      <Table
        columns={columns}
        dataSource={dataSource}
        size="small"
        rowKey="index"
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
      />
    </>
  );
}

export default CurrentOrganizationPositionCertificationLogsUserPage;