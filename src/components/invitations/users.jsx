import React, { Component, Fragment } from 'react';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { UsersApi } from '../../helpers/request';
import SearchComponent from '../shared/searchTable';
import { FormattedMessage } from 'react-intl';
import API from '../../helpers/request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddUser from '../modal/addUser';
import Loading from '../loaders/loading';
import EventContent from '../events/shared/content';
import EvenTable from '../events/shared/table';
import Pagination from '../shared/pagination';
import ModalAdvise from './modal';
import { fieldNameEmailFirst, parseData2Excel } from '../../helpers/utils';
import XLSX from 'xlsx';

class UsersRsvp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actualEvent: {},
      events: [],
      users: [],
      usersReq: [],
      selection: [],
      auxArr: [],
      importUser: false,
      addUser: false,
      checked: false,
      ticket: false,
      loading: true,
      pages: null,
      pageSize: 10,
      message: { class: '', content: '' },
      columns: [],
      clearSearch: false,
      errorData: {},
      serverError: false,
      dropUser: false,
      dropSend: false,
      visible: false,
      exportUsers: [],
      tickets: [],
    };
    this.checkEvent = this.checkEvent.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
  }

  async componentDidMount() {
    try {
      const { event } = this.props;
      const properties = event.user_properties;

      let columnsKey = fieldNameEmailFirst(properties);
      this.setState({ columnsKey, tickets: event.tickets });

      const resp = await UsersApi.getAll(this.props.eventID, '?pageSize=10000');

      const columns = this.props.event.user_properties.map((field) => field.label);
      columns.unshift('created_at');
      columns.unshift('updated_at');

      columns.unshift(
        <div className='field'>
          <input
            className='event-inv-check is-checkradio is-small'
            id={'checkallUser'}
            type='checkbox'
            name={'checkallUser'}
            onClick={this.toggleAll}
          />
          <label htmlFor={'checkallUser'} />
        </div>
      );

      const users = handleUsers(this.props.event.user_properties, resp.data);
      this.setState({
        exportUsers: resp.data,
        loading: false,
        users,
        usersReq: users,
        resp,
        columns,
        pageOfItems: users.slice(0, 10),
      });
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

  //Fetch user of selected event
  async checkEvent(event) {
    if (this.state.actualEvent._id !== event._id) {
      try {
        const resp = await UsersApi.getAll(event._id);

        const users = handleUsers(this.props.event.user_properties, resp.data);
        const columns = this.state.columns;
        let index = columns
          .map((e) => {
            return e.id;
          })
          .indexOf('state_id');
        if (index >= 0) columns.splice(index, 1);
        this.setState({ actualEvent: event, users, userAux: users });
        this.handleCheckBox(users, this.state.selection);
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
  }

  handleCheckBox = (users, selection) => {
    let exist = 0,
      unexist = 0;
    const checkbox = document.getElementById('checkallUser');
    if (checkbox) {
      for (let i = 0; i < users.length; i++) {
        const pos = selection
          .map((e) => {
            return e.id;
          })
          .indexOf(users[i].id);
        pos < 0 ? unexist++ : exist++;
      }
      if (exist === users.length) {
        checkbox.indeterminate = false;
        checkbox.checked = true;
      } else if (unexist === users.length) {
        checkbox.indeterminate = false;
        checkbox.checked = false;
      } else {
        checkbox.indeterminate = true;
        checkbox.checked = false;
      }
    }
  };

  //Add all of users to selection state
  async toggleAll() {
    const selectAll = !this.state.selectAll;
    let selection = [...this.state.selection];
    const currentRecords = this.state.users ? this.state.users : this.state.usersReq;
    if (selectAll) {
      this.setState({ loading: true });
      await asyncForEach(currentRecords, async (item) => {
        const pos = selection
          .map((e) => {
            return e.id;
          })
          .indexOf(item.id);
        if (pos <= -1) await selection.push(item);
      });

      this.setState({
        loading: false,
        items: selection.slice(0, 10),
        scrollNow: 10,
      });
    } else {
      currentRecords.map((user) => {
        const pos = selection
          .map((e) => {
            return e.id;
          })
          .indexOf(user.id);
        if (pos >= 0) {
          selection = [...selection.slice(0, pos), ...selection.slice(pos + 1)];
        }
      });
      this.setState({ loading: false, items: [], scrollNow: 10 });
    }
    this.setState({ selectAll, selection, auxArr: selection });
    this.handleCheckBox(currentRecords, selection);
  }

  //Add or remove user to selection state
  toggleSelection = (user) => {
    let selection = [...this.state.selection];
    let items = [...this.state.usersReq];
    let auxArr = [...this.state.auxArr];
    const keyIndex = selection
      .map((e) => {
        return e.id;
      })
      .indexOf(user.id);
    if (keyIndex >= 0) {
      selection = [...selection.slice(0, keyIndex), ...selection.slice(keyIndex + 1)];
      auxArr = [...auxArr.slice(0, keyIndex), ...auxArr.slice(keyIndex + 1)];
      items = [...items.slice(0, keyIndex), ...items.slice(keyIndex + 1)];
    } else {
      selection.push(user);
      auxArr.push(user);
      items.push(user);
    }
    this.handleCheckBox(this.state.users, selection);
    this.setState({ selection, auxArr, items });
  };

  //Check if user exist at selection state
  isChecked = (id) => {
    if (this.state.selection.length > 0) {
      const pos = this.state.selection
        .map((e) => {
          return e.id;
        })
        .indexOf(id);
      return pos !== -1;
    } else return false;
  };

  //Modal add single User
  modalUser = () => {
    const html = document.querySelector('html');
    html.classList.add('is-clipped');
    this.setState((prevState) => {
      return { addUser: !prevState.addUser, edit: false };
    });
  };
  closeModal = () => {
    const html = document.querySelector('html');
    html.classList.remove('is-clipped');
    this.setState((prevState) => {
      return { addUser: !prevState.addUser, edit: undefined };
    });
  };

  //Add user to current list at middle column
  addToList = async (user) => {
    try {
      //const resp = await UsersApi.getAll(this.props.eventID, "?pageSize=10000");
      //let data = resp.data;
      const newUsersFormated = handleUsers(this.props.event.user_properties, [user]);
      let usuarios = [...newUsersFormated, ...this.state.users];

      toast.success(<FormattedMessage id='toast.user_saved' defaultMessage='Ok!' />);
      this.setState({ users: usuarios, usersReq: usuarios });
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

  //Search records at third column
  searchResult = (data) => {
    !data ? this.setState({ users: this.state.auxArr.slice(0, 10) }) : this.setState({ users: data });
  };

  //Button Ticket Logic
  showTicket = () => {
    const html = document.querySelector('html');
    this.setState((prevState) => {
      !prevState.ticket ? html.classList.add('is-clipped') : html.classList.remove('is-clipped');
      return { ticket: !prevState.ticket };
    });
  };

  sendTicket = () => {
    const { event } = this.props;
    const { selection } = this.state;
    const url = '/api/eventUsers/bookEventUsers/' + event._id;
    const html = document.querySelector('html');
    let users = [];
    selection.map((item) => {
      return users.push(item.id);
    });
    this.setState({ disabled: true });
    API.post(url, { eventUsersIds: users })
      .then((res) => {
        toast.success(<FormattedMessage id='toast.ticket_sent' defaultMessage='Ok!' />);
        html.classList.remove('is-clipped');
        this.setState({
          redirect: true,
          url_redirect: '/event/' + event._id + '/messages',
          disabled: false,
        });
      })
      .catch((e) => {
        toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
        this.setState({ timeout: true, loader: false });
      });
  };

  //Table
  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems });
  };

  //Dropdowns
  handleDropUser = () =>
    this.setState((prevState) => {
      return { dropUser: !prevState.dropUser };
    });
  handleDropSend = () =>
    this.setState((prevState) => {
      return { dropSend: !prevState.dropSend };
    });

  irACreacionComunicacion = () => {
    //Actualizar el estado del padre
    if (this.state.selection[0] === undefined) {
      this.setState({ visible: this.state.visible === true ? false : true });
    } else {
      this.props.setGuestSelected(this.state.selection);
      this.props.history.push(`${this.props.matchUrl}/createmessage`);
      //enviar a la otra página
    }
  };

  exportFile = async () => {
    const columnsKey = Object.keys(this.state.usersReq[0].properties);
    columnsKey.unshift('created_at');
    columnsKey.unshift('updated_at');

    const data = await parseData2Excel(this.state.exportUsers, this.state.columnsKey);

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistentes');
    XLSX.writeFile(wb, `asistentes_${this.props.event.name}.xls`);
  };

  filterBytipoAsistente(tipoAsistente) {
    const { users } = this.state;
    if (!tipoAsistente) {
      this.setState({ users: users });
      return;
    }
    const filter = [];
    for (let i = 0; users.length > i; i++) {
      if (users[i].properties.asistecomo) {
        if (users[i].properties.asistecomo === tipoAsistente) {
          filter.push(users[i]);
        }
      }
    }
    this.setState({ users: filter });
  }

  filterByTicket(ticket) {
    toString(ticket);
    const { resp } = this.state;

    const filter = [];
    for (let i = 0; resp.data.length > i; i++) {
      if (resp.data[i].user.ticket_id === ticket || resp.data[i].user.ticketid === ticket) {
        filter.push({
          id: resp.data[i]._id,
          properties: resp.data[i].user,
        });
      } else {
      }
    }

    this.setState({ users: filter });
  }
  render() {
    if (this.state.redirect) return <Redirect to={{ pathname: this.state.url_redirect }} />;
    if (this.state.loading) return <Loading />;
    const { users, usersReq, dropUser, dropSend, pageOfItems, columns, tickets } = this.state;
    return (
      <Fragment>
        <EventContent
          title={'Invitados'}
          description={
            usersReq.length <= 0 ? 'Crear o importar una lista de personas que desea invitar a su evento' : ''
          }>
          <button
            className='button'
            style={{ float: 'left', marginTop: '2%' }}
            onClick={() => this.irACreacionComunicacion()}>
            {' '}
            Enviar comunicación / Correo{' '}
          </button>
          <ModalAdvise visible={this.state.visible} />
          {usersReq.length > 0 ? (
            <div>
              <button
                className='button'
                style={{ float: 'left', marginTop: '2%', marginLeft: '20%' }}
                onClick={() => this.exportFile(users)}>
                Exportar
              </button>
            </div>
          ) : (
            <></>
          )}

          <div>
            <div className='columns'>
              <div className='column is-12'>
                <div
                  className={`dropdown is-pulled-right is-right ${dropUser ? 'is-active' : ''}`}
                  onClick={this.handleDropUser}>
                  <div className='dropdown-trigger'>
                    <button className='button' aria-haspopup aria-controls={'dropdown-menu1'}>
                      <span>Agregar usuarios</span>
                      <span className='icon'>
                        <i className='fas fa-angle-down' />
                      </span>
                    </button>
                  </div>
                  <div className='dropdown-menu' id='dropdown-menu1' role='menu'>
                    <div className='dropdown-content'>
                      <a href='#' className='dropdown-item' onClick={this.modalUser}>
                        Nuevo usuario
                      </a>
                      <Link className='dropdown-item' to={`${this.props.matchUrl}/importar-excel`}>
                        Importar usuarios de Excel
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='columns'>
              <SearchComponent
                classes={'column is-7'}
                data={this.state.usersReq}
                kind={'user'}
                searchResult={this.searchResult}
                clear={this.state.clearSearch}
              />
              <div className='column is-2' />
              <div className='column'>
                <div
                  className={`dropdown is-pulled-right is-right ${dropUser ? 'is-active' : ''}`}
                  onClick={this.handleDropUser}>
                  <div className='dropdown-trigger'>
                    <button className='button' aria-haspopup aria-controls={'dropdown-menu1'}>
                      <span>Agregar usuarios</span>
                      <span className='icon'>
                        <i className='fas fa-angle-down' />
                      </span>
                    </button>
                  </div>
                  <div className='dropdown-menu' id='dropdown-menu1' role='menu'>
                    <div className='dropdown-content'>
                      <div className='dropdown-item' onClick={this.modalUser}>
                        <p>Nuevo usuario</p>
                      </div>
                      <Link className='dropdown-item' to={`${this.props.matchUrl}/importar-excel`}>
                        Importar usuarios de Excel
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='columns'>
              <div className='column is 6'>
                <p>
                  Seleccionados: <strong> {this.state.auxArr.length}</strong>
                </p>
              </div>

              <div className='column is-6'>
                <label className='label'>Filtrar por ticket</label>
                <div className='select'>
                  {tickets.length > 0 ? (
                    <select onChange={(e) => this.filterByTicket(e.target.value)}>
                      <option>Selecciona...</option>
                      {tickets.map((ticket, key) => (
                        <option key={key} value={ticket._id}>
                          {ticket.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select>
                      <option>Sin ticketes</option>
                    </select>
                  )}
                </div>
              </div>
              <div className='column is-6'>
                <label className='label'>Filtrar por tipo de tipoAsistente</label>
                <div className='select'>
                  {
                    <select onChange={(e) => this.filterBytipoAsistente(e.target.value)}>
                      <option value=''>Selecciona...</option>
                      <option value='Persona'>Persona</option>
                      <option value='Empresa'>Empresa</option>
                    </select>
                  }
                </div>
              </div>
            </div>
            {/* {this.state.auxArr.length > 0 && (
                <div
                  className={`dropdown ${dropSend ? "is-active" : ""}`}
                  onClick={this.handleDropSend}
                >
                  <div className="dropdown-trigger">
                    <button
                      className="button"
                      aria-haspopup
                      aria-controls={"dropdown-menu"}
                    >
                      <span>Enviar</span>
                      <span className="icon">
                        <i className="fas fa-angle-down" />
                      </span>
                    </button>
                  </div>
                  <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      <div className="dropdown-item">
                        <p>Invitaciones</p>
                      </div>
                      <div className="dropdown-item">
                        <p>Correos</p>
                      </div>
                      <div className="dropdown-item">
                        <p>Entradas</p>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
            <div className='table-invite-asistente'>
              <EvenTable head={columns}>
                {pageOfItems.map((user, key) => (
                  <tr key={key}>
                    {/* <td>
                      {"checkinUser" + user.id}
                    </td> */}
                    {Object.keys(user.properties).map((prop) => (
                      <td key={prop}>
                        {parseInt() || typeof user.properties[prop] == 'string'
                          ? user.properties[prop]
                          : JSON.stringify(user.properties[prop])}
                      </td>
                    ))}
                  </tr>
                ))}
              </EvenTable>
            </div>
            <Pagination items={users} onChangePage={this.onChangePage} />
          </div>
        </EventContent>

        {this.state.addUser && (
          <AddUser
            handleModal={this.closeModal}
            modal={this.state.addUser}
            eventId={this.props.eventID}
            value={this.state.selectedUser}
            addToList={this.addToList}
            extraFields={this.props.event.user_properties}
            edit={this.state.edit}
          />
        )}
      </Fragment>
    );
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

//Add only id, and the first two fields
const handleUsers = (fields, list) => {
  let users = [];
  list.map((user, key) => {
    users[key] = {};
    users[key]['id'] = user._id;
    users[key]['properties'] = {};
    users[key].properties['created_at'] = user.created_at;
    users[key].properties['updated_at'] = user.updated_at;
    fields.map((field) => (users[key].properties[field.name] = user.properties[field.name]));

    return;
  });
  return users;
};

export default withRouter(UsersRsvp);
