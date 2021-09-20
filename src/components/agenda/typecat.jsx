import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { CategoriesAgendaApi, TypesAgendaApi } from '../../helpers/request';
import EventContent from '../events/shared/content';
import Loading from '../loaders/loading';
import EvenTable from '../events/shared/table';
import TableAction from '../events/shared/tableAction';
import { handleRequestError, sweetAlert } from '../../helpers/utils';
import { Table, Tag, Row, Col, Tooltip, Button, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';

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
      ]
    };
    this.eventID = '';
    this.apiURL = '';
  }

  async componentDidMount() {
    this.eventID = this.props.event._id;
    const subject = this.props.match.url.split('/').slice(-1)[0];
    //Se setea la ruta api de acuerdo a la ruta
    this.apiURL = subject === 'categorias' ? CategoriesAgendaApi : TypesAgendaApi;
    //Header de las tablas según ruta
    const headers = subject === 'categorias' ? ['Nombre', 'Color', ''] : ['Nombre', ''];
    const list = await this.apiURL.byEvent(this.eventID);
    this.setState({ list, loading: false, subject, headers });
  }

  //FN para editar fila
  editItem = (type) => this.setState({ id: type._id, name: type.name, color: type.color ? type.color : '' });

  onChange = (e) => {
    this.setState({ name: e.target.value });
  };
  //FNs para el cambio de color
  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };
  handleChangeComplete = (color) => {
    this.setState({ color: color.hex });
  };

  //FN para agregar un nuevo item a la lista, si ya hay uno no hace nada
  newItem = () => {
    if (!this.state.list.find(({ value }) => value === 'new'))
      this.setState((state) => ({ list: state.list.concat({ name: '', _id: 'new' }), id: 'new' }));
  };

  removeNewItem = () =>
    this.setState((state) => ({ list: state.list.filter(({ _id }) => _id !== 'new'), id: '', name: '' }));

  saveItem = async () => {
    try {
      const info =
        this.state.subject === 'categorias'
          ? { name: this.state.name, color: this.state.color }
          : { name: this.state.name };
      if (this.state.id !== 'new') {
        await this.apiURL.editOne(info, this.state.id, this.eventID);
        this.setState((state) => {
          const data = state.list.map((object) => {
            if (object._id === state.id) {
              object.name = state.name;
              object.color = state.color;
              return object;
            } else return object;
          });
          return { list: data, id: '', name: '', color: '' };
        });
      } else {
        const newRole = await this.apiURL.create(this.eventID, info);
        this.setState((state) => {
          const types = state.list.map((item) => {
            if (item._id === state.id) {
              item = Object.assign(item, newRole);
              return item;
            } else return item;
          });
          return { list: types, id: '', name: '' };
        });
      }
    } catch (e) {
      e;
    }
  };

  discardChanges = () => {
    this.setState({ id: '', name: '', color: '' });
  };

  removeItem = (deleteID) => {
    sweetAlert.twoButton(`Está seguro de borrar este elemento`, 'warning', true, 'Borrar', async (result) => {
      try {
        if (result.value) {
          sweetAlert.showLoading('Espera (:', 'Borrando...');
          await this.apiURL.deleteOne(deleteID);
          this.setState((state) => ({ list: state.list.filter(({ _id }) => _id !== deleteID), id: '', name: '' }));
          sweetAlert.hideLoading();
        }
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
      }
    });
  };

  render() {
    const { loading, subject, list, id, name, color, headers, columns } = this.state;const { matchUrl } = this.props;
    const categoryUrl = '/event/' + this.props.eventID;
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
          hasData={list.length>0}
          pagination={false}
        />
      </div>
    );
  }
}

export default withRouter(AgendaTypeCat);
