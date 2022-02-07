import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { SpacesApi } from '../../helpers/request';
import Loading from '../loaders/loading';
import Moment from 'moment';
import EventContent from '../events/shared/content_old';
import EvenTable from '../events/shared/table';
import TableAction from '../events/shared/tableAction';
import { handleRequestError, sweetAlert } from '../../helpers/utils';

class Espacios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      id: '',
      deleteID: '',
      name: '',
      isLoading: false,
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchItem();
  }

  fetchItem = async () => {
    const data = await SpacesApi.byEvent(this.props.eventID);
    this.setState({ list: data, loading: false });
  };

  onChange = (e) => {
    this.setState({ name: e.target.value });
  };

  newRole = () => {
    if (!this.state.list.find(({ _id }) => _id === 'new')) {
      this.setState((state) => {
        const list = state.list.concat({ name: '', created_at: new Date(), _id: 'new' });
        return { list, id: 'new' };
      });
    }
  };

  removeNewRole = () => {
    this.setState((state) => {
      const list = state.list.filter((item) => item._id !== 'new');
      return { list, id: '', name: '' };
    });
  };

  saveRole = async () => {
    try {
      if (this.state.id !== 'new') {
        await SpacesApi.editOne({ name: this.state.name }, this.state.id, this.props.eventID);
        this.setState((state) => {
          const list = state.list.map((item) => {
            if (item._id === state.id) {
              item.name = state.name;
              return item;
            } else return item;
          });
          return { list, id: '', name: '' };
        });
      } else {
        const newRole = await SpacesApi.create({ name: this.state.name }, this.props.eventID);
        this.setState((state) => {
          const list = state.list.map((item) => {
            if (item._id === state.id) {
              item.name = newRole.name;
              item.created_at = newRole.created_at;
              item._id = newRole._id;
              return item;
            } else return item;
          });
          return { list, id: '', name: '' };
        });
      }
    } catch (e) {
      e;
    }
  };

  editItem = (cert) => this.setState({ id: cert._id, name: cert.name });

  removeItem = (id) => {
    sweetAlert.twoButton(`Está seguro de borrar este espacio`, 'warning', true, 'Borrar', async (result) => {
      try {
        if (result.value) {
          sweetAlert.showLoading('Espera (:', 'Borrando...');
          await SpacesApi.deleteOne(id, this.props.eventID);
          this.setState(() => ({ id: '', name: '' }));
          this.fetchItem();
          sweetAlert.hideLoading();
        }
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
      }
    });
  };

  goBack = () => this.props.history.goBack();

  render() {
    return (
      <React.Fragment>
        <EventContent
          title='Espacios'
          closeAction={this.goBack}
          description={'Agregue o edite las personas que son conferencistas'}
          addAction={this.newRole}
          addTitle={'Nuevo espacio'}>
          {this.state.loading ? (
            <Loading />
          ) : (
            <EvenTable head={['Nombre', '']}>
              {this.state.list.map((cert, key) => {
                return (
                  <tr key={key}>
                    <td>
                      {this.state.id === cert._id ? (
                        <input type='text' value={this.state.name} onChange={this.onChange} />
                      ) : (
                        <p>{cert.name}</p>
                      )}
                    </td>
                    <td>{Moment(cert.created_at).format('DD/MM/YYYY')}</td>
                    <TableAction
                      id={this.state.id}
                      object={cert}
                      saveItem={this.saveRole}
                      editItem={this.editItem}
                      removeNew={this.removeNewRole}
                      removeItem={this.removeItem}
                      discardChanges={this.discardChanges}
                    />
                  </tr>
                );
              })}
            </EvenTable>
          )}
        </EventContent>
      </React.Fragment>
    );
  }
}

export default withRouter(Espacios);
