import React, { Component } from 'react';
import { Link } from "react-router-dom"
import { Col, Row, Button } from 'antd';
import ReactPlayer from 'react-player'
import './index.scss';

class AnimateImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: "",
            event: {}
        }
    }

    componentDidMount() {
        console.log(this.props)
        this.setState({ eventId: this.props.location.state.eventId, event: this.props.location.state.event })
    }

    render() {
        const { eventId, event } = this.state
        return (
            <>
                {event.loader_page === "code" && (
                    <div className="container_imgLoading">
                        <div dangerouslySetInnerHTML={{ __html: event.data_loader_page }} />
                        <Row justify="center">
                            <Col>
                                <Link to={`/landing/${eventId}`}>
                                    <Button className="button">Entrar</Button>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                )}
                {event.loader_page === "text" && (
                    <div className="container_imgLoading" >
                        <ReactPlayer
                            width="100%"
                            height="100%"
                            url={'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/WhatsApp%20Video%202020-07-29%20at%204.52.29%20PM.mp4?alt=media&token=f95f2492-20a8-4cb3-a199-aa094381fc4f'}
                            playing="true"
                        />

                        <Row justify="center">
                            <Col>
                                <Link to={`/landing/${eventId}`}>
                                    <Button className="button">Entrar</Button>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                )}
            </>
        );
    }
}

export default AnimateImg;