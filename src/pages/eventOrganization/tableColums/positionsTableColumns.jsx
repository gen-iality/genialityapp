import { Link } from 'react-router-dom';
import { Tooltip, Button, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export const columns = (editModalPosition, orgEventsData, currentUrl) => {
  return [
    {
      title: 'Cargo',
      dataIndex: 'position_name',
      width: 300,
      ellipsis: true,
      sorter: (a, b) => a.position_name.localeCompare(b.position_name),
    },
    {
      title: 'Cursos asignados',
      width: 800,
      render(position) {
        return (
          <>
            {orgEventsData &&
              orgEventsData
                .filter((orgEvent) => (position.event_ids || []).includes(orgEvent._id))
                .map((event) => <Tag key={event._id}>{event.name}</Tag>)}
          </>
        );
      },
    },
    {
      title: 'Asignados',
      width: 120,
      render: (position) => (
        <Link
          to={`${currentUrl}/${position._id}`}
        >
          {position.users.length}
          {' usuarios'}
        </Link>
      )
    },
    {
      title: 'Opción',
      dataIndex: 'index',
      fixed: 'right',
      width: 80,
      render(val, item, index) {
        return (
          <>
            <Tooltip title='Editar'>
              <Button
                id={`editAction${index}`}
                type='primary'
                size='small'
                onClick={(e) => editModalPosition(item)}
                icon={<EditOutlined />}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];
};
