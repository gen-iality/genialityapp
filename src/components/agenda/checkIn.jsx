import { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { fieldNameEmailFirst, handleRequestError, parseData2Excel } from '@helpers/utils';
import { firestore } from '@helpers/firebase';
import { FormattedMessage, useIntl } from 'react-intl';
import { Activity, RolAttApi } from '@helpers/request';
import { Input, Button, Space, Row, Col, Tooltip, Checkbox, Tag } from 'antd';
import {
  SearchOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  SendOutlined,
  QrcodeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import UserModal from '../modal/modalUser';
import dayjs from 'dayjs';
import Header from '@antdComponents/Header';
import Table from '@antdComponents/Table';
import { DispatchMessageService } from '@context/MessageService';

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
    const self = this;
    this.cargarUsuarios(self);
  }

  //FUNCION QUE OBTIENE CHECKIN DE FIREBASE
  async obtaincheckin(user, ref) {
    const resp = await ref.doc(user._id).get();
    const userNew = {
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
    const arrlist = [];
    for (const user of listuser) {
      const userNew = await this.obtaincheckin(user, ref);
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
      const { checkIn } = this.state;
      const properties = event.user_properties;
      const rolesList = await RolAttApi.byEventRolsGeneral();
      const roles = rolesList?.map((role) => {
        return { label: role.name, value: role._id };
      });

      const userRef = firestore
        .collection(`${event._id}_event_attendees`)
        .doc('activity')
        .collection(`${agendaID}`);
      this.createColumnsTable(properties, self);

      //Parse de campos para mostrar primero el nombre, email y luego el resto
      const eventFields = fieldNameEmailFirst(properties);

      const arrayFields = Array.from(eventFields);

      arrayFields.push({
        author: null,
        categories: [],
        label: 'Inscripción',
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
        const attendee = item.attendee
          ? item.attendee
          : item.user
          ? { properties: { email: item.user.email, names: item.user.displayName } }
          : null;
        item = { ...item, ...attendee, idActivity: item._id };
        return item;
      });
      //NO SE ESTAN ELIMINANDO LOS USUARIOS BIEN HACK PARA QUITARLOS
      newList = newList?.filter((users) => users.user !== null);
      newList = await this.obtenerCheckinAttende(userRef, newList);

      this.setState(() => {
        return { attendees: newList, loading: false, total: newList.length, checkIn, properties };
      });
      const usersData = this.createUserInformation(newList);

      this.setState({ usersData });
    } catch (error) {
      const errorData = handleRequestError(error);
      this.setState({ timeout: true, errorData });
    }
  }

  checkedincomponent = (text, item, index) => {
    const self = this;
    return item.checkedin_at || item.properties?.checkedin_at ? (
      <p>{dayjs(item.checkedin_at || item.properties?.checkedin_at).format('D/MMM/YY H:mm:ss A')}</p>
    ) : (
      <div>
        <Checkbox
          id={'checkinUser' + item._id}
          disabled={item.checkedin_at}
          name={'checkinUser' + item._id}
          checked={item.checkedin_at}
          onChange={() => {
            self.checkIn(item._id);
          }}
        />
      </div>
    );
  };

  //Funcion para crear columnas para la tabla de ant
  createColumnsTable(properties, self) {
    const columnsTable = [];
    const editColumn = {
      title: 'Editar',
      ellipsis: true,
      key: 'edit',
      fixed: 'right',
      width: 110,
      render: self.editcomponent,
    };
    /* columnsTable.push(editColumn); */

    columnsTable.push({
      title: 'Último ingreso',
      dataIndex: 'checkedin_at',
      width: 120,
      ellipsis: true,
      width: 130,
      sorter: (a, b) => a.checkedin_at - b.checkedin_at,
      render: self.checkedincomponent,
    });

    for (let i = 0; properties.length > i; i++) {
      columnsTable.push({
        title: properties[i].label ? properties[i].label : properties[i].name,
        dataIndex: properties[i].name,
        ellipsis: true,
        sorter: (a, b) => a[properties[i].name]?.length - b[properties[i].name]?.length,
        ...this.getColumnSearchProps(properties[i].name),
      });
    }
    columnsTable.push(editColumn);

    this.setState({ columnsTable });
  }

  //Funcion para crear la lista de usuarios para la tabla de ant
  createUserInformation(newList) {
    const usersData = [];
    for (let i = 0; newList.length > i; i++) {
      if (newList[i].properties) {
        const newUser = newList[i].properties;
        newUser.key = newList[i]._id;
        newUser.rol = newList[i].rol_id;
        newUser.checkedin_at = newList[i].checkedin_at;
        newUser._id = newList[i]._id;
        newUser.idActivity = newList[i].idActivity;
        usersData.push(newUser);
      }
    }

    return usersData;
  }
  openEditModalUser = (item) => {
    this.setState({ editUser: true, selectedUser: item, edit: true });
  };

  editcomponent = (text, item, index) => {
    return (
      <Tooltip placement="topLeft" title="Editar">
        <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => this.openEditModalUser(item)} />
      </Tooltip>

      /* <span
        className="icon has-text-grey action_pointer"
        data-tooltip="Editar"
        // eslint-disable-next-line no-unused-vars
        onClick={(e) => {
          this.openEditModalUser(item);
        }}>
        <i className="fas fa-edit" />
      </span> */
    );
  };

  //FN para exportar listado a excel
  exportFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    //Se trae el listado total y se ordenan por fecha de creación
    // let attendessFilter = this.state.attendees;
    // attendessFilter = attendessFilter.filter((attendes) => attendes.user !== null);
    // const attendees = [...attendessFilter].sort((a, b) => b.created_at - a.created_at);
    // const data = await parseData2Excel(attendees, this.state.eventFields, this.state.rolesList);
    // const ws = await XLSX.utils.json_to_sheet(data);
    // const wb = await XLSX.utils.book_new();
    // await XLSX.utils.book_append_sheet(wb, ws, 'Asistentes');
    // await XLSX.writeFile(
    //   wb,
    //   `asistentes_actividad_${
    //     this.props.location.state.name ? this.props.location.state.name : this.props.location.state.item.name
    //   }.xls`
    // );
  };

  //FN Modal, abre y cierra
  //Falta actualizar este modulo
  /* checkModal = () => {
    this.setState((prevState) => {
      return { qrModal: !prevState.qrModal };
    });
  }; */
  addUser = () => {
    this.setState((prevState) => {
      return { editUser: !prevState.editUser, edit: false };
    });
  };
  closeQRModal = () => {
    this.setState((prevState) => {
      return { qrModal: !prevState.qrModal };
    });
  };
  modalUser = () => {
    this.setState((prevState) => {
      return { editUser: !prevState.editUser, edit: undefined };
    });
  };

  //FN para checkin
  checkIn = async (id, check = null, snap = null, edit = true) => {
    const { attendees } = this.state;

    //Se busca en el listado total con el id

    const user = snap != null ? { ...snap, _id: id, ticket_id: '' } : attendees.find(({ _id }) => _id === id);
    const userRef = this.state.userRef;

    const doc = await this.state.userRef.doc(user._id).get();
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
        DispatchMessageService({
          type: 'success',
          msj: 'Usuario inscrito exitosamente',
          action: 'show',
        });
        if (edit) {
          this.updateAttendeesList(id, user);
        }
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
        DispatchMessageService({
          type: 'error',
          msj: this.props.intl.formatMessage({ id: 'toast.error', defaultMessage: 'Sry :(' }),
          action: 'show',
        });
      });
  };

  updateAttendeesList = (id, user, check) => {
    const { attendees } = this.state;
    const addUser = attendees.find(({ _id }) => _id === id);

    if (addUser) {
      const updateAttendes = this.state.usersData.map((attendee) => {
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
      const updateAttendes = this.state.usersData;

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
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
      pathname: `/eventadmin/${this.props.match.params.id}/invitados`,
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
            byActivity
            activityId={this.state.agendaID}
            updateView={this.cargarUsuarios}
            checkinActivity={this.checkIn}
            updateList={this.updateAttendeesList}
            substractSyncQuantity={this.substractSyncQuantity}
          />
        )}
        <Header
          title={`CheckIn: ${
            this.props.location.state ? this.props.location.state.item.name : this.props.location.state.item.name
          }`}
          back
        />

        <Row gutter={[8, 8]} wrap>
          <Col>
            <Tag>
              <small>Total: {total}</small>
            </Tag>
          </Col>
          <Col>
            <Tag>
              <small>Inscriptos: {checkIn}</small>
            </Tag>
          </Col>
        </Row>

        <Table
          header={columnsTable}
          list={usersData}
          pagination
          scroll={{ x: 'auto' }}
          titleTable={
            <Row gutter={[8, 8]} wrap justify="end">
              <Col>
                <Button onClick={this.goToSendMessage} type="primary" icon={<SendOutlined />}>
                  {'Enviar comunicación/correo'}
                </Button>
              </Col>
              <Col>
                <Button onClick={this.exportFile} type="primary" icon={<DownloadOutlined />}>
                  Exportar
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() =>
                    this.props.history.push(`/eventadmin/${this.props.event._id}/invitados/importar-excel`)
                  }
                  type="primary"
                  icon={<UploadOutlined />}
                >
                  {'Importar usuario'}
                </Button>
              </Col>
              <Col>
                <Button onClick={this.addUser} type="primary" icon={<PlusCircleOutlined />}>
                  {'Agregar usuario'}
                </Button>
              </Col>
            </Row>
          }
        />
      </Fragment>
    );
  }
}

export default withRouter(CheckAgenda);
