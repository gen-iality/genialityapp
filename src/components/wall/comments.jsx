import React, { Component, useEffect, useState, Fragment } from "react"
import { firestore } from "../../helpers/firebase";
import { Avatar, Button, message, Form, List, Card, Input, Row, Col, Spin, Alert, Popconfirm } from "antd";
import TimeStamp from "react-timestamp";
import { toast } from "react-toastify";
import { MessageOutlined, LikeOutlined, SendOutlined, DeleteOutlined } from "@ant-design/icons";
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
            dataPost: this.props.dataPost || undefined,
            dataComment: [],
            dataPostFilter: [],
            submitting: false,
            value: "",
            valueCommit: "",
            currentCommet: null,
            deleting: false,
            user: undefined,
        }
    }
    innerDeletePost = async (postId) => {

        await this.setState({ deleting: postId });
        var result = await this.props.deletePost(postId);
        await this.setState({ deleting: null });
        message.success("Publicación eliminada.")
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


    componentDidUpdate(prevProps) {
        if (prevProps.dataPost !== this.props.dataPost) {
            this.setState({ dataPost: this.props.dataPost });
        }

        if (prevProps.user !== this.props.user) {
            this.setState({ user: this.props.user });
        }
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
                    this.setState({ user: data });
                }
            } catch (error) {
                const { status } = error.response;
                console.log(status);
            }
        }
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

    gotoCommentList() {
        this.setState({ currentCommet: null });
    }

    render() {
        const { dataPost, submitting, valueCommit, currentCommet, dataComment, user } = this.state;
        return (
            <div className="">
                <a
                    className="has-text-black"
                    onClick={(e) => {
                        this.gotoCommentList();
                    }}>
                    <h3 className="has-text-black"> Regresar a la publicación</h3>
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
            </div>
        )
    }
}

export default WallList