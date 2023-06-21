import { useEffect, useState } from 'react';
import { Spin, Form, Switch, Table, Button, Typography, Tag } from 'antd';
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
  const [send, setSend] = useState<boolean>(false)
 
  

  useEffect(() => {
    const updatedData: Menu[] = Object.keys(menu).map((key: string, index: number) => {
      return {
        key: key,
        drag: <DragIcon />,
        position: menu[key].position,
        name: menu[key].name,
        icon: menu[key].icon,
        checked: menu[key].checked,
        label: menu[key].label,
        options: <iconComponents.EditOutlined />,
      };
    });
    setData(updatedData);
    if(send) {
      submit()
      setSend(false)
    }
  }, [menu]);


  
  const DragHandle = SortableHandle(() => (
    <DragIcon
      style={{
        cursor: 'move',
        color: '#999999',
        fontSize: '22px',
      }}
    />
  ));

  const SortableItem : any = SortableElement((props: any) => <tr {...props} />);
  const SortableBody : any = SortableContainer((props: any) => <tbody {...props} />);

  const renderIcon = (iconName: string) => {
    //@ts-ignore
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent /> : iconName;
  };
  const showDrawe = (item : Menu) => {
    setItemEdit(item)
    setVisibility(true)
  }
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
      render: (text: number, record: Menu, index: number) => <Tag>{`#${index + 1}`}</Tag>,
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
      render: (text: string, record: Menu) => renderIcon(record.icon),
    },
    {
      title: 'Habilitado',
      dataIndex: 'checked',
      width: 10,
      render: (checked: boolean, record: Menu) => (
        <Switch checked={checked} checkedChildren={'si'} unCheckedChildren={'No'} onChange={(checked) => record.key && checkedItem(record.key, checked)} />
      ),
    },
    {
      title: 'Opciones',
      dataIndex: 'options',
      width: 10,
      render: (text: string, record: Menu) =>
          <Button type='primary' onClick={()=> showDrawe(record)} icon={<iconComponents.EditOutlined />} disabled={!record.checked}  />
    },
  ];
  const handleOk = () => {
    const { checked, icon, position, label } = itemEdit;
    const menuCopy = { ...menu };
    menuCopy[itemEdit.key] = {
      ...menu[itemEdit.key],
      checked,
      icon,
      position,
      label: label ?? '',
    };
    setItemsMenu(menuCopy)
    setVisibility(false)
    setSend(true)
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
                style={{ padding: '30px 0' }}
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
