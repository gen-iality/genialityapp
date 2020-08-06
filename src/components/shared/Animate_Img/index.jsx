import React, { Component } from 'react';
import { Link } from "react-router-dom"
import { Col, Row, Button } from 'antd';
import {PlayCircleOutlined} from '@ant-design/icons'
import ReactPlayer from 'react-player'
import './index.scss';

class AnimateImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: "",
            event: {},
            autoplay: false
        }
    }

    componentDidMount() {
        console.log(this.props)
        this.setState({ eventId: this.props.eventId, event: this.props.event })
    }

    render() {
        const { eventId, event, autoplay } = this.state
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
                            playing={autoplay}
                        />
                        <Row justify="center">
                            <Col span={4}>
                                <Button className="button" onClick={showLanding}>Entrar</Button>
                            </Col>
                            <Col span={4}>
                                <PlayCircleOutlined className="button" onClick={()=>this.setState({autoplay:true})}/>
                            </Col>
                        </Row>                        
                    </div>
                )}
            </>
        );
    }
}

export default AnimateImg;