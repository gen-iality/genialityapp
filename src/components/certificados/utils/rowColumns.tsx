import { DragHandle } from '@/components/events/Description/hooks/utils';
import { CertifiRow } from '../types';
import { Button, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/lib/table';

export const columnsRowList: ColumnType<CertifiRow>[] = [
  {
    title: '',
    className: 'drag-visible',
    dataIndex: 'drag',
    width: 20,
    //@ts-ignore
    render: () => <DragHandle />,
  },
  {
    title: 'Orden',
    dataIndex: 'position',
    width: 20,
    render: (position: number, record: CertifiRow, index: number) => <Tag>{`#${index + 1}`}</Tag>,
  },
  {
    title: 'Tipo',
    dataIndex: 'type',
    width: 70,
  },
  {
    title: 'Contenido',
    dataIndex: 'content',
    className: 'drag-visible',
    width: 70,
    render: (text: string, item: CertifiRow, index: number) => (
      <span>{item.type === 'break' ? item.times : item.content}</span>
    ),
  },
  
];
