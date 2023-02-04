import { Link } from 'react-router-dom'
import { Tooltip, Button, Tag } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import { ColumnsType } from 'antd/es/table'

import { PositionResponseType } from '@Utilities/types/PositionType'

interface PositionResponseRowType extends PositionResponseType {
  users: any[],
}

export default function positionsTableColumns(
  cbEdit: (item: PositionResponseType) => void,
  orgEventsData: any[],
  currentUrl: string,
) {
  const columns: ColumnsType<PositionResponseRowType> = [
    {
      key: 'position',
      title: 'Cargo',
      dataIndex: 'position_name',
      width: 300,
      ellipsis: true,
      sorter: (a, b) => a.position_name.localeCompare(b.position_name),
    },
    {
      key: 'course',
      title: 'Cursos asignados',
      width: 800,
      render: (_, position) => (
        <>
          {orgEventsData &&
            orgEventsData
              .filter((orgEvent) => (position.event_ids || []).includes(orgEvent._id))
              .map((event) => <Tag key={event._id}>{event.name}</Tag>)}
        </>
      ),
    },
    {
      key: 'assigned',
      title: 'Asignados',
      width: 120,
      render: (_, position) => (
        <Link key={position._id} to={`${currentUrl}/${position._id}`}>
          {`${position.users.length} usuarios`}
        </Link>
      ),
    },
    {
      key: 'option',
      title: 'Opción',
      dataIndex: 'index',
      fixed: 'right',
      width: 80,
      render: (_, position) => {
        return (
          <Tooltip key={position._id} title='Editar'>
            <Button
              type='primary'
              size='small'
              onClick={(e) => cbEdit(position)}
              icon={<EditOutlined />}
            />
          </Tooltip>
        )
      },
    },
  ]

  return columns
}
