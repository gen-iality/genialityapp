import React, { Component } from "react";
import { Comment, Avatar, Form, Button, List, Input, Card, Row, Col, Modal, Alert } from "antd";
import CreatePost from "./createPost"

class Wall extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }
  render() {
    const { currentCommet } = this.state;
    const { event } = this.props
    return (

      <div>
        {/*Crear un nuevo post*/}
        {!currentCommet && (
          <div>
            <Row
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}>
              <Col xs={24} sm={20} md={20} lg={20} xl={12}>
                <CreatePost event={event} />
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  }
}

export default Wall;