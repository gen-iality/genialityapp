import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Affix,
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Empty,
  Image,
  message,
  Popover,
  Row,
  Space,
  Spin,
  Table,
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
import ModalVideoComponent from './componets/modalVideo';
import ReactPlayer from 'react-player';
import { EventsApi } from '@/helpers/request';
import { CurrentEventContext } from '@/context/eventContext';

const DescriptionDynamic = () => {
  //permite guardar el listado de elmentos de la descripción
  const [dataSource, setDataSource] = useState([]);
  const [type, setType] = useState(null);
  const [item, setItem] = useState(null);
  const [focus, setFocus] = useState(false);
  const [loading, setLoading]=useState(false)
  const cEvent= useContext(CurrentEventContext);

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
          <Button icon={<EditOutlined />} onClick={() => editItem(item)} />
          <Button icon={<DeleteOutlined />} onClick={() => deleteItem(item)} type='primary' danger />
        </Space>
      ),
    },
  ];

  const renderTypeComponent = useCallback((type, value) => {
    if (focus) return;
    switch (type) {
      case 'image':
        return <Image preview={false} src={value} width={'100%'} height={350} />;
      case 'text':
        return <div dangerouslySetInnerHTML={{ __html: value }} />;
      case 'video':
        return  <ReactPlayer controls width={'100%'} height={'350'} style={{}} url={value} />;
      default :
        return <div></div>;
    }
  },[dataSource]);

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
      <Card onClick={() => {
          setItem(null);
          setType('video');
        }} className='animate__animated animate__bounceIn ' hoverable={true} style={styleCardButton}>
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

  useEffect(()=>{
    if(!cEvent.value) return;
    obtenerDescriptionSections()

  },[cEvent.value])

  const obtenerDescriptionSections=async ()=>{
    setLoading(true);
   const sections= await EventsApi.getSectionsDescriptions(cEvent.value._id)
   let dataOrder=sections.data.sort((a,b)=>a.index-b.index);
   setDataSource(dataOrder|| [])
   setLoading(false);
  }

  const addSectionToDescription=async (section)=>{
    const sectionEvent={...section, event_id:cEvent.value._id}
    const saveSection=await EventsApi.saveSections(sectionEvent);
    if(saveSection?._id){
      return true;
    }
    return false;
  }

  const obtenerIndex = () => {
    let data = dataSource?.sort((a, b) => a.index > b.index);
    return data?.length + 1;
  };

  const updateItem = async (item) => {
  //  const sectionUpdate=await EventsApi.updateSections(item._id,item);
  //  console.log("RESP UPDATE==>", sectionUpdate)
  //  return sectionUpdate._id;
    // const newList = dataSource.map((data) => {
    //   if (data.index == item?.index) {
    //     return item;
    //   } else {
    //     return data;
    //   }
    // });
    // return newList;
  };

  const deleteItem = async (item) => {
   const resp= await EventsApi.deleteSections(item._id);
   if(resp){
    let newList = dataSource.filter((data) => data.index !== item.index);
    newList = updateIndexTotal(newList);
    const updateIndexSections=await EventsApi.updateSections(cEvent.value?._id,newList);
    if(updateIndexSections){
      setDataSource(newList);
    }
   }
    
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
    let newList = [];
    let resp;
    if (item && !isNumber(item.index)) {
      const itemIndex = { ...item, index: obtenerIndex() };
      newList = [...dataSource, itemIndex];
      resp = addSectionToDescription(itemIndex)
    } else {
      resp = updateItem(item);
    }
    if(resp){
      setDataSource(newList);
      setItem(null);
    }else{
      message.error("Error al guardar la sección")
    }
    
  };
  const tableFunction=useCallback(()=>{
   return( <Table
    id='tableDescription'
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
  />)
  },[dataSource]);
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row justify='center' align='middle'>
          <ConfigProvider renderEmpty={() => <Empty />}>
          {!loading ?tableFunction() :<Spin />}
          </ConfigProvider>
        </Row>
      </Col>
      <Col span={24}>
        <Row justify='center' align='middle'>
          <Popover content={content} title={null} trigger={'focus'} overlayInnerStyle={{ padding: '20px' }}>
            <Divider>
              <Button
                onBlur={(e) => setFocus(false)}
                onFocus={(e) => setFocus(true)}
                className={`animate__animated animate__heartBeat animate__slow ${focus ? '' : 'animate__infinite'}`}
                type='dashed'
                shape='default'
                icon={<PlusOutlined style={{ fontSize: '30px', color: '#2698FA' }} />}
                style={{ height: '60px', width: '60px', position: 'sticky', bottom: '10px' }}
              />
            </Divider>
          </Popover>
        </Row>
      </Col>
      <ModalImageComponent type={type} setType={setType} initialValue={item} saveItem={saveItem} />
      <ModalTextComponent type={type} setType={setType} initialValue={item} saveItem={saveItem} />
      <ModalVideoComponent  type={type} setType={setType} initialValue={item} saveItem={saveItem} />
    </Row>
  );
};

export default DescriptionDynamic;
