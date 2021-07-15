import React, { Component, Fragment } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { firestore } from '../../helpers/firebase';
import { BadgeApi, RolAttApi } from '../../helpers/request';
import UserModal from '../modal/modalUser';
import ErrorServe from '../modal/serverError';
import SearchComponent from '../shared/searchTable';
import Loading from '../loaders/loading';
import 'react-toastify/dist/ReactToastify.css';
import QrModal from './qrModal';
import { fieldNameEmailFirst, handleRequestError, parseData2Excel, sweetAlert } from '../../helpers/utils';
import EventContent from '../events/shared/content';
import Moment from 'moment';
import { TicketsApi } from '../../helpers/request';

import { Table } from 'antd';

import updateAttendees from './eventUserRealTime';
import { Link } from 'react-router-dom';

/*            switch (field.type) {
              case "boolean":
                value = item.properties[field.name] ? "SI" : "NO";
                break;
              case "complex":
                value = (
                  <span
                    className="icon has-text-grey action_pointer"
                    data-tooltip={"Detalle"}
                    onClick={() => this.showMetaData(item.properties[field.name])}>
                    <i className="fas fa-eye" />
                  </span>
                );
                break;
              default:
                value = item.properties[field.name];
            }
*/

const html = document.querySelector('html');
class ListEventUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      columns: null,
      usersReq: [],
      pageOfItems: [],
      listTickets: [],
      usersRef: firestore.collection(`${props.event._id}_event_attendees`),
      pilaRef: firestore.collection('pila'),
      total: 0,
      totalCheckedIn: 0,
      totalCheckedInWithWeight: 0,
      extraFields: [],
      spacesEvents: [],
      addUser: false,
      editUser: false,
      deleteUser: false,
      loading: true,
      importUser: false,
      modalPoints: false,
      pages: null,
      message: { class: '', content: '' },
      sorted: [],
      rolesList: [],
      facingMode: 'user',
      qrData: {},
      clearSearch: false,
      changeItem: false,
      errorData: {},
      badgeEvent: {},
      serverError: false,
      stage: '',
      ticket: '',
      tabActive: 'camera',
      ticketsOptions: [],
      scanner: 'first',
      localChanges: null,
      quantityUsersSync: 0,
      lastUpdate: new Date(),
      disabledPersistence: false,
      percent_checked: 0,
      percent_unchecked: 0,
      totalPesoVoto: 0,
      configfast: {},
    };
  }

  // eslint-disable-next-line no-unused-vars
  editcomponent = (text, item, index) => {
    return (
      <span
        className='icon has-text-grey action_pointer'
        data-tooltip={'Editar'}
        // eslint-disable-next-line no-unused-vars
        onClick={(e) => {
          this.openEditModalUser(item);
        }}>
        <i className='fas fa-edit' />
      </span>
    );
  };

  // eslint-disable-next-line no-unused-vars
  created_at_component = (text, item, index) => {
    if (item.created_at !== null) {
      return <p>{Moment(item.created_at).format('D/MMM/YY h:mm:ss A ')}</p>;
    } else {
      return '';
    }
  };

  // eslint-disable-next-line no-unused-vars
  updated_at_component = (text, item, index) => {
    if (item.updated_at !== null) {
      return <p>{Moment(item.updated_at).format('D/MMM/YY h:mm:ss A ')}</p>;
    } else {
      return '';
    }
  };

  // eslint-disable-next-line no-unused-vars
  checkedincomponent = (text, item, index) => {
    var self = this;

    return item.checkedin_at ? (
      <p>{Moment(item.checkedin_at).format('D/MMM/YY H:mm:ss A')}</p>
    ) : (
      <div>
        <input
          className='is-checkradio is-primary is-small'
          id={'checkinUser' + item._id}
          disabled={item.checkedin_at}
          type='checkbox'
          name={'checkinUser' + item._id}
          checked={item.checkedin_at}
          // eslint-disable-next-line no-unused-vars
          onChange={(e) => {
            self.checkIn(item._id);
          }}
        />
        <label htmlFor={'checkinUser' + item._id} />
      </div>
    );
  };

  addDefaultLabels = (extraFields) => {
    extraFields = extraFields.map((field) => {
      field['label'] = field['label'] ? field['label'] : field['name'];
      return field;
    });
    return extraFields;
  };

  orderFieldsByWeight = (extraFields) => {
    extraFields = extraFields.sort((a, b) =>
      (a.order_weight && !b.order_weight) || (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
        ? -1
        : 1
    );
    return extraFields;
  };

  async componentDidMount() {
    let self = this;

    this.checkFirebasePersistence();
    try {
      const { event } = this.props;
      const properties = event.user_properties;
      const rolesList = await RolAttApi.byEventRolsGeneral();
      const badgeEvent = await BadgeApi.get(this.props.event._id);

      let extraFields = fieldNameEmailFirst(properties);
      extraFields = this.addDefaultLabels(extraFields);
      extraFields = this.orderFieldsByWeight(extraFields);

      let columns = [];
      let checkInColumn = {
        title: 'Ingreso',
        dataIndex: 'checkedin_at',
        key: 'checkedin_at',
        render: self.checkedincomponent,
      };
      let editColumn = {
        title: 'Editar',
        key: 'edit',
        render: self.editcomponent,
      };
      columns.push(editColumn);
      columns.push(checkInColumn);

      let extraColumns = extraFields
        .filter((item) => {
          return item.type != 'tituloseccion';
        })
        .map((item) => {
          return { title: item.label, dataIndex: item.name, key: item.name };
        });
      columns = [...columns, ...extraColumns];

      let created_at = {
        title: 'Creado',
        dataIndex: 'created_at',
        key: 'created_at',
        render: self.created_at_component,
      };
      let updated_at = {
        title: 'Actualizado',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: self.updated_at_component,
      };

      columns.push(created_at);
      columns.push(updated_at);

      this.setState({ columns: columns });

      this.setState({ extraFields, rolesList, badgeEvent });
      const { usersRef } = this.state;

      firestore
        .collection(`event_config`)
        .doc(event._id)
        .onSnapshot((doc) => {
          this.setState({ ...this.state, configfast: doc.data() });
        });

      usersRef.orderBy('updated_at', 'desc').onSnapshot(
        {
          // Listen for document metadata changes
          //includeMetadataChanges: true
        },
        (snapshot) => {
          let currentAttendees = [...this.state.usersReq];
          let updatedAttendees = updateAttendees(currentAttendees, snapshot);
          let totalCheckedIn = updatedAttendees.reduce((acc, item) => acc + (item.checkedin_at ? 1 : 0), 0);

          let totalCheckedInWithWeight =
            Math.round(
              updatedAttendees.reduce(
                (acc, item) => acc + (item.checkedin_at ? parseFloat(item.pesovoto ? item.pesovoto : 1) : 0),
                0
              ) * 100
            ) / 100;
          this.setState({ totalCheckedIn: totalCheckedIn, totalCheckedInWithWeight: totalCheckedInWithWeight });

          for (let i = 0; i < updatedAttendees.length; i++) {
            // Arreglo temporal para que se muestre el listado de usuarios sin romperse
            // algunos campos no son string y no se manejan bien
            Object.keys(updatedAttendees[i].properties).forEach(function(key) {
              if (
                !(
                  (updatedAttendees[i][key] && updatedAttendees[i][key].getMonth) ||
                  typeof updatedAttendees[i][key] == 'string' ||
                  typeof updatedAttendees[i][key] == 'boolean' ||
                  typeof updatedAttendees[i][key] == 'number' ||
                  Number(updatedAttendees[i][key]) ||
                  updatedAttendees[i][key] === null
                )
              ) {
                updatedAttendees[i]['properties'][key] = JSON.stringify(updatedAttendees[i][key]);
              }
              updatedAttendees[i][key] = updatedAttendees[i]['properties'][key];
            });

            if (updatedAttendees[i].payment) {
              updatedAttendees[i].payment =
                'Status: ' +
                updatedAttendees[i].payment.status +
                ' Fecha de transaccion: ' +
                updatedAttendees[i].payment.date +
                ' Referencia PayU: ' +
                updatedAttendees[i].payment.payuReference +
                ' Transaccion #: ' +
                updatedAttendees[i].payment.transactionID;
            } else {
              updatedAttendees[i].payment = 'No se ha registrado el pago';
            }
          }

          this.setState({
            users: updatedAttendees,
            usersReq: updatedAttendees,
            auxArr: updatedAttendees,
            loading: false,
          });
        },
        () => {
          //this.setState({ timeout: true, errorData: { message: error, status: 708 } });
        }
      );
    } catch (error) {
      const errorData = handleRequestError(error);
      this.setState({ timeout: true, errorData });
    }
  }

  exportFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const attendees = [...this.state.users].sort((a, b) => b.created_at - a.created_at);

    const data = await parseData2Excel(attendees, this.state.extraFields);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistentes');
    XLSX.writeFile(wb, `asistentes_${this.props.event.name}.xls`);
  };

  addUser = () => {
    html.classList.add('is-clipped');
    this.setState((prevState) => {
      return { editUser: !prevState.editUser, edit: false };
    });
  };

  modalUser = () => {
    html.classList.remove('is-clipped');
    this.setState((prevState) => {
      return { editUser: !prevState.editUser, edit: undefined };
    });
  };

  checkModal = () => {
    html.classList.add('is-clipped');
    this.setState((prevState) => {
      return { qrModal: !prevState.qrModal };
    });
  };
  closeQRModal = () => {
    html.classList.add('is-clipped');
    this.setState((prevState) => {
      return { qrModal: !prevState.qrModal };
    });
  };

  checkIn = async (id) => {
    const { qrData } = this.state;
    const { event } = this.props;
    qrData.another = true;

    try {
      await TicketsApi.checkInAttendee(event._id, id);
      //toast.success('Usuario Chequeado');
    } catch (e) {
      toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
    }

    //return;

    const userRef = firestore.collection(`${event._id}_event_attendees`).doc(id);

    // Actualiza el usuario en la base de datos
    userRef
      .update({
        updated_at: new Date(),
        checkedin_at: new Date(),
        checked_at: new Date(),
      })
      .then(() => {
        toast.success('Usuario Chequeado');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
        toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
      });
  };

  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems });
  };

  // Funcion para disminuir el contador y pasarlo como prop al modalUser
  substractSyncQuantity = () => {
    this.setState((prevState) => ({ quantityUsersSync: prevState.quantityUsersSync - 1 }));
    this.setState({ lastUpdate: new Date() });
  };

  showMetaData = (value) => {
    html.classList.add('is-clipped');
    let content = '';
    Object.keys(value).map((key) => (content += `<p><b>${key}:</b> ${value[key]}</p>`));
    sweetAlert.simple('Información', content, 'Cerrar', '#1CDCB7', () => {
      html.classList.remove('is-clipped');
    });
  };

  // Function to check the firebase persistence and load page if this return false
  checkFirebasePersistence = () => {
    let { disabledPersistence } = this.state;

    disabledPersistence = window.eviusFailedPersistenceEnabling;
    this.setState({ disabledPersistence });
  };

  openEditModalUser = (item) => {
    html.classList.add('is-clipped');
    this.setState({ editUser: true, selectedUser: item, edit: true });
  };

  changeStage = (e) => {
    const { value } = e.target;
    const {
      event: { tickets },
    } = this.props;
    if (value === '') {
      let check = 0,
        acompanates = 0;
      this.setState({ checkIn: 0, total: 0 }, () => {
        const list = this.state.usersReq;
        list.forEach((user) => {
          if (user.checked_in) check += 1;
          if (user.properties.acompanates && /^\d+$/.test(user.properties.acompanates))
            acompanates += parseInt(user.properties.acompanates, 10);
        });
        this.setState((state) => {
          return {
            users: state.auxArr.slice(0, 50),
            ticket: '',
            stage: value,
            total: list.length + acompanates,
            checkIn: check,
          };
        });
      });
    } else {
      const options = tickets.filter((ticket) => ticket.stage_id === value);
      this.setState({ stage: value, ticketsOptions: options });
    }
  };

  changeTicket = (e) => {
    const { value } = e.target;
    let check = 0,
      acompanates = 0;
    this.setState({ checkIn: 0, total: 0 }, () => {
      const list =
        value === '' ? this.state.usersReq : [...this.state.usersReq].filter((user) => user.ticket_id === value);
      list.forEach((user) => {
        if (user.checked_in) check += 1;
        if (user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/))
          acompanates += parseInt(user.properties.acompanates, 10);
      });
      const users = value === '' ? [...this.state.auxArr].slice(0, 50) : list;
      this.setState({ users, ticket: value, checkIn: check, total: list.length + acompanates });
    });
  };

  //Search records at third column
  searchResult = (data) => {
    !data ? this.setState({ users: [] }) : this.setState({ users: data });
  };

  handleChange = (e) => {
    this.setState({ typeScanner: e.target.value });
    this.checkModal();
  };

  // Set options in dropdown list
  clearOption = () => {
    this.setState({ typeScanner: 'options' });
  };

  render() {
    const {
      timeout,
      usersReq,
      users,
      totalCheckedIn,
      totalCheckedInWithWeight,
      extraFields,
      spacesEvent,
      editUser,
      stage,
      ticket,
      ticketsOptions,
      localChanges,
      quantityUsersSync,
      lastUpdate,
      disabledPersistence,
    } = this.state;
    const {
      event: { event_stages },
    } = this.props;

    return (
      <React.Fragment>
        {disabledPersistence && (
          <div style={{ margin: '5%', textAlign: 'center' }}>
            <label>
              El almacenamiento local de lso datos esta deshabilitado. Cierre otras pestañanas de la plataforma para
              pode habilitar el almacenamiento local
            </label>
          </div>
        )}

        <EventContent classes='checkin' title={'Check In'}>
          <div className='checkin-warning '>
            <p className='is-size-7 is-full-mobile'>
              Se muestran los primeros 50 usuarios, para verlos todos porfavor descargar el excel o realizar una
              búsqueda.
            </p>
          </div>

          <div className='columns checkin-tags-wrapper is-flex-touch'>
            <div>
              <div className='tags' style={{ flexWrap: 'nowrap' }}>
                <span className='tag is-white'>Total</span>
                <span className='tag is-light'>
                  {(this.state.configfast && this.state.configfast.totalAttendees
                    ? this.state.configfast.totalAttendees
                    : usersReq.length) || 0}
                </span>

                <span className='tag is-white'>Asistido</span>
                <span className='tag is-light'>{totalCheckedIn}</span>

                <span className='tag is-white'>% Asistencia</span>
                <span className='tag is-light'>
                  {Math.round(
                    (totalCheckedInWithWeight /
                      (this.state.configfast && this.state.configfast.totalAttendees
                        ? this.state.configfast.totalAttendees
                        : usersReq.length)) *
                      100 *
                      100
                  ) / 100}
                </span>

                {extraFields.reduce((acc, item) => acc || item.name === 'pesovoto', false) && (
                  <>
                    <span className='tag is-white'>Total Pesos</span>
                    <span className='tag is-light'>{totalCheckedInWithWeight}</span>
                  </>
                )}
              </div>
            </div>

            {// localChanges &&
            quantityUsersSync > 0 && localChanges === 'Local' && (
              <div className='is-4 column'>
                <p className='is-size-7'>Cambios sin sincronizar : {quantityUsersSync < 0 ? 0 : quantityUsersSync}</p>
              </div>
            )}
          </div>
          <div>
            <div>
              <p className='is-size-7 '>
                Última Sincronización : <FormattedDate value={lastUpdate} /> <FormattedTime value={lastUpdate} />
              </p>
            </div>
          </div>
          <Link to={`/event/${this.props.event._id}/invitados`}>Importar usuarios</Link>
          <div className='columns'>
            <div className='is-flex-touch columns container-options'>
              <div className='column is-narrow has-text-centered button-c is-centered'>
                <button className='button is-primary' onClick={this.addUser}>
                  <span className='icon'>
                    <i className='fas fa-user-plus'></i>
                  </span>
                  <span className='text-button'>Agregar Usuario</span>
                </button>
              </div>
              {usersReq.length > 0 && (
                <div className='column is-narrow has-text-centered export button-c is-centered'>
                  <button className='button' onClick={this.exportFile}>
                    <span className='icon'>
                      <i className='fas fa-download' />
                    </span>
                    <span className='text-button'>Exportar</span>
                  </button>
                </div>
              )}
              <div className='column'>
                <div className='select is-primary'>
                  <select
                    name={'type-scanner'}
                    value={this.state.typeScanner}
                    defaultValue={this.state.typeScanner}
                    onChange={this.handleChange}>
                    <option key={1} value='options'>
                      Escanear...
                    </option>
                    <option key={2} value='scanner-qr'>
                      Escanear QR
                    </option>
                    <option key={3} value='scanner-document'>
                      Escanear Documento
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className='search column is-5 is-four-fifths-mobile has-text-left-tablet'>
              <SearchComponent
                style={{ marginLeft: '40px' }}
                placeholder={''}
                data={usersReq}
                kind={'user'}
                event={this.props.event._id}
                searchResult={this.searchResult}
                clear={this.state.clearSearch}
              />
            </div>
          </div>
          {event_stages && event_stages.length > 0 && (
            <div className='filter'>
              <button className='button icon-filter'>
                <span className='icon'>
                  <i className='fas fa-filter'></i>
                </span>
                <span className='text-button'>Filtrar</span>
              </button>
              <div className='filter-menu'>
                <p className='filter-help'>Filtra Usuarios por Tiquete</p>
                <div className='columns'>
                  <div className='column field'>
                    <div className='control'>
                      <label className='label'>Etapa</label>
                      <div className='control'>
                        <div className='select'>
                          <select value={stage} onChange={this.changeStage} name={'stage'}>
                            <option value={''}>Escoge la etapa...</option>
                            {event_stages.map((item, key) => {
                              return (
                                <option key={key} value={item.stage_id}>
                                  {item.title}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='column field'>
                    <div className='control'>
                      <label className='label'>Tiquete</label>
                      <div className='control'>
                        <div className='select'>
                          <select value={ticket} onChange={this.changeTicket} name={'stage'}>
                            <option value={''}>Escoge el tiquete...</option>
                            {ticketsOptions.map((item, key) => {
                              return (
                                <option key={key} value={item._id}>
                                  {item.title}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className='checkin-table'>
            {this.state.loading ? (
              <Fragment>
                <Loading />
                <h2 className='has-text-centered'>Cargando...</h2>
              </Fragment>
            ) : (
              <div className='table-wrapper'>
                <div className='table-container' style={{ height: '60vh' }}>
                  {this.state.columns && (
                    <Table
                      className='table-striped-rows'
                      rowKey='_id'
                      dataSource={users}
                      columns={this.state.columns}
                    />
                  )}
                  ;
                </div>
              </div>
            )}
          </div>
        </EventContent>

        {!this.props.loading && editUser && (
          <UserModal
            handleModal={this.modalUser}
            modal={editUser}
            eventId={this.props.eventId}
            ticket={ticket}
            tickets={this.state.listTickets}
            rolesList={this.state.rolesList}
            value={this.state.selectedUser}
            checkIn={this.checkIn}
            badgeEvent={this.state.badgeEvent}
            extraFields={this.state.extraFields}
            spacesEvent={spacesEvent}
            edit={this.state.edit}
            substractSyncQuantity={this.substractSyncQuantity}
          />
        )}
        {this.state.qrModal && (
          <QrModal
            fields={extraFields}
            usersReq={usersReq}
            typeScanner={this.state.typeScanner}
            clearOption={this.clearOption}
            checkIn={this.checkIn}
            eventID={this.props.event._id}
            closeModal={this.closeQRModal}
            openEditModalUser={this.openEditModalUser}
          />
        )}
        {timeout && <ErrorServe errorData={this.state.errorData} />}
      </React.Fragment>
    );
  }
}
export default ListEventUser;
