import React, { Component } from "react";

//custom
import { getFiles } from "./services";
import { ApiGoogleDocuments } from "../../helpers/constants";
import { List, Col, Row, Card, Button } from 'antd';
import {  LikeOutlined, DownloadOutlined } from '@ant-design/icons';

// Estructura de boton para descargar documentos

const IconText = ({ icon, text, onSubmit }) => (
    <Button 
        htmlType="submit"  
        type="link"
        href={onSubmit}
        target="_blank" 
    >

      {React.createElement(icon, { style: { marginRight: 8 } })}
      {text}
    </Button>
);

class documentsDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documents: [],
            loading: false,
            category_id: null,
            previewImage: "",
            data: []
        };
    }

    async componentDidMount() {
        let { documents } = this.state;

        //console.log(this.props)
        let data = []

        documents = await getFiles(this.props.eventId);

        //Se itera para poder pasar un array al componente List de ant
        for (const document in documents) {
            console.log(documents[document]);
            data.push(documents[document])
        }
        console.log(data)
        this.setState({ data })
    }

    //Funcion para observar el documento, se abre la modal y muestra el iframe
    viewDocument(route) {
        //Se trae la api de google
        let list = ApiGoogleDocuments
        //Se codifica en encodeURIComponent y se le pasa la ruta del archivo que le llega
        const preview = list + encodeURIComponent(route)
        //Se observa en consola para comprobar funcionalidad
        // console.log(preview)

        //Se envia al estado
        this.setState({ previewImage: preview })
    }

    render() {
        const { data } = this.state;

        return (
            <>
            <div className="has-margin-top-70 has-margin-bottom-70">
                
                <Col 
                xs={24}
                sm={22}
                md={18} 
                lg={18} 
                xl={18}
                style={{ margin: "0 auto" }}
                >
                    <Card style={{  textAlign: "left" }}>
                        <List itemLayout="horizontal"
                        //Se traen los datos del state 
                        dataSource={data}
                        
                        //se mapean los datos del array data
                        renderItem={item => (
                            <List.Item
                            
                            //boton de descarga
                            actions={[
                                <IconText 
                                    text="Descargar" 
                                    icon={DownloadOutlined} 
                                    onSubmit={item.file}
                                    />
                                ]}
                                >
                                <List.Item.Meta 
                                title={
                                    <a 
                                    href={ApiGoogleDocuments + encodeURIComponent(item.file)} 
                                    target="_blank"
                                    style={{ wordBreak: "break-word" }}
                                    >
                                        {item.title}
                                    </a>
                                    }
                                    />
                            </List.Item>
                        )}
                        />
                    </Card>
                </Col>
            </div>
        </>
        )
    }
}

export default documentsDetail