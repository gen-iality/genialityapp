import { useEffect, useState, useMemo } from 'react'
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
  Space,
  Select,
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
    values.description = values.description || ''
    values.entity = values.entity || ''
    values.event_id = props.event._id

    console.debug('form submits:', values)

    CerticationLogsApi.create(values).then(() => {
      closeModal()
      form.resetFields()
      loadAllUsers().then()
    })
  }

  const columns = [
    {
      key: 'user',
      title: 'Usuario',
      dataIndex: 'user',
      render: (user: any) => <>{user.names}</>,
      sorter: true,
    },
    {
      key: 'hours',
      title: 'Horas de certificación',
      dataIndex: 'hours',
      render: (hours: number) => <>{hours === undefined ? 'sin' : hours} horas</>,
      sorter: (a: number, b: number) => (a || 0) - (b || 0),
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
      render: (entity: string) => <>{entity}</>,
      sorter: true,
    },
    {
      key: 'approved_from_date',
      title: 'Fecha de aprobación',
      dataIndex: 'approved_from_date',
      render: (data: string) => <>{dayjs(data).format('DD/MM/YYYY')}</>,
      sorter: (a: string, b: string) => dayjs(a) - dayjs(b),
    },
    {
      key: 'approved_until_date',
      title: 'Fecha de vencimiento',
      dataIndex: 'approved_until_date',
      render: (data: string) => <>{dayjs(data).format('DD/MM/YYYY')}</>,
      sorter: (a: string, b: string) => dayjs(a) - dayjs(b),
    },
    // {
    //   key: 'last_hours',
    //   title: <Tooltip title="No me preguntes, no sé qué es esto">Últimas horas</Tooltip>,
    //   dataIndex: 'last_hours',
    //   render: (last_hours: number) => <>{last_hours} horas</>,
    // },
    {
      key: 'success',
      title: 'Exitoso',
      dataIndex: 'success',
      render: (success: boolean) => <Tag color={success ? 'green' : 'red'}>{success ? 'Exitoso' : 'Fallido'}</Tag>,
      sorter: true,
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

  const allCertificationLog = useMemo(() => users
    .map((user) => user.certification_logs.map((certificationLog: any) => ({...certificationLog, user}) ))
    .flat(), [users])

  return (
    <>
    <Space direction="vertical">
      <Typography.Title>Histório de certificaciones</Typography.Title>
      <Typography.Text>
        Agregue o edite el historial de certificaciones a un usuario de este curso
      </Typography.Text>

      {!props.event.is_external && (
        <Alert type="warning" message={<>¡Cuidado! este curso no ha sido configurado como <b>Curso Externo</b></>} />
      )}

      <Button
        type="primary"
        onClick={() => {
          // setCurrentUserEditing(user)
          form.resetFields()
          openModal()
        }}
      >Agregar certification</Button>
    </Space>

    <Table
      loading={isLoading}
      columns={columns}
      dataSource={allCertificationLog}
    />

    <Modal
      visible={isOpened}
      onOk={() => {
        form.submit()
      }}
      onCancel={cancelModel}
      title="Agrega una certificación"
    >
      <Form
        form={form}
        onFinish={onFormFinish}
      >
        <Form.Item
          label="Usuario"
          name="user_id"
          rules={[{required: true, message: '¿Quién?'}]}
        >
          <Select
            options={users.map((user) => ({ label: user.names, value: user._id }))}
          />
        </Form.Item>

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

        {/* <Form.Item
          label="Última horas"
          name="last_hours"
          initialValue={defaultValue.lastHours}
          rules={[{required: true, message: 'Valor requerido'}]}
        >
          <InputNumber min={0} />
        </Form.Item> */}
      </Form>
    </Modal>
    </>
  )
}

export default CertificationLogsPage
