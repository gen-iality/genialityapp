import { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { UsersApi, eventTicketsApi } from '../../helpers/request';
import { Table, Input, Button, Space, Menu, Row, Col, Tag } from 'antd';
import { SearchOutlined, UserOutlined, DownloadOutlined, UploadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { parseData2Excel } from '../../helpers/utils';
import { utils, writeFileXLSX } from 'xlsx';
import AddUser from '../modal/addUser';
import ModalAdvise from './modal';
import Header from '../../antdComponents/Header';
import { HelperContext } from '@context/helperContext/helperContext';

class eventUsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendees: [],
      attendeesFormatedForTable: [],
      columnsTable: [],
      selectedRowKeys: [], //Contiene los id de los usuarios, se llama de esta manera el array por funcionalidad de la tabla
      tickets: [],
    };
    this.createTableColumns = this.createTableColumns.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }
  static contextType = HelperContext;

  async componentDidMount() {
    const { eventID, event } = this.props;
    let attendees = await UsersApi.getAll(eventID);
    let tickets = await eventTicketsApi.getAll(eventID);
    this.setState({ tickets });
    let attendeesFormatedForTable = this.formatAttendeesForTable(attendees.data);
    let columnsTable = this.createTableColumns(event);

    this.setState({ attendees: attendees.data, attendeesFormatedForTable, columnsTable });
  }

  /*  Se aplanan los datos del array attendes para filtrar desde un solo array 
        y de esta manera no romper la logica del filtro traida desde ant
    */
  formatAttendeesForTable(attendees) {
    let attendeesFormatedForTable = [];
    let attendeeFlattenedData = '';

    for (let i = 0; attendees.length > i; i++) {
      if (attendees[i].properties) {
        attendeeFlattenedData = attendees[i]?.properties;
        attendeeFlattenedData.key = attendees[i]?._id;
        attendeeFlattenedData.ticket = attendees[i]?.ticket ? attendees[i]?.ticket?.title : '';
        attendeeFlattenedData.checkedin_at = attendees[i]?.checkedin_at ? attendees[i]?.checkedin_at : '';
        attendeeFlattenedData.created_at = attendees[i]?.created_at;
        attendeeFlattenedData.updated_at = attendees[i]?.updated_at;
        attendeesFormatedForTable.push(attendeeFlattenedData);
      }
    }
    //verificacion del tipo de dato de los campos, si se recibe un {...} entonces se pasa a array para evitar errores en la renderizacion de la tabla
    return attendeesFormatedForTable;
  }

  /* El eventUser consta de varios campos basicos y un campo especial llamada properties donde almacenamos
        diferentes propiedades dinamicas en formato JSON para poder mostrar esto en una tabla nos toca aplanar el eventUser
        es decir aplanar los valores del campo properties
    */
  createTableColumns(event) {
    const { tickets } = this.state;

    let filterTickets = [];
    let propertiesTable = event.user_properties;
    let columnsTable = [];

    columnsTable.push({
      title: 'Último ingreso',
      dataIndex: 'checkedin_at',
      width: '150px',
      ellipsis: true,
      sorter: (a, b) => a.checkedin_at.length - b.checkedin_at.length,
      ...this.getColumnSearchProps('checkedin_at'),
    });

    if (tickets.length > 0) {
      for (let i = 0; tickets.length > i; i++) {
        filterTickets.push({
          text: tickets[i].title,
          value: tickets[i].title,
        });
      }
    }

    columnsTable.push({
      title: 'Tiquete',
      dataIndex: 'ticket',
      width: '130px',
      filters: filterTickets,
      ellipsis: true,
      /* sorter: (a, b) => a.ticket.length - b.ticket.length, */
      ...this.getColumnSearchProps('ticket'),
      onFilter: (value, record) => record.ticket.indexOf(value) === 0,
    });

    // Se iteran las propiedades del usuario (campos a recolectar) para mostrar la información
    // que el usuario diligenció para registrarse al event
    for (let i = 0; propertiesTable?.length > i; i++) {
      columnsTable.push({
        title: propertiesTable[i].label ? propertiesTable[i].label : propertiesTable[i].name,
        dataIndex: propertiesTable[i].name,
        /* width: '300', */
        ellipsis: true,
        sorter: (a, b) => a[propertiesTable[i].name]?.length - b[propertiesTable[i].name]?.length,
        ...this.getColumnSearchProps(propertiesTable[i].name),
      });
    }

    //Se hace push al final de la iteracion anterior para crear al final del array de columnsTable los campos de timestamp
    columnsTable.push(
      {
        title: 'Creado',
        dataIndex: 'created_at',
        width: '160px',
        ellipsis: true,
        sorter: (a, b) => a.created_at - b.created_at,
        ...this.getColumnSearchProps('created_at'),
      },
      {
        title: 'Actualizado',
        dataIndex: 'updated_at',
        width: '160px',
        ellipsis: true,
        sorter: (a, b) => a.updated_at - b.updated_at,
        ...this.getColumnSearchProps('updated_at'),
      }
    );

    return columnsTable;
  }

  //Funcion que reune los id de los usuarios para enviar al estado
  onSelectChange(idEventUsers) {
    const { attendees } = this.state;
    let attendeesForSendMessage = [];

    for (let i = 0; idEventUsers.length > i; i++) {
      attendeesForSendMessage = attendees.filter((item) => idEventUsers.indexOf(item._id) !== -1);
    }

    this.setState({ selectedRowKeys: idEventUsers, attendeesForSendMessage });
  }

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

  exportFile = async () => {
    const columnsKey = this.props.event.user_properties;
    const { attendees } = this.state;

    const data = await parseData2Excel(attendees, columnsKey);

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Asistentes');
    writeFileXLSX(wb, `asistentes_${this.props.event.name}.xls`);
  };

  modalUser = () => {
    this.setState((prevState) => {
      return { addUser: !prevState.addUser, edit: false };
    });
  };

  closeModal = () => {
    this.setState((prevState) => {
      return { addUser: !prevState.addUser, edit: undefined };
    });
  };

  //Funcion para enviar la data de los usuarios al componente send.jsx
  goToSendMessage = () => {
    const { attendeesForSendMessage, modalVisible } = this.state;
    /* console.log('lista', attendeesForSendMessage); */
    //Actualizar el estado del padre

    // if (attendeesForSendMessage && attendeesForSendMessage.length > 0) {
    this.props.setGuestSelected(attendeesForSendMessage);
    this.props.history.push(`${this.props.matchUrl}/createmessage`);
    // } else {
    //   this.setState({ modalVisible: modalVisible === true ? false : true });
    // }
  };

  render() {
    const { eventIsActive } = this.context;

    const menu = (
      <Menu>
        <Menu.Item key='1' icon={<UserOutlined />} onClick={this.modalUser}>
          Crear usuario
        </Menu.Item>
        <Link className='dropdown-item' to={`${this.props.matchUrl}/importar-excel`}>
          <Menu.Item key='2' icon={<UserOutlined />}>
            Importar usuarios de Excel
          </Menu.Item>
        </Link>
      </Menu>
    );
    const { columnsTable, attendeesFormatedForTable, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        {
          key: 'deselect',
          text: 'Deselect all Data',
          width: '50%',
          onSelect: () => {
            let newSelectedRowKeys = [];
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
      ],
    };

    return (
      <>
        <Header title={'Enviar información o correo a asistentes'} />
        <div>
          <small>
            <Tag>Seleccionados: {selectedRowKeys.length === 0 ? 'Todos' : selectedRowKeys.length}</Tag>
          </small>
        </div>

        <Table
          scroll={{ x: 'auto' }}
          size='small'
          rowSelection={rowSelection}
          columns={columnsTable}
          dataSource={attendeesFormatedForTable}
          title={() => (
            <Row wrap gutter={[8, 8]} justify='end'>
              <Col>
                <Button
                  onClick={() => this.goToSendMessage()}
                  disabled={!eventIsActive && window.location.toString().includes('eventadmin')}>
                  Enviar comunicación a : {selectedRowKeys.length === 0 ? 'Todos' : selectedRowKeys.length}
                </Button>
                <ModalAdvise visible={this.state.modalVisible} />
              </Col>
              <Col>
                <Button type='primary' onClick={this.exportFile} icon={<DownloadOutlined />}>
                  Exportar usuario
                </Button>
              </Col>
              <Col>
                <Link
                  to={
                    !eventIsActive && window.location.toString().includes('eventadmin')
                      ? ''
                      : `${this.props.matchUrl}/importar-excel`
                  }
                  icon={<UploadOutlined />}>
                  <Button type='primary' disabled={!eventIsActive && window.location.toString().includes('eventadmin')}>
                    Importar usuario
                  </Button>
                </Link>
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={this.modalUser}
                  icon={<PlusCircleOutlined />}
                  disabled={!eventIsActive && window.location.toString().includes('eventadmin')}>
                  Agregar usuario
                </Button>
              </Col>
            </Row>
          )}
        />

        {this.state.addUser && (
          <AddUser
            handleModal={this.closeModal}
            modal={this.state.addUser}
            eventId={this.props.eventID}
            value={this.state.selectedUser}
            extraFields={this.props.event.user_properties}
            edit={this.state.edit}
          />
        )}
      </>
    );
  }
}

export default withRouter(eventUsersList);
