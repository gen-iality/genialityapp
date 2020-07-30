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
        this.setState({ eventId: this.props.eventId, event: this.props.event })
    }

    render() {
        const { eventId, event } = this.state
        const { showLanding } = this.props
        return (
            <>
                {event.loader_page === "code" && (
                    <div className="container_imgLoading">
                        <div dangerouslySetInnerHTML={{ __html: event.data_loader_page }} />
                        <Row justify="center">
                            <Col>
                                <Button onClick={showLanding} className="button">Entrar</Button>
                            </Col>
                        </Row>
                    </div>
                )}
                {event.loader_page === "text" && (
                    <div className="container_imgLoading" >
                        <ReactPlayer
                            width="100%"
                            height="100%"
                            url={event.data_loader_page}
                            playing="true"
                        />
                        <Row justify="center">
<<<<<<< HEAD
                            <Col justify="center">
                                <Link to={`/landing/${eventId}`}>
                                    <Button className="button">Entrar</Button>
                                </Link>
=======
                            <Col>
                                <Button className="button" onClick={showLanding}>Entrar</Button>
>>>>>>> fd10c0b71c72618e1373d651934b9ef4a2ebf825
                            </Col>
                        </Row>
                    </div>
                )}
            </>
        );
    }
}

export default AnimateImg;