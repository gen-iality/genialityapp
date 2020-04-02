import React, { Component } from "react";
import { getFiles } from "./services";
import { ApiGoogleDocuments } from "../../helpers/constants";
import 'antd/dist/antd.css';
import { List } from 'antd';

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
            <div className="column is-10">
                <List itemLayout="horizontal" style={{ background: "#ffffff" }} dataSource={data} renderItem={item => (
                    <List.Item actions={[<a href={item.file} key="list-loadmore-edit">Descargar</a>]}>
                        <List.Item.Meta title={<a href={ApiGoogleDocuments + encodeURIComponent(item.file)} target="_blank">{item.title}</a>}/>
                    </List.Item>
                )}
                />
            </div>

        )
    }
}

export default documentsDetail