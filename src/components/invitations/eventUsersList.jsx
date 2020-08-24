import React, { Component, Fragment } from "react";
import { withRouter, Link } from "react-router-dom";
import { UsersApi } from "../../helpers/request";
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { parseData2Excel } from "../../helpers/utils";
import XLSX from "xlsx";

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
        let attendeesFormatedForTable = this.organizedDataAttendees(attendees.data)                     
        this.setState({ attendees: attendees.data, columnsTable, attendeesFormatedForTable })
    }

    /*  Se aplanan los datos del array attendes para filtrar desde un solo array 
        y de esta manera no romper la logica del filtro traida desde ant
    */
    organizedDataAttendees(attendees) {
        let attendeesFormatedForTable = []
        for (let i = 0; attendees.length > i; i++) {
            attendees[i].properties.key = attendees[i]._id
            attendees[i].properties.ticket = attendees[i].ticket ? attendees[i].ticket.title : ""
            attendees[i].properties.checkedin_at = attendees[i].checkedin_at ? attendees[i].checkedin_at : ""
            attendees[i].properties.created_at = attendees[i].created_at
            attendees[i].properties.updated_at = attendees[i].updated_at
            attendeesFormatedForTable.push(
                attendees[i].properties
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

    exportFile = async () => {
        const columnsKey = this.props.event.user_properties
        const { attendees } = this.state

        const data = await parseData2Excel(attendees, columnsKey);

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Asistentes");
        XLSX.writeFile(wb, `asistentes_${this.props.event.name}.xls`);
    };

    render() {
        const { columnsTable, attendeesFormatedForTable, eventUsersId } = this.state
        const rowSelection = {
            eventUsersId,
            onChange: this.onSelectChange,
        };
        return (
            <>
                <div>
                    <Button onClick={this.exportFile}>Exportar</Button>
                </div>
                <Fragment>
                    <p>Seleccionados: {eventUsersId.length}</p>
                    <Table size="small" style={{ overflowX: "scroll" }} rowSelection={rowSelection} columns={columnsTable} dataSource={attendeesFormatedForTable} />
                </Fragment>
            </>
        )
    }
}

export default withRouter(eventUsersList)