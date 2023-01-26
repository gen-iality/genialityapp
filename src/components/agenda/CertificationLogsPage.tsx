import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {
  Modal,
  Form,
  Tag,
  Tooltip,
  Table,
  Typography,
  Card,
  Divider,
  Button,
  DatePicker,
  Input,
  InputNumber,
  Switch,
  Alert,
} from 'antd'
import { CerticationLogsApi, UsersApi, EventsApi } from '@helpers/request'
import { DeleteOutlined } from '@ant-design/icons'

type DefaultValue = {
  hours: number,
  description: string,
  entity: string,
  lastHours: number,
  validityDays: number,
}

export interface CertificationLogsPageProps {
  event: any,
}

/**
 * Create a page that requests for all users data to render an user list and their
 * certification logs. Also, it enables to add a certification log via a new form
 * in a Modal component. The default values are loaded from the current event data.
 * 
 * @param props CertificationLogsPageProps
 * @returns React Component
 */
function CertificationLogsPage(props: CertificationLogsPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [defaultValue, setDefaultValue] = useState<DefaultValue>({} as DefaultValue);
  const [currentUserEditing, setCurrentUserEditing] = useState<null | any>(null);

  const [isOpened, setIsOpened] = useState(false);

  const [form] = Form.useForm();

  const openModal = () => {
    setIsOpened(true);
  }

  const closeModal = () => {
    setIsOpened(false);
  }

  const cancelModel = () => {
    form.resetFields();
    closeModal();
  }

  const loadAllUsers = async () => {
    setIsLoading(true)
    const result: any = await UsersApi.getAll(props.event._id)
    const allUsers = result.data.map((data: any) => data.user) as any[]
    setUsers(allUsers)
    console.log('allUsers:', allUsers)
    setIsLoading(false)
  }

  const onFormFinish = (values: any) => {
    if (!currentUserEditing?._id) {
      alert('[Error :(] No se ha cargado información del usuario')
      return
    }

    values.description = values.description || ''
    values.entity = values.entity || ''
    values.event_id = props.event._id
    values.user_id = currentUserEditing._id

    console.debug('form submits:', values)

    CerticationLogsApi.create(values).then(() => {
      closeModal()
      form.resetFields()
      loadAllUsers().then()
    })
  }

  const columns = [
    {
      key: 'hours',
      title: 'Horas de certificación',
      dataIndex: 'hours',
      render: (hours: number) => <>{hours === undefined ? 'sin' : hours} horas</>
    },
    {
      key: 'description',
      title: 'Descripción',
      dataIndex: 'description',
      render: (description: string) => <>{description}</>,
    },
    {
      key: 'entity',
      title: 'Entidad',
      dataIndex: 'entity',
      render: (entity: string) => <>{entity}</>
    },
    {
      key: 'approved_from_date',
      title: 'Fecha de aprobación',
      dataIndex: 'approved_from_date',
      render: (data: string) => <>{dayjs(data).format('DD/MM/YYYY')}</>
    },
    {
      key: 'approved_until_date',
      title: 'Fecha de vencimiento',
      dataIndex: 'approved_until_date',
      render: (data: string) => <>{dayjs(data).format('DD/MM/YYYY')}</>
    },
    {
      key: 'last_hours',
      title: <Tooltip title="No me preguntes, no sé qué es esto">Últimas horas</Tooltip>,
      dataIndex: 'last_hours',
      render: (last_hours: number) => <>{last_hours} horas</>
    },
    {
      key: 'success',
      title: 'Exitoso',
      dataIndex: 'success',
      render: (success: boolean) => <Tag color={success ? 'green' : 'red'}>{success ? 'Exitoso' : 'Fallido'}</Tag>,
    },
    {
      key: 'option',
      title: 'Opciones',
      render: (certificationLog: any) => (
        <Tooltip title="Eliminar certification">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsLoading(true)
              CerticationLogsApi.deleteOne(certificationLog._id).finally(() => {
                loadAllUsers().then()
              })
            }}
          />
        </Tooltip>
      ),
    },
  ]

  useEffect(() => {
    // Load users
    loadAllUsers().then()
    EventsApi.getOne(props.event._id).then((event: any) => {
      const newDefaultValue: DefaultValue = {
        hours: event.default_certification_hours || 1,
        lastHours: event.default_certification_last_hours || 1,
        description: event.default_certification_description || '',
        entity: event.default_certification_entity || '',
        validityDays: event.validity_days || 0,
      }
      
      console.debug('default value =', { newDefaultValue })
      setDefaultValue(newDefaultValue)
    })
  }, [])

  return (
    <>
    <Typography.Title>Histório de certificaciones</Typography.Title>
    <Typography.Text>
      Agregue o edite el historial de certificaciones a un usuario de este curso
    </Typography.Text>

    {!props.event.is_external && (
      <Alert type="warning" message={<>¡Cuidado! este curso no ha sido configurado como <b>Curso Externo</b></>} />
    )}

    {users.map((user) => (
      <Card key={user._id}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography.Text strong>{user.names}</Typography.Text>
            <p>Este usuario tiene {user.certification_logs.length} certificacion(es)</p>
          </div>
        <Button
          type="primary"
          onClick={() => {
            setCurrentUserEditing(user)
            form.resetFields()
            openModal()
          }}
        >Agregar certification</Button>
        </div>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={user.certification_logs || []}
        />
        <Divider />
      </Card>
    ))}
    <Modal
      visible={isOpened}
      onOk={() => {
        form.submit()
      }}
      onCancel={cancelModel}
      title="Agrega una certificación"
    >
      <p>Editando usuario {currentUserEditing?.names || 'indefinido'}</p>
      <Form
        form={form}
        onFinish={onFormFinish}
      >
        <Form.Item label="Descripción" name="description" initialValue={defaultValue.description}>
          <Input />
        </Form.Item>

        <Form.Item label="Exitoso" name="success" initialValue={true} valuePropName="checked">
          <Switch/>
        </Form.Item>

        <Form.Item label="Horas" name="hours" initialValue={defaultValue.hours}>
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item label="Entidad" name="entity" initialValue={defaultValue.entity}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Fecha de aprobación"
          name="approved_from_date"
          initialValue={dayjs(Date.now())}
          rules={[{required: true, message: 'Fecha requerida'}]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="Fecha de vencimiento"
          name="approved_until_date"
          initialValue={dayjs(Date.now()).add(defaultValue.validityDays || 0, 'days')}
          rules={[{required: true, message: 'Fecha requerida'}]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="Última horas"
          name="last_hours"
          initialValue={defaultValue.lastHours}
          rules={[{required: true, message: 'Valor requerido'}]}
        >
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Modal>
    </>
  )
}

export default CertificationLogsPage
