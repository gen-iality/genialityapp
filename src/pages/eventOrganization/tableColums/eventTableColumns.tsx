import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { DATE_FORMAT } from '@/constants/datesformat.constants';
import { AddEventToGroup } from '../components/addEventToGroup/AddEventToGroup';

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
    title: 'Grupos',
    dataIndex: 'index',
    fixed: 'right',
    render(val, item, index) {
      return (
        <>
          <AddEventToGroup selectedEvent={item} />
        </>
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
];
