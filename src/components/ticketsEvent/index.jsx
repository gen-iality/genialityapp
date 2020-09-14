import React, { useState, useEffect, Fragment } from "react";
import EventContent from "../events/shared/content";
import EvenTable from "../events/shared/table";
import TableAction from "../events/shared/tableAction";
import { eventTicketsApi } from "../../helpers/request";
import Moment from "moment";
import { message } from 'antd';

let tickets = (props) => {
    const [tickets, setTickets] = useState([])
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [allowed_to_vote, setAllowedToVote] = useState(false)

    useEffect(() => {
        getTickets()
    }, [props])

    //Funcion para traer los tickets
    async function getTickets() {
        const tickets = await eventTicketsApi.getAll(props.eventId)
        setTickets(tickets)
        console.log(tickets)
    }

    //Funcion para crear el espacio en el array para crear el ticket
    function newTicket() {
        let ticket = tickets
        if (!tickets.find(({ _id }) => _id === "new")) {
            setTickets(ticket = tickets.concat({ title: '', allowed_to_vote: allowed_to_vote, created_at: new Date(), _id: 'new' }))
            setId("new")
            return { tickets: ticket, created_at: new Date(), _id: 'new' }
        }
    };

    //Funcion asincrona para guardar o editar datos
    async function saveItem() {
        try {
            if (id === "new") {
                const data = { title: name, event_id: props.eventId, allowed_to_vote: allowed_to_vote }
                await eventTicketsApi.create(data.event_id, data)
                setName(""); setId(""); getTickets();
                message.info('Ticket Guardado');
            } else {
                const data = { title: name, allowed_to_vote: allowed_to_vote, event_id: props.eventId }
                await eventTicketsApi.update(data.event_id, data, id)
                setName(""); setId(""); getTickets();
                message.info('Ticket Actualizado');
            }
        } catch (e) {
            console.log(e)
        }
    }

    //Funcion para habilitar el input para editar datos
    function editItem(data) {
        setId(data._id)
        setName(data.title)
    }

    //Funcion para cancelar la creacion de campos
    function removeNew() {
        setName(""); setId(""); setAllowedToVote(false); getTickets();
    }

    //Funcion asincrona para eliminar datos
    async function removeItem(_id) {        
        message.info('Ticket Eliminado');
        getTickets()
    }

    return (
        <Fragment>
            <EventContent title={"Tickets"} addAction={newTicket} addTitle={"Nuevo ticket"}>
                <EvenTable head={["Id", "Nombre", "Permiso de Voto", "Fecha Creación", "Acciones"]}>
                    {tickets.map((ticket, key) => {
                        return <tr key={key}>
                            <td>
                                {
                                    ticket._id !== id &&
                                    <p>{ticket._id}</p>
                                }
                            </td>
                            <td>
                                {
                                    ticket._id !== id ?
                                        <p>{ticket.title}</p>
                                        :
                                        <input type="text" value={name} autoFocus onChange={(e) => setName(e.target.value)} />
                                }
                            </td>
                            <td>
                                {
                                    ticket._id !== id ?
                                        (
                                            <p>{ticket.allowed_to_vote ? "Verdadero" : "Falso"}</p>
                                        ) : (
                                            <select defaultValue={false} value={allowed_to_vote} autoFocus onChange={(e) => setAllowedToVote(e.target.value)}>
                                                <option value={true}>Permitir Voto</option>
                                                <option value={false}>Denegar Voto</option>
                                            </select>
                                        )
                                }
                            </td>
                            <td>{Moment(ticket.created_at).format("DD/MM/YYYY")}</td>
                            <TableAction id={id} object={ticket} saveItem={saveItem} editItem={editItem} removeNew={removeNew} removeItem={removeItem} discardChanges={removeNew} />
                        </tr>
                    })}
                </EvenTable>
            </EventContent>
        </Fragment>
    )
}

export default tickets