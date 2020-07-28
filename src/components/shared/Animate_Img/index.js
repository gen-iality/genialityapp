import React, { Component } from 'react';
import { } from 'antd';
import './Index.css';

class AnimateImg extends React.Component {

	render() {
		return (
			<>
				<div className="container">
					<img src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/FONDO_AFUERA_FINAL.png?alt=media&token=29f90cd7-f6b8-4439-9027-7827262ecf55" />
					<Row justify="center">
						<Col span={2}><Button className="button">Entrar</Button></Col>
					</Row>
				</div>
			</>
		);
	}
}

export default AnimateImg;