import React, { Component, Fragment, useState, useEffect } from "react";
import { message, Button, Row, Col } from 'antd';
import { FormattedMessage } from "react-intl";

import ReactQuill from "react-quill";
import { BaseUrl, toolbarEditor } from "../../../helpers/constants";

import { Actions, EventsApi } from "../../../helpers/request";




function ConfirmacionRegistro(props) {
    let [event, setEvent] = useState(null);

    //Cambio descripción
    const chgTxt = content => {
        event.registration_message = content;
        setEvent(event)
    }

    let valor = "asdf";

    const saveData = async () => {
        let data = { registration_message: event.registration_message }
        const updatedEvent = await EventsApi.editOne(data, event._id);
        console.log(updatedEvent)
        message.success(<FormattedMessage id="toast.success" defaultMessage="Cotenido guardado" />);
    }



    useEffect(() => {

        (async (props) => {
            const dbevent = await Actions.getAll(`/api/events/${props.eventID}`);
            console.log("evento", dbevent, props);

            setEvent(dbevent);
        })(props)
    }, [props.eventID])


    if (!event) return "Cargando ...";

    return (
        <>
            <h1>Mensaje Confirmacion Registro </h1>
            <p>El siguiene mensaje le llegara a las personas luego de haberse registrado al evento</p>

            <Row gutter={[0, 24]}><Col span={12}>
                <ReactQuill value={event.registration_message} modules={toolbarEditor} onChange={chgTxt} />
            </Col>
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
