import React, { Component, Fragment } from 'react';
import * as Cookie from "js-cookie";
import { ApiUrl } from "../../helpers/constants";
import TimeStamp from "react-timestamp";
import { TicketsApi, EventsApi } from "../../helpers/request";
import { Typography, Card, Col, Row, Button } from 'antd';
import Moment from "moment";
import EventImage from "../../eventimage.png";
import { Link } from 'react-router-dom';
import DetailTickets from "./detalleTickets"
const { Title } = Typography;

class TicketInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            iframeUrl: '',
            usersInscription: [],
            visible: false,
            items: {}
        }
        this.changeVisible = this.changeVisible.bind(this)
    }
    async componentWillMount() {
        const token = Cookie.get("evius_token")
        const tickets = await TicketsApi.getAll(token)
        console.log(tickets)
        const usersInscription = []
        tickets.forEach(async element => {
            const eventByTicket = await EventsApi.getOne(element.event_id)
            if (eventByTicket) {
                usersInscription.push({
                    picture: eventByTicket.picture ? eventByTicket.picture : EventImage,
                    id: eventByTicket._id,
                    place: eventByTicket.venue,
                    event: eventByTicket.name,
                    event_start: eventByTicket.datetime_from,
                    event_end: eventByTicket.datetime_to,
                    rol: element.properties.rol,
                    state: element.state ? element.state.name : "Sin Confirmar",
                    properties: element.properties,
                    status: element.checked_in,
                    description: eventByTicket.description
                })
            }
            this.setState({ usersInscription })
        });
    }

    async changeVisible(items) {
        this.setState({ items, visible: this.state.visible === false ? true : false })
    }

    render() {
        const { usersInscription } = this.state
        return (
            <Fragment>
                <Title level={2}>Tus Tickets</Title>
                <Row gutter={16}>
                    {
                        usersInscription.map((items, key) => (
                            <Col span={9} key={key}>
                                <Card
                                    style={{ marginLeft: "15%", marginTop: "3%" }}
                                    bordered={true}
                                    actions={[
                                        <Link to={{ pathname: `/landing/${items.id}` }}>
                                            <Button> Ir al evento</Button>
                                        </Link>,
                                        <Button onClick={() => { this.changeVisible(items) }}>Detalles</Button>
                                    ]}
                                    cover={
                                        <div>
                                            <figure className="image is-3by2"> <img alt="example" src={items.picture} /> </figure>
                                        </div>
                                    }>


                                    <div className="media-content">
                                        <div className="">
                                            <h2 className="title is-size-6 is-medium has-text-grey-dark">{items.event}</h2>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="is-size-7">
                                            <div style={{ float: "left", marginRight: "3%" }}>
                                                <TimeStamp data={items.event_start} />
                                            </div>
                                            <div>
                                                <TimeStamp data={items.event_end} />
                                            </div>
                                        </p>
                                        <p>
                                            {items.place}
                                        </p>
                                    </div>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
                <DetailTickets items={this.state.items} visible={this.state.visible} />
            </Fragment >
        );
    }
}

export default TicketInfo;