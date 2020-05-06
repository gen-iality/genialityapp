import React, { Component } from "react";
import { Comment, Avatar, Form, Button, List, Input, Card, Row, Col, Modal, Alert } from "antd";
import CreatePost from "./createPost"
import ListWall from "./listWall"
import { firestore } from "../../helpers/firebase";
import { toast } from "react-toastify";

class Wall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPost: undefined
    };
  }


  async componentDidMount() {
    let posts = await this.getPosts();
    this.setState({ dataPost: posts });
  };

  addPosts = (post) => {
    this.setState({ dataPost: [post, ...this.state.dataPost] });
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
                <CreatePost event={event} addPosts={this.addPosts} />
                <ListWall key={this.state.keyList} dataPost={this.state.dataPost} />
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  }

  //Se obtienen los post para mapear los datos, no esta en ./helpers por motivo de que la promesa que retorna firebase no se logra pasar por return
  async getPosts() {
    const dataPost = [];

    try {
      let adminPostRef = firestore.collection("adminPost").doc(this.props.event._id).collection("posts").orderBy("datePost", "desc");
      let snapshot = await adminPostRef.get()

      if (snapshot.empty) {
        toast.error("No hay ningun post");
        return;
      }

      snapshot.forEach((doc) => {
        var data = doc.data();
        data.id = doc.id;

        dataPost.push(data);
      });

      return dataPost;

    } catch (e) {
      console.log("Error getting documents", e);
    }
  }
}

export default Wall;