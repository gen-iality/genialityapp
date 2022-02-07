import React, { Component, Fragment } from 'react';
import SearchComponent from '../../shared/searchTable';
import Loading from '../../loaders/loading';
import Pagination from '../../shared/pagination';
import ErrorServe from '../../modal/serverError';
import connect from 'react-redux/es/connect/connect';
import { HelperApi } from '../../../helpers/request';
import Dialog from '../../modal/twoAction';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import LogOut from '../../shared/logOut';
import EventContent from '../shared/content_old';
import EvenTable from '../shared/table';
import EventModal from '../shared/eventModal';
import StaffModal from './modal';

class AdminRol extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { Nombres: '', email: '', rol: '' },
      users: [],
      loading: true,
      found: 0,
      pageOfItems: [],
      message: {},
      modal: false,
      edit: false,
      serverError: false,
    };
  }

  async componentDidMount() {
    try {
      const res = await HelperApi.listHelper(this.props.event._id);
      this.setState({ users: res, pageOfItems: res, loading: false });
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false });
      } else {
        if (error.request) this.setState({ serverError: true, loader: false });
      }
    }
  }

  //Edit
  editHelper = (item) => {
    const user = {
      Nombres: item.user.Nombres ? item.user.Nombres : item.user.displayName ? item.user.displayName : item._id,
      email: item.user.email,
      rol: item.role_id,
      space: item.space_id,
      id: item._id,
      model_id: item.model_id,
    };
    this.setState(
      { user, edit: true, modal: true, found: 3, emailValid: true, nameValid: true, rolValid: true },
      this.validateForm
    );
  };
  removeHelper = (item) => {
    const user = { id: item._id };
    this.setState({ user, deleteModal: true });
  };

  //Modal
  handleModal = () => {
    const html = document.querySelector('html');
    const user = { Nombres: '', email: '', rol: '' };
    this.setState((prevState) => {
      !prevState.modal ? html.classList.add('is-clipped') : html.classList.remove('is-clipped');
      return { modal: !prevState.modal, formValid: false, edit: false, found: 0, user };
    });
  };
  //Delete Helper
  deleteHelper = async () => {
    const self = this;
    try {
      await HelperApi.removeHelper(self.state.user.id, self.props.event._id);
      toast.info(<FormattedMessage id='toast.user_deleted' defaultMessage='Ok!' />);
      self.setState({
        message: { ...self.state.message, class: 'msg_error', content: 'CONTRIBUTOR DELETED' },
        create: false,
      });
      self.updateContributors();
      const user = { Nombres: '', email: '', rol: '' };
      setTimeout(() => {
        this.setState({ message: {}, user, deleteModal: false });
        if (self.state.user.email) self.handleModal();
      }, 800);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false });
      } else {
        if (error.request) this.setState({ serverError: true, loader: false });
      }
    }
  };
  closeDelete = () => {
    this.setState({ deleteModal: false, edit: false });
  };

  updateContributors = async () => {
    try {
      const res = await HelperApi.listHelper(this.props.event._id);
      this.setState({ users: res, pageOfItems: res, loading: false });
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false });
      } else {
        if (error.request) this.setState({ serverError: true, loader: false });
      }
    }
  };

  //Search records
  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems });
  };
  searchResult = (data) => {
    !data ? this.setState({ pageOfItems: this.state.users }) : this.setState({ pageOfItems: data });
  };

  render() {
    const { timeout, users, pageOfItems, modal, user, edit, serverError, errorData, found } = this.state;
    const { roles, event } = this.props;
    return (
      <Fragment>
        <EventContent
          title={'Organizadores'}
          description={'Registre las personas que serán parte de la logística de su evento'}
          addAction={this.handleModal}
          addTitle={'Agregar staff'}>
          {users.length > 0 && (
            <SearchComponent
              data={users}
              kind={'helpers'}
              searchResult={this.searchResult}
              clear={this.state.clearSearch}
            />
          )}
          {this.state.loading ? (
            <Loading />
          ) : (
            <EvenTable head={['Correo', 'Nombre', 'Rol', 'Acciones']}>
              {pageOfItems.map((item, key) => {
                return (
                  <tr key={key}>
                    <td>{item.user.email}</td>
                    <td>{item.user.displayName ? item.user.displayName : 'SinNombre'}</td>
                    <td>{item.role.name}</td>
                    <td>
                      <button>
                        <span
                          className='icon has-text-grey'
                          onClick={() => {
                            this.editHelper(item);
                          }}>
                          <i className='fas fa-edit' />
                        </span>
                      </button>
                      <button>
                        <span
                          className='icon has-text-grey'
                          onClick={() => {
                            this.removeHelper(item);
                          }}>
                          <i className='far fa-trash-alt' />
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {users.length > 10 && <Pagination items={users} onChangePage={this.onChangePage} />}
            </EvenTable>
          )}
        </EventContent>
        {modal && (
          <EventModal
            modal={modal}
            title={edit ? 'Editar staff' : 'Agregar staff'}
            action={this.saveField}
            actionTitle={edit ? 'Guardar' : 'Agregar'}
            closeModal={this.handleModal}>
            <StaffModal
              roles={roles}
              user={user}
              edit={edit}
              found={found}
              handleModal={this.handleModal}
              updateContributors={this.updateContributors}
              eventID={event._id}
            />
          </EventModal>
        )}
        {this.state.deleteModal && (
          <Dialog
            modal={this.state.deleteModal}
            title={'Borrar Usuario'}
            content={<p>Seguro de borrar este usuario?</p>}
            first={{ title: 'Borrar', class: 'is-dark has-text-danger', action: this.deleteHelper }}
            message={this.state.message}
            second={{ title: 'Cancelar', class: '', action: this.closeDelete }}
          />
        )}
        {timeout && <LogOut />}
        {serverError && <ErrorServe errorData={errorData} />}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  roles: state.rols.items,
  loading: state.rols.loading,
  error: state.rols.error,
});

export default connect(mapStateToProps)(AdminRol);
