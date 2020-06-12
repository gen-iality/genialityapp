import React, { Component } from "react";

//custom
import { getFiles } from "./services";
import { ApiGoogleDocuments } from "../../helpers/constants";
import { List, Col, Row, Card, Button, Table, Tag, Space } from 'antd';
import { AgendaApi, DocumentsApi } from "../../helpers/request"

import { LikeOutlined, EyeOutlined } from '@ant-design/icons';

const columns = [
    {
        title: 'Actividad',
        dataIndex: 'activity',
        key: 'activity',
    },
    {
        title: 'Documento',
        dataIndex: 'document',
        key: 'document',
    },
    {
        title: 'Action',
        key: 'action',
        render: (item) => (
            <Space size="middle">
                <a target="_blank" href={item.file} download>
                    <IconText
                        text="Observar"
                        icon={EyeOutlined}

                    /></a>
            </Space>
        ),
    },
];

// Estructura de boton para descargar documentos
const IconText = ({ icon, text, onSubmit }) => (
    <Button
        htmlType="submit"
        type="link"
        href={onSubmit}
        target="_blank"
    >

        {React.createElement(icon, { style: { margin: 0 } })}
        {text}
    </Button>
);

class documentsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data || [],
            documentDates: []
        };
        this.getDatesFromDocumentList = this.getDatesFromDocumentList.bind(this)
    }
    componentDidMount() {
        this.getDatesFromDocumentList()
    }

    async getDatesFromDocumentList() {
        const { data } = this.state
        const documentDates = []
        for (let i = 0; i < data.length; i++) {
            const agenda = await AgendaApi.getOne(data[i].activity_id)
            documentDates.push({
                activity: agenda.name,
                document: data[i].title,
                file: data[i].file
            })
        }
        this.setState({ documentDates })
    }

    render() {
        const { documentDates } = this.state;

        return (
            <Card style={{ textAlign: "left" }}>
                <Table columns={columns} dataSource={documentDates} />
            </Card>
        )
    }
}
export default documentsList