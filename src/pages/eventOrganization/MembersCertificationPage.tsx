/** React's libraries */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  Select,
  Switch,
  InputNumber,
  Input,
  DatePicker,
} from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'

/** Helpers and utils */
import {
  EventsApi,
  PositionsApi,
  UsersApi,
  CerticationsApi,
  CerticationLogsApi,
} from '@helpers/request'
import { fireStorage } from '@helpers/firebase'

/** Components */
import Header from '@antdComponents/Header'
import PositionCertificationFileUploader from './PositionCertificationFileUploader'

const { TextArea } = Input

export interface MembersCertificationPageProps {
  org: any
  match: {
    params: {
      positionId: string
      userId: string
    }
    url: string
  }
}

function MembersCertificationPage(props: MembersCertificationPageProps) {
  const organizationId: string = props.org._id
  const positionId = props.match.params.positionId
  const userId = props.match.params.userId

  const [columns, setColumns] = useState<ColumnsType<any>>([])
  const [allPositionEvents, setAllPositionEvents] = useState<any[]>([])
  const [allEvents, setAllEvents] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [currentPosition, setCurrentPosition] = useState<any | null>(null)

  const [isModalOpened, setIsModalOpened] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmiting, setIsSubmiting] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [certification, setCertification] = useState<any | null>({})

  const [form] = Form.useForm()
  const ref = fireStorage.ref()

  const openModal = () => setIsModalOpened(true)
  const closeModal = () => setIsModalOpened(false)

  const loadData = async () => {
    const user = await UsersApi.getProfile(userId)
    setCurrentUser(user)

    const position = await PositionsApi.getOne(positionId)
    setCurrentPosition(position)
    console.debug('CurrentOrganizationPositionPage: loadPositionData', { position })

    const certifications = await CerticationsApi.getByPositionAndMaybeUser(
      position._id,
      user._id,
    )

    const allEventIds = position.event_ids || []
    const events = await Promise.all(
      allEventIds.map(async (eventId: string) => await EventsApi.getOne(eventId)),
    )
    setAllEvents(events.filter((event) => event.is_certification))
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
    values.approved_from_date = values.approved_from_date
      .startOf('day')
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
    values.approved_until_date = values.approved_until_date
      .startOf('day')
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
    console.debug('form submit', { values })

    setIsSubmiting(true)

    if (isEditing) {
      CerticationsApi.update(certification._id, values).finally(() => {
        setIsSubmiting(false)
        setIsLoading(true)

        //Edit certificationLog too
        const lastCertificationLog = [...certification.certification_logs].pop()
        CerticationLogsApi.update(lastCertificationLog._id, values)

        loadData().finally(() => setIsLoading(false))

        setIsEditing(false)
      })
    } else {
      CerticationsApi.create(values).finally(() => {
        setIsSubmiting(false)
        setIsLoading(true)
        loadData().finally(() => setIsLoading(false))
      })
    }
  }

  const editUserCertification = (values: any) => {
    const certification = values.certification
    setCertification(certification)
    openModal()

    form.setFieldsValue({
      event_id: values._id,
      description: certification.description,
      entity: certification.entity,
      hours: certification.hours ?? 1,
      approved_from_date: dayjs(certification.approved_from_date),
      approved_until_date: dayjs(certification.approved_until_date),
      file_url: certification.file_url,
      firestorage_path: certification.firestorage_path,
    })

    setIsEditing(true)
  }

  const onDeleteCertification = (certification: any) => {
    CerticationsApi.deleteOne(certification._id).then((result) => {
      if (result.success) {
        // Now remove the file in FireStorage
        if (certification?.firestorage_path) {
          ref
            .child(certification.firestorage_path)
            .delete()
            .then(() => {
              console.log('This file was removed from FireStorage')
            })
        }
        setIsLoading(true)
        loadData().finally(() => setIsLoading(false))
      } else {
        alert(result.message)
      }
    })
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
        render: (event: any) => {
          return <span>{event.name}</span>
        },
      },
      {
        title: 'Certificación',
        align: 'center',
        width: 100,
        render: (event: any) => {
          if (event.certification?.file_url) {
            return (
              <a href={event.certification.file_url} target="_blank">
                Ver certificado
              </a>
            )
          } else return <em>Sin certificado</em>
        },
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
              <Link to={`${props.match.url}/logs/${certification._id}`}>
                <Tag color="#88f">
                  {(certification?.certification_logs || []).length} registros
                </Tag>
              </Link>
            )}
          </>
        ),
      },
      /* {
        title: 'Estado de aprobación',
        align: 'center',
        width: 100,
        dataIndex: 'certification',
        render: (certification: any) => (
          <Tag color={certification?.success ? 'green' : 'red'}>
            {certification?.success ? 'Aprobado' : 'No aprobado'}
          </Tag>
        ),
      }, */
      {
        title: 'Fecha de emisión',
        align: 'center',
        width: 100,
        dataIndex: 'certification',
        render: (certification: any) => (
          <>
            {certification?.approved_from_date ? (
              dayjs(certification?.approved_from_date).format('DD/MM/YYYY')
            ) : (
              <em>Sin fecha</em>
            )}
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
            {certification?.approved_until_date ? (
              dayjs(certification?.approved_until_date).format('DD/MM/YYYY')
            ) : (
              <em>Sin fecha</em>
            )}
          </>
        ),
      },
      {
        title: 'Estado de vigencia',
        align: 'center',
        width: 100,
        dataIndex: 'certification',
        render: (certification: any) => {
          let lema = 'Inactivo'
          if (certification?.approved_until_date) {
            if (dayjs(certification?.approved_until_date) > dayjs(Date.now())) {
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
                  onClick={(e) => {
                    if (!event.certification) return
                    else editUserCertification(event)
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
                  onClick={(e) => onDeleteCertification(event.certification)}
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
  }, [allPositionEvents])

  return (
    <>
      <Header
        title={
          <>
            {`Certificados de `}
            {currentUser ? <>{currentUser.names}</> : <Spin />}
            {` en el cargo de `}
            {currentPosition ? <>{currentPosition.position_name}</> : <Spin />}
          </>
        }
      />
      <Typography.Paragraph>
        Estos son los certificados de dicho usuario.
      </Typography.Paragraph>

      <Typography.Paragraph>
        Este cargo requiere {allPositionEvents.length} certificaciones.
      </Typography.Paragraph>

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
                  form.resetFields()
                  openModal()
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
          form.submit()
          closeModal()
        }}
        onCancel={() => closeModal()}
      >
        <Form form={form} onFinish={onFormFinish} layout="vertical">
          <Form.Item
            name="event_id"
            label="Curso a dar certificación"
            rules={[{ required: true, message: 'Esto' }]}
          >
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
              options={allEvents.map((event) => ({
                label: event.name,
                value: event._id,
              }))}
            />
          </Form.Item>
          <Form.Item name="success" label="Exitoso" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: 'Agrega la descripción' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="hours"
            label="Horas"
            rules={[{ required: true, message: 'Agrega el número de horas' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="entity"
            label="Entidad"
            rules={[{ required: true, message: 'Agrega la entidad' }]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item name="file_url" label="Archivo externo">
            <PositionCertificationFileUploader
              path="positions"
              onFirebasePathChange={(value) => {
                // If the file is from FireStorage...
                console.debug('firestorage_path changes to', value)
                form.setFieldsValue({ firestorage_path: value })
              }}
            />
          </Form.Item>
          {/** Please, keep the next line */}
          <Form.Item name="firestorage_path" />
        </Form>
      </Modal>
    </>
  )
}

export default MembersCertificationPage
