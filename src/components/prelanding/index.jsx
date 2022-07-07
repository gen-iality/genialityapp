import { Button, Card, Row, Spin, Switch, Table } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import { useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { SectionsPrelanding } from '@/helpers/constants';
const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: 'grab',
      color: '#999',
    }}
  />
));

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

const PreLandingSections = (props) => {
  const [dataSource, setDataSource] = useState(SectionsPrelanding);
  const [loading, setLoading] = useState(false);
  //PERMITE ACTUALIZAR EL STATUS DE LAS SECCIONES
  const updateItem = (item, val) => {
    setLoading(true);
    item.status = val;
    const newDataSource = dataSource.map((data) => {
      if (data.key == item.key) return item;
      else return data;
    });
    setDataSource(newDataSource);
    setLoading(false);
  };
  //PERMITE GUARDAR STATUS DE LAS SECCIONES EN BD
  const saveSections = async () => {
    console.log('DATASOURCE==>', dataSource);
  };
  //COLUMNAS PARA LAS SECCIONES DE PRELANDING
  const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Sección',
      dataIndex: 'name',
      className: 'drag-visible',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      render: (val, item) => {
        return (
          <Switch
            onChange={(val) => updateItem(item, val)}
            checkedChildren='On'
            unCheckedChildren='Off'
            checked={val}
          />
        );
      },
    },
    {
      title: 'Modificar sección',
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
      console.log('Sorted items: ', newData);
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
  return (
    <Card>
      <Table
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
      <Row justify='end' style={{ marginTop: 10 }}>
        {!loading ? (
          <Button onClick={() => saveSections()} type='primary'>
            Guardar
          </Button>
        ) : (
          <Spin />
        )}
      </Row>
      {dataSource
        ? dataSource.map((data) => {
            return (
              <Row key={'row' + data.key} style={{ marginTop: 10 }}>
                {data.name} - {data.status ? 'Activo' : 'Desactivado'}
              </Row>
            );
          })
        : null}
    </Card>
  );
};

export default PreLandingSections;
