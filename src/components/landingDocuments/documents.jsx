import React, { Component } from "react";
import { getFiles } from "./services";
import EvenTable from "../events/shared/table";

class documentsDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documents: [],
            loading: false,
            category_id: null
        };
    }

    async componentDidMount() {
        let { documents } = this.state;

        console.log(this.props)

        documents = await getFiles(this.props.eventId);
        console.log(documents)
        await this.setState({ documents, loading: false });
    }

    render() {
        const { documents } = this.state
        return (
            <div>
                <EvenTable head={["Carpeta", ""]}>
                    {documents.map(document =>
                        <tr key={document._id}>
                            <td>
                                {document.title}
                            </td>
                            <td>
                                <button>Observar <span className="icon"><i class="far fa-eye" /></span></button>
                            </td>
                        </tr>)}
                </EvenTable>
            </div>
        )
    }
}

export default documentsDetail