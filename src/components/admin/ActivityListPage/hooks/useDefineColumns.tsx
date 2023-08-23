import { ColumnType } from 'antd/lib/table'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import ActivityPublishingStatus from '../ActivityPublishingStatus'
import lessonTypeToString from '@components/events/lessonTypeToString'
import { Button, Col, Row, Tag, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { StateMessage } from '@context/MessageService'

export default function useDefineColumns<T extends object = any>(
  eventId: string,
  config?: {
    extraBefore?: ColumnType<T>[]
    extraAfter?: ColumnType<T>[]
    editUrl?: string
    removeMethod?: (id: string) => void
  },
) {
  const [columns, setColumns] = useState<ColumnType<any>[]>([])
  // const [isPublishedActivityMap, setIsPublishedActivityMap] = useState<{
  //   [key: string]: boolean
  // }>({})
  const isPublishedActivityMap = useRef<{
    [key: string]: boolean | undefined
  }>({})

  useEffect(() => {
    setColumns([
      ...(config?.extraBefore ?? []),
      {
        title: 'Fecha y hora inicio',
        dataIndex: 'datetime_start',
        ellipsis: true,
        sorter: (a, b) => a.datetime_start.localeCompare(b.datetime_start),
        render(record) {
          return <div>{dayjs(record).format('DD/MM/YYYY')}</div>
        },
      },
      {
        title: 'Fecha y hora fin',
        dataIndex: 'datetime_end',
        ellipsis: true,
        sorter: (a, b) => a.datetime_end.localeCompare(b.datetime_end),
        render(record) {
          return <div>{dayjs(record).format('DD/MM/YYYY')}</div>
        },
      },
      {
        title: 'Lección',
        dataIndex: 'name',
        //ellipsis: true,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Está publicado?',
        ellipsis: true,
        filters: [
          { text: 'Público', value: true },
          { text: 'Oculto', value: false },
        ],
        onFilter: (status, item) => {
          console.log(status, item)
          return isPublishedActivityMap.current[item._id] === status
        },
        render: (item) => {
          return (
            <ActivityPublishingStatus
              eventId={eventId}
              activityId={item._id}
              onChange={(status) => {
                isPublishedActivityMap.current[item._id] = status
              }}
            />
          )
        },
      },
      {
        title: 'Tipo',
        render: (record) => {
          if (!record?.type) {
            return <div>Genérico</div>
          }
          const typeName = lessonTypeToString(record.type?.name) || 'Genérico'
          return <div>{typeName}</div>
        },
      },
      {
        title: 'Categorias',
        dataIndex: 'activity_categories',
        ellipsis: true,
        render: (items) => {
          return (
            <>
              {(items ?? []).map((item: any, key: number) => (
                <Tag key={key} color={item.color}>
                  {item.name}
                </Tag>
              ))}
            </>
          )
        },
      },
      {
        title: 'Espacios',
        dataIndex: 'space',
        ellipsis: true,
        render(space) {
          return (
            <>
              <div>{space?.name}</div>
            </>
          )
        },
      },
      {
        title: 'Conferencistas',
        dataIndex: 'hosts',
        ellipsis: true,
        render(hosts) {
          return (
            <>
              {(hosts ?? []).map((item: any, key: number) => (
                <Tag key={key}>{item.name}</Tag>
              ))}
            </>
          )
        },
      },
      // Options
      {
        title: 'Opciones',
        dataIndex: 'options',
        fixed: 'right',
        width: 110,
        render: (val, item) => (
          <Row wrap gutter={[8, 8]}>
            <Col>
              <Tooltip placement="topLeft" title="Editar">
                <Link
                  key={`editAction${item.index}`}
                  id={`editAction${item.index}`}
                  to={config?.editUrl || ''}
                  state={{ edit: item._id }}
                >
                  <Button icon={<EditOutlined />} type="primary" size="small" />
                </Link>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip placement="topLeft" title="Eliminar">
                <Button
                  key={`removeAction${item.index}`}
                  id={`removeAction${item.index}`}
                  onClick={() => {
                    if (typeof config?.removeMethod === 'function') {
                      config.removeMethod(item._id)
                    } else {
                      StateMessage.show(
                        null,
                        'error',
                        'No se ha configurado el borrador de elementos',
                      )
                    }
                  }}
                  icon={<DeleteOutlined />}
                  danger
                  type="primary"
                  size="small"
                />
              </Tooltip>
            </Col>
          </Row>
        ),
      },
      ...(config?.extraAfter ?? []),
    ])
  }, [])

  return columns
}
