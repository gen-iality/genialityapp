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
import { Link } from 'react-router-dom';

export interface CurrentOrganizationPositionCertificationUserPageProps {
  org: any;
  match: {
    params: {
      positionId: string;
      userId: string;
    };
    url: string;
  };
}

function CurrentOrganizationPositionCertificationUserPage(
  props: CurrentOrganizationPositionCertificationUserPageProps,
) {
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const [allPositionEvents, setAllPositionEvents] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentPosition, setCurrentPosition] = useState<any | null>(null);

  const [isModalOpened, setIsModalOpened] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const [form] = Form.useForm();

  const organizationId: string = props.org._id;
  const positionId = props.match.params.positionId;
  const userId = props.match.params.userId;

  const openModal = () => setIsModalOpened(true);
  const closeModal = () => setIsModalOpened(false);

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

  const onFormFinish = (values: any) => {
    if (!currentUser) {
      alert('No se ha cargado el usuario con anterioridad');
      return;
    }
    values['user_id'] = currentUser._id;
    console.debug('form submit', { values });

    setIsSubmiting(true);
    CerticationsApi.create(values).finally(() => {
      setIsSubmiting(false);
      setIsLoading(true);
      loadData().finally(() => setIsLoading(false));
    });
  };

  // Load all users for this position
  useEffect(() => {
    setIsLoading(true);

    loadData().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const newColumns: ColumnsType = [
      {
        title: 'Certificación de',
        render: (event: any) => <span>{event.name}</span>,
      },
      {
        title: 'Historial',
        dataIndex: 'certification',
        align: 'center',
        width: 100,
        render: (certification: any) => (
          <>
          {(certification?.certification_logs || []).length === 0 ? (
            <em>Sin registros</em>
          ) : (
            <Link to={`${props.match.url}/logs`}>
              <Tag color='#88f'>
                {(certification?.certification_logs || []).length} registros
              </Tag>
            </Link>
          )}
          </>
        ),
      },
      {
        title: 'Estado de aprobación',
        align: 'center',
        width: 100,
        dataIndex: 'certification',
        render: (certification: any) => (
          <Tag color={certification?.success ? 'green' : 'red'}>
            {certification?.success ? 'Aprobado' : 'No aprobado'}
          </Tag>
        ),
      },
      {
        title: 'Fecha de emisión',
        align: 'center',
        width: 100,
        dataIndex: 'certification',
        render: (certification: any) => (
          <>
            {certification?.approved_from_date
              ? dayjs(certification?.approved_from_date).format('DD/MM/YYYY')
              : 'sin fecha'}
          </>
        ),
      },
      {
        title: 'Fecha de vencimiento',
        align: 'center',
        width: 100,
        dataIndex: 'certification',
        render: (certification: any) => (
          <>
            {certification?.approved_until_date
              ? dayjs(certification?.approved_until_date).format('DD/MM/YYYY')
              : 'sin fecha'}
          </>
        ),
      },
      {
        title: 'Estado de vigencia',
        align: 'center',
        width: 100,
        dataIndex: 'certification',
        render: (certification: any) => {
          let lema = 'Inactivo';
          if (certification?.approved_until_date) {
            if (dayjs(certification?.approved_until_date) > dayjs(Date.now())) {
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
      {
        title: 'Opciones',
        width: 80,
        render: (event: any) => (
          <Tooltip title="Borrar">
            <Button
              id={`deleteAction${event._id}`}
              type="primary"
              size="small"
              onClick={(e) => alert('No implementado aún')}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        ),
      },
    ];

    setColumns(newColumns);
  }, [allPositionEvents]);

  return (
    <>
      <Header
        title={(
          <>
          {`Certificados de `}
          {currentUser ? <>{currentUser.names}</> : <Spin />}
          {` en el cargo de `}
          {currentPosition ? <>{currentPosition.position_name}</> : <Spin />}
          </>
        )}
      />
      <Typography.Paragraph>Estos son los certificados de dicho usuario.</Typography.Paragraph>

      <Typography.Paragraph>Este cargo requiere {allPositionEvents.length} certificaciones.</Typography.Paragraph>

      <Table
        columns={columns}
        dataSource={allPositionEvents}
        size="small"
        rowKey="index"
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
        title={() => (
          <Row wrap justify="end" gutter={[8, 8]}>
            <Col>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  form.resetFields();
                  openModal();
                }}
              >
                Agregar certificación
              </Button>
              {isSubmiting && <Spin />}
            </Col>
          </Row>
        )}
      />

      <Modal
        visible={isModalOpened}
        title={`Agrega una certificación a usuario: ${currentUser?.names}`}
        onOk={() => {
          form.submit();
          closeModal();
        }}
        onCancel={() => closeModal()}
      >
        <Form form={form} onFinish={onFormFinish}>
          <Form.Item name="event_id" label="Curso a dar certificación" rules={[{ required: true, message: 'Esto' }]}>
            <Select
              onChange={(value) => {
                /**
                 * When the user change the event to create the certificaciton,
                 * then this code will update the default value for description,
                 * entity and hours.
                 */
                const event = allEvents.find((event) => event._id == value)
                console.log('value changed to:', value, event)
                if (event) {
                  form.setFieldsValue({
                    description: event.default_certification_description,
                    entity: event.default_certification_entity,
                    hours: event.default_certification_hours ?? 1,
                  })
                }
              }}
              options={allEvents.map((event) => ({ label: event.name, value: event._id }))}
            />
          </Form.Item>
          <Form.Item name="success" label="Exitoso">
            <Switch />
          </Form.Item>
          <Form.Item name="description" label="Descripción" rules={[{ required: true, message: 'Ah!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="hours" label="Horas" rules={[{ required: true, message: 'Ah!' }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="entity" label="Entidad" rules={[{ required: true, message: 'Ah!' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="approved_from_date"
            label="Fecha de aprobación"
            rules={[{ required: true, message: 'Cuándo!' }]}
            initialValue={dayjs(Date.now())}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="approved_until_date"
            label="Fecha de vencimiento"
            rules={[{ required: true, message: 'Cuándo!' }]}
            initialValue={dayjs(Date.now())}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CurrentOrganizationPositionCertificationUserPage;
