import React, { Component } from "react";
import { getFiles } from "./services";
import EvenTable from "../events/shared/table";
import { ApiGoogleDocuments } from "../../helpers/constants";

class documentsDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documents: [],
            loading: false,
            category_id: null,
            previewImage: ""
        };
    }

    async componentDidMount() {
        let { documents } = this.state;
        
        //console.log(this.props)

        documents = await getFiles(this.props.eventId);
        //console.log(documents)
        if (documents != false) {
            // console.log(documents)
            await this.setState({ documents, loading: false });
        }
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
        const { documents, previewImage } = this.state
        return (
            <div>
                {/* Se muestra en una tabla los datos existentes y para poder observar el documento se realiza un boton */}
                <EvenTable head={["Carpeta", ""]}>
                    {documents.map(document =>
                        <tr key={document._id}>
                            <td>
                                {document.title}
                            </td>
                            <td>
                                <a className="button is-primary modal-button" href={ApiGoogleDocuments + encodeURIComponent(document.file)} target="_blank"><span className="icon"><i class="far fa-eye" /></span></a>
                            </td>
                        </tr>)}
                </EvenTable>
            </div>

        )
    }
}

export default documentsDetail