import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import EventContent from "../events/shared/content_old";
import { AgendaApi } from "../../helpers/request";
import { Table, Tag, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';

class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            days: [],
            day: "",
            filtered: [],
            toShow: [],
            redirect: false,
            disabled: false
        }
    }

    async componentDidMount() {
        const { data } = await AgendaApi.byEvent(this.props.event._id);
        this.setState({ list: data })
    }

    //Fn para el resultado de la busqueda
    searchResult = (data) => this.setState({ toShow: !data ? [] : data });

    redirect = () => this.setState({ redirect: true });

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
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
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

    render() {
        if (this.state.redirect) return <Redirect to={{ pathname: `${this.props.matchUrl}/actividad`, state: { new: true } }} />;
        const { list } = this.state;
        const columns = [
            {
                title: 'Fecha y Hora Inicio',
                dataIndex: 'datetime_start',
                width: 100,
                render: (record, key) => (
                    <p key={key}>{record}</p>
                ),
                ...this.getColumnSearchProps('datetime_start'),
            },
            {
                title: 'Fecha y Hora Fin',
                dataIndex: 'datetime_end',
                width: 100,
                render: (record, key) => (
                    <p key={key}>{record}</p>
                ),
                ...this.getColumnSearchProps('datetime_end'),
            },
            {
                title: 'Actividad',
                dataIndex: 'name',
                width: 150,
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Categorias',
                dataIndex: 'activity_categories',
                width: 100,
                render: (record) => (
                    record.map((item, key) => (
                        <Tag key={key} color={item.color}>{item.name}</Tag>
                    ))
                )
            },
            {
                title: 'Espacios',
                dataIndex: 'space',
                width: 50,
                render: (record) => (
                    record !== null && (
                        <p>{record.name}</p>
                    )
                )
            },
            {
                title: 'Conferencistas',
                dataIndex: 'hosts',
                width: 50,
                render: (record) => (
                    record.map((item, key) => (
                        <p key={key}>{item.name}</p>
                    ))
                )
            },
            {
                title: 'Editar',
                dataIndex: '_id',
                width: 50,
                render: (record) => (
                    <Link to={{ pathname: `${this.props.matchUrl}/actividad`, state: { edit: record } }}>
                        <EditOutlined />
                    </Link>
                )
            }
        ];
        return (
            <EventContent title={"Programación"} classes={"agenda-list"} addAction={this.redirect} addTitle={"Nueva actividad"}>
                <Table columns={columns} dataSource={list} pagination={false} />
            </EventContent>
        )
    }
}

export default Agenda