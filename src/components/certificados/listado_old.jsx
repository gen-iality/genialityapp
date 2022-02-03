import React, { Component } from 'react';
import NewCert from './modalNewCert_old';
import { CertsApi, RolAttApi } from '../../helpers/request';
import Moment from 'moment';
import Dialog from '../modal/twoAction';
import Loading from '../loaders/loading';
Moment.locale('es');

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      roles: [],
      modalCert: false,
      loading: true,
      id: false,
      deleteModal: false,
      name: '',
      rol: '',
      message: '',
    };
    this.fetchCerts = this.fetchCerts.bind(this);
    this.deleteCert = this.deleteCert.bind(this);
  }

  componentDidMount() {
    this.fetchCerts();
  }

  async fetchCerts() {
    try {
      const list = await CertsApi.byEvent(this.props.event._id);
      const roles = await RolAttApi.byEvent(this.props.event._id);
      this.setState({ list, roles, loading: false });
    } catch (e) {
      e;
    }
  }

  newCert = () => {
    if (this.state.name.length > 0) {
      this.props.certTab({ name: this.state.name, rol: this.state.rol });
      this.closeModal();
    } else {
      this.setState({ message: 'Por favor coloca un nombre' });
    }
  };

  onChange = (e) => {
    this.setState({ name: e.target.value, message: '' });
  };

  handleSelect = (e) => {
    console.log(e.target.value);
    this.setState({ rol: e.target.value, message: '' });
  };

  closeModal = () => {
    this.setState({ modalCert: false, name: '', message: '' });
  };

  editCert = (data) => {
    this.props.certTab(data);
  };

  async deleteCert() {
    this.setState({ isLoading: 'Cargando....' });
    const self = this;
    try {
      await CertsApi.deleteOne(this.state.id);
      this.setState(
        { message: { ...this.state.message, class: 'msg_success', content: 'Certificado borrado' }, isLoading: false },
        () => {
          setTimeout(() => {
            self.setState({ deleteModal: false, id: false, message: '' });
          }, 1200);
          this.fetchCerts();
        }
      );
    } catch (error) {
      if (error.response) {
        this.setState({
          message: { ...this.state.message, class: 'msg_error', content: JSON.stringify(error.response) },
          isLoading: false,
        });
      } else if (error.request) {
        this.setState({ serverError: true, errorData: { message: error.request, status: 708 } });
      } else {
        this.setState({ serverError: true, errorData: { message: error.message, status: 708 } });
      }
    }
  }

  closeDelete = () => {
    this.setState({ deleteModal: false });
  };

  render() {
    return (
      <React.Fragment>
        <div className='has-text-right'>
          <button className='button is-primary' onClick={() => this.setState({ modalCert: true })}>
            <span className='icon'>
              <i className='fas fa-plus' />
            </span>
            <span className='text-button'>Nuevo Certificado</span>
          </button>
        </div>
        {this.state.loading ? (
          <Loading />
        ) : (
          <div className='table'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Fecha Creación</th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.state.list.map((cert, key) => {
                  return (
                    <tr key={key}>
                      <td>{cert.name}</td>
                      <td>{cert.rol_id ? this.state.roles.find((rol) => rol._id === cert.rol_id).name : 'Sin Rol'}</td>
                      <td>{Moment(cert.created_at).format('DD/MM/YYYY')}</td>
                      <td>
                        <span
                          className='icon has-text-primary action_pointer'
                          onClick={() => {
                            this.editCert(cert);
                          }}>
                          <i className='fas fa-edit' />
                        </span>
                      </td>
                      <td className='has-text-centered'>
                        <span
                          className='icon has-text-danger action_pointer'
                          onClick={() => {
                            this.setState({ id: cert._id, deleteModal: true });
                          }}>
                          <i className='far fa-trash-alt' />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {this.state.modalCert && (
          <NewCert
            modal={this.state.modalCert}
            name={this.state.name}
            onChange={this.onChange}
            roles={this.state.roles}
            rol={this.state.rol}
            handleSelect={this.handleSelect}
            message={this.state.message}
            newCert={this.newCert}
            closeModal={this.closeModal}
          />
        )}
        {this.state.deleteModal && (
          <Dialog
            modal={this.state.deleteModal}
            title={'Borrar Certificado'}
            content={<p>¿Estas seguro de eliminar este certificado?</p>}
            first={{ title: 'Borrar', class: 'is-dark has-text-danger', action: this.deleteCert }}
            message={this.state.message}
            isLoading={this.state.isLoading}
            second={{ title: 'Cancelar', class: '', action: this.closeDelete }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default List;
