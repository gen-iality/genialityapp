import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { Card } from "antd";
import ReactQuill from "react-quill";
import ReactPlayer from "react-player";
import { Row, Col, Button } from 'antd';
import NetworkingForm from "../networking";
import AgendaForm from "./agendaLanding";
import MyAgenda from "../networking/myAgenda"
import { getCurrentUser, getCurrentEventUser, userRequest } from "../networking/services";
import * as Cookie from "js-cookie";

class eventLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onPage: "event"
        }

        this.onChangePage = this.onChangePage.bind(this)
    }

    async componentDidMount() {
        const { event } = this.props
        let currentUser = Cookie.get("evius_token");

        if (currentUser) {
            let eventUserList = await userRequest.getEventUserList(event._id, Cookie.get("evius_token"));
            let user = await getCurrentUser(currentUser);
            const eventUser = await getCurrentEventUser(event._id, user._id);

            this.setState({ users: eventUserList, eventUser, eventUserId: eventUser._id, currentUserName: eventUser.names || eventUser.email });
        } else {
            this.setState({ onPage: "event" })
        }
        this.setState({ onPage: "event" })
    }


    onChangePage(value) {
        this.props.showSection(value)
    }

    onClick() {
        this.setState({ onClick: true })
    }

    render() {
        const { event } = this.props
        const { eventUserId, users } = this.state

        return (
            <Row >
                <div style={{ marginRight: 12, marginBottom: 12 }}>
                    <Col sm={24} md={24} lg={24} xl={24}>
                        <Card className="event-description" bodyStyle={{ padding: "25px 5px" }} bordered={true}>
                            {
                                event._id === "5f0622f01ce76d5550058c32" ? <></> : <h1 className="is-size-4-desktop has-text-weight-semibold">{event.name}</h1>
                            }
                            {event.video && (
                                <div className="column is-centered mediaplayer">
                                    <ReactPlayer
                                        width={"100%"}
                                        style={{
                                            display: "block",
                                            margin: "0 auto",
                                        }}
                                        url={event.video}
                                        //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                                        controls
                                    />
                                </div>
                            )}
                        
                            {
                                event._id === "5f0622f01ce76d5550058c32" ? (
                                    <div>
                                        <div className="containerfenalco">
                                            <Row gutter={[8, 16]}>
                                                <Col xs={16} sm={12} md={12} lg={12} xl={8}>
                                                    <div className="imagen">
                                                        <img onClick={() => this.onChangePage("interviews")} style={{cursor:'pointer'}} src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Btn-A3.png?alt=media&token=3ff840dc-d9a6-4ea1-9e9c-a623cb796ef5" />
                                                    </div>
                                                </Col>
                                                <Col xs={16} sm={12} md={12} lg={12} xl={8}>
                                                    <div className="imagen">
                                                        <img onClick={() => this.onChangePage("networking")} style={{cursor:'pointer'}} src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Btn-B3.png?alt=media&token=d9a64548-1fed-43d8-9adf-3aaee0e719f5" />
                                                    </div>
                                                </Col>
                                                <Col xs={16} sm={12} md={12} lg={12} xl={8}>
                                                    <img onClick={() => this.onChangePage("agenda")} style={{cursor:'pointer'}} src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Btn-C3.png?alt=media&token=615fb718-af55-478f-b444-d8486edfc24a" />
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                ) :
                                    (event.description && typeof event.description === "string") && (
                                        <div>
                                            <ReactQuill value={event.description} modules={{ toolbar: false }} readOnly={true} theme="bubble" />
                                        </div>
                                    )
                            }
                        </Card>
                    </Col>
                </div>
            </Row>

        )
    }
}

export default withRouter(eventLanding)