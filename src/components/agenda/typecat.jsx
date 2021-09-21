import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { CategoriesAgendaApi, TypesAgendaApi } from '../../helpers/request';
import { handleRequestError, sweetAlert } from '../../helpers/utils';
import { Table, Tag, Row, Col, Tooltip, Button, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import { async } from 'ramda-adjunct';

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
            let self = this;
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
                      onClick={() => {
                        self.removeItem(item._id);
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

  removeItem = (deleteID) => {
    console.log(deleteID);
    sweetAlert.twoButton(`Está seguro de borrar este elemento`, 'warning', true, 'Borrar', async (result) => {
      try {
        if (result.value) {
          sweetAlert.showLoading('Espera (:', 'Borrando...');
          await this.apiURL.deleteOne(deleteID);
          this.getCat();
          /* this.setState((state) => ({ list: state.list.filter(({ _id }) => _id !== deleteID), id: '', name: '' })); */
          sweetAlert.hideLoading();
        }
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
      }
    });
  };

  render() {
    const { loading, subject, list, columns } = this.state;
    console.log(list);
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
        />
      </div>
    );
  }
}

export default withRouter(AgendaTypeCat);
