import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import EventContent from '../events/shared/content';
import { fieldNameEmailFirst, handleRequestError, parseData2Excel } from '../../helpers/utils';
import { firestore } from '../../helpers/firebase';
import Loading from '../loaders/loading';
import { FormattedMessage } from 'react-intl';
import CheckSpace from '../event-users/checkSpace';
import XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { Activity, RolAttApi } from '../../helpers/request';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import UserModal from '../modal/modalUser';
import Moment from 'moment';

const html = document.querySelector('html');

class CheckAgenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      attendees: [],
      toShow: [],
      eventFields: [],
      usersData: [],
      total: 0,
      checkIn: 0,
      qrModal: false,
      editUser: false,
      extraFields: [],
      selectedRowKeys: [],
      ticket: null,
      ticketsOptions: null,
      spacesEvents: [],
      userRef: null,
      properties: null,
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.cargarUsuarios = this.cargarUsuarios.bind(this);
  }

  async componentDidMount() {
    let self = this;
    this.cargarUsuarios(self);
  }

  //FUNCION QUE OBTIENE CHECKIN DE FIREBASE
  async obtaincheckin(user, ref) {
    let resp = await ref.doc(user._id).get();
    let userNew = {
      ...user,
      checkedin_at:
        resp.exists && resp.data().checkedin_at !== null && resp.data().checkedin_at !== '' && resp.data().checkedin_at
          ? new Date(resp.data().checkedin_at.seconds * 1000)
          : false,
    };

    return userNew;
  }

  //FUNCION QUE LLAMA A FIREBASE PARA OBTENER CHECKIN POR CADA USUARIO
  async obtenerCheckinAttende(ref, listuser) {
    let arrlist = [];
    for (let user of listuser) {
      let userNew = await this.obtaincheckin(user, ref);
      arrlist.push(userNew);
    }

    return arrlist;
  }

  async cargarUsuarios(self) {
    if (!self) {
      self = this;
    }
    try {
      const { event } = this.props;
      const agendaID = this.props.match.params.id;
      let { checkIn } = this.state;
      const properties = event.user_properties;
      const rolesList = await RolAttApi.byEventRolsGeneral();
      console.log('ROLES==>', rolesList);
      let roles = rolesList?.map((role) => {
        return { label: role.name, value: role._id };
      });

      let userRef = firestore
        .collection(`${event._id}_event_attendees`)
        .doc('activity')
        .collection(`${agendaID}`);
      this.createColumnsTable(properties, self);

      //Parse de campos para mostrar primero el nombre, email y luego el resto
      let eventFields = fieldNameEmailFirst(properties);
      console.log('eventFields0==>', eventFields);
      let arrayFields = Array.from(eventFields);

      arrayFields.push({
        author: null,
        categories: [],
        label: 'Rol',
        mandatory: true,
        name: 'rol_id',
        organizer: null,
        tickets: [],
        type: 'list',
        fields_conditions: [],
        unique: false,
        options: roles,
        visibleByAdmin: false,
        visibleByContacts: 'public',
        _id: { $oid: '614260d226e7862220497eac11' },
      });

      arrayFields.push({
        author: null,
        categories: [],
        label: 'Checkin',
        mandatory: false,
        name: 'checked_in',
        organizer: null,
        tickets: [],
        type: 'boolean',
        fields_conditions: [],
        unique: false,
        visibleByAdmin: false,
        visibleByContacts: 'public',
        _id: { $oid: '614260d226e7862220497eac22' },
      });

      this.setState({ eventFields: arrayFields, agendaID, eventID: event._id, rolesList, userRef });
      let newList = [...this.state.attendees];

      newList = await Activity.getActivyAssitantsAdmin(this.props.event._id, agendaID);

      newList = newList.map((item) => {
        let attendee = item.attendee
          ? item.attendee
          : item.user
          ? { properties: { email: item.user.email, names: item.user.displayName } }
          : null;
        item = { ...item, ...attendee };
        return item;
      });
      //console.log("NEWLIST1==>",newList)
      //NO SE ESTAN ELIMINANDO LOS USUARIOS BIEN HACK PARA QUITARLOS
      newList = newList?.filter((users) => users.user !== null);
      newList = await this.obtenerCheckinAttende(userRef, newList);
      //console.log("NEWLIST==>",newList)

      this.setState(() => {
        return { attendees: newList, loading: false, total: newList.length, checkIn, properties };
      });
      let usersData = this.createUserInformation(newList);

      this.setState({ usersData });
    } catch (error) {
      const errorData = handleRequestError(error);
      this.setState({ timeout: true, errorData });
    }
  }

  checkedincomponent = (text, item, index) => {
    //console.log('ITEM==>', item);
    const self = this;
    return item.checkedin_at || item.properties?.checkedin_at ? (
      <p>{Moment(item.checkedin_at || item.properties?.checkedin_at).format('D/MMM/YY H:mm:ss A')}</p>
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

  //Funcion para crear columnas para la tabla de ant
  createColumnsTable(properties, self) {
    let columnsTable = [];
    let editColumn = {
      title: 'Editar',
      key: 'edit',
      render: self.editcomponent,
    };
    columnsTable.push(editColumn);

    columnsTable.push({
      title: 'Chequeado',
      dataIndex: 'checkedin_at',
      render: self.checkedincomponent,
    });

    for (let i = 0; properties.length > i; i++) {
      columnsTable.push({
        title: properties[i].label ? properties[i].label : properties[i].name,
        dataIndex: properties[i].name,
        ...this.getColumnSearchProps(properties[i].name),
      });
    }

    this.setState({ columnsTable });
  }

  //Funcion para crear la lista de usuarios para la tabla de ant
  createUserInformation(newList) {
    let usersData = [];
    for (let i = 0; newList.length > i; i++) {
      if (newList[i].properties) {
        let newUser = newList[i].properties;
        newUser.key = newList[i]._id;
        newUser.rol = newList[i].rol_id;
        newUser.checkedin_at = newList[i].checkedin_at;
        newUser._id = newList[i]._id;
        usersData.push(newUser);
      }
    }

    return usersData;
  }
  openEditModalUser = (item) => {
    html.classList.add('is-clipped');
    this.setState({ editUser: true, selectedUser: item, edit: true });
  };

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

  //FN para exportar listado a excel
  exportFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    //Se trae el listado total y se ordenan por fecha de creación
    let attendessFilter = this.state.attendees;
    attendessFilter = attendessFilter.filter((attendes) => attendes.user !== null);
    const attendees = [...attendessFilter].sort((a, b) => b.created_at - a.created_at);
    const data = await parseData2Excel(attendees, this.state.eventFields, this.state.rolesList);
    const ws = await XLSX.utils.json_to_sheet(data);
    const wb = await XLSX.utils.book_new();
    await XLSX.utils.book_append_sheet(wb, ws, 'Asistentes');
    await XLSX.writeFile(wb, `asistentes_actividad_${this.props.location.state.name}.xls`);
  };

  //FN Modal, abre y cierra
  checkModal = () => {
    html.classList.add('is-clipped');
    this.setState((prevState) => {
      return { qrModal: !prevState.qrModal };
    });
  };
  addUser = () => {
    html.classList.add('is-clipped');
    this.setState((prevState) => {
      return { editUser: !prevState.editUser, edit: false };
    });
  };
  closeQRModal = () => {
    html.classList.remove('is-clipped');
    this.setState((prevState) => {
      return { qrModal: !prevState.qrModal };
    });
  };
  modalUser = () => {
    html.classList.remove('is-clipped');
    this.setState((prevState) => {
      return { editUser: !prevState.editUser, edit: undefined };
    });
  };

  //FN para checkin
  checkIn = async (id, check = null, snap = null, edit = true) => {
    const { attendees } = this.state;
    console.log('ATTENDESS=>', attendees, id);

    //Se busca en el listado total con el id

    const user = snap != null ? { ...snap, _id: id, ticket_id: '' } : attendees.find(({ _id }) => _id === id);
    const userRef = this.state.userRef;

    let doc = await this.state.userRef.doc(user._id).get();
    //Sino está chequeado se chequea
    user.checked_in = check !== null ? check : !user.checked_in;

    userRef
      .doc(user._id)
      .set({
        ...user,
        updated_at: new Date(),
        checked_in: user.checked_in,
        checkedin_at: user.checked_in ? new Date() : null,
        checked_at: new Date(),
      })
      .then(() => {
        toast.success('Usuario Chequeado');
        if (edit) {
          this.updateAttendeesList(id, user);
        }
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
        toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
      });
  };

  updateAttendeesList = (id, user, check) => {
    const { attendees } = this.state;
    const addUser = attendees.find(({ _id }) => _id === id);

    if (addUser) {
      let updateAttendes = this.state.usersData.map((attendee) => {
        if (attendee._id === id) {
          return {
            ...(user.properties || user),
            key: attendee._id,
            rol: user.rol_id,
            _id: attendee._id,
            updated_at: new Date(),
            checked_in: user.checked_in,
            checkedin_at: user.checked_in ? new Date() : false,
            checked_at: new Date(),
          };
        } else {
          return attendee;
        }
      });
      this.setState({ attendees: updateAttendes, usersData: updateAttendes });
    } else {
      let updateAttendes = this.state.usersData;

      updateAttendes.push({
        ...(user.properties || user),
        key: id,
        rol: user.rol_id,
        _id: id,
        updated_at: new Date(),
        checked_in: user.checked_in,
        checkedin_at: user.checked_in ? new Date() : false,
        checked_at: new Date(),
      });

      this.setState({ attendees: updateAttendes, usersData: updateAttendes });
    }
  };

  //Funcion para filtrar los usuarios de la tabla
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  //Funcion para enviar la data de los usuarios al componente send.jsx
  goToSendMessage = () => {
    this.props.history.push({
      pathname: `/event/${this.props.match.params.id}/invitados`,
    });
  };

  //Funcion que reune los id de los usuarios para enviar al estado
  onSelectChange(idEventUsers) {
    const { attendees } = this.state;
    let attendeesForSendMessage = [];

    for (let i = 0; idEventUsers.length > i; i++) {
      attendeesForSendMessage = attendees.filter((item) => idEventUsers.indexOf(item._id) !== -1);
    }

    this.setState({ selectedRowKeys: idEventUsers, attendeesForSendMessage });
  }
  goBack = () => this.props.history.goBack();

  render() {
    const {
      attendees,
      selectedRowKeys,
      usersData,
      loading,
      columnsTable,
      total,
      checkIn,
      qrModal,
      eventID,
      agendaID,
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    if (!this.props.location.state) return this.goBack();
    return (
      <Fragment>
        {!this.props.loading && this.state.editUser && (
          <UserModal
            handleModal={this.modalUser}
            modal={this.state.editUser}
            eventId={eventID}
            ticket={this.state.ticket}
            tickets={this.state.listTickets}
            rolesList={this.state.rolesList}
            value={this.state.selectedUser}
            checkIn={this.checkIn}
            badgeEvent={this.state.badgeEvent}
            extraFields={this.state.eventFields}
            spacesEvent={this.state.spacesEvent}
            edit={this.state.edit}
            byActivity={true}
            activityId={this.state.agendaID}
            updateView={this.cargarUsuarios}
            checkinActivity={this.checkIn}
            updateList={this.updateAttendeesList}
            substractSyncQuantity={this.substractSyncQuantity}
          />
        )}
        <EventContent
          title={`CheckIn: ${this.props.location.state.name}`}
          closeAction={this.goBack}
          classes={'checkin'}>
          <div className='columns'>
            <div className='is-flex-touch columns'>
              {attendees.length > 0 && (
                <div className='column is-narrow has-text-centered export button-c is-centered'>
                  <button className='button' onClick={this.exportFile}>
                    <span className='icon'>
                      <i className='fas fa-download' />
                    </span>
                    <span className='text-button'>Exportar</span>
                  </button>
                </div>
              )}
              <div className='column is-narrow has-text-centered button-c is-centered'>
                <button className='button is-inverted' onClick={this.checkModal}>
                  <span className='icon'>
                    <i className='fas fa-qrcode'></i>
                  </span>
                  <span className='text-button'>Leer Código QR</span>
                </button>
              </div>
              <div className='column is-narrow has-text-centered button-c is-centered'>
                <Button onClick={() => this.goToSendMessage()}>Enviar comunicación / Correo</Button>
              </div>
              <div className='column is-narrow has-text-centered button-c is-centered'>
                <div className='tags is-centered '>
                  <span className='tag is-white'>Total</span>
                  <span className='tag is-light'>{total}</span>
                </div>
              </div>
              <div className='column is-narrow has-text-centered button-c is-centered'>
                <div className='tags is-centered'>
                  <span className='tag is-white'>Ingresados</span>
                  <span className='tag is-primary'>{checkIn}</span>
                </div>
              </div>
              <div className='column is-narrow has-text-centered button-c is-centered'>
                <button className='button is-inverted' onClick={this.addUser}>
                  <span className='icon'>
                    <UserAddOutlined />
                  </span>
                  <span className='text-button'>Agregar usuario</span>
                </button>
              </div>
              <div className='column is-narrow has-text-centered button-c is-centered'>
                <Button
                  onClick={() =>
                    this.props.history.push(`/eventAdmin/${this.props.event._id}/invitados/importar-excel`)
                  }>
                  Importar Usuario
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <Fragment>
              <Loading />
              <h2 className='has-text-centered'>Cargando...</h2>
            </Fragment>
          ) : (
            <Table
              scroll={{ x: 1500 }}
              sticky
              className='table-striped-rows'
              pagination={{ position: ['bottomCenter'] }}
              //rowSelection={rowSelection}
              columns={columnsTable}
              dataSource={usersData}
            />
          )}
        </EventContent>
        {qrModal && (
          <CheckSpace
            list={attendees}
            closeModal={this.closeQRModal}
            eventID={eventID}
            agendaID={agendaID}
            checkIn={this.checkIn}
          />
        )}
      </Fragment>
    );
  }
}

export default withRouter(CheckAgenda);
