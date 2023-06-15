import React, { useState, useEffect } from 'react';
import { Spin, Form, Switch, Table, Button, Typography, Tag } from 'antd';
import Header from '@/antdComponents/Header';
import BackTop from '@/antdComponents/BackTop';
import useMenuLanding from './hooks/useMenuLanding';
import { MenuLandingProps } from './interfaces/menuLandingProps';
import { DragOutlined, EditOutlined } from '@ant-design/icons';
import * as iconComponents from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BottonOpenModal from './hooks/BottonOpenModal';

export default function MenuLanding(props: MenuLandingProps) {
  const { menu, isLoading, titleheader, data, setData, updateValue, submit, checkedItem } = useMenuLanding(props);

  useEffect(() => {
    const updatedData = Object.keys(menu).map((key: string, index) => {
      return {
        key: key,
        drag: <DragOutlined />,
        position: menu[key].position,
        name: menu[key].name,
        icons: menu[key].icon,
        checked: menu[key].checked,
        options: <EditOutlined />,
      };
    });
    setData(updatedData);
  }, [menu]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const items = Array.from(data);
    const reorderedItem = items[source.index];
    const targetItem = items[destination.index];
    if (!reorderedItem.checked || !targetItem.checked) {
      return;
    }
    items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setData(items);
  };

  // const renderIcon = (record) => {
  //   const icon = record.icons;
  //   const IconComponent = iconComponents[icon];
  //   return IconComponent ? <IconComponent /> : null;
  // };

  const columns = [
    {
      title: '',
      dataIndex: 'drag',
      width: 100,
    },
    {
      title: 'Orden',
      dataIndex: 'position',
      width: 100,
      render: (text: number, record, index: number) => <Tag>{`#${index + 1}`}</Tag>,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: 100,
      render: (text: string, record) => <Typography.Text>{record.name}</Typography.Text>,
    },
    {
      title: 'Iconos',
      dataIndex: 'icons',
      width: 100,
      // render: (record) => renderIcon(record)
    },
    {
      title: 'Habilitado',
      dataIndex: 'checked',
      width: 100,
      render: (text: string, record) => (
        <Switch checked={text} onChange={(checked) => checkedItem(record.key, checked)} />
      ),
    },
    {
      title: 'Opciones',
      dataIndex: 'options',
      width: 100,
      render: (text: string, record) =>
        record.checked ? (
          <BottonOpenModal updateValue={updateValue} checkedItem={checkedItem} />
        ) : (
          <Button type='primary' icon={<EditOutlined />} disabled />
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
                      <tbody {...props} ref={provided.innerRef}>
                        {props.children}
                        {provided.placeholder}
                      </tbody>
                    ),
                    row: (props) => (
                      <Draggable draggableId={props['data-row-key']} index={props.index}>
                        {(provided) => (
                          <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            {props.children}
                          </tr>
                        )}
                      </Draggable>
                    ),
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
