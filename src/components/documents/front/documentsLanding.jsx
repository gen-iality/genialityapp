import React, { Component } from "react";

//custom
import { getFiles } from "../services";
import { ApiGoogleDocuments } from "../../../helpers/constants";
import { List, Col, Row, Card, Button, Result } from 'antd';
import { LikeOutlined, DownloadOutlined } from '@ant-design/icons';

import DocumentsList from "../documentsList";

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
        console.log("data", data)
        this.setState({ data })
    }

    render() {
        const { data } = this.state;

        return (
            <>
                <Col xs={24} sm={20} md={20} lg={20} xl={12}
                    style={{ margin: "0 auto" }}
                >
                    {(data && data.length > 0) && <DocumentsList data={data} />}

                    {(!data || !data.length) && (

                        <div className="site-card-border-less-wrapper">
                            <Card title="" bordered={false} >
                                <Result title="Aún no se han agragado archivos." />
                            </Card>
                        </div>
                    )}
                </Col>
            </>
        )
    }
}

export default documentsDetail