import {
  Affix,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Layout,
  List,
  message,
  Modal,
  Popover,
  Row,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, InfoCircleOutlined, OrderedListOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import { useContext, useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { SectionsPrelanding } from '@/helpers/constants';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';
import InformationIcon from '@2fd/ant-design-icons/lib/Information';
import { CurrentEventContext } from '@/context/eventContext';
import { AgendaApi, EventsApi, SpeakersApi } from '@/helpers/request';
import ModalContador from './modalContador';
import { useHistory } from 'react-router';
import { obtenerData, settingsSection, visibleAlert } from './hooks/helperFunction';
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

const PreLandingSections = ({ tabActive, changeTab }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [agenda, setAgenda] = useState([]);

  const cEvent = useContext(CurrentEventContext);
  const history = useHistory();

  useEffect(() => {
    if (!cEvent.value || tabActive !== '3') return;
    setLoading(true);
    obtainPreview();
    async function obtainPreview() {
      //OBTENENOS LAS SECCIONES DE PRELANDING
      const previews = await EventsApi.getPreviews(cEvent.value._id);
      //SE ORDENAN LAS SECCIONES POR INDEX
      const sections = previews.data.length > 0 ? previews.data.sort((a, b) => a.index - b.index) : SectionsPrelanding;
      const { speakers, agenda, description } = await obtenerData(cEvent);
      setDescription(description);
      setAgenda(agenda);
      setSpeakers(speakers);
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

  const validateBlockState = (block) => {
    if (block.status === true && !visibleAlert(block, description, speakers, agenda)) {
      return 'VISIBLE_BLOCK';
    } else if (block.status === true && visibleAlert(block, description, speakers, agenda)) {
      return 'BLOCK_LOCKED';
    } else {
      return 'HIDDEN_BLOCK';
    }
  };

  const stateOrStateColor = (block, iWantColor) => {
    const state = validateBlockState(block);

    switch (state) {
      case 'VISIBLE_BLOCK':
        return iWantColor ? '#52C41A' : 'Visible';
      case 'BLOCK_LOCKED':
        return iWantColor ? '#FAAD14' : 'Sin contenido';
      case 'HIDDEN_BLOCK':
        return iWantColor ? '#FF4D4F' : 'Oculto';
      default:
        return iWantColor ? '#FF4D4F' : 'Oculto';
    }
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
        return <Tag color={stateOrStateColor(item, true)}>{stateOrStateColor(item)}</Tag>;
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
            <Badge
              count={
                visibleAlert(item, description, speakers, agenda) ? (
                  <Tooltip title={'Debe configurar el contenido para que se visualice en la landing'}>
                    <InformationIcon style={{ color: '#FAAD14', fontSize: '20px' }} />
                  </Tooltip>
                ) : (
                  0
                )
              }>
              <Button onClick={() => settingsSection(item, cEvent, history, setVisible, changeTab)}>Configurar</Button>
            </Badge>
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
    <Row gutter={[8, 8]}>
      <Col span={18}>
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
      </Col>

      <Col span={6}>
        <Card
          bordered={false}
          bodyStyle={{ padding: '0px', overflow: 'hidden', backgroundColor: '#7C7979' }}
          style={{
            borderRadius: '5px',
            height: '100%',
            overflow: 'hidden',
            minHeight: '100%',
            backgroundColor: '#7C7979',
          }}>
          <Layout>
            <Layout.Header style={{ padding: '0px' }}>
              <Row justify='center' align='middle' style={{ height: '80px', backgroundColor: '#E8E6F0' }}>
                Banner
              </Row>
            </Layout.Header>
            <Layout.Content style={{ backgroundColor: '#7C7979' }}>
              <Row justify='center' align='middle' style={{ height: '80px', backgroundColor: '#7C7979' }}>
                <Card style={{ width: '80%', height: '40px' }}></Card>
              </Row>

              <List
                dataSource={dataSource}
                grid={{ gutter: 8, column: 1 }}
                renderItem={(item) => (
                  <List.Item
                    className={`animate__animated ${item.status ? 'animate__backInLeft' : 'animate__backOutRight'}`}
                    style={{ display: `${item.status ? 'block' : 'none'}` }}>
                    <Col span={24} style={{ height: '60px', backgroundColor: '#C4C4C4' }}>
                      <Row justify='center' align='middle' style={{ height: '100%' }}>
                        {item.name}
                      </Row>
                    </Col>
                  </List.Item>
                )}
              />
            </Layout.Content>
          </Layout>
        </Card>
      </Col>
      {/* Modal para la creacion de la data del contador */}
      <ModalContador visible={visible} setVisible={setVisible} />
    </Row>
  );
};

export default PreLandingSections;
