import React, { Component, useEffect, useState, Fragment } from "react"
import { firestore } from "../../helpers/firebase";
import { Avatar, Button, Form, List, Card, Input, Row, Col } from "antd";
import TimeStamp from "react-timestamp";
import { toast } from "react-toastify";
import { MessageOutlined, LikeOutlined, SendOutlined } from "@ant-design/icons";
import { saveFirebase } from "./helpers";
import * as Cookie from "js-cookie";
import API from "../../helpers/request";

const { TextArea } = Input;
const EditorComment = ({ onChange, onSubmit, valueCommit }) => (
    <Form.Item>
        <Row
            style={{
                display: "flex",
                justifyContent: "center",
            }}>
            <Col span={21}>
                <TextArea
                    placeholder="Escribe un comentario..."
                    onChange={onChange}
                    valueCommit={valueCommit}
                    autoSize
                    id="comment"
                />
            </Col>
            <Button
                id="submitButton"
                htmlType="submit"
                type="link"
                onClick={onSubmit}
                style={{ color: "gray" }}
                icon={<SendOutlined />}
            />
        </Row>
    </Form.Item>
);

const IconText = ({ icon, text, onSubmit }) => (
    <Button htmlType="submit" type="link" onClick={onSubmit} style={{ color: "gray" }}>
        {React.createElement(icon, { style: { marginRight: 8, fontSize: "20px" } })}
        {text}
    </Button>
);

class WallList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            avatar: "https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/avatar0.png?alt=media&token=26ace5bb-f91f-45ca-8461-3e579790f481",
            dataPost: [],
            dataComment: [],
            dataPostFilter: [],
            submitting: false,
            value: "",
            valueCommit: "",
            currentCommet: null
        }
    }
    //Funcion para enviar al estado el dato de la caja de texto del comentario
    handleChangeCommit = (e) => {
        this.setState({
            valueCommit: e.target.value,
        });
    };

    // se obtienen los comentarios, Se realiza la muestra del modal y se envian los datos a dataComment del state
    async getComments(postId) {
        this.setState({ currentCommet: postId });

        const dataComment = [];

        let admincommentsRef = firestore
            .collection("adminPost")
            .doc(`${this.props.event._id}`)
            .collection("comment")
            .doc(`${postId}`)
            .collection("comments")
            .orderBy("date", "desc");
        let query = admincommentsRef
            .get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    //console.log('No hay ningun comentario');
                    this.setState({ dataComment: [] });
                    return;
                }

                snapshot.forEach((doc) => {
                    dataComment.push({
                        id: doc.id,
                        comment: doc.data().comment,
                        idPost: doc.data().idPost,
                        author: doc.data().author,
                        date: doc.data().date,
                    });
                    this.setState({ dataComment });
                });
            })
            .catch((err) => {
                console.log("Error getting documents", err);
            });
    }

    async componentDidMount() {
        let evius_token = Cookie.get("evius_token");

        if (!evius_token) {
            this.setState({ user: false });
        } else {
            try {
                const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
                if (resp.status === 200) {
                    const data = resp.data;
                    // Solo se desea obtener el id del usuario
                    this.setState({ dataUser: data });
                }
            } catch (error) {
                const { status } = error.response;
                console.log(status);
            }
        }
        this.getPost()
    }

    //Se salva el comentario, el proceso se encuentra en ./helpers.js
    async saveComment(idPost) {
        try {

            let email = this.state.dataUser.correo;
            let eventId = this.props.event._id;
            let comments = this.state.valueCommit;
            let fecha = new Date().toString();
            let date = fecha

            const data = saveFirebase.saveComment(email, comments, date, eventId, idPost);
            if (data) {
                document.getElementById("comment").value = "";
                this.getComments(idPost);
            }
        } catch (error) {
            toast.warning("Inicia sesion para poder realizar publicaciones")
        }
    }

    //Se obtienen los post para mapear los datos, no esta en ./helpers por motivo de que la promesa que retorna firebase no se logra pasar por return
    async getPost() {
        const dataPost = [];
        const dataPostFilter = [];

        let adminPostRef = firestore
            .collection("adminPost")
            .doc(`${this.props.event._id}`)
            .collection("posts")
            .orderBy("datePost", "desc");
        let query = adminPostRef
            .get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    toast.error("No hay ningun post");
                    return;
                }
                snapshot.forEach((doc) => {
                    dataPost.push({
                        id: doc.id,
                        author: doc.data().author,
                        urlImage: doc.data().urlImage,
                        post: doc.data().post,
                        datePost: doc.data().datePost,
                    });

                    dataPostFilter.push({
                        id: doc.id,
                        author: doc.data().author,
                        urlImage: doc.data().urlImage,
                        post: doc.data().post,
                        datePost: doc.data().datePost,
                    });

                    if (dataPost.length > 5) {
                        dataPost.length = 5;
                    }

                    this.setState({ dataPost, dataPostFilter });
                });
            })
            .catch((err) => {
                console.log("Error getting documents", err);
            });
    }

    gotoCommentList() {
        this.setState({ currentCommet: null });
    }

    render() {
        const { dataPost, submitting, valueCommit, currentCommet, dataComment } = this.state;
        return (
            <Fragment>
                {/*Inicia el detalle de los comentarios */}
                {currentCommet ? (
                    <div className="">
                        <a
                            className="has-text-black"
                            onClick={(e) => {
                                this.gotoCommentList();
                            }}>
                            <h3 className="has-text-black"> Regresar a los comentarios</h3>
                            <br />
                        </a>

                        {/* Se mapea la información de los comentario */}
                        <Row
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}>
                            <Col>
                                <Card style={{ display: "block", margin: "0 auto", textAlign: "left", padding: "0px 30px" }}>
                                    <List
                                        itemLayout="vertical"
                                        size="large"
                                        style={{ texteAling: "left" }}
                                        // Aqui se llama al array del state
                                        dataSource={dataComment}
                                        // Aqui se mapea al array del state
                                        renderItem={(item) => (
                                            <List.Item key={item.id}>
                                                <List.Item.Meta
                                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                    title={<span>{item.author}</span>}
                                                    description={<TimeStamp date={item.date} />}
                                                />

                                                {item.comment}
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        </Row>
                        {/*finaliza el detalle de los comentarios */}
                    </div>
                ) :
                    <div>
                        {/* Se mapean los datos que provienen de firebase del post  */}
                        <List
                            itemLayout="vertical"
                            size="small"
                            style={{ texteAling: "left", marginBottom: "20px" }}

                            // Aqui se llama al array del state
                            dataSource={dataPost}
                            // Aqui se mapea al array del state
                            renderItem={(item) => (
                                <Card style={{ marginBottom: "20px" }}>
                                    <List.Item
                                        key={item.id}
                                        style={{ padding: "0px" }}
                                        // Se importa el boton de like y el de redireccionamiento al detalle del post
                                        actions={[
                                            <IconText icon={LikeOutlined} text="0" key="list-vertical-like-o" />,
                                            <IconText
                                                icon={MessageOutlined}
                                                key="list-vertical-message"
                                                text=""
                                                onSubmit={(e) => {
                                                    this.getComments(item.id);
                                                }}
                                            />,
                                        ]}>
                                        <List.Item.Meta
                                            avatar={
                                                item.avatar ? (
                                                    <Avatar src={item.avatar} />
                                                ) : (
                                                        <Avatar>{item.author.charAt(0).toUpperCase()}</Avatar>
                                                    )
                                            }
                                            title={<span>{item.author}</span>}
                                            description={
                                                <span style={{ fontSize: "12px" }}>
                                                    <TimeStamp date={item.datePost.seconds} />
                                                </span>
                                            }
                                        />

                                        <br />
                                        {item.post}
                                        <br />
                                        <br />
                                        {item.urlImage ? (
                                            <img
                                                width={"100%"}
                                                style={{
                                                    display: "block",
                                                    margin: "0 auto",
                                                }}
                                                alt="logo"
                                                src={item.urlImage}
                                            />
                                        ) : null}
                                        <br />
                                        <EditorComment
                                            onChange={this.handleChangeCommit}
                                            onSubmit={(e) => {
                                                this.saveComment(item.id);
                                            }}
                                            submitting={submitting}
                                            valueCommit={valueCommit}
                                        />
                                    </List.Item>
                                </Card>
                            )}
                        />
                        <Button id="click" onClick={this.loadMore}>
                            Load More
                        </Button>
                    </div>
                }
            </Fragment>
        )
    }
}

export default WallList