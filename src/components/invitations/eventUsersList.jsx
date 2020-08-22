import React, { Component, Fragment } from "react";
import { withRouter, Link } from "react-router-dom";
import { UsersApi, eventTicketsApi } from "../../helpers/request";
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { complement } from "ramda";

class eventUsersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendeesFormatedForTable: [],
            columnsTable: [],
            eventUsersId: []    
        }
        this.loadData = this.loadData.bind(this)
        this.formattedAttendees = this.formattedAttendees.bind(this)
        this.onSelectChange = this.onSelectChange.bind(this)
    }

    componentDidMount() {
        this.loadData()
    }

    //Funcion para llamar los datos de los usuarios
    async loadData() {
        const { eventID } = this.props

        //Se consulta la información de los usuarios del evento y de los tickets
        let attendees = await UsersApi.getAll(eventID)
        let tickets = await eventTicketsApi.getAll(eventID)

        let attendeesForIterate = attendees.data
        let attendeesOrganized = []

        // Se itera la informacion de los usuarios del evento para validar si tiene ticket_id, 
        // de igual manera para introducir en el objeto properties el id del usuario, el timestamp y el ticket_id si tiene.
        // Se envia al estado la informacion obtenida para usar en la tabla posteriormente

        //Se itera la consulta de los tickets para cambiar 
        // el ticket_id por el nombre del tiquete para mayor facilidad de filtro

        for (let i = 0; attendeesForIterate.length > i; i++) {
            if (attendeesForIterate[i].properties.ticket_id) {
                for (let a = 0; tickets.length > a; a++) {
                    if (attendeesForIterate[i].properties.ticket_id === tickets[a]._id) {
                        attendeesForIterate[i].properties.ticket = tickets[a].title
                    }
                    attendeesForIterate[i].properties.id = attendeesForIterate[i]._id
                    attendeesForIterate[i].properties.key = attendeesForIterate[i]._id
                    attendeesForIterate[i].properties.updated_at = attendeesForIterate[i].updated_at
                    attendeesForIterate[i].properties.created_at = attendeesForIterate[i].created_at
                }
                attendeesOrganized.push(
                    attendeesForIterate[i].properties,
                )
                // Se hace un else en caso de que no exista tiquete,
                // esto para obtener la data sin el tiquete y mostrar la información de igual manera
            } else {
                attendeesForIterate[i].properties.id = attendeesForIterate[i]._id
                attendeesForIterate[i].properties.key = attendeesForIterate[i]._id
                attendeesForIterate[i].properties.updated_at = attendeesForIterate[i].updated_at
                attendeesForIterate[i].properties.created_at = attendeesForIterate[i].created_at
                attendeesOrganized.push(
                    attendeesForIterate[i].properties,
                )
            }
        }
        this.setState({ attendeesFormatedForTable: attendeesOrganized })
        this.formattedAttendees(attendeesOrganized)
    }

    formattedAttendees(attendeesFormatedForTable) {
        const { event } = this.props
        let propertiesTable = event.user_properties
        let columnsTable = []

        // Se crea la validacion para saber si tiene ticket para asignar el campo al header de la tabla y mostrar el tiquete
        // para poder filtrar se pasa la funcion getColumnSearchProps
        // dentro del objeto donde se asigna el campo a mostrar en la tabla
        // con el campo exacto del dataIndex

        if (attendeesFormatedForTable[0].ticket) {
            columnsTable.push({
                title: "Tiquete",
                dataIndex: "ticket",                
                ...this.getColumnSearchProps("ticket")
            })
        }

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

        this.setState({ columnsTable })
    }

    //Funcion que reune los id de los usuarios para enviar al estado
    onSelectChange(idEventUsers) {
        console.log(idEventUsers)
        this.setState({ eventUsersId: idEventUsers })
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

    modalUser = () => {
        const html = document.querySelector("html");
        html.classList.add("is-clipped");
        this.setState(prevState => {
            return { addUser: !prevState.addUser, edit: false };
        });
    };

    render() {
        const { columnsTable, attendeesFormatedForTable, eventUsersId } = this.state
        const rowSelection = {
            eventUsersId,
            onChange: this.onSelectChange,            
        };
        return (
            <>                
                <Fragment>
                    <p>Seleccionados: {eventUsersId.length}</p>
                    <Table size="small" style={{ overflowX: "scroll" }} rowSelection={rowSelection} columns={columnsTable} dataSource={attendeesFormatedForTable} />
                </Fragment>
            </>
        )
    }
}

export default withRouter(eventUsersList)