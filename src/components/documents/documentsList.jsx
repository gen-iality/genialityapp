import React, { Component } from "react";

//custom
import { getFiles } from "./services";
import { ApiGoogleDocuments } from "../../helpers/constants";
import { List, Col, Row, Card, Button, Table } from 'antd';
import { LikeOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { AgendaApi } from "../../helpers/request"

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
        render: (item) => (
            <a target="_blank" href={item.file} download>
                <IconText
                    text="Descargar"
                    icon={DownloadOutlined}
                /></a>
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
        console.log("INNERPROPS", props);
        this.state = {
            data: props.data || [],
            documentDates: []
        };
    }

    componentDidMount() {
        this.getDatesFromDocumentList()
    }

    async getDatesFromDocumentList() {
        const { data } = this.state
        const documentDates = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].activity_id) {
                const agenda = await AgendaApi.getOne(data[i].activity_id, data[i].event_id)
                documentDates.push({
                    activity: agenda.name,
                    document: data[i].title ? data[i].title : data[i].name,
                    file: data[i].file
                })
            }
        }
        this.setState({ documentDates })

    }

    render() {
        const { documentDates, data } = this.state;

        return (
            <div>

                {

                    data[0].activity_id ?
                        <div>
                            <Table dataSource={documentDates} columns={columns} />
                        </div>
                        :

                        <Card style={{ textAlign: "left" }}>
                            <List itemLayout="horizontal"
                                //Se traen los datos del state 
                                dataSource={data}
                                //se mapean los datos del array data
                                renderItem={item => (
                                    <List.Item key={item._id}
                                        //boton de descarga
                                        actions={[
                                            <a target="_blank" href={item.file} download>
                                                <IconText
                                                    text="Descargar"
                                                    icon={DownloadOutlined}

                                                /></a>,
                                            // <a
                                            //     href={ApiGoogleDocuments + encodeURIComponent(item.file)}
                                            //     target="_blank"
                                            //     style={{ wordBreak: "break-word" }}
                                            // >
                                            //     <IconText
                                            //         text="Previsualizar"
                                            //         icon={EyeOutlined}
                                            //     />
                                            // </a>
                                        ]}
                                    >
                                        <div>
                                            <List.Item.Meta title={item.title ? item.title : item.name} />
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                }
            </div>

        )
    }
}
export default documentsList