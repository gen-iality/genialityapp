import React, { Component, Fragment } from 'react';
import EventContent from '../events/shared/content';
import EvenTable from "../events/shared/table";
import { DocumentsApi } from "../../helpers/request";
import { Link, Redirect } from "react-router-dom";
import { sweetAlert } from "../../helpers/utils";
import { toast } from 'react-toastify';
import firebase from 'firebase';

class documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            redirect: false,
            list: []
        };
    }

    async componentDidMount() {
        const {data} = await DocumentsApi.getAll(this.props.event._id)
        this.setState({ list: data })
        console.log(data)
    }

    destroy(name,id,event) {
        let information = DocumentsApi.deleteOne(event, id);
        console.log(information);

        const ref = firebase.storage().ref();
            var desertRef = ref.child(`documents/${event}/${name}`);
            console.log(desertRef)
            // //Delete the file
            desertRef.delete().then(function () {
                //El dato se elimina aqui
            }).catch(function (error) {
                //Si no muestra el error
                console.log(error)
            });

        toast.success("Information Deleted")
        setTimeout(function () { 
            window.location.reload()
        }, 4000);
    }

    redirect = () => this.setState({ redirect: true });

    render() {
        if (this.state.redirect) return <Redirect to={{ pathname: `${this.props.matchUrl}/upload`, state: { new: true } }} />;
        const { list } = this.state;
        return (
            <Fragment>
                <div>
                    <h1></h1>
                    <EventContent title={"Documentos"} classes={"documents-list"} addAction={this.redirect} addTitle={"Nuevo documento"}>
                        <EvenTable head={["Nombre", "Formato","Documento","Categoria","Rol" ,""]}>
                            {
                                list.map((trivia, key) => (
                                    <tr key={key}>
                                        <td>{trivia.title}</td>
                                        <td>{trivia.format}</td>
                                        <td><a href={trivia.file}>Descargar</a></td>
                                        <td>{trivia.category}</td>
                                        <td>{trivia.rol}</td>
                                        <td>
                                            <Link to={{ pathname: `${this.props.matchUrl}/upload`, state: { edit: trivia._id } }}>
                                                <button><span className="icon"><i className="fas fa-2x fa-chevron-right" /></span></button>
                                            </Link>
                                        </td>
                                        <td>
                                            <button onClick={this.destroy.bind(trivia.publicada, trivia.name,trivia._id, this.props.event._id)}><span className="icon"><i className="fas fa-trash-alt" /></span></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </EvenTable>
                    </EventContent>
                </div>
            </Fragment>
        )
    }
}

export default documents