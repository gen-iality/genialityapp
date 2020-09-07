import React, { useState, useEffect } from "react";
import { message, Button, Row, Col, Checkbox } from 'antd';
import { FormattedMessage } from "react-intl";

import ReactQuill from "react-quill";
import { toolbarEditor } from "../../../helpers/constants";

import { Actions, EventsApi } from "../../../helpers/request";




function ConfirmacionRegistro(props) {
    //Se definen las variables de useState para enviar y obtener datos
    let [event, setEvent] = useState(null);
    let [validateEmail, setValidateEmail] = useState(false)    

    //Funcion para cargar los datos al inicio de la carga del componente
    useEffect(() => {

        (async (props) => {
            const dbevent = await Actions.getAll(`/api/events/${props.eventID}`);
            console.log("evento", dbevent, props);

            setEvent(dbevent);
        })(props)
    }, [props.eventID])

    if (!event) return "Cargando ...";

    //funcion para guardar la inormación
    const saveData = async () => {
        let data = { registration_message: event.registration_message, validateEmail: validateEmail }
        const updatedEvent = await EventsApi.editOne(data, event._id);
        console.log(updatedEvent)
        message.success(<FormattedMessage id="toast.success" defaultMessage="Cotenido guardado" />);
    }

    //Cambio descripción
    const chgTxt = content => {
        event.registration_message = content;
        setEvent(event)
    }

    return (
        <>
            <h1>Mensaje Confirmacion Registro </h1>
            <p>El siguiene mensaje le llegara a las personas luego de haberse registrado al evento</p>

            <Row gutter={[0, 24]}><Col span={12}>
                <ReactQuill value={event.registration_message} modules={toolbarEditor} onChange={chgTxt} />
            </Col>
            </Row>
            <Row>
                {/* Se envia el valor a validEmail a useSate para usarla porteriormente en la funcion saveData */}
                <Checkbox defaultChecked={event.validateEmail} style={{ marginRight: "2%" }} onChange={(e) => setValidateEmail(e.target.checked)} />
                <label>Autologuearse despues de registrarse</label>
            </Row>
            <Row >
                <Col span={12}>
                    <Button type="primary" onClick={saveData}>Guardar</Button>
                </Col>
            </Row>
        </>
    )
}

export default ConfirmacionRegistro
