/** React's libraries */
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

/** Antd imports */
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
  DatePicker,
} from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

/** Helpers and utils */
import {
  EventsApi,
  PositionsApi,
  UsersApi,
  CerticationsApi,
  CerticationLogsApi,
} from '@helpers/request'

/** Components */
import Header from '@antdComponents/Header'
import { useLocation, useParams } from 'react-router'

export interface MemberCertificationLogsPageProps {
  org: any
}

function MemberCertificationLogsPage(props: MemberCertificationLogsPageProps) {
  const [columns, setColumns] = useState<ColumnsType<any>>([])
  const [allPositionEvents, setAllPositionEvents] = useState<any[]>([])
  const [allEvents, setAllEvents] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [currentPosition, setCurrentPosition] = useState<any | null>(null)

  const [dataSource, setDataSource] = useState<any[]>([])

  const [isLoading, setIsLoading] = useState(false)

  const [isModalOpened, setIsModalOpened] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [certificationLog, setCertificationLog] = useState<any | null>({})

  const params = useParams<{
    positionId: string
    userId: string
    certificationId: string
  }>()

  const [form] = Form.useForm()

  const openModal = () => setIsModalOpened(true)
  const closeModal = () => setIsModalOpened(false)

  // const organizationId: string = props.org._id
  const positionId = params.positionId
  const userId = params.userId
  const certificationId = params.certificationId

  const loadData = async () => {
    const user = await UsersApi.getProfile(userId)
    setCurrentUser(user)

    const position = await PositionsApi.getOne(positionId)
    setCurrentPosition(position)
    console.debug('CurrentOrganizationPositionPage: loadPositionData', { position })

    // This SHOULD be optimized, but it needs a back-end upgrade. Then, for now we filter here.
    // Task:
    // - Implement the filtering mechanism in the method index of the Back-End
    // - Update the method getAll of CerticationLogsApi to accept filters too.
    // - Replace the CerticationsApi using for CerticationLogsApi and use getAll
    let certifications = await CerticationsApi.getByPositionAndMaybeUser(
      position._id,
      user._id,
    )
    certifications = certifications.filter((c: any) => c._id === certificationId)

    const allEventIds = position.event_ids || []
    const events = await Promise.all(
      allEventIds.map(async (eventId: string) => await EventsApi.getOne(eventId)),
    )
    setAllEvents(events.filter((event) => event.type_event === 'certification'))
    setAllPositionEvents(
      events.map((event) => {
        const filteredCertification = certifications.find(
          (certification: any) => certification.event_id === event._id,
        )
        return {
          ...event,
          certification: filteredCertification,
        }
      }),
    )
  }

  const onFormFinish = async (values: any) => {
    if (!currentUser) {
      alert('No se ha cargado el usuario con anterioridad')
      return
    }
    values['user_id'] = currentUser._id
    console.debug('form submit', { values })

    if (isEditing) {
      CerticationLogsApi.update(certificationLog._id, values).finally(() => {
        setIsLoading(true)
        loadData().finally(() => setIsLoading(false))
        setIsEditing(false)
      })
    }
  }

  const editUserCertificationLog = (values: any) => {
    const certificationLog = values.log
    openModal()

    form.setFieldsValue({
      approved_from_date: dayjs(certificationLog.approved_from_date),
      approved_until_date: dayjs(certificationLog.approved_until_date),
    })

    setCertificationLog(certificationLog)
    setIsEditing(true)
  }

  const deleteUserCertificationLog = (values: any) => {
    CerticationLogsApi.deleteOne(values.log._id).finally(() => {
      setIsLoading(true)
      loadData().finally(() => setIsLoading(false))
    })
    // TODO: delete the certification file from FireStorage with:
    // values.log.firestorage_path
  }

  // Load all users for this position
  useEffect(() => {
    setIsLoading(true)

    loadData().finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const data: any[] = []
    allPositionEvents.forEach((event) => {
      const { certification } = event
      // If there is not certification, ignore this event
      if (!certification)
        return // Build a data with: event, certification, certification log, to use in the table
      ;(certification.certification_logs || []).forEach((log: any) => {
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
      /* {
        title: 'Estado',
        align: 'center',
        width: 100,
        dataIndex: 'log',
        render: (log: any) => (
          <Tag color={log?.success ? 'green' : 'red'}>{log?.success ? 'Aprobado' : 'No aprobado'}</Tag>
        ),
      }, */
      {
        title: 'Certificación',
        align: 'center',
        dataIndex: 'log',
        width: 100,
        render: (log: any) => {
          if (log?.file_url) {
            return (
              <a href={log?.file_url} target="_blank" rel="noreferrer">
                Ver certificado
              </a>
            )
          } else return <em>Sin certificado</em>
        },
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
          let lema = 'Inactivo'
          if (log?.approved_until_date) {
            if (dayjs(log?.approved_until_date) > dayjs(Date.now())) {
              lema = 'Activo'
            }
          }
          return (
            <>
              <Tag color={lema === 'Inactivo' ? 'red' : 'green'}>{lema}</Tag>
            </>
          )
        },
      },
      {
        title: 'Opciones',
        width: 80,
        render: (event: any) => (
          <Row wrap gutter={[8, 8]}>
            <Col>
              <Tooltip title="Editar">
                <Button
                  id={`editAction${event._id}`}
                  type="primary"
                  size="small"
                  onClick={() => {
                    console.log('event', event)
                    if (!event.certification) return
                    else editUserCertificationLog(event)
                  }}
                  icon={<EditOutlined />}
                />
              </Tooltip>
            </Col>
            <Col>
              <Tooltip title="Borrar">
                <Button
                  id={`deleteAction${event._id}`}
                  type="primary"
                  size="small"
                  onClick={() => {
                    console.log('event', event)
                    if (!event.certification) return
                    else deleteUserCertificationLog(event)
                  }}
                  icon={<DeleteOutlined />}
                  danger
                />
              </Tooltip>
            </Col>
          </Row>
        ),
      },
    ]

    setColumns(newColumns)
  }, [dataSource])

  return (
    <>
      <Header
        title={
          <span>
            Historial de certificados de {currentUser?.names ?? <Spin />} en el cargo de{' '}
            {currentPosition?.position_name ?? <Spin />}
          </span>
        }
      />
      <Typography.Paragraph>
        Este es el historial de certificaciones.
      </Typography.Paragraph>

      <Table
        columns={columns}
        dataSource={dataSource}
        size="small"
        rowKey="index"
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
      />

      <Modal
        open={isModalOpened}
        title={`Edita el registro de certificación a usuario: ${currentUser?.names}`}
        onOk={() => {
          form.submit()
          closeModal()
        }}
        onCancel={() => closeModal()}
      >
        <Form form={form} onFinish={onFormFinish} layout="vertical">
          <Form.Item
            name="approved_from_date"
            label="Fecha de aprobación"
            rules={[{ required: true, message: 'Agrega la fecha' }]}
            initialValue={dayjs(Date.now())}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="approved_until_date"
            label="Fecha de vencimiento"
            rules={[{ required: true, message: 'Agrega la fecha' }]}
            initialValue={dayjs(Date.now())}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default MemberCertificationLogsPage
