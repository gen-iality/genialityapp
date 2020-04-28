import React, { useEffect, useState } from "react";
import { Alert, Button, Tag } from "antd";
import { AuthUrl } from "../../helpers/constants";
import * as Cookie from "js-cookie";
import API from "../../helpers/request";

function WithUserEventRegistered(Component) {

    return function WihLoadingComponent(props) {
        let [currentUser, setCurrentUser] = useState(null);
        let [usuarioRegistrado, setUsuarioRegistrado] = useState(null);
        let [event, setEvent] = useState(null)

        useEffect(() => {
            (async () => {
                const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
                console.log("respuesta status", resp.status !== 202);
                if (resp.status !== 200 && resp.status !== 202) { return; }

                setCurrentUser(resp.data)
                setUsuarioRegistrado(props.usuarioRegistrado)
                setEvent(props.event)
            })();
        })

        console.log("event", event, "CurrentUser", currentUser, "UsuarioRegistrado", usuarioRegistrado)
        if (!currentUser && !usuarioRegistrado)
            return (<div>
                <Tag color="geekblue">{event && event.allow_register ? "El Evento permite registro" : "Es Evento Privado"}</Tag>
                <Tag color="geekblue">{currentUser ? "Usuario Autenticado" : "Usuario Anónimo"}</Tag>
                <Tag color="geekblue">{usuarioRegistrado ? "Usuario Registrado" : "Usuario sin Registrar"}</Tag>

                {!currentUser && (
                    <Alert
                        onClick={() => (window.location.href = "https://eviusauth.netlify.com")}
                        message="Evento restringido. requiere usuario"
                        description={
                            <p>
                                <b>
                                    Evento Restringido:
                                </b>
                                debes estar previamente registrado al evento para acceder al espacio en vivo,
                                si estas registrado en el evento ingresa al sistema con tu usuario para poder acceder al evento,
                                &nbsp;&nbsp;
                                <Button type="primary">
                                    <a href={AuthUrl}>Ir a Ingreso</a>
                                </Button>
                            </p>
                        }
                        type="info"
                        showIcon
                    />
                )}

                {currentUser && !usuarioRegistrado && (
                    <Alert
                        message="Evento restringido. requiere registro previo"
                        description={
                            <p>
                                <b>Evento Restringido:</b>
                                debes estar previamente registrado al evento para acceder al espacio en vivo,
                                si estas registrado y no tienes acceso comunicate con el organizador &nbsp;&nbsp;
                            </p>
                        }
                        type="warning"
                        showIcon
                    />
                )}

            </div>)
        return <>
            <Component {...props} />
        </>
    };
}
export default WithUserEventRegistered;
