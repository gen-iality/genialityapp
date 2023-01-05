import { useHistory } from 'react-router';
import { Tooltip, Button, Row, Col, Popover, Image, Avatar, Empty } from 'antd';
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
