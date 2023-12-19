import { Avatar, Button, Switch, Typography } from 'antd';
import * as iconComponents from '@ant-design/icons';
import { MenuItem } from '../interfaces/menuLandingProps';
import { DragHandle } from '@/components/events/Description/hooks/utils';
import { ColumnType } from 'antd/lib/table';

type FCheckedItem = (checked: boolean, menuName: string) => void;
type FShowDrawer = (record: MenuItem) => void;
export const columnsMenuItems = (checkedItem: FCheckedItem, showDrawer: FShowDrawer): ColumnType<MenuItem>[] => {
  return [
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
      render: (position: number, record, index: number) => <Avatar shape='square'>{index + 1}</Avatar>,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: 70,
      render: (text: string, record) => <Typography.Text>{record.name}</Typography.Text>,
    },
    {
      title: 'Alias',
      dataIndex: 'label',
      className: 'drag-visible',
      width: 70,
    },
    {
      title: 'Icono',
      dataIndex: 'icon',
      width: 10,
      render: (text: string, record) => renderIcon(record.icon, 25),
    },
    {
      title: 'Habilitado',
      dataIndex: 'checked',
      width: 10,
      render: (checked: boolean, record) => (
        <Switch
          checked={checked}
          checkedChildren={'si'}
          unCheckedChildren={'No'}
          onChange={(checked) => checkedItem(checked, record.name)}
        />
      ),
    },
    {
      title: 'Opciones',
      dataIndex: 'options',
      width: 10,
      render: (text: string, record) => (
        <Button
          type='primary'
          onClick={() => showDrawer(record)}
          icon={<iconComponents.EditOutlined />}
          disabled={!record.checked}
        />
      ),
    },
  ];
};

const renderIcon = (iconName: string, size?: number) => {
  //@ts-ignore
  const IconComponent = iconComponents[iconName];
  return IconComponent ? <IconComponent style={size ? { fontSize: size } : {}} /> : iconName;
};
