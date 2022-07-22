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
  Popover,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import arrayMove from 'array-move';
import { isNumber } from 'ramda-adjunct';
import { useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import ModalImageComponent from './componets/modalImage';
import ModalTextComponent from './componets/modalTextType';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';
import ImageAreaIcon from '@2fd/ant-design-icons/lib/ImageArea';
import CardTextIcon from '@2fd/ant-design-icons/lib/CardText';
import VideoBoxtIcon from '@2fd/ant-design-icons/lib/VideoBox';

const DescriptionDynamic = () => {
  //permite guardar el listado de elmentos de la descripción
  const [dataSource, setDataSource] = useState([]);
  const [type, setType] = useState(null);
  const [item, setItem] = useState(null);
  const [focus, setFocus] = useState(false);

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
          <Button size='large' icon={<EditOutlined />} onClick={() => editItem(item)} />
          <Button size='large' icon={<DeleteOutlined />} onClick={() => deleteItem(item)} type='primary' danger />
        </Space>
      ),
    },
  ];

  const renderTypeComponent = (type, value) => {
    switch (type) {
      case 'image':
        return <Image preview={true} src={value} style={{ objectFit: 'contain' }} width='100%' height='250px' />;
      case 'text':
        return <div dangerouslySetInnerHTML={{ __html: value }} />;
      default:
        return <div></div>;
    }
  };

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
      <Card className='animate__animated animate__bounceIn ' hoverable={true} style={styleCardButton}>
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

  const obtenerIndex = () => {
    let data = dataSource.sort((a, b) => a.index > b.index);
    return data.length + 1;
  };

  const updateItem = (item) => {
    const newList = dataSource.map((data) => {
      if (data.index == item?.index) {
        return item;
      } else {
        return data;
      }
    });
    return newList;
  };

  const deleteItem = (item) => {
    let newList = dataSource.filter((data) => data.index !== item.index);
    newList = updateIndexTotal(newList);
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

  const saveItem = (item) => {
    let newList = [];
    if (item && !isNumber(item.index)) {
      const itemIndex = { ...item, index: obtenerIndex() };
      newList = [...dataSource, itemIndex];
    } else {
      newList = updateItem(item);
    }
    setDataSource(newList);
    setItem(null);
  };
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row justify='center' align='middle'>
          <ConfigProvider renderEmpty={() => <Empty />}>
            <Table
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
            />
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
    </Row>
  );
};

export default DescriptionDynamic;
