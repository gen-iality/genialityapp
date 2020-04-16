import React, { Component, useRef, useState } from "react";
import FileBase64 from 'react-file-base64';
import { toast } from "react-toastify";
import firebase from 'firebase';
import TimeStamp from "react-timestamp";
import CameraFeed from './cameraFeed';
import $ from "jquery"

//custom
import { firestore } from "../../helpers/firebase";
import { saveFirebase } from "./helpers"
import { Comment, Avatar, Form, Button, List, Input, Card, Row, Col, Modal } from 'antd';
import {
    CloudUploadOutlined,
    MessageOutlined,
    CameraOutlined,
    LikeOutlined,
    SendOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div>
        <Form.Item>
            <TextArea
                placeholder="¿Qué está pasando?"
                rows={4}
                onChange={onChange}
                value={value}
                id="postText"
            />
        </Form.Item>

        <Form.Item>
            <Button
                id="submitPost"
                htmlType="submit"
                loading={submitting}
                onClick={onSubmit}
                type="primary">
                Enviar
        </Button>
        </Form.Item>
    </div>
);


const EditorComment = ({ onChange, onSubmit, submitting, valueCommit, icon }) => (
    <Form.Item>
        <Row
            style={{
                display: "flex",
                justifyContent: "center"
            }}
        >
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
    <Button
        htmlType="submit"
        type="link"
        onClick={onSubmit}
        style={{ color: "gray" }}
    >

        {React.createElement(icon, { style: { marginRight: 8, fontSize: "20px" } })}
        {text}
    </Button>
);


class Wall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: "https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/avatar0.png?alt=media&token=26ace5bb-f91f-45ca-8461-3e579790f481",
            files: [],
            urlPost: "",
            comment: "",
            comments: "",
            counts: [],
            fileName: "",
            file: null,
            inputKey: Date.now(),
            keyImage: Date.now(),
            imageSelfie: "",
            dataPost: [],
            dataPostFilter: [],
            dataComment: [],
            idPostComment: [],
            currentCommet: null,
            submitting: false,
            value: '',
            valueCommit: '',
            hidden: true,
            modal1Visible: false,
            selfieImage: "",
            modal2Visible: false,
        }
        this.savePost = this.savePost.bind(this)
        this.cancelUpload = this.cancelUpload.bind(this)
        this.previewImage = this.previewImage.bind(this)
        this.loadMore = this.loadMore.bind(this)
        this.cancelImage = this.cancelImage.bind(this)
    }

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    handleChangeCommit = e => {
        this.setState({
            valueCommit: e.target.value,
        });
    };



    //Se monta el componente getPost antes
    componentDidMount = async () => {
        this.getPost()
    }

    // se obtienen los comentarios, Se realiza la muestra del modal y se envian los datos a dataComment del state
    async getComments(postId) {

        this.setState({ currentCommet: postId });

        const dataComment = [];

        let admincommentsRef = firestore.collection('adminPost').doc(`${this.props.event._id}`).collection('comment').doc(`${postId}`).collection('comments').orderBy('date', 'desc')
        let query = admincommentsRef.get().then(snapshot => {
            if (snapshot.empty) {
                //console.log('No hay ningun comentario');
                this.setState({ dataComment: [] })
                return;
            }

            snapshot.forEach(doc => {
                dataComment.push({
                    id: doc.id,
                    comment: doc.data().comment,
                    idPost: doc.data().idPost,
                    author: doc.data().author,
                    date: doc.data().date
                })
                this.setState({ dataComment })
            });
        }).catch(err => {
            console.log('Error getting documents', err);
        });
    }

    gotoCommentList() {
        this.setState({ currentCommet: null });
    }

    //Se obtienen los post para mapear los datos, no esta en ./helpers por motivo de que la promesa que retorna firebase no se logra pasar por return
    async getPost() {
        const dataPost = [];
        const dataPostFilter = [];

        let adminPostRef = firestore.collection('adminPost').doc(`${this.props.event._id}`).collection('posts').orderBy('datePost', 'desc')
        let query = adminPostRef.get().then(snapshot => {
            if (snapshot.empty) {
                toast.error('No hay ningun post');
                return;
            }
            snapshot.forEach(doc => {
                dataPost.push({
                    id: doc.id,
                    author: doc.data().author,
                    urlImage: doc.data().urlImage,
                    post: doc.data().post,
                    datePost: doc.data().datePost
                })

                dataPostFilter.push({
                    id: doc.id,
                    author: doc.data().author,
                    urlImage: doc.data().urlImage,
                    post: doc.data().post,
                    datePost: doc.data().datePost
                })

                if (dataPost.length > 5) {
                    dataPost.length = 5
                }

                this.setState({ dataPost, dataPostFilter })
            });
        }).catch(err => {
            console.log('Error getting documents', err);
        });
    }

    //Funcion para guardar el post, Se recoge la informacion y se envia a ./helpers, se valida si trae imagen o no
    async savePost() {
        const image = document.getElementById("image").files[0]
        const selfieImage = document.getElementById("frontImage")

        if (selfieImage && selfieImage.src.length > 100) {

            const imageUrl = []
            imageUrl.push(selfieImage.src);
            const text = document.getElementById("postText").value
            saveFirebase.savePostSelfie(imageUrl, text, this.props.event.author.email, this.props.event._id)
            this.setState({
                value: ''
            })
            this.cancelUploadImage()
            this.getPost()
        } else if (image) {
            // let imageUrl = this.saveImage(image)
            let imageUrl = saveFirebase.saveImage(this.props.event._id, image)
            //console.log("Datos de imagen obtenidos")
            const text = document.getElementById("postText").value
            //savePostImage se realiza para publicar el post con imagen
            saveFirebase.savePostImage(imageUrl, text, this.props.event.author.email, this.props.event._id)
            this.setState({
                value: ''
            })
            this.cancelImage()
            this.getPost()

        } else {
            const text = document.getElementById("postText").value
            //savepost se realiza para publicar el post sin imagen
            saveFirebase.savePost(text, this.props.event.author.email, this.props.event._id)
            this.setState({
                value: ''
            })
            this.getPost()
        }
    }

    //Se salva el comentario, el proceso se encuentra en ./helpers.js 
    async saveComment(idPost) {
        let email = this.props.event.author.email
        let eventId = this.props.event._id
        let comments = this.state.valueCommit
        let fecha = new Date().toString()
        let date = fecha
        const data = saveFirebase.saveComment(email, comments, date, eventId, idPost)
        if (data) {
            document.getElementById("comment").value = ""
            //console.log(this.state.valueCommit)
            this.getComments(idPost)
        }
    }

    //Funcion para limpiar el files e image los cuales muestran el preview de la imagen
    cancelUpload() {
        this.setState({ files: [], image: [] })
    }

    //Funcion para observar la imagen antes de publicarla
    previewImage(event) {
        document.getElementById("previewImage").hidden = false
        const selfieImage = document.getElementById("frontImage")
        this.setState({ selfieImage })

        //console.log(URL.createObjectURL(event.target.files[0]))

        this.setState({
            image: URL.createObjectURL(event.target.files[0])
        })
    }

    //Funcion para eliminar post
    async deletePost(postId) {
        saveFirebase.deletePost(postId, this.props.event._id)
        this.getPost()
    }

    async loadMore() {
        let count = 0
        let button = document.getElementById("click")

        let counts = []
        let dataPostArray = []
        dataPostArray.push(this.state.dataPostFilter)


        button.addEventListener('click', () => {
            let push = count++
            counts.push(push)

            let total = 6 + counts.length

            if (this.state.dataPostFilter) {
                this.state.dataPostFilter.length = total
                //console.log("Data", this.state.dataPostFilter)
            }
        });
    }

    uploadImage() {
        const formData = new FormData();
        formData.append('file', formData);
    };


    // Funciones para abrir y cerrar modal

    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible, keyImage: Date.now() });
        if (document.getElementById("divImage")) {
            document.getElementById("divImage").hidden = false
        }

    }

    cancelUploadImage() {
        //console.log("Entré")
        document.getElementById("frontImage").src = ''
        document.getElementById("divImage").hidden = true
    }

    async cancelImage() {
        document.getElementById('imagePost').removeAttribute('src');
        this.setState({
            file: null,
            inputKey: Date.now()
        });
        //console.log(document.getElementById("imagePost").src)
        document.getElementById("previewImage").hidden = true
    }
    render() {
        const { dataPost, imageSelfie, dataComment, hidden, texto, image, comments, submitting, value, avatar, currentCommet, valueCommit } = this.state
        return (
            <div>
                {/*Inicia el detalle de los comentarios */}

                {/*Inicia el detalle de los comentarios */}
                {currentCommet && (
                    <div className="">
                        <a
                            className="has-text-white"
                            onClick={e => {
                                this.gotoCommentList();
                            }}
                        >
                            <h3 className="has-text-white"> Regresar a los comentarios</h3>
                            <br />
                        </a>

                        {/* Se mapea la información de los comentario */}
                        <Row
                            style={{
                                display: "flex",
                                justifyContent: "center"
                            }}
                        >
                            <Col xs={24} sm={20} md={20} lg={20} xl={12} >
                                <Card style={{ display: "block", margin: "0 auto", textAlign: "left", padding: "0px 30px" }}>
                                    <List
                                        itemLayout="vertical"
                                        size="large"
                                        style={{ texteAling: "left" }}
                                        // pagination={{
                                        //     onChange: page => {
                                        //         console.log(page);
                                        //     },
                                        //     pageSize: 3,
                                        // }}

                                        // Aqui se llama al array del state 
                                        dataSource={dataComment}


                                        // Aqui se mapea al array del state 
                                        renderItem={item => (

                                            <List.Item
                                                key={item.id}


                                            >
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
                )}

                {/*finaliza el detalle de los comentarios */}



                {/*Inicia la lista de los comentarios */}
                {!currentCommet && (
                    <div>

                        <Row
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "20px"
                            }}
                        >

                            <Col xs={24} sm={20} md={20} lg={20} xl={12}>

                                <Card size="small" title="Crear publicación" extra={<div></div>}>

                                    {/* Se valida si hay imagen para mostrar o no */}

                                    <Row >
                                        <Col xs={24} sm={20} md={20} lg={20} xl={12}>
                                            <Row>
                                                {/* Boton para subir foto desde la galeria del dispositivo */}
                                                <Button type="primary">
                                                    <input key={this.state.inputKey} class="file-input" type="file" id="image" onChange={this.previewImage} />
                                                    <span>Subir Foto</span>
                                                    <CloudUploadOutlined />
                                                </Button>

                                                {/* Boton para abrir la camara */}
                                                <Button style={{ marginLeft: "3%" }} onClick={e => { this.setState({ hidden: true }, this.setModal2Visible(true)) }}><CameraOutlined /></Button>

                                                {/* Modal para camara  */}

                                                <div hidden={hidden} className="App">
                                                    <Modal
                                                        title="Camara"
                                                        centered
                                                        visible={this.state.modal2Visible}
                                                        onOk={e => { this.setState({ hidden: false }, this.setModal2Visible(false)) }}
                                                        onCancel={e => { this.setState({ hidden: false }, this.setModal2Visible(false)) }}
                                                    >
                                                        <CameraFeed sendFile={this.uploadImage} />

                                                    </Modal>
                                                </div>
                                            </Row>
                                            <Row>
                                                {
                                                    document.getElementById("getImage") ?
                                                        <div id="divImage" style={{ marginTop: "2%" }}>
                                                            <Card
                                                                hoverable
                                                                style={{ width: 240 }}
                                                                cover={<img id="frontImage" key={this.state.keyImage} src={document.getElementById("getImage").src} />}
                                                            >
                                                                <Button onClick={this.cancelUploadImage}>Cancelar</Button>
                                                            </Card>,
                                                        </div>
                                                        :
                                                        <div id="previewImage" hidden>
                                                            <Card
                                                                hoverable
                                                                style={{ width: 240 }}
                                                                cover={<img id="imagePost" src={image} />}
                                                            >
                                                                <Button onClick={this.cancelImage}>Cancelar</Button>
                                                            </Card>,
                                                        </div>
                                                }
                                            </Row>
                                        </Col>
                                    </Row>
                                    {/* Se importa el componente de textArea para agregar un comentario al post */}

                                    <Comment
                                        content={
                                            <Editor
                                                id="comment"
                                                onChange={this.handleChange}
                                                onSubmit={this.savePost}
                                                submitting={submitting}
                                                value={value}
                                            />
                                        }
                                    />

                                </Card>
                            </Col>
                        </Row>

                        {/* Se mapean los datos que provienen de firebase del post */}
                        <Row
                            style={{
                                display: "flex",
                                justifyContent: "center"
                            }}
                        >
                            <Col xs={24} sm={20} md={20} lg={20} xl={12} style={{ display: "block", margin: "0 auto", textAlign: "left" }}>


                                <List
                                    itemLayout="vertical"
                                    size="small"
                                    style={{ texteAling: "left", marginBottom: "20px" }}
                                    // pagination={{
                                    //     onChange: page => {
                                    //         console.log(page);
                                    //     },
                                    //     pageSize: 3,
                                    // }}

                                    // Aqui se llama al array del state 
                                    dataSource={dataPost}

                                    // Aqui se mapea al array del state 
                                    renderItem={item => (

                                        <Card
                                            style={{ marginBottom: "20px" }}
                                        >
                                            <List.Item
                                                key={item.id}
                                                style={{ padding: "0px" }}
                                                // Se importa el boton de like y el de redireccionamiento al detalle del post
                                                actions={[
                                                    <IconText
                                                        icon={LikeOutlined}
                                                        text="0"
                                                        key="list-vertical-like-o"
                                                    />,
                                                    <IconText
                                                        icon={MessageOutlined}
                                                        key="list-vertical-message"
                                                        onSubmit={e => { this.getComments(item.id) }}
                                                    />
                                                ]}

                                            >

                                                <List.Item.Meta
                                                    avatar={
                                                        item.avatar ?
                                                            <Avatar src={item.avatar} /> :
                                                            <Avatar>{item.author.charAt(0).toUpperCase()}</Avatar>

                                                    }
                                                    title={<span>{item.author}</span>}
                                                    description={
                                                        <span style={{ fontSize: "12px" }}><TimeStamp date={item.datePost.seconds} /></span>
                                                    }
                                                />

                                                <br />
                                                {item.post}
                                                <br />
                                                <br />
                                                {
                                                    item.urlImage ?
                                                        <img
                                                            width={"100%"}
                                                            style={{
                                                                display: "block",
                                                                margin: "0 auto",
                                                            }}
                                                            alt="logo"
                                                            src={item.urlImage}
                                                        /> : null
                                                }
                                                <br />
                                                <EditorComment
                                                    onChange={this.handleChangeCommit}
                                                    onSubmit={e => { this.saveComment(item.id) }}
                                                    submitting={submitting}
                                                    valueCommit={valueCommit}
                                                />
                                            </List.Item>
                                        </Card>
                                    )}
                                />
                                <Button id="click" onClick={this.loadMore}>loading more</Button>
                            </Col>
                        </Row>

                    </div>
                )}
                {/*Finaliza la lista de los comentarios */}
            </div>
        )
    }
}

export default Wall