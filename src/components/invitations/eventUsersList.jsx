import React, { Component, Fragment } from "react";
import { withRouter, Link } from "react-router-dom";
import { UsersApi } from "../../helpers/request";
import { Table, Input, Button, Space, Menu, Dropdown, Row, Col } from 'antd';
import { SearchOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { parseData2Excel } from "../../helpers/utils";
import XLSX from "xlsx";
import AddUser from "../modal/addUser";
import ModalAdvise from "./modal"

class eventUsersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendees: [],
            attendeesFormatedForTable: [],
            columnsTable: [],
            eventUsersId: []
        }
        this.createTableColumns = this.createTableColumns.bind(this)
        this.onSelectChange = this.onSelectChange.bind(this)
    }

    async componentDidMount() {
        const { eventID, event } = this.props
        let attendees = await UsersApi.getAll(eventID)
        let columnsTable = this.createTableColumns(event)
        let attendeesFormatedForTable = this.formatAttendeesForTable(attendees.data)
        this.setState({ attendees: attendees.data, columnsTable, attendeesFormatedForTable })
    }

    /*  Se aplanan los datos del array attendes para filtrar desde un solo array 
        y de esta manera no romper la logica del filtro traida desde ant
    */
    formatAttendeesForTable(attendees) {
        let attendeesFormatedForTable = []
        for (let i = 0; attendees.length > i; i++) {
            let attendeeFlattenedData = attendees[i].properties

            attendeeFlattenedData.key = attendees[i]._id
            attendeeFlattenedData.ticket = attendees[i].ticket ? attendees[i].ticket.title : ""
            attendeeFlattenedData.checkedin_at = attendees[i].checkedin_at ? attendees[i].checkedin_at : ""
            attendeeFlattenedData.created_at = attendees[i].created_at
            attendeeFlattenedData.updated_at = attendees[i].updated_at
            attendeesFormatedForTable.push(
                attendeeFlattenedData
            )
        }
        return attendeesFormatedForTable
    }

    /* El eventUser consta de varios campos basicos y un campo especial llamada properties donde almacenamos
        diferentes propiedades dinamicas en formato JSON para poder mostrar esto en una tabla nos toca aplanar el eventUser
        es decir aplanar los valores del campo properties
    */
    createTableColumns(event) {
        let propertiesTable = event.user_properties
        let columnsTable = []

        columnsTable.push({
            title: "Chequeado",
            dataIndex: "checkedin_at",
            ...this.getColumnSearchProps("checkedin_at")
        })


        columnsTable.push({
            title: "Tiquete",
            dataIndex: "ticket",
            ...this.getColumnSearchProps("ticket")
        })


        // Se iteran las propiedades del usuario (campos a recolectar) para mostrar la información 
        // que el usuario diligenció para registrarse al event
        for (let i = 0; propertiesTable.length > i; i++) {
            columnsTable.push({
                title: propertiesTable[i].label,
                dataIndex: propertiesTable[i].name,
                ...this.getColumnSearchProps(propertiesTable[i].name)
            })
        }

        //Se hace push al final de la iteracion anterior para crear al final del array de columnsTable los campos de timestamp
        columnsTable.push(
            {
                title: "Creado",
                dataIndex: "created_at",
                ...this.getColumnSearchProps("created_at")
            },
            {
                title: "Actualizado",
                dataIndex: "updated_at",
                ...this.getColumnSearchProps("updated_at")
            }
        )
        return columnsTable
    }

    //Funcion que reune los id de los usuarios para enviar al estado
    onSelectChange(idEventUsers) {
        const { attendees } = this.state
        let attendeesForSendMessage = []

        for (let i = 0; idEventUsers.length > i; i++) {
            attendeesForSendMessage = attendees.filter(
                item => idEventUsers.indexOf(item._id) !== -1
            )
        }        

        this.setState({ eventUsersId: idEventUsers, attendeesForSendMessage })
    };

    //Funcion para filtrar los usuarios de la tabla
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
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

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    exportFile = async () => {
        const columnsKey = this.props.event.user_properties
        const { attendees } = this.state

        const data = await parseData2Excel(attendees, columnsKey);

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Asistentes");
        XLSX.writeFile(wb, `asistentes_${this.props.event.name}.xls`);
    };

    modalUser = () => {
        const html = document.querySelector("html");
        html.classList.add("is-clipped");
        this.setState(prevState => {
            return { addUser: !prevState.addUser, edit: false };
        });
    };

    closeModal = () => {
        const html = document.querySelector("html");
        html.classList.remove("is-clipped");
        this.setState(prevState => {
            return { addUser: !prevState.addUser, edit: undefined };
        });
    };

    //Funcion para enviar la data de los usuarios al componente send.jsx
    goToSendMessage = () => {
        const { attendeesForSendMessage, visible } = this.state
        //Actualizar el estado del padre
        if (attendeesForSendMessage === undefined) {
            this.setState({ visible: visible === true ? false : true })
        } else {
            this.props.setGuestSelected(attendeesForSendMessage);
            this.props.history.push(`${this.props.matchUrl}/createmessage`);
        }
    };

    render() {
        const menu = (
            <Menu >
                <Menu.Item key="1" icon={<UserOutlined />} onClick={this.modalUser}>
                    Crear Usuario
                </Menu.Item>
                <Link className="dropdown-item" to={`${this.props.matchUrl}/importar-excel`}>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        Importar usuarios de Excel
                    </Menu.Item>
                </Link>
            </Menu >
        );
        const { columnsTable, attendeesFormatedForTable, eventUsersId, dropUser } = this.state
        const rowSelection = {
            eventUsersId,
            onChange: this.onSelectChange,
        };
        return (
            <>
                <Row justify="center">
                    <Col span={8}>
                        <Button onClick={() => this.goToSendMessage()}>
                            Enviar comunicación / Correo
                        </Button>
                        <ModalAdvise visible={this.state.visible} />
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
                    <p>Seleccionados: {eventUsersId.length}</p>
                    <Table size="small" style={{ overflowX: "scroll" }} rowSelection={rowSelection} columns={columnsTable} dataSource={attendeesFormatedForTable} />
                </Fragment>
                {
                    this.state.addUser && (
                        <AddUser
                            handleModal={this.closeModal}
                            modal={this.state.addUser}
                            eventId={this.props.eventID}
                            value={this.state.selectedUser}
                            extraFields={this.props.event.user_properties}
                            edit={this.state.edit}
                        />
                    )
                }
            </>
        )
    }
}

export default withRouter(eventUsersList)