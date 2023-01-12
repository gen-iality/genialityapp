import { useHistory } from 'react-router';
import { Tooltip, Button, Row, Col, Popover, Image, Avatar, Empty, Tag } from 'antd';
import { ClockCircleOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';

export const columns = (editModalPosition) => {
  const history = useHistory();
  return [
    {
      title: 'Cargo',
      dataIndex: 'position_name',
      width: 300,
      /* align: 'center', */
      ellipsis: true,
      sorter: (a, b) => a.position_name.localeCompare(b.position_name),
    },
    {
      title: 'Cursos asignados',
      //dataIndex: 'event_names',
      width: 300,
      //align: 'center',
      ellipsis: true,
      //render: (position) => <Tag>{position.event_names}</Tag>,
      render(position) {
        return (
          <>
            {position.event_names?.map((eventName) => (
              <Tag>{eventName}</Tag>
            ))}
          </>
        );
      },

      /* render(record) {
        return (
          <>
            {record.map((item, key) => (
              <Tag key={key}>{item}</Tag>
            ))}
          </>
        );
      }, */
    },
    {
      title: 'Opción',
      dataIndex: 'index',
      /* align: 'center', */
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
                onClick={(e) => {
                  editModalPosition(item);
                }}
                icon={<EditOutlined />}
              ></Button>
            </Tooltip>
          </>
        );
      },
    },
  ];
};
