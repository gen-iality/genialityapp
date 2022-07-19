import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Popover, Row, Table } from 'antd';
import arrayMove from 'array-move';
import { useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const DescriptionDynamic = () => {
  const [dataSource, setDataSource] = useState([]);
  const DragHandle = SortableHandle(() => (
    <MenuOutlined
      style={{
        cursor: 'grab',
        color: '#999',
      }}
    />
  ));
  const columns = [
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      render: () => <DragHandle />,
    },
    {
      title: 'value',
      dataIndex: 'value',
      width: '95%',
    },
  ];

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
    <SortableBody useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props} />
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
      <Button style={{ marginRight: 10 }}>Imagen</Button>
      <Button style={{ marginRight: 10 }}>Texto</Button>
      <Button style={{ marginRight: 10 }}>Video</Button>
    </Row>
  );
  return (
    <div>
      <Row>
        <Table
          style={{ width: '100%' }}
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
      <Row justify='center' style={{ marginTop: 40 }}>
        <Popover content={content} title='¿Que deseas agregar?'>
          <Button shape='circle' icon={<PlusCircleOutlined />} size={'large'}></Button>
        </Popover>
      </Row>
    </div>
  );
};

export default DescriptionDynamic;
