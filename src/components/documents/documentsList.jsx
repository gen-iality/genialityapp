import React, { Component } from "react";

//custom
import { getFiles } from "./services";
import { ApiGoogleDocuments } from "../../helpers/constants";
import { List, Col, Row, Card, Button } from 'antd';
import { LikeOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';

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
            data: props.data || []
        };
    }

    render() {
        const { data } = this.state;

        return (
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
                            <List.Item.Meta title={item.title ? item.title : item.name} />
                        </List.Item>
                    )}
                />
            </Card>
        )
    }
}
export default documentsList