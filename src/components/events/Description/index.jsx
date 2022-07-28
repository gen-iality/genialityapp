import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Empty,
  Image,
  Popconfirm,
  Popover,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import arrayMove from 'array-move';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ModalImageComponent from './componets/modalImage';
import ModalTextComponent from './componets/modalTextType';
import ImageAreaIcon from '@2fd/ant-design-icons/lib/ImageArea';
import CardTextIcon from '@2fd/ant-design-icons/lib/CardText';
import VideoBoxtIcon from '@2fd/ant-design-icons/lib/VideoBox';
import ContentSaveAlertIcon from '@2fd/ant-design-icons/lib/ContentSaveAlert';
import ContentSaveCheckIcon from '@2fd/ant-design-icons/lib/ContentSaveCheck';
import FitToScreenIcon from '@2fd/ant-design-icons/lib/FitToScreen';
import ModalVideoComponent from './componets/modalVideo';
import ReactPlayer from 'react-player';
import { CurrentEventContext } from '@/context/eventContext';
import DrawerPreview from './componets/drawerPreview';
import Loading from '@/components/profile/loading';
import {
  deleteItem,
  DragHandle,
  editItem,
  messageDinamic,
  obtenerDescriptionSections,
  openNotification,
  saveItem,
  saveOrder,
  SortableBody,
  SortableItem,
  styleCardButton,
} from './hooks/utils';

const DescriptionDynamic = () => {
  //permite guardar el listado de elmentos de la descripción
  const [dataSource, setDataSource] = useState([]);
  const [type, setType] = useState(null);
  const [item, setItem] = useState(null);
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOrderUpdate, setIsOrderUpdate] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const cEvent = useContext(CurrentEventContext);

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
      render: (value, item) => {
        return renderTypeComponent(item.type, value);
      },
    },
    {
      title: 'Edit',
      dataIndex: 'index',
      width: 50,
      className: 'drag-visible',
      render: (value, item) => (
        <Space direction='vertical'>
          <Tooltip placement='left' title='Editar'>
            <Button size='large' icon={<EditOutlined />} onClick={() => editItem(item, setItem, setType)} />
          </Tooltip>
          <Popconfirm
            icon={<WarningOutlined />}
            placement='left'
            title={
              <Typography.Text>{`¿Está seguro que desea eliminar este bloque de ${messageDinamic(
                item.type
              )}?`}</Typography.Text>
            }
            onConfirm={() => deleteItem(item, dataSource, setDataSource)}
            okText='Eliminar'
            okType='danger'
            cancelText='Cancelar'>
            <Button size='large' icon={<DeleteOutlined />} type='primary' danger />
          </Popconfirm>
          {item.type === 'image' && (
            <Tooltip
              placement='left'
              title='La imagen agregada no refleja sus dimensiones reales, esto con el fin de facilitar la acción de ordenar.'>
              <Button size='large' icon={<ExclamationCircleOutlined style={{ color: '#1890FF' }} />} type='text' />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const renderTypeComponent = useCallback(
    (type, value) => {
      if (focus) return;
      switch (type) {
        case 'image':
          return (
            <Image
              preview={{
                mask: (
                  <Button size='large' type='primary'>
                    Ver imagen completa
                  </Button>
                ),
              }}
              src={value}
              style={{ objectFit: 'contain' }}
              width='100%'
              height='250px'
            />
          );
        case 'text':
          return <div style={{ maxHeight: '250px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: value }} />;
        case 'video':
          return <ReactPlayer controls width={'100%'} height={'250px'} url={value} />;
        default:
          return <div></div>;
      }
    },
    [dataSource]
  );

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      let newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter((el) => !!el);
      if (newData) {
        newData = newData.map((data, key) => {
          return { ...data, index: key };
        });
      }
      setIsOrderUpdate(true);
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

  const content = (
    <Space size={20} id='content-block-description'>
      <Card
        className='animate__animated animate__bounceIn '
        hoverable={true}
        style={styleCardButton}
        onClick={() => {
          setItem(null);
          setType('text');
        }}>
        <Space size={8} style={{ textAlign: 'center' }} direction='vertical'>
          <Avatar
            shape='square'
            size={80}
            icon={
              <CardTextIcon
                className='animate__animated animate__bounceIn animate__delay-2s '
                style={{ fontSize: '50px' }}
              />
            }
            style={{ display: 'grid', placeContent: 'center', backgroundColor: '#517FD6' }}></Avatar>
          <Typography.Text>Texto</Typography.Text>
        </Space>
      </Card>
      <Card
        className='animate__animated animate__bounceIn '
        hoverable={true}
        style={styleCardButton}
        onClick={() => {
          setItem(null);
          setType('image');
        }}>
        <Space size={8} style={{ textAlign: 'center' }} direction='vertical'>
          <Avatar
            shape='square'
            size={80}
            icon={
              <ImageAreaIcon
                className='animate__animated animate__bounceIn animate__delay-2s '
                style={{ fontSize: '50px' }}
              />
            }
            style={{ display: 'grid', placeContent: 'center', backgroundColor: '#51D6A8' }}></Avatar>
          <Typography.Text>Imagen</Typography.Text>
        </Space>
      </Card>
      <Card
        onClick={() => {
          setItem(null);
          setType('video');
        }}
        className='animate__animated animate__bounceIn '
        hoverable={true}
        style={styleCardButton}>
        <Space size={8} style={{ textAlign: 'center' }} direction='vertical'>
          <Avatar
            shape='square'
            size={80}
            icon={
              <VideoBoxtIcon
                className='animate__animated animate__bounceIn animate__delay-2s '
                style={{ fontSize: '50px' }}
              />
            }
            style={{ display: 'grid', placeContent: 'center', backgroundColor: '#D6A851' }}></Avatar>
          <Typography.Text>Video</Typography.Text>
        </Space>
      </Card>
    </Space>
  );
  //PERMITE OBTENER LAS SECCIONES DE LA DESCRIPCION
  useEffect(() => {
    if (!cEvent.value) return;
    obtenerDescriptionSections(setLoading, cEvent, setDataSource);
  }, [cEvent.value]);

  const tableFunction = useCallback(() => {
    return !loading ? (
      <Table
        className='viewReactQuill'
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
    ) : (
      <Row style={{ height: '100%' }}>
        <Loading />
      </Row>
    );
  }, [dataSource, loading]);
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row justify='center' align='middle'>
          <ConfigProvider renderEmpty={() => <Empty />}>{tableFunction()}</ConfigProvider>
        </Row>
      </Col>

      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '2px',
          borderRadius: '5px',
        }}>
        <Row gutter={[16, 16]} justify='end' align='middle'>
          <Col>
            <Popover content={content} title={null} trigger={'focus'} overlayInnerStyle={{ padding: '20px' }}>
              <Tooltip title='Agregar'>
                <Button
                  onBlur={(e) => setFocus(false)}
                  onFocus={(e) => setFocus(true)}
                  shape='default'
                  icon={
                    <PlusOutlined
                      className={`animate__animated animate__heartBeat animate__slow ${
                        focus ? '' : 'animate__infinite'
                      }`}
                      style={{ fontSize: '30px', color: '#2698FA' }}
                    />
                  }
                  style={{ height: '60px', width: '60px' }}
                />
              </Tooltip>
            </Popover>
          </Col>
          <Col>
            <Tooltip title={isOrderUpdate ? 'Guardar cambios' : 'Cambios guardados'}>
              <Button
                loading={loading}
                className='animate__animated animate__bounceIn'
                style={{ height: '60px', width: '60px' }}
                onClick={() =>
                  isOrderUpdate ? saveOrder(dataSource, setIsOrderUpdate, setLoading) : openNotification()
                }
                icon={
                  isOrderUpdate ? (
                    <ContentSaveAlertIcon
                      className='animate__animated animate__tada animate__slow animate__infinite '
                      style={{ fontSize: '30px', color: '#FAAD14' }}
                    />
                  ) : (
                    <ContentSaveCheckIcon style={{ fontSize: '30px', color: '#52C41A' }} />
                  )
                }
              />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title='Vista previa'>
              <Button
                style={{ height: '60px', width: '60px' }}
                onClick={() => setVisibleDrawer(true)}
                icon={<FitToScreenIcon style={{ fontSize: '30px' }} />}
              />
            </Tooltip>
          </Col>
        </Row>
      </div>
      <DrawerPreview dataSource={dataSource} visibleDrawer={visibleDrawer} setVisibleDrawer={setVisibleDrawer} />
      <ModalImageComponent
        type={type}
        setType={setType}
        setLoading={setLoading}
        dataSource={dataSource}
        setItem={setItem}
        setDataSource={setDataSource}
        initialValue={item}
        saveItem={saveItem}
      />
      <ModalTextComponent
        type={type}
        setType={setType}
        setLoading={setLoading}
        dataSource={dataSource}
        setItem={setItem}
        setDataSource={setDataSource}
        initialValue={item}
        saveItem={saveItem}
      />
      <ModalVideoComponent
        type={type}
        setType={setType}
        setLoading={setLoading}
        dataSource={dataSource}
        setItem={setItem}
        setDataSource={setDataSource}
        initialValue={item}
        saveItem={saveItem}
      />
    </Row>
  );
};

export default DescriptionDynamic;
