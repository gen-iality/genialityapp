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
  message,
  notification,
  Popconfirm,
  Popover,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import arrayMove from 'array-move';
import { isNumber } from 'ramda-adjunct';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import ModalImageComponent from './componets/modalImage';
import ModalTextComponent from './componets/modalTextType';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';
import ImageAreaIcon from '@2fd/ant-design-icons/lib/ImageArea';
import CardTextIcon from '@2fd/ant-design-icons/lib/CardText';
import VideoBoxtIcon from '@2fd/ant-design-icons/lib/VideoBox';
import ContentSaveAlertIcon from '@2fd/ant-design-icons/lib/ContentSaveAlert';
import ContentSaveCheckIcon from '@2fd/ant-design-icons/lib/ContentSaveCheck';
import FitToScreenIcon from '@2fd/ant-design-icons/lib/FitToScreen';
import ModalVideoComponent from './componets/modalVideo';
import ReactPlayer from 'react-player';
import { EventsApi } from '@/helpers/request';
import { CurrentEventContext } from '@/context/eventContext';
import DrawerPreview from './componets/drawerPreview';
import Loading from '@/components/profile/loading';

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

  const editItem = (item) => {
    setItem(item);
    setType(item.type);
  };

  const styleCardButton = {
    height: '130px',
    width: '110px',
    display: 'grid',
    placeContent: 'center',
    borderRadius: '8px',
  };

  const DragHandle = SortableHandle(() => (
    <DragIcon
      style={{
        cursor: 'move',
        color: '#999999',
        fontSize: '28px',
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
            <Button size='large' icon={<EditOutlined />} onClick={() => editItem(item)} />
          </Tooltip>
          <Popconfirm
            icon={<WarningOutlined />}
            placement='left'
            title={
              <Typography.Text>{`¿Está seguro que desea eliminar este bloque de ${messageDinamic(
                item.type
              )}?`}</Typography.Text>
            }
            onConfirm={() => deleteItem(item)}
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

  const messageDinamic = (type) => {
    switch (type) {
      case 'image':
        return 'imagen';
      case 'text':
        return 'texto';
      case 'video':
        return 'video';

      default:
        break;
    }
  };

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

  const openNotification = () => {
    notification.info({
      message: 'No hay más cambios que guardar',
      placement: 'bottomRight',
    });
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

  useEffect(() => {
    if (!cEvent.value) return;
    obtenerDescriptionSections();
  }, [cEvent.value]);

  const obtenerDescriptionSections = async () => {
    setLoading(true);
    const sections = await EventsApi.getSectionsDescriptions(cEvent.value._id);
    let dataOrder = sections.data.sort((a, b) => a.index - b.index);
    setDataSource(dataOrder || []);
    setLoading(false);
  };

  const addSectionToDescription = async (section) => {
    const sectionEvent = { ...section, event_id: cEvent.value._id };
    const saveSection = await EventsApi.saveSections(sectionEvent);
    if (saveSection?._id) {
      return true;
    }
    return false;
  };

  const obtenerIndex = () => {
    let data = dataSource?.sort((a, b) => a.index > b.index);
    return data?.length + 1;
  };

  const updateItem = async (item) => {
    const newList = dataSource.map((data) => {
      if (data.index == item?.index) {
        return item;
      } else {
        return data;
      }
    });
    const sectionUpdate = await EventsApi.updateSectionOne(item._id, item);
    return newList;
  };

  const deleteItem = async (item) => {
    let newList = dataSource.filter((data) => data._id !== item._id);
    const resp = await EventsApi.deleteSections(item._id);
    newList = updateIndexTotal(newList);
    await Promise.all(
      newList.map(async (item) => {
        const updateIndexSections = await EventsApi.updateSectionOne(item._id, item);
      })
    );
    setDataSource(newList);
  };

  //PERMITE ACTUALIZAR LOS INDICES
  const updateIndexTotal = (lista) => {
    let newList = lista.sort((a, b) => a.index > b.index);
    newList = lista.map((data, index) => {
      return { ...data, index: index };
    });
    return newList;
  };

  const saveItem = async (item) => {
    setLoading(true);
    let newList = [];
    let resp;
    if (item && !isNumber(item.index)) {
      const itemIndex = { ...item, index: obtenerIndex() };
      newList = [...dataSource, itemIndex];
      resp = await addSectionToDescription(itemIndex);
    } else {
      resp = updateItem(item);
    }
    if (resp) {
      setTimeout(async () => await obtenerDescriptionSections(), 300);
      setItem(null);
    } else {
      message.error('Error al guardar la sección');
    }
    setLoading(false);
  };

  const saveOrder = async () => {
    const newList = updateIndexTotal(dataSource);
    setLoading(true);
    await Promise.all(
      newList.map(async (item) => {
        const updateIndexSections = await EventsApi.updateSectionOne(item._id, item);
      })
    );
    setIsOrderUpdate(false);
    setLoading(false);
  };
  const tableFunction = useCallback(() => {
    return !loading ? (
      <Table
        className='viewReactQuill'
        tableLayout='auto'
        showHeader={false}
        /* title={() => (
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
                  onClick={isOrderUpdate ? saveOrder : openNotification}
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
        )} */
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
                onClick={isOrderUpdate ? saveOrder : openNotification}
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
      <ModalImageComponent type={type} setType={setType} initialValue={item} saveItem={saveItem} />
      <ModalTextComponent type={type} setType={setType} initialValue={item} saveItem={saveItem} />
      <ModalVideoComponent type={type} setType={setType} initialValue={item} saveItem={saveItem} />
    </Row>
  );
};

export default DescriptionDynamic;
