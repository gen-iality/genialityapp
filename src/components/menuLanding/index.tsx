import { useEffect } from 'react';
import { Spin, Form, Switch, Table, Button, Typography, Tag } from 'antd';
import Header from '@/antdComponents/Header';
import BackTop from '@/antdComponents/BackTop';
import useMenuLanding from './hooks/useMenuLanding';
import { MenuLandingProps } from './interfaces/menuLandingProps';
import * as iconComponents from '@ant-design/icons';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import BottonOpenModal from './hooks/BottonOpenModal';
import { SortEndHandler, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
interface DataItem {
  key: string;
  drag: JSX.Element;
  position: number;
  name: string;
  icons: string;
  checked: boolean;
  options: JSX.Element;
}

export default function MenuLanding(props: MenuLandingProps) {
  const { menu, isLoading, titleheader, data, formValues, setData, updateValue, submit, checkedItem } = useMenuLanding(
    props
  );

  useEffect(() => {
    const updatedData: DataItem[] = Object.keys(menu).map((key: string, index: number) => {
      return {
        key: key,
        drag: <DragIcon />,
        position: menu[key].position,
        name: menu[key].name,
        icons: menu[key].icon,
        checked: menu[key].checked,
        options: <iconComponents.EditOutlined />,
      };
    });
    setData(updatedData);
  }, [menu]);

  const handleDragEnd: SortEndHandler = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex) {
      const enabledItems = data.filter((item) => item.checked);
      const disabledItems = data.filter((item) => !item.checked);

      const movedItem = enabledItems.splice(oldIndex, 1)[0];
      enabledItems.splice(newIndex, 0, movedItem);

      const updatedData = [...enabledItems, ...disabledItems];
      const updatedDataWithPositions = updatedData.map((item, index) => ({
        ...item,
        position: item.checked ? index + 1 : item.position,
      }));

      setData(updatedDataWithPositions);
    }
  };

  
  const DragHandle = SortableHandle(() => (
    <DragIcon
      style={{
        cursor: 'move',
        color: '#999999',
        fontSize: '22px',
      }}
    />
  ));

  const SortableItem = SortableElement((props: any) => <tr {...props} />);
  const SortableBody = SortableContainer((props: any) => <tbody {...props} />);

  const renderIcon = (iconName: string) => {
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent /> : iconName;
  };

  const columns = [
    {
      title: '',
      className: 'drag-visible',
      dataIndex: 'drag',
      width: 30,
      render: () => <DragHandle />,
    },
    {
      title: 'Orden',
      dataIndex: 'position',
      width: 20,
      render: (text: number, record: DataItem, index: number) => <Tag>{`#${index + 1}`}</Tag>,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: 100,
      render: (text: string, record: DataItem) => <Typography.Text>{record.name}</Typography.Text>,
    },
    {
      title: 'Alias',
      dataIndex: 'label',
      className: 'drag-visible',
      width: 100,
    },
    {
      title: 'Iconos',
      dataIndex: 'icons',
      width: 100,
      render: (text: string, record: DataItem) => renderIcon(record.icons),
    },
    {
      title: 'Habilitado',
      dataIndex: 'checked',
      width: 100,
      render: (text: string, record: DataItem) => (
        <Switch checked={text} onChange={(checked) => record.key && checkedItem(record.key, checked)} />
      ),
    },
    {
      title: 'Opciones',
      dataIndex: 'options',
      width: 100,
      render: (text: string, record: DataItem) =>
        record.checked ? (
          <BottonOpenModal updateValue={updateValue} checkedItem={checkedItem} formValues={formValues} />
        ) : (
          <Button type='primary' icon={<iconComponents.EditOutlined />} disabled />
        ),
    },
  ];

  return (
    <Form onFinish={submit}>
      <Header title={titleheader} save form />
      <Spin tip='Cargando...' size='large' spinning={isLoading}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='menu'>
            {(provided) => (
              <Table
                style={{ padding: '30px 0' }}
                dataSource={data}
                columns={columns}
                pagination={false}
                bordered
                size='small'
                components={{
                  body: {
                    wrapper: (props) => (
                      <SortableBody {...props} useDragHandle helperClass="row-dragging" onSortEnd={handleDragEnd} />
                    ),
                    row: (props) => <SortableItem index={props["data-row-key"]} {...props} />,
                  },
                }}                
                onRow={(record: any, index: number | undefined) => ({
                  index,
                  'data-row-key': record.key,
                })}
                rowKey='key'
              />
            )}
          </Droppable>
        </DragDropContext>
      </Spin>
      <BackTop />
    </Form>
  );
}
