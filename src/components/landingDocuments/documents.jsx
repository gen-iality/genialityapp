import React, { Component } from "react";
import { getFiles } from "./services";
import EvenTable from "../events/shared/table";

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

        console.log(this.props)

        documents = await getFiles(this.props.eventId);
        console.log(documents)
        if (documents != false) {
            console.log(documents)
            await this.setState({ documents, loading: false });
        }
    }
    viewDocument(route) {
        document.querySelectorAll('.modal-button').forEach(function (el) {
            el.addEventListener('click', function () {
                var target = document.querySelector(el.getAttribute('data-target'));

                target.classList.add('is-active');

                target.querySelector('.modal-close').addEventListener('click', function () {
                    target.classList.remove('is-active');
                });
            });
        });

        let list = "http://docs.google.com/gview?embedded=true&url="
        const preview = list + encodeURIComponent(route)
        console.log(preview)
        this.setState({ previewImage: preview })
    }

    render() {
        const { documents, previewImage } = this.state
        return (
            <div>
                <EvenTable head={["Carpeta", ""]}>
                    {documents.map(document =>
                        <tr key={document._id}>
                            <td>
                                {document.title}
                            </td>
                            <td>
                                <button className="button is-primary modal-button" onClick={e => { this.viewDocument(document.file) }} data-target="#myModal" aria-haspopup="true"><span className="icon"><i class="far fa-eye" /></span></button>
                            </td>
                        </tr>)}
                </EvenTable>
                <div id="myModal" class="modal modal-full-screen modal-fx-fadeInScale">
                <div className="modal-background"></div>
                    <div class="modal-content modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Modal title</p>
                            <button className="modal-close is-large" aria-label="close"></button>
                        </header>
                        <section class="modal-card-body">
                            <iframe src={previewImage} frameborder="0"></iframe>
                        </section>
                    </div>
                </div>

            </div>

        )
    }
}

export default documentsDetail