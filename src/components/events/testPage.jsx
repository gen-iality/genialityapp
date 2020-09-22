import React, { Component, Fragment } from "react"
import WithUserEventRegistered from "../shared/withUserEventRegistered"
import ComponentTest from "./componentTest";
import * as Cookie from "js-cookie";
import API from "../../helpers/request";
import { firestore } from "../../helpers/firebase";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: false,
            usuarioRegistrado: false
        }
    }

    async componentDidMount() {
        console.log("en testPage")
        const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
        console.log("respuesta status", resp.status !== 202);
        if (resp.status !== 200 && resp.status !== 202) { return; }

        const data = resp.data;
        console.log("Aqui")
        const userRef = firestore
            .collection(`${this.props.event._id}_event_attendees`)
            .where("properties.email", "==", data.email)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    toast.error("Usuario no inscrito a este evento, contacte al administrador");
                    console.log("No matching documents.");
                    this.setState({ currentUser: false })
                    return;
                }

                console.log("USUARIO REGISTRADO.");
                this.setState({ currentUser: true })

                snapshot.forEach(doc => {
                    var user = firestore.collection(`${this.props.event._id}_event_attendees`).doc(doc.id);
                    console.log(doc.id, "=>", doc.data());
                    user
                        .update({
                            updated_at: new Date(),
                            checked_in: true,
                            checked_at: new Date()
                        })
                        .then(() => {
                            // Disminuye el contador si la actualizacion en la base de datos se realiza
                            console.log("Document successfully updated!");
                            toast.success("Usuario Chequeado");
                            this.setState({ usuarioRegistrado: true })
                        })
                        .catch(error => {
                            console.error("Error updating document: ", error);
                            toast.error(<FormattedMessage id="toast.error" defaultMessage="Error :(" />);
                        });
                });
            })
            .catch(err => {
                console.log("Error getting documents", err);
            });

        await console.log(userRef)
    }

    render() {
        return (
            <Fragment>
                <ComponentTest testData="prueba de dato" validate={true} event={this.props.event} currentUser={this.state.currentUser} usuarioRegistrado={this.state.currentUser} />
            </Fragment>
        )
    }
}

export default Test