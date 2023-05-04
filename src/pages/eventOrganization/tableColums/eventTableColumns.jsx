import { Button, Typography, Tag } from 'antd'
import { FileProtectOutlined, FileOutlined } from '@ant-design/icons'

const { Paragraph } = Typography
export const columns = (goToEvent) => [
  {
    title: 'Nombre del curso',
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
    render(event) {
      return (
        <Button type="link" onClick={() => goToEvent(event._id)}>
          {event.type_event === 'certification' ? (
            <>
              <Tag color="#61E62C" icon={<FileProtectOutlined />}>
                Certificación
              </Tag>
            </>
          ) : !event.type_event || event.type_event === 'onlineEvent' ? (
            <>
              <Tag color="#E67B17" icon={<FileOutlined />}>
                Curso
              </Tag>
            </>
          ) : undefined}
          <span style={{ color: '#2E9AFE' }}>{event.name}</span>
        </Button>
      )
    },
  },
  {
    title: 'Total usuarios',
    dataIndex: 'count',
    align: 'center',
    ellipsis: 'true',
    sorter: (a, b) => a.count - b.count,
  },
  /* {
    title: 'Usuarios sin inscripción',
    dataIndex: 'checked_in_not',
    align: 'center',
    ellipsis: 'true',
    sorter: (a, b) => a.checked_in_not - b.checked_in_not,
    /* render(val, item) {
         return item.checked_in_not;
      }, */
  //}, */
  {
    title: 'Aprobaron',
    dataIndex: 'checked_in_not',
    align: 'center',
    ellipsis: 'true',
    sorter: (a, b) => a.checked_in_not - b.checked_in_not,
  },
  {
    title: 'Completaron',
    dataIndex: 'checked_in_not',
    align: 'center',
    ellipsis: 'true',
    sorter: (a, b) => a.checked_in_not - b.checked_in_not,
  },
  {
    title: 'Pre-registrados',
    dataIndex: 'checked_in',
    align: 'center',
    ellipsis: 'true',
    sorter: (a, b) => a.checked_in - b.checked_in,
    /* render(val, item) {
         return item.checked_in;
      }, */
  },
]
