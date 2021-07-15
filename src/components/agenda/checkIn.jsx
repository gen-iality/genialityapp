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
      editUser:false, 
      extraFields:[], 
      selectedRowKeys: [],
      ticket:null,
      ticketsOptions:null,
      spacesEvents: [],
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.cargarUsuarios=this.cargarUsuarios.bind(this);
  }

  async componentDidMount() {
   this.cargarUsuarios()
  }

  async cargarUsuarios(){
    try {
      const { event } = this.props;
      const agendaID = this.props.match.params.id;
      let { checkIn } = this.state;
      const properties = event.user_properties;
      const rolesList = await RolAttApi.byEventRolsGeneral();
   

      this.createColumnsTable(properties);

      //Parse de campos para mostrar primero el nombre, email y luego el resto
      const eventFields = fieldNameEmailFirst(properties);

      this.setState({ eventFields, agendaID, eventID: event._id,rolesList });
      let newList = [...this.state.attendees];
      console.log("Cargando lista")
      newList = await Activity.getActivyAssitantsAdmin(this.props.event._id, agendaID);
      console.log(newList )
      newList = newList.map((item) => {
        let attendee = item.attendee
          ? item.attendee
          : item.user? { properties: { email: item.user.email, names: item.user.displayName } }:null;
        item = { ...item, ...attendee };
        return item;
      });
      
      console.log(newList)

      this.setState(() => {
        return { attendees: newList, loading: false, total: newList.length, checkIn };
      });
      let usersData = this.createUserInformation(newList);
      console.log("usersData")
      console.log(usersData)
      this.setState({ usersData });
    } catch (error) {
      const errorData = handleRequestError(error);
      this.setState({ timeout: true, errorData });
    }
  }

  //Funcion para crear columnas para la tabla de ant
  createColumnsTable(properties) {
    let columnsTable = [];

    columnsTable.push({
      title: 'Chequeado',
      dataIndex: 'checkedin_at',
      ...this.getColumnSearchProps('checkedin_at'),
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
      if(newList[i].properties){
        let newUser = newList[i].properties;
        newUser.key = newList[i]._id;
        usersData.push(newUser);
      }
     
    }
    return usersData;
  }

  //FN para exportar listado a excel
  exportFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    //Se trae el listado total y se ordenan por fecha de creación
    let attendessFilter=this.state.attendees;
    attendessFilter=attendessFilter.filter((attendes)=>attendes.user!==null)
    const attendees = [...attendessFilter].sort((a, b) => b.created_at - a.created_at);    
    const data = await parseData2Excel(attendees, this.state.eventFields);
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
  checkIn = (id) => {
    const { attendees } = this.state;
    //Se busca en el listado total con el id
    const user = attendees.find(({ attendee_id }) => attendee_id === id);
    //Sino está chequeado se chequea
    if (!user.checked_in) {
      const userRef = firestore.collection(`/${this.props.event._id}_event_attendees`).doc(user._id);
      userRef
        .update({
          updated_at: new Date(),
          checked_in: true,
          checked_at: new Date(),
        })
        .then(() => {
          toast.success('Usuario Chequeado');
        })
        .catch((error) => {
          console.error('Error updating document: ', error);
          toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
        });
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
    const { attendeesForSendMessage, modalVisible } = this.state;
    //Actualizar el estado del padre
    if (attendeesForSendMessage && attendeesForSendMessage.length > 0) {
      this.props.history.push({
        pathname: `/event/${this.props.match.params.id}/invitados/createmessage`,
        selection: attendeesForSendMessage,
      });
    } else {
      this.setState({ modalVisible: modalVisible === true ? false : true });
    }
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
    console.log(eventID)
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        {
          key: 'deselect',
          text: 'Deselect all Data',
          width: '30%',
          onSelect: () => {
            let newSelectedRowKeys = [];
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
      ],
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
                <Button onClick={() =>this.props.history.push( `/event/${this.props.event._id}/invitados`)}>Importar Usuario</Button>
               
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
              pagination={{ position: ['bottomCenter'] }}
              rowSelection={rowSelection}
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
