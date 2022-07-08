import { Avatar, Button, Card, message, Row, Space, Spin, Switch, Table, Tag } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, MenuOutlined, OrderedListOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import { useContext, useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { SectionsPrelanding } from '@/helpers/constants';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';
import { CurrentEventContext } from '@/context/eventContext';
import { EventsApi } from '@/helpers/request';
import { async } from 'ramda-adjunct';
const DragHandle = SortableHandle(() => (
  <DragIcon
    style={{
      cursor: 'move',
      color: '#999999',
      fontSize: '22px',
    }}
  />
));

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

const PreLandingSections = ({ tabActive }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const cEvent = useContext(CurrentEventContext);

  useEffect(() => {
    if (!cEvent.value || tabActive !== '3') return;
    setLoading(true);
    obtainPreview();
    async function obtainPreview() {
      //OBTENENOS LAS SECCIONES DE PRELANDING
      const previews = await EventsApi.getPreviews(cEvent.value._id);
      //SE ORDENAN LAS SECCIONES POR INDEX
      const sections = previews.data.length > 0 ? previews.data.sort((a, b) => a.index - b.index) : SectionsPrelanding;
      setDataSource(sections);
      setLoading(false);
    }
  }, [cEvent, tabActive]);
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
    if (dataSource) {
      let saved = true;
      await Promise.all(
        dataSource.map(async (section) => {
          if (!section._id) {
            try {
              const resp = await EventsApi.addPreviews(cEvent.value._id, section);
            } catch (error) {
              saved = false;
            }
          } else {
            try {
              const resp = await EventsApi.updatePreviews(section._id, section);
            } catch (error) {
              saved = false;
            }
          }
        })
      );
      if (saved) message.success('Configuración guardada correctamente');
      else message.error('Error al guardar la configuración');
    } else {
      message.error('Secciones no se pueden guardar');
    }
  };
  //COLUMNAS PARA LAS SECCIONES DE PRELANDING
  const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 50,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: <OrderedListOutlined />,
      dataIndex: 'order',
      width: 80,
      className: 'drag-visible',
      render: (val, item) => {
        return <Avatar shape='square'>{item.index + 1}</Avatar>;
      },
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
        return <Tag color={item.status === true ? 'green' : 'red'}>{item.status === true ? 'Visible' : 'Oculto'} </Tag>;
      },
    },
    {
      title: 'Opciones',
      dataIndex: 'status',
      className: 'drag-visible',
      render: (val, item) => {
        return (
          <Space>
            <Switch
              loading={loading}
              onChange={(val) => updateItem(item, val)}
              checkedChildren={<EyeOutlined />}
              unCheckedChildren={<EyeInvisibleOutlined />}
              checked={val}
            />
            <Button>Configurar</Button>
          </Space>
        );
      },
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
  return (
    <>
      <Card hoverable={true} style={{ borderRadius: '20px' }}>
        <Table
          tableLayout='auto'
          style={{ userSelect: 'none' }}
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
      </Card>
      {/* {dataSource
        ? dataSource.map((data) => {
            return (
              <Row key={'row' + data.key} style={{ marginTop: 10 }}>
                {data.name} - {data.status ? 'Activo' : 'Desactivado'}
              </Row>
            );
          })
        : null} */}
    </>
  );
};

export default PreLandingSections;