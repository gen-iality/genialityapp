import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { CategoriesAgendaApi, TypesAgendaApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { Table, Tag, Row, Col, Tooltip, Button, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';

const { confirm } = Modal;

class AgendaTypeCat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      displayColorPicker: false,
      id: '',
      subject: '',
      color: '',
      name: '',
      list: [],
      headers: [],
      columns: [
        {
          title: 'Nombre',
          dataIndex: 'name',
        },
        {
          title: 'Color',
          dataIndex: 'color',
          render(val, item) {
            return (
              <Tag color={val} style={{'width': '70px'}}>
                {val}
              </Tag>
            )
          }
        },
        {
          title: 'Opciones',
          dataIndex: 'options',
          render(val, item) { 
            /* let self = this; */
            const remove = this.remove(item._id);           
            return (
              <Row wrap gutter={[8, 8]}>
                <Col >
                  <Tooltip placement='topLeft' title='Editar Categoría' >
                    <Link 
                      key='edit' 
                      to={{ pathname: `${props.matchUrl}/categorias/categoria`, state: { edit: item._id } }}
                    >
                      <Button icon={<EditOutlined />} type='primary' size="small" />
                    </Link>
                  </Tooltip>
                </Col>
                <Col >
                  <Tooltip placement='topLeft' title='Eliminar Categoría' >
                    <Button
                      key='delete'
                      onClick={remove}
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
    this.eventID = '';
    this.apiURL = '';
  }

  componentDidMount() {
    this.getCat();
  }

  getCat = async () => {
    this.eventID = this.props.event._id;
    const subject = this.props.match.url.split('/').slice(-1)[0];
    //Se setea la ruta api de acuerdo a la ruta
    this.apiURL = subject === 'categorias' ? CategoriesAgendaApi : TypesAgendaApi;
    //Header de las tablas según ruta
    const headers = subject === 'categorias' ? ['Nombre', 'Color', ''] : ['Nombre', ''];
    const list = await this.apiURL.byEvent(this.eventID);
    this.setState({ list, loading: false, subject, headers });
  }

  remove = async (id) => {
    console.log(id, this.eventID);
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras borra la información..</>,
    });
    confirm({
      title: `¿Está seguro de eliminar la categoría?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        const onHandlerRemove = async () => {
          try {
            await this.apiURL.deleteOne(id, this.eventID);
            message.destroy(loading.key);
            message.open({
              type: 'success',
              content: <> Se eliminó categoría correctamente!</>,
            });
            this.getCat();
          } catch (e) {
            message.destroy(loading.key);
            message.open({
              type: 'error',
              content: handleRequestError(e).message,
            });
          }
        }
        onHandlerRemove();
      }
    });
  };

  render() {
    const { loading, subject, list, columns } = this.state;
    return (
      <div>
        <Header 
          title={`${subject === 'categorias' ? 'Categorías' : 'Tipos'} de Actividad`}
          back
          addUrl={{ 
            pathname: `${this.props.matchUrl}/categorias/categoria`, 
            state: { new: true }
          }}
        />
        
        <Table 
          columns={columns}
          loading={loading}
          dataSource={list}
          hasData={list.length}
          pagination={false}
          rowKey='_id'
        />
      </div>
    );
  }
}

export default withRouter(AgendaTypeCat);
