import { EventsApi, PositionsApi, UsersApi, CerticationsApi } from '@helpers/request'
import { Typography, Table, Spin, Row, Col, Button, Tooltip, Tag } from 'antd'
import Header from '@antdComponents/Header'
import { ColumnsType } from 'antd/lib/table'
import {
  useState,
  useEffect,
} from 'react'
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

export interface CurrentOrganizationPositionCertificationUserPageProps {
  org: any,
  match: {
    params: {
      positionId: string,
      userId: string,
    },
    url: string,
  },
}

function CurrentOrganizationPositionCertificationUserPage(props: CurrentOrganizationPositionCertificationUserPageProps) {
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const [allPositionEvents, setAllPositionEvents] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentPosition, setCurrentPosition] = useState<any | null>(null);

  const [allCertifications, setAllCertifications] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const organizationId: string = props.org._id;
  const positionId = props.match.params.positionId;
  const userId = props.match.params.userId;

  const loadData = async () => {
    const user = await UsersApi.getProfile(userId)
    setCurrentUser(user);

    const position = await PositionsApi.getOne(positionId)
    setCurrentPosition(position)
    console.debug('CurrentOrganizationPositionPage: loadPositionData',  {position})

    const certifications = await CerticationsApi.getAll(organizationId)
    setAllCertifications(certifications.filter((certification: any) => {
      return (position.event_ids.includes(certification.event_id) && certification.user_id === userId)
    }))

    const allEventIds = (position.event_ids || [])
    const events = await Promise.all(
      allEventIds.map(async (eventId: string) => (await EventsApi.getOne(eventId))),
    )
    setAllPositionEvents(events.map((event) => {
      const eventId = event._id
      const filteredCertification = certifications.filter((certification: any) => certification.event_id === eventId)
      return {
        ...event,
        certification: filteredCertification,
      }
    }))
  }

  // Load all users for this position
  useEffect(() => {
    setIsLoading(true)

    loadData().finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const newColumns: ColumnsType = [
      {
        title: 'Certificación de',
        render: (event: any) => <p>{event.name}</p>
      },
      {
        title: 'Estado',
        width: 100,
        render: (event: any) => (
          <Tag
            color={event.certification?.success ? 'green' : 'red'}
          >
            {event.certification?.success ? 'pasado' : 'fallido'}
          </Tag>
        ),
      },
      {
        title: 'Fecha aprobación',
        width: 100,
        render: (event: any) => (
          <>{dayjs(event.certification?.approved_from_date).format('DD/MM/YYYY')}</>
        ),
      },
      {
        title: 'Fecha vencimiento',
        width: 100,
        render: (event: any) => (
          <>{dayjs(event.certification?.approved_until_date).format('DD/MM/YYYY')}</>
        ),
      },
      {
        title: '¿Vencido?',
        width: 100,
        render: (event: any) => (
          <>{(event.certification?.approved_until_date || event.certification?.approved_until_date || 0) >= (event.certification?.approved_until_date || 0) ? 'Vencido' : 'Vigente'}</>
        ),
      },
      {
        title: 'Opciones',
        width: 80,
        render: (event: any) => (
          <Tooltip title='Borrar'>
            <Button
              id={`deleteAction${event._id}`}
              type='primary'
              size='small'
              onClick={(e) => alert('No implementado aún')}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        )
      },
    ]

    setColumns(newColumns)
  }, [allPositionEvents])

  return (
    <>
      <Header
        title={`Certificados de ${currentUser ? currentUser.names : <Spin />} en el cargo de ${currentPosition ? currentPosition.position_name : <Spin />}`}
      />
      <Typography.Paragraph>
        Estos son los certificados de dicho usuario.
      </Typography.Paragraph>

      <Typography.Paragraph>
        Este cargo requiere {allPositionEvents.length} certificaciones.
      </Typography.Paragraph>

      <Typography.Paragraph style={{color: 'red'}}>
        TODO: Es necesario filtrar los eventos por <code>event.is_external</code> porque son los que
        tienen certificación (en diseño).
      </Typography.Paragraph>

      <Table
        columns={columns}
        dataSource={allPositionEvents}
        size='small'
        rowKey='index'
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
        title={() => (
          <Row wrap justify='end' gutter={[8, 8]}>
            <Col>
              <Button type='primary' icon={<PlusCircleOutlined />} onClick={() => alert('Falta implementar eso')}>
                {'Agregar certificación'}
              </Button>
            </Col>
          </Row>
        )}
      />
    </>
  );
}

export default CurrentOrganizationPositionCertificationUserPage;