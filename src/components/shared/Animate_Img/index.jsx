import React, { Component } from 'react';
import { Link } from "react-router-dom"
import { Col, Row, Button } from 'antd';
import './index';

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
					<div className="container">
						<div dangerouslySetInnerHTML={{ __html: event.data_loader_page }} />
						<Row justify="center">
							<Col span={2}>
								<Link to={`/landing/${eventId}`}>
									<Button className="button">Entrar</Button>
								</Link>
							</Col>
						</Row>
					</div>
				)}
				{event.loader_page === "text" && (
					<div className="container" >
						<iframe
							width="100%"
							height="100%"
							src={`https://www.youtube.com/embed/${event.data_loader_page}`}
							frameborder="0"
							allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						>
						</iframe>
						<Row justify="center">
							<Col span={2}>
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