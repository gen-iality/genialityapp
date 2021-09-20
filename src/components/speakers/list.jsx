import React, { Component, useState } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { SpeakersApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { Button, Row, Col, Table, Typography, Avatar, Tooltip, Popover, Image, Empty, Modal, notification, Switch, Input, Space, message } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, EditOutlined, UserOutlined, ExclamationCircleOutlined, SearchOutlined, SaveOutlined, DragOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Header from '../../antdComponents/Header';

const DragHandle = sortableHandle(() => <DragOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

const { Title } = Typography;
const { confirm } = Modal;

class SpeakersList extends Component {
  constructor(props) {
    super(props);
    let self = this;
    this.state = {
      loading: true,
      speakersList: [],
      pageOfItems: [],
      changeItem: false,
      redirect: false,
      viewModal: false,
      searchText: '',
      searchedColumn: '',
      columns: [
        {
          title: '',
          dataIndex: 'move',
          width: '50px',
          render(val, item) {
            return(<DragHandle />)
          }
        },
        {
          title: 'Orden',
          dataIndex: 'index',
          render(val, item) {
            return (
              <div>
                {val+1}
              </div>
            )
          }
        },
        {
          title: 'Imagen',
          dataIndex: 'image',
          render(val, item) {
            /*
            * Dentro de la imagen se realizó al momento de mostrar en la tabla un Avatar, para darle mejor apariencia. 
            * Para ver más amplia la imagen se realizó un popover con la etiqueta de "Image" que permite ver mejor la imagen
            */
            return (
              <Row gutter={8}>
                <Col>
                  <Popover 
                    placement="top"
                    content= {() => (
                      <>
                        {
                          item.image ? (
                            <Image key={'img' + item._id} width={200} height={200} src={item.image} />
                          ) :
                          (
                            <Empty description="Imagen no encontrada"/>
                          )
                        }
                      </>
                    )}
                  >
                    {
                      item.image ? (
                        <Avatar key={'img' + item._id} src={item.image} />
                      ) :
                      (
                        <Avatar icon={<UserOutlined />} />
                      )
                    }
                  </Popover>
                </Col>
                {/* <Col>
                  <p>{item.name}</p>
                </Col> */}
              </Row>
            );
          },
        },
        {
          title: 'Nombre',
          dataIndex: 'name',
          ...this.getColumnSearchProps('name'),
        },
        {
          title: 'Profesión',
          dataIndex: 'profession',
          ...this.getColumnSearchProps('profession')
        },
        {
          title: 'Visible',
          dataIndex: 'published',
          render(val, item) {
            const [ publish, setPublish ] = useState(item.published);
            const update = async (checked) => {
              item.published = checked;
              const res = await SpeakersApi.editOne(item, item._id, item.event_id);
              /* '5fa9a9431cd0d1074b1e9242' */
              if(res) setPublish(res.published);
            }
            return (
              <Switch checkedChildren="Sí" unCheckedChildren="No" onChange={update} checked={publish}/>
            )
          },
        },
        {
          title: 'Opciones',
          dataIndex: 'options',
          render(val, item) {
            return (
              /*
              * Para las acciones, se implemento que fueran iconos pequeños y sin texto, nada más del que se presenta en el tooltip, para darle un toque minimalista, de tal manera de que no cargue demasiado la tabla y pantalla
              */
              <Row wrap gutter={[8, 8]}>
                <Col xs={24} sm={24} md={12} lg={12} xxl={12}>
                  <Tooltip placement='topLeft' title='Editar Conferencista' >
                    <Link 
                      key='edit' 
                      to={{ pathname: `${props.matchUrl}/speaker`, state: { edit: item._id } }}
                    >
                      <Button icon={<EditOutlined />} type='primary' size="small" />
                    </Link>
                  </Tooltip>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xxl={12}>
                  <Tooltip placement='topLeft' title='Eliminar Conferencista' >
                    <Button
                      key='delete'
                      onClick={() => {
                        self.remove(item);
                      }}
                      icon={<DeleteOutlined />}
                      type='danger'
                      size="small"
                    />
                  </Tooltip>
                </Col>    
              </Row>
            );
          },
        },
      ],
    };
  }

  componentDidMount() {
    this.fetchSpeakers();
  }

  fetchSpeakers = async () => {
    const data = await SpeakersApi.byEvent(this.props.eventID);

    let list = [];
    if(data) {
      list=data.sort((a,b)=>a.sort && b.sort ?a.sort-b.sort:true)        
      list= list.map((speaker,index)=>{
        return {...speaker,index:speaker.sort==index?speaker.sort:index}
      })
      list=list.sort((a,b)=>a.index-b.index)
      this.setState({ speakersList: list, loading: false });
    }
  };

  redirect = () => this.setState({ redirect: true });

  remove = (info) => {
    //Se coloco la constante "eventId" porque se perdia al momento de hacer la llamada al momento de eliminar
    let self = this;
    const eventId = self.props.eventID;
    confirm({
      title: `¿Está seguro de eliminar a ${info.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        const onHandlerRemoveSpeaker = async () => {
          try {
            await SpeakersApi.deleteOne(info._id, eventId);
            self.fetchSpeakers();
            notification.success({
              message: 'Operación Exitosa',
              description: `Se eliminó a ${info.name}`,
              placement:'bottomRight'
            })
          } catch (e) {
            notification.error({
              message: handleRequestError(e).message,
              description: `Hubo un error intentando borrar a ${info.name}`,
              placement:'bottomRight'
            })
          }
        }
        onHandlerRemoveSpeaker();
      }
    });
  };

  goBack = () => this.props.history.goBack();

  //FN para búsqueda en la tabla 1/3
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Borrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filtrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  //FN para búsqueda en la tabla 2/3
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  //FN para búsqueda en la tabla 3/3
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  //FN para el draggable 1/3
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { speakersList } = this.state;
    if (oldIndex !== newIndex) {
      let newData = arrayMove([].concat(speakersList), oldIndex, newIndex).filter(el => !!el);
      if(newData){
        newData= newData.map((speaker,key)=>{
          return {...speaker,index:key};
         })
        }
      this.setState({ speakersList: newData });
    }
  };

  //FN para el draggable 2/3
  DraggableContainer = props => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  //FN para el draggable 3/3
  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { speakersList } = this.state;
    const index = speakersList.findIndex(x => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  saveOrder = async() => {    
    const loadingSave = message.open({
       key: 'loading',
       type: 'loading',
       content: <> Por favor espere miestras se guarda la configuración..</>,
     });
    if(this.state.speakersList){
      await Promise.all(this.state.speakersList.map(async(speaker,index)=>{
        let speakerChange={...speaker,order:index+1}
        await SpeakersApi.editOne(speakerChange, speaker._id, this.props.eventId);      
      }))
    }
    message.destroy(loadingSave.key);
    message.open({
      type: 'success',
      content: <> Configuración guardada correctamente!</>,
    });
  }

  render() {
    if (this.state.redirect)
    return <Redirect to={{ pathname: `${this.props.matchUrl}/speaker`, state: { new: true } }} />;
    const { speakersList, loading } = this.state;
    console.log(speakersList);

    return (
      <div>
        <Header 
          title={'Conferencistas'}
          titleTooltip={'Agregue o edite las personas que son conferencistas'}
          addUrl={{ 
            pathname: `${this.props.matchUrl}/speaker`, 
            state: { new: true } 
          }}
          save={this.saveOrder}
        />
        
        {/* En esta tabla en particular viene por defecto el paginamiento, por lo que no necesita llamar a algún otro método para su funcionamiento (se tuvo que colocar false para no venir la paginación) */}
        <Table 
          columns={this.state.columns} 
          dataSource={speakersList}
          size="small"
          rowKey="index"
          loading={loading}
          hasData={speakersList.length>0}
          components={{
            body: {
              wrapper: this.DraggableContainer,
              row: this.DraggableBodyRow,
            },
          }}
          pagination={false}
        />
      </div>
    );
  }
}

export default withRouter(SpeakersList);