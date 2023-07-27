import { useEffect, useState } from 'react';
import { Spin, Form, Switch, Table, Button, Typography, Tag, Avatar } from 'antd';
import Header from '@/antdComponents/Header';
import BackTop from '@/antdComponents/BackTop';
import useMenuLanding from './hooks/useMenuLanding';
import { Menu, MenuItem, MenuLandingProps } from './interfaces/menuLandingProps';
import * as iconComponents from '@ant-design/icons';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ModalEdit from './components/ModalEdit';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { ColumnType } from 'antd/lib/table';

export default function MenuLanding(props: MenuLandingProps) {
  const { menu, isLoading, titleheader, data, setData, handleDragEnd, submit, checkedItem ,setItemsMenu} = useMenuLanding(
    props
  );
  const [visibility, setVisibility] = useState(false)
  const [itemEdit, setItemEdit] = useState<Menu>({} as Menu)
 
  

  useEffect(() => {
    const newdata: Menu[] = Object.keys(menu).map((key: string, index: number) => {
      return {
        key: key,
        position: menu[key].position,
        name: menu[key].name,
        icon: menu[key].icon,
        checked: menu[key].checked,
        label: menu[key].label,
        permissions : menu[key].permissions,
        options: <iconComponents.EditOutlined />,
      };
    })
    .toSorted((a, b) => a.position   - b.position )
    
    
    setData(newdata);
  }, [menu]);




  const SortableItem: any = SortableElement((props: any) => <tr {...props} />);
  const SortableBody: any = SortableContainer((props: any) => <tbody {...props} />);
  const renderIcon = (iconName: string, size?: number) => {
    //@ts-ignore
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent style={size ? {fontSize: size} : {}} /> : iconName;
  };
  const showDrawe = (item: Menu) => {
    setItemEdit(item);
    setVisibility(true);
  };
  const DragHandle = SortableHandle(() => (
    <DragIcon
      style={{
        cursor: 'move',
        fontSize: '22px',
      }}
    />
  ));
  const columns = [
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
      render: (position: number, record: Menu, index: number) => <Avatar shape='square'>{index + 1}</Avatar>,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: 70,
      render: (text: string, record: Menu) => <Typography.Text>{record.name}</Typography.Text>,
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
      render: (text: string, record: Menu) => renderIcon(record.icon, 25),
    },
    {
      title: 'Habilitado',
      dataIndex: 'checked',
      width: 10,
      render: (checked: boolean, record: Menu) => (
        <Switch checked={checked} checkedChildren={'si'} unCheckedChildren={'No'} onChange={(checked) => record.key && checkedItem(record.key, checked)} />
      )
    },
    {
      title: 'Opciones',
      dataIndex: 'options',
      width: 10,
      render: (text: string, record: Menu) => (
        <Button
          type='primary'
          onClick={() => showDrawe(record)}
          icon={<iconComponents.EditOutlined />}
          disabled={!record.checked}
        />
      ),
    },
  ];

  const handleOk = () => {
    const { checked, icon, label, key } = itemEdit;
    menu[key] = {
      ...menu[key],
      icon,
      label: label ?? '',
    };
    checkedItem(key,checked)
    setVisibility(false)

  }
  const handleCancel = () => {
    setVisibility(false);
    setItemEdit({} as Menu)
  };
  return (
 
    <Form onFinish={submit}>
      <Header title={titleheader} save form />
     <ModalEdit item={itemEdit} handleOk={handleOk} handleCancel={handleCancel} visibility={visibility} loading={isLoading} setItemEdit={setItemEdit} />
      <Spin tip='Cargando...' size='large' spinning={isLoading}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='menu'>
            {(provided : any) => (
              <Table
                ref={provided.innerRef} 
                tableLayout='auto'
                style={{ padding: '30px 0', cursor: 'pointer' }}
                dataSource={data}
                columns={columns as ColumnType<Menu>[]}
                pagination={false}
                bordered={false}
                size='small'
                components={{
                  body: {
                    wrapper: (props : any) => (
                      <SortableBody {...props} useDragHandle helperClass="row-dragging" onSortEnd={handleDragEnd} />
                    ),
                    row: (props : any) => <SortableItem index={props["data-row-key"]} {...props} />,
                  },
                }}
                //@ts-ignore
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