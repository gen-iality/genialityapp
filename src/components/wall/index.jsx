import React, { Component } from "react";
import { Comment, Avatar, Form, Button, List, Input, Card, Row, Col, Modal, Alert } from "antd";
import CreatePost from "./createPost"
import ListWall from "./listWall"
import { firestore } from "../../helpers/firebase";
import { saveFirebase } from "./helpers";

import { toast } from "react-toastify";
import * as Cookie from "js-cookie";
import API from "../../helpers/request";

class Wall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPost: undefined,
      user: undefined
    };
  }


  async componentDidMount() {
    let posts = await this.getPosts();
    console.log("post", posts)
    this.setState({ dataPost: posts });

    let evius_token = Cookie.get("evius_token");

    if (!evius_token) {
      this.setState({ user: false });
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
        if (resp.status === 200) {
          const data = resp.data;
          // Solo se desea obtener el id del usuario
          this.setState({ user: data });
        }
      } catch (error) {
        const { status } = error.response;
        console.log(status);
      }
    };
  }

  addPosts = (post) => {
    this.setState({ dataPost: [post, ...this.state.dataPost] });
  }

  deletePost = async (postId) => {

    //window.confirm("Seguro deseas borrar esta publicación");
    //se borra en el API
    await saveFirebase.deletePost(postId, this.props.event._id)

    //se borra local
    var updatedPost = this.state.dataPost.filter(function (value, index, arr) { return value.id != postId; });
    this.setState({ dataPost: updatedPost });
    return true;

  }

  increaseLikes = async (postId) => {

    var updatedPost = await saveFirebase.increaseLikes(postId, this.props.event._id)

    //se borra local
    var updatedPost = this.state.dataPost.map(function (value, index, arr) { return (value.id != postId) ? value : updatedPost });
    this.setState({ dataPost: updatedPost });
    return true;

  }

  render() {
    const { currentCommet, user } = this.state;
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
                <ListWall user={user} key={this.state.keyList} dataPost={this.state.dataPost} deletePost={this.deletePost} increaseLikes={this.increaseLikes} />
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
        return dataPost;
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