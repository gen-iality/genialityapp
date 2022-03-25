import { Button, Typography } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;
export const columns = (goToEvent) => [
  {
    title: 'Nombre del evento',
    dataIndex: 'name',
    ellipsis: 'true',
    sorter: (a, b) => a.name.localeCompare(b.name),
    /* align: 'center', */
    /* render(val, item) {
         return (
            <Paragraph
               onClick={() => goToEvent(item._id)}
               style={{ width: 250, color: '#2E9AFE', textDecorationLine: 'underline', cursor: 'pointer' }}
               ellipsis={{
                  rows: 1,
                  tooltip: `${item.name}`,
               }}>
               {item.name}
            </Paragraph>
         );
      }, */
    /* fixed: 'left', */
    render(val, item) {
      return (
        <Button type='link' onClick={() => goToEvent(item._id)}>
          <span style={{ color: '#2E9AFE' }}>{item.name}</span>
        </Button>
      );
    },
  },
  {
    title: 'Total usuarios',
    dataIndex: 'count',
    align: 'center',
    ellipsis: 'true',
    sorter: (a, b) => a.count - b.count,
  },
  {
    title: 'Usuarios sin checkIn',
    dataIndex: 'checked_in_not',
    align: 'center',
    ellipsis: 'true',
    sorter: (a, b) => a.checked_in_not - b.checked_in_not,
    /* render(val, item) {
         return item.checked_in_not;
      }, */
  },
  {
    title: 'Usuarios con checkIn',
    dataIndex: 'checked_in',
    align: 'center',
    ellipsis: 'true',
    sorter: (a, b) => a.checked_in - b.checked_in,
    /* render(val, item) {
         return item.checked_in;
      }, */
  },
];
