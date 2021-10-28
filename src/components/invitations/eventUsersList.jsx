import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { UsersApi, eventTicketsApi } from '../../helpers/request';
import { Table, Input, Button, Space, Menu, Dropdown, Row, Col } from 'antd';
import { SearchOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { parseData2Excel } from '../../helpers/utils';
import XLSX from 'xlsx';
import AddUser from '../modal/addUser';
import ModalAdvise from './modal';
import { formatDataToString } from '../../helpers/utils';

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
    for (let i = 0; attendees.length > i; i++) {
      let attendeeFlattenedData = attendees[i].properties;
      attendeeFlattenedData.key = attendees[i]._id;
      attendeeFlattenedData.ticket = attendees[i].ticket ? attendees[i].ticket.title : '';
      attendeeFlattenedData.checkedin_at = attendees[i].checkedin_at ? attendees[i].checkedin_at : '';
      attendeeFlattenedData.created_at = attendees[i].created_at;
      attendeeFlattenedData.updated_at = attendees[i].updated_at;

      Object.keys(attendeeFlattenedData).map((item) => {
        attendeeFlattenedData[item] = formatDataToString(attendeeFlattenedData[item]);
      });

      attendeesFormatedForTable.push(attendeeFlattenedData);
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
      title: 'Chequeado',
      dataIndex: 'checkedin_at',
      ellipsis: true,
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
      filters: filterTickets,
      ellipsis: true,
      onFilter: (value, record) => record.ticket.indexOf(value) === 0,
    });

    // Se iteran las propiedades del usuario (campos a recolectar) para mostrar la información
    // que el usuario diligenció para registrarse al event
    for (let i = 0; propertiesTable.length > i; i++) {
      columnsTable.push({
        title: propertiesTable[i].label ? propertiesTable[i].label : propertiesTable[i].name,
        dataIndex: propertiesTable[i].name,
        width: 300,
        ellipsis: true,
        ...this.getColumnSearchProps(propertiesTable[i].name),
      });
    }

    //Se hace push al final de la iteracion anterior para crear al final del array de columnsTable los campos de timestamp
    columnsTable.push(
      {
        title: 'Creado',
        dataIndex: 'created_at',
        width: 300,
        ellipsis: true,
        ...this.getColumnSearchProps('created_at'),
      },
      {
        title: 'Actualizado',
        dataIndex: 'updated_at',
        width: 300,
        ellipsis: true,

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

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistentes');
    XLSX.writeFile(wb, `asistentes_${this.props.event.name}.xls`);
  };

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

  //Funcion para enviar la data de los usuarios al componente send.jsx
  goToSendMessage = () => {
    const { attendeesForSendMessage, modalVisible } = this.state;
    console.log('lista', attendeesForSendMessage);
    //Actualizar el estado del padre
    if (attendeesForSendMessage && attendeesForSendMessage.length > 0) {
      this.props.setGuestSelected(attendeesForSendMessage);
      this.props.history.push(`${this.props.matchUrl}/createmessage`);
    } else {
      this.setState({ modalVisible: modalVisible === true ? false : true });
    }
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item key='1' icon={<UserOutlined />} onClick={this.modalUser}>
          Crear Usuario
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
        <Row justify='center'>
          <Col span={8}>
            <Button onClick={() => this.goToSendMessage()}>Enviar comunicación / Correo</Button>
            <ModalAdvise visible={this.state.modalVisible} />
          </Col>
          <Col span={8}>
            <Button onClick={this.exportFile}>Exportar</Button>
          </Col>
          <Col span={8}>
            <Dropdown overlay={menu}>
              <Button>
                Agregar Usuario <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Fragment>
          <p style={{ marginTop: '2%' }}>Seleccionados: {selectedRowKeys.length}</p>
          <Table
            style={{ height: '50px' }}
            scroll={{ x: 2100 }}
            sticky
            pagination={{ position: ['bottomCenter'] }}
            size='small'
            rowSelection={rowSelection}
            columns={columnsTable}
            dataSource={attendeesFormatedForTable}
          />
        </Fragment>
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
