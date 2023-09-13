import { Button, Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { DATE_FORMAT } from '@/constants/datesformat.constants';
import { EditOutlined } from '@ant-design/icons';

type GoToEvent = (eventId: string) => void;
type OpenModal = (event: any) => void;
export const columns = (goToEvent: GoToEvent, openModal: OpenModal): ColumnsType<any> => [
  {
    title: 'Nombre del evento',
    dataIndex: 'name',
    ellipsis: true,
    sorter: (a, b) => a.name.localeCompare(b.name),
    render(val, item) {
      return (
        <Button type='link' onClick={() => goToEvent(item._id)}>
          <span style={{ color: '#2E9AFE' }}>{item.name}</span>
        </Button>
      );
    },
  },
  {
    title: 'Fecha de inicio',
    dataIndex: 'startDate',

    render(val, item) {
      let dateStart;
      if (item?.dates && Array.isArray(item?.dates) && item?.dates?.length > 0) {
        dateStart = item.dates[0].start;
      }
      if (!dateStart) {
        dateStart = item.datetime_from;
      }
      return (
        <Button type='link' onClick={() => goToEvent(item._id)}>
          <span>{moment(dateStart).format(DATE_FORMAT.DateFull)}</span>
        </Button>
      );
    },
  },
  {
    title: 'Total usuarios',
    dataIndex: 'count',
    align: 'center',
    ellipsis: true,
    sorter: (a, b) => a.count - b.count,
  },
  {
    title: 'Usuarios sin checkIn',
    dataIndex: 'checked_in_not',
    align: 'center',
    ellipsis: true,
    sorter: (a, b) => a.checked_in_not - b.checked_in_not,
  },
  {
    title: 'Usuarios con checkIn',
    dataIndex: 'checked_in',
    align: 'center',
    ellipsis: true,
    sorter: (a, b) => a.checked_in - b.checked_in,
  },
  {
    title: 'Opción',
    dataIndex: 'index',
    fixed: 'right',
    width: 80,
    render(val, item, index) {
      return (
        <>
          <Space>
            <Tooltip title='Editar'>
              <Button
                id={`editAction${index}`}
                type='primary'
                size='small'
                onClick={(e) => {
                  openModal(item);
                }}
                icon={<EditOutlined />}></Button>
            </Tooltip>
          </Space>
        </>
      );
    },
  },
];
