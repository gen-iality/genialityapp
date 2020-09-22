import React, { Component, Fragment } from "react";
import { Row, Col, Button, Table, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

import { InvitationsApi } from "../../helpers/request";
import ExportReport from "./exportReport";

// const style = { background: '#0092ff', padding: '8px 0' };

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchedColumn: '',
            changeItem: false,
            loading: true
        }
    }

    async componentDidMount() {
        const { event } = this.props
        let data = []
        const invitations = []
        const invitationsToExport = []
        const invitation = await InvitationsApi.getAll(event._id)
        data = invitation.data

        for (let i = 0; data.length > i; i++) {
            invitations.push({
                key: data[i]._id,
                user_requested: data[i].user_name_requested ? data[i].user_name_requested : "Sin datos",
                user_name_requesting: data[i].user_name_requesting ? data[i].user_name_requesting : "Sin datos",
                state: data[i].state ? data[i].state : "",
                response: data[i].response ? data[i].response : ""
            })

            invitationsToExport.push({
                key: data[i]._id,
                user_requested: data[i].user_name_requested ? data[i].user_name_requested : "Sin datos",
                user_name_requesting: data[i].user_name_requesting ? data[i].user_name_requesting : "Sin datos",
                state: data[i].state ? data[i].state : "",
                response: data[i].response ? data[i].response : "",
                created_at: data[i].created_at,
                updated_at: data[i].updated_at,
            })
        }
        this.setState({ invitations, loading: false, invitationsToExport })
    }


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
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
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
        const { invitations, loading, invitationsToExport } = this.state;
        const columns = [
            {
                title: 'Usuario',
                dataIndex: 'user_name_requesting',
                key: 'user_name_requesting',
                width: '30%',
                ...this.getColumnSearchProps('user_name_requesting'),
            },
            {
                title: 'Usuario Quien responde',
                dataIndex: 'user_requested',
                key: 'user_requested',
                width: '20%',
                ...this.getColumnSearchProps('user_requested'),
            },
            {
                title: 'Estado',
                dataIndex: 'state',
                key: 'state',
                ...this.getColumnSearchProps('state'),
            },
            {
                title: 'Respuesta',
                dataIndex: 'response',
                key: 'response',
                ...this.getColumnSearchProps('response'),
            },
        ];
        return (
            <Fragment>
                {loading === false ?
                    (
                        <div>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" span={6}>
                                    <ExportReport invitations={invitationsToExport} />
                                </Col>
                            </Row>
                            <Table columns={columns} dataSource={invitations} style={{ marginTop: "5%" }} />
                        </div>
                    )
                    :
                    (
                        <p>Estamos cargando la información por favor espera</p>
                    )
                }

            </Fragment>
        )
    }
}

export default Report