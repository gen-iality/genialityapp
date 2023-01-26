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
} from 'antd'
import { CerticationLogsApi, UsersApi, EventsApi } from '@helpers/request'

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

function CertificationLogsPage(props: CertificationLogsPageProps) {
  const [columnsData, setColumnsData] = useState<any>({})
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
    // setCurrentEditingItem(null);
    closeModal();
  }

  const loadAllUsers = async () => {
    const result: any = await UsersApi.getAll(props.event._id)
    const allUsers = result.data.map((data: any) => data.user) as any[]
    setUsers(allUsers)
    console.log('allUsers:', allUsers)
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

    {users.map((user) => (
      <Card key={user._id}>
        <Typography.Text>{user.names}</Typography.Text>
        <br />
        <Button
          type="primary"
          onClick={() => {
            setCurrentUserEditing(user)
            form.resetFields()
            openModal()
          }}
        >Agregar certification</Button>
        <Table
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
        onFinish={(values) => {
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
        }}
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
