import { DeleteOutlined, EditOutlined, MenuOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Image, Layout, Popover, Row, Space, Table } from 'antd';
import arrayMove from 'array-move';
import { isNumber } from 'ramda-adjunct';
import { useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import ModalImageComponent from './componets/modalImage';
import ModalTextComponent from './componets/modalTextType';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';

const DescriptionDynamic = () => {
  //permite guardar el listado de elmentos de la descripción
  const [dataSource, setDataSource] = useState([]);
  const [type, setType] = useState(null);
  const [item, setItem] = useState(null);

  const editItem = (item) => {
    setItem(item);
    setType(item.type);

  }

  const DragHandle = SortableHandle(() => (
    <DragIcon
      style={{
        cursor: 'move',
        color: '#999999',
        fontSize: '22px',
      }}
    />
  ));
  const columns = [
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 50,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'value',
      dataIndex: 'value',

      className: 'drag-visible',
      render: (value, item) => { return renderTypeComponent(item.type, value) },
    },
    {
      title: 'Edit',
      dataIndex: 'index',
      width: 100,
      className: 'drag-visible',
      render: (value, item) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => editItem(item)} />
          <Button icon={<DeleteOutlined />} onClick={() => deleteItem(item)} type='primary' danger />
        </Space>
      )
    },


  ];

  const renderTypeComponent = (type, value) => {
    switch (type) {
      case 'image':
        return <Image
          preview={false}
          src={value}
          width={'100%'}
          height={350} />
      case 'text':
        return <div dangerouslySetInnerHTML={{ __html: value }} />
      default:
        return <div></div>;
    }

  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      let newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter((el) => !!el);
      if (newData) {
        newData = newData.map((data, key) => {
          return { ...data, index: key };
        });
      }
      setDataSource(newData);
    }
  };

  const DraggableContainer = (props) => (
    <SortableBody useDragHandle disableAutoscroll onSortEnd={onSortEnd} {...props} />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };
  const SortableItem = SortableElement((props) => <tr {...props} />);
  const SortableBody = SortableContainer((props) => <tbody {...props} />);
  const content = (
    <Row>
      <Button onClick={() => { setItem(null); setType('image') }} style={{ marginRight: 10 }}>Imagen</Button>
      <Button onClick={() => { setItem(null); setType('text') }} style={{ marginRight: 10 }}>Texto</Button>
      <Button style={{ marginRight: 10 }}>Video</Button>
    </Row>
  );

  const obtenerIndex = () => {
    let data = dataSource.sort((a, b) => a.index > b.index);
    return data.length + 1;
  }


  const updateItem = (item) => {
    const newList = dataSource.map((data) => {
      if (data.index == item?.index) {
        return item;
      } else {
        return data;
      }
    });
    return newList;
  }

  const deleteItem = (item) => {
    let newList = dataSource.filter((data) => data.index !== item.index);
    newList = updateIndexTotal(newList);
    setDataSource(newList);
  }

  //PERMITE ACTUALIZAR LOS INDICES
  const updateIndexTotal = (lista) => {
    let newList = lista.sort((a, b) => a.index > b.index);
    newList = lista.map((data, index) => {
      return { ...data, index: index }
    });
    return newList;
  }

  const saveItem = (item) => {
    let newList = [];
    if (item && !isNumber(item.index)) {
      const itemIndex = { ...item, index: obtenerIndex() };
      newList = [...dataSource, itemIndex];

    } else {
      newList = updateItem(item)
    }
    setDataSource(newList);
    setItem(null);
  }
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row justify="center" align='middle'>
          <Table
            tableLayout='auto'
            showHeader={false}
            style={{ userSelect: 'none', width: '100%' }}
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            rowKey='index'
            components={{
              body: {
                wrapper: DraggableContainer,
                row: DraggableBodyRow,
              },
            }}
          />
        </Row>
      </Col>
      <Col span={24}>
        <Row justify="center" align='middle'>
          <Popover content={content} title='¿Que deseas agregar?' trigger={'click'}>
            <Button type='text' shape='circle' icon={<PlusCircleOutlined />} size={'large'} />
          </Popover>
        </Row>
      </Col>
      <ModalImageComponent type={type} setType={setType} initialValue={item} saveItem={saveItem} />
      <ModalTextComponent type={type} setType={setType} initialValue={item} saveItem={saveItem} />
    </Row>
  );
};

export default DescriptionDynamic;