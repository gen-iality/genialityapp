import React, { Component, Fragment } from 'react';
import Moment from 'moment';
import { RolAttApi } from '../../../helpers/request';
import EventContent from '../shared/content';
import EvenTable from '../shared/table';
import TableAction from '../shared/tableAction';
import { handleRequestError, sweetAlert } from '../../../helpers/utils';

class TipoAsistentes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      id: '',
      deleteID: '',
      name: '',
    };
  }

  async componentDidMount() {
    this.fetchItems();
  }

  fetchItems = async () => {
    const list = await RolAttApi.byEvent(this.props.eventID);
    this.setState({ list });
  };

  onChange = (e) => {
    this.setState({ name: e.target.value });
  };

  newRole = () => {
    if (!this.state.list.find(({ _id }) => _id === 'new')) {
      this.setState((state) => {
        const list = state.list.concat({ name: '', created_at: new Date(), _id: 'new' });
        return { list: list, id: 'new' };
      });
    }
  };

  removeNew = () => {
    this.setState((state) => {
      const list = state.list.filter((item) => item._id !== 'new');
      return { list: list, id: '', name: '' };
    });
  };

  saveItem = async () => {
    try {
      if (this.state.id !== 'new') {
        await RolAttApi.editOne({ name: this.state.name }, this.state.id, this.props.eventID);
        this.setState((state) => {
          const list = state.list.map((item) => {
            if (item._id === state.id) {
              item.name = state.name;
              return item;
            } else return item;
          });
          return { list: list, id: '', name: '' };
        });
      } else {
        const newRole = await RolAttApi.create({ name: this.state.name, event_id: this.props.eventID });
        this.setState((state) => {
          const list = state.list.map((item) => {
            if (item._id === state.id) {
              item.name = newRole.name;
              item.created_at = newRole.created_at;
              item._id = newRole._id;
              return item;
            } else return item;
          });
          return { list: list, id: '', name: '' };
        });
      }
    } catch (e) {
      e;
    }
  };

  editItem = (cert) => this.setState({ id: cert._id, name: cert.name });

  removeItem = (deleteID) => {
    sweetAlert.twoButton(`Está seguro de borrar este tipo de asistente`, 'warning', true, 'Borrar', async (result) => {
      try {
        if (result) {
          // sweetAlert.showLoading('Espera (:', 'Borrando...');
          console.log("deleteID",deleteID)
          await RolAttApi.deleteOne(deleteID, this.props.eventID);
          this.setState(() => ({ id: '', name: '' }));
          this.fetchItems();
          sweetAlert.hideLoading();
        }
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
      }
    });
  };

  render() {
    const { list, id, name } = this.state;
    return (
      <Fragment>
        <EventContent
          title={'Tipo de asistentes'}
          description={
            'Clasifique a los asistentes en categorías personalizadas. Ej: Asistente, conferencista, mesa de honor, etc.'
          }
          addAction={this.newRole}
          addTitle={'Nuevo rol'}>
          <EvenTable head={['Nombre', 'Fecha Creación', 'Acciones']}>
            {list.map((cert, key) => {
              return (
                <tr key={key}>
                  <td>
                    {id === cert._id ? (
                      <input type='text' value={name} autoFocus onChange={this.onChange} />
                    ) : (
                      <p>{cert.name}</p>
                    )}
                  </td>
                  <td>{Moment(cert.created_at).format('DD/MM/YYYY')}</td>
                  <TableAction
                    id={id}
                    object={cert}
                    saveItem={this.saveItem}
                    editItem={this.editItem}
                    removeNew={this.removeNew}
                    removeItem={this.removeItem}
                    discardChanges={this.discardChanges}
                  />
                </tr>
              );
            })}
          </EvenTable>
        </EventContent>
      </Fragment>
    );
  }
}

export default TipoAsistentes;
