import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { Card } from "antd";
import ReactQuill from "react-quill";
import ReactPlayer from "react-player";
import { Row, Col, Button } from 'antd';

class eventLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { event } = this.props
        return (
            <div className="description-container column is-12">
                <Card className="event-description" bodyStyle={{ padding: "25px 5px" }} bordered={true}>
                    <h1 className="is-size-4-desktop has-text-weight-semibold">{event.name}</h1>

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
                                <div>
                                    <img src="" style={{ maxWidth: '100%', height: '500px' }} />
                                    <div className="containerfenalco">
                                        <Row gutter={[20, 8]}>
                                            <Col xs={16} sm={16} md={12} lg xl={8}>
                                                <div className="overlayVende">
                                                    <h1>VENDE</h1>
                                                    <h2>Salones de reuniones y citas de negocios</h2>
                                                    <Row justify="center">
                                                        <Col span={4}><Button style={{ backgroundColor: '#52c41a', color: 'white' }}>Entrar</Button></Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                            <Col xs={16} sm={16} md={12} lg xl={8}>
                                                <div className="overlayConecta">
                                                    <h1>CONECTA</h1>
                                                    <h2>Networking y contactos</h2>
                                                    <Row justify="center">
                                                        <Col span={4}><Button style={{ backgroundColor: '#52c41a', color: 'white', marginTop: '40px' }}>Entrar</Button></Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                            <Col xs={16} sm={16} md={12} lg xl={8}>
                                                <div className="overlayInspira">
                                                    <h1>INSPIRA</h1>
                                                    <h2>Coferencias, contenido y conversatorios</h2>
                                                    <Row justify="center">
                                                        <Col span={4}><Button style={{ backgroundColor: '#52c41a', color: 'white' }}>Entrar</Button></Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
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
            </div>
        )
    }
}

export default withRouter(eventLanding)