/** React's libraries */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

/** Antd imports */
import {
  Tooltip,
  Button,
  Row,
  Col,
  Popover,
  Image,
  Avatar,
  Empty,
  Spin,
  Modal,
} from 'antd'
import {
  ClockCircleOutlined,
  EditOutlined,
  KeyOutlined,
  RiseOutlined,
  UserOutlined,
} from '@ant-design/icons'

/** Helpers and utils */
import { membersGetColumnSearchProps } from '../searchFunctions/membersGetColumnSearchProps'
import dayjs from 'dayjs'

export const columns = (
  columnsData,
  editModalUser,
  extraFields,
  togglePaymentPlan,
  organization,
  changeUserToChangePassword,
) => {
  const navigate = useNavigate()
  const [columns, setColumns] = useState([])

  if (!extraFields) return []

  const dynamicColumns = extraFields
    .map((extraField) => {
      const dataIndex = () => {
        switch (extraField.name) {
          case 'position_id':
            return 'position'
          case 'rol_id':
            return 'role'
          default:
            return extraField.name
        }
      }

      return {
        title: extraField.label,
        dataIndex: dataIndex(),
        ellipsis: true,
        sorter: (a, b) => a[extraField.name]?.length - b[extraField.name]?.length,
        ...membersGetColumnSearchProps(extraField.name, columnsData),
      }
    })
    .filter((x) => x !== null)

  const picture = {
    title: 'Avatar',
    dataIndex: 'picture',
    width: 70,
    /* align: 'center', */
    render(val, item) {
      return (
        <Row gutter={8}>
          <Col>
            <Popover
              placement="top"
              content={() => (
                <>
                  {item.picture ? (
                    <Image
                      key={'img' + item._id}
                      width={200}
                      height={200}
                      src={item.picture}
                    />
                  ) : (
                    <Empty description="Imagen no encontrada" />
                  )}
                </>
              )}
            >
              {item.picture ? (
                <Avatar key={'img' + item._id} src={item.picture} />
              ) : (
                <Avatar icon={<UserOutlined />} />
              )}
            </Popover>
          </Col>
        </Row>
      )
    },
  }

  const payment_plan = {
    title: 'Plan de pago',
    dataIndex: 'payment_plan',
    key: 'payment_plan',
    width: '140px',
    ellipsis: true,
    sorter: (a, b) =>
      (a.payment_plan?.date_until ?? 0) - (b.payment_plan?.date_until ?? 0),
    // ...membersGetColumnSearchProps('payment_plan'),
    render(payment_plan) {
      if (!payment_plan) return 'Sin plan'
      if (!payment_plan.date_until) return 'Indefinido'
      const date = dayjs(payment_plan.date_until)
      if (date.isValid()) {
        return 'Hasta: ' + date.format('YYYY/MM/DD')
      }
      return 'Fecha inválida'
    },
  }

  const payment_plan_days_count = {
    title: 'Días faltantes',
    dataIndex: 'payment_plan',
    key: 'payment_plan_days_count',
    width: '140px',
    ellipsis: true,
    sorter: (a, b) =>
      (a.payment_plan?.date_until ?? 0) - (b.payment_plan?.date_until ?? 0),
    // ...membersGetColumnSearchProps('payment_plan'),
    render(payment_plan) {
      if (!payment_plan) return 'Sin registro'
      if (!payment_plan.date_until) return '~'
      const date = dayjs(payment_plan.date_until)
      if (date.isValid()) {
        const days = date.diff(dayjs(Date.now()), 'days')
        return days !== 1 ? `${days} días` : `${days} día`
      }
      return '*'
    },
  }

  const payment_plan_price = {
    title: 'Plan pagado',
    dataIndex: 'payment_plan',
    key: 'payment_plan_price',
    width: '140px',
    ellipsis: true,
    sorter: (a, b) => (a.payment_plan?.price ?? 0) - (b.payment_plan?.price ?? 0),
    // ...membersGetColumnSearchProps('payment_plan'),
    render(payment_plan) {
      if (!payment_plan) return '0'
      if (!payment_plan.price) return 'Gratis'
      if (payment_plan.price === 0) return 'Gratis'
      return `$${payment_plan.price}`
    },
  }

  const payment_plan_days = {
    title: 'Días pagados',
    dataIndex: 'payment_plan',
    key: 'payment_plan_days',
    width: '140px',
    ellipsis: true,
    sorter: (a, b) => (a.payment_plan?.days ?? 0) - (b.payment_plan?.days ?? 0),
    // ...membersGetColumnSearchProps('payment_plan'),
    render(payment_plan) {
      if (!payment_plan) return 'Sin datos'
      if (payment_plan.days > 365 * 10) return 'Siempre'
      return payment_plan.days
    },
  }

  const payment_plan_updated_at = {
    title: 'Última actualización del plan',
    dataIndex: 'payment_plan',
    key: 'payment_plan_updated_at',
    width: '140px',
    ellipsis: true,
    sorter: (a, b) =>
      (a.payment_plan?.updated_at ?? 0) - (b.payment_plan?.updated_at ?? 0),
    // ...membersGetColumnSearchProps('payment_plan'),
    render(payment_plan) {
      if (!payment_plan?.updated_at) return 'Sin datos'
      const date = dayjs(payment_plan.updated_at)
      if (date.isValid()) {
        return date.format('YYYY/MM/DD')
      }
      return 'Fecha inválida'
    },
  }

  const created_at = {
    title: 'Creado',
    dataIndex: 'created_at',
    /* align: 'center', */
    ellipsis: true,
    sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    ...membersGetColumnSearchProps('created_at', columnsData),
    render(val, item) {
      return item.created_at
    },
  }

  const updated_at = {
    title: 'Actualizado',
    dataIndex: 'updated_at',
    /* align: 'center', */
    ellipsis: true,
    sorter: (a, b) => a.updated_at.localeCompare(b.updated_at),
    ...membersGetColumnSearchProps('updated_at', columnsData),
    render(val, item) {
      return item.updated_at
    },
  }

  const editOption = {
    title: 'Opción',
    dataIndex: 'index',
    /* align: 'center', */
    fixed: 'right',
    width: 80,
    render(val, item, index) {
      return (
        <>
          <Tooltip title="Time tracking">
            <Button
              style={{ marginRight: 10 }}
              type="primary"
              size="small"
              onClick={() => {
                navigate(`timetracking/${item._id}`)
              }}
              icon={<ClockCircleOutlined />}
            ></Button>
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              id={`editAction${index}`}
              type="primary"
              size="small"
              onClick={() => {
                editModalUser(item)
              }}
              icon={<EditOutlined />}
            ></Button>
          </Tooltip>
          <Tooltip title="Cambiar contraseña">
            <Button
              danger
              type="primary"
              size="small"
              onClick={() => {
                changeUserToChangePassword(item)
              }}
              icon={<KeyOutlined />}
            ></Button>
          </Tooltip>
          {organization.access_settings?.type === 'payment' && (
            <Tooltip title={item.payment_plan ? 'Quitar premium' : 'Hace premium'}>
              <Button
                type={item.payment_plan ? 'ghost' : 'primary'}
                size="small"
                onClick={() => {
                  togglePaymentPlan(item)
                }}
                icon={<RiseOutlined />}
              ></Button>
            </Tooltip>
          )}
        </>
      )
    },
  }

  useEffect(() => {
    const newColumns = [picture, ...dynamicColumns]

    if (organization.access_settings?.type === 'payment') {
      newColumns.push(payment_plan)
      newColumns.push(payment_plan_updated_at)
      newColumns.push(payment_plan_price)
      newColumns.push(payment_plan_days)
      newColumns.push(payment_plan_days_count)
    }
    newColumns.push(created_at)
    newColumns.push(updated_at)
    newColumns.push(editOption)

    setColumns(newColumns)
  }, [columnsData])

  return columns
}
