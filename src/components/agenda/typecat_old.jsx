import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { CategoriesAgendaApi, TypesAgendaApi } from '../../helpers/request';
import EventContent from '../events/shared/content';
import Loading from '../loaders/loading';
import EvenTable from '../events/shared/table';
import TableAction from '../events/shared/tableAction';
import { handleRequestError, sweetAlert } from '../../helpers/utils';

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
      headers: []
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

  goBack = () => this.props.history.goBack();

  render() {
    const { loading, subject, list, id, name, color, headers } = this.state;
    return (
      <EventContent
        addAction={this.newItem}
        addTitle={'Nuevo tipo'}
        closeAction={this.goBack}
        title={`${subject === 'categorias' ? 'Categorías' : 'Tipos'} de Actividad`}>
        {loading ? (
          <Loading />
        ) : (
          <EvenTable head={headers}>
            {list.map((object) => {
              return (
                <tr key={object._id}>
                  <td>
                    {id === object._id ? (
                      <input type='text' value={name} autoFocus onChange={this.onChange} />
                    ) : (
                      <p>{object.name}</p>
                    )}
                  </td>
                  {subject === 'categorias' && (
                    <td>
                      {id === object._id ? (
                        <div>
                          <div
                            style={{
                              padding: '5px',
                              background: '#fff',
                              borderRadius: '1px',
                              boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                              display: 'inline-block',
                              cursor: 'pointer'
                            }}
                            onClick={this.handleClick}>
                            <div
                              style={{
                                width: '36px',
                                height: '14px',
                                borderRadius: '2px',
                                background: `${this.state.color}`
                              }}
                            />
                          </div>
                          {this.state.displayColorPicker && (
                            <div style={{ position: 'absolute', zIndex: '2' }}>
                              <div
                                style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
                                onClick={this.handleClick}
                              />
                              <ChromePicker color={color} onChange={this.handleChangeComplete} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: '5px',
                            width: '36px',
                            height: '14px',
                            background: object.color,
                            borderRadius: '1px',
                            boxShadow: '0 0 0 1px rgba(0,0,0,.1)'
                          }}
                        />
                      )}
                    </td>
                  )}
                  <TableAction
                    id={id}
                    object={object}
                    saveItem={this.saveItem}
                    editItem={this.editItem}
                    removeNew={this.removeNewItem}
                    removeItem={this.removeItem}
                    discardChanges={this.discardChanges}
                  />
                </tr>
              );
            })}
          </EvenTable>
        )}
      </EventContent>
    );
  }
}

export default withRouter(AgendaTypeCat);
