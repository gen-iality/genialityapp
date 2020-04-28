import React, { Component, Fragment } from "react"
import TimeStamp from "react-timestamp";
import CameraFeed from "./cameraFeed";
import * as Cookie from "js-cookie";
import ListWall from "./listWall"

//custom
import { AuthUrl } from "../../helpers/constants";
import { firestore } from "../../helpers/firebase";
import API from "../../helpers/request";
import { saveFirebase } from "./helpers";
import { Comment, Avatar, Form, Button, List, Input, Card, Row, Col, Modal, Alert } from "antd";
import { CloudUploadOutlined, MessageOutlined, CameraOutlined, LikeOutlined, SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div>
        <Form.Item>
            <TextArea placeholder="¿Qué está pasando?" rows={4} onChange={onChange} value={value} id="postText" />
        </Form.Item>

        <Form.Item>
            <Button id="submitPost" htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Enviar
          </Button>
        </Form.Item>
    </div>
);

class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar:
                "https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/avatar0.png?alt=media&token=26ace5bb-f91f-45ca-8461-3e579790f481",
            files: [],
            urlPost: "",
            comment: "",
            comments: "",
            counts: [],
            fileName: "",
            file: null,
            inputKey: Date.now(),
            keyImage: Date.now(),
            showInfo: false,
            keyList: Date.now(),
            imageSelfie: "",
            dataPost: [],
            dataPostFilter: [],

            idPostComment: [],
            dataUser: [],
            currentCommet: null,
            submitting: false,
            value: "",
            valueCommit: "",
            hidden: true,
            modal1Visible: false,
            selfieImage: "",
            modal2Visible: false,
            showInfo: false,
            loading: false,
            visible: false,
            user: false,
        }
        this.savePost = this.savePost.bind(this);
        this.previewImage = this.previewImage.bind(this);
        this.cancelImage = this.cancelImage.bind(this);
        this.stayForm = this.stayForm.bind(this);
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
                    this.setState({ dataUser: data, user: true });
                }
            } catch (error) {
                const { status } = error.response;
                console.log(status);
            }
        }
    }

    async savePost() {
        const image = document.getElementById("image").files[0];
        const selfieImage = document.getElementById("frontImage");
        const dataUser = this.state.dataUser;

        const text = document.getElementById("postText").value;
        const imageUrl = [];

        if (selfieImage && selfieImage.src.length > 100) {
            imageUrl.push(selfieImage.src);
            saveFirebase.savePostSelfie(imageUrl, text, dataUser.correo, this.props.event._id);
            this.cancelUploadImage();
        } else if (image) {
            let imageUrl = await saveFirebase.saveImage(this.props.event._id, image);
            saveFirebase.savePostImage(imageUrl, text, dataUser.correo, this.props.event._id);
            this.cancelImage();
        } else {
            console.log("dataUser", dataUser);
            //savepost se realiza para publicar el post sin imagen
            saveFirebase.savePost(text, dataUser.displayName, this.props.event._id);
        }

        this.setState({ value: "", showInfo: true, });

        setTimeout(() => {
            this.stayForm();
        }, 3000);
    }

    stayForm() {
        this.setState({
            value: "",
            showInfo: false,
            visible: false,

            keyList: Date.now()
        });
    }
    previewImage(event) {
        document.getElementById("previewImage").hidden = false;
        const selfieImage = document.getElementById("frontImage");
        this.setState({ selfieImage });

        //console.log(URL.createObjectURL(event.target.files[0]))

        this.setState({
            image: URL.createObjectURL(event.target.files[0]),
        });
    }

    uploadImage() {
        const formData = new FormData();
        formData.append("file", formData);
    }

    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible, keyImage: Date.now() });
        if (document.getElementById("divImage")) {
            document.getElementById("divImage").hidden = false;
        }
    }

    //Funcion para limpiar el input de la selfie y ocultar el componente card que muestra la selfie
    cancelUploadImage() {
        //console.log("Entré")
        document.getElementById("frontImage").src = "";
        document.getElementById("divImage").hidden = true;
    }
    //Funcion para limpiar el input de la imagen del archivo
    async cancelImage() {
        if (document.getElementById("imagePost")) {
            document.getElementById("imagePost").removeAttribute("src");
        }
        this.setState({
            file: null,
            inputKey: Date.now(),
        });
        if (document.getElementById("previewImage")) {
            document.getElementById("previewImage").hidden = true;
        }
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    };
    //Funciones para mostrar o cerrar el modal que contiene el formulario para guardar post
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { user, visible, hidden, image, submitting, value } = this.state;
        const { event } = this.props
        return (
            <Fragment>
                <Card size="small" title="Publicaciones" extra={<div></div>}>
                    {/* Se renueva el formulario de publicacion de post para poder mostrar el respectivo mensaje o modal */}
                    <div>
                        {// Si showInfo es falso muestra el modal, de lo contrario muestra el mensaje
                            this.state.showInfo === true ? (
                                <Alert message="Post Publicado en unos momentos observará su publicación" type="success" />
                            ) : (
                                    // Desde aqui empieza el formulario para guardar un post
                                    <div>
                                        {user && (
                                            <Button style={{ marginBottom: "3%" }} type="primary" onClick={this.showModal}>
                                                Crear Publicación
                                            </Button>
                                        )}

                                        {!user && (
                                            <Alert
                                                message={
                                                    <p>
                                                        <b>Para públicar:</b> Para públicar un mensaje debes estar autenticado, inicia sesión
                                                            para poder realizar publicaciones &nbsp;&nbsp;
                                                        <Button type="primary">
                                                            <a href={AuthUrl}>Ir a Ingreso</a>
                                                        </Button>
                                                    </p>
                                                }
                                                type="error"
                                            />
                                        )}

                                        <Modal
                                            visible={visible}
                                            title="Publicaciones"
                                            onOk={this.handleOk}
                                            onCancel={this.handleCancel}
                                            footer={[]}>
                                            <Row>
                                                <Col xs={24} sm={20} md={20} lg={20} xl={12}>
                                                    <Row>
                                                        {/* Boton para subir foto desde la galeria del dispositivo */}
                                                        <Button type="primary">
                                                            <input
                                                                key={this.state.inputKey}
                                                                class="file-input"
                                                                type="file"
                                                                id="image"
                                                                onChange={this.previewImage}
                                                            />
                                                            <span>Subir Foto</span>
                                                            <CloudUploadOutlined />
                                                        </Button>

                                                        {/* Boton para abrir la camara */}
                                                        <Button
                                                            style={{ marginLeft: "3%" }}
                                                            onClick={(e) => {
                                                                this.setState({ hidden: true }, this.setModal2Visible(true));
                                                            }}>
                                                            <CameraOutlined />
                                                        </Button>

                                                        {/* Modal para camara  */}

                                                        <div hidden={hidden} className="App">
                                                            {/* En esta modal se muestra la imagen de selfie */}
                                                            <Modal
                                                                id="Camera"
                                                                title="Camara"
                                                                centered
                                                                visible={this.state.modal2Visible}
                                                                onOk={(e) => {
                                                                    this.setState({ hidden: false }, this.setModal2Visible(false));
                                                                }}
                                                                onCancel={(e) => {
                                                                    this.setState({ hidden: false }, this.setModal2Visible(false));
                                                                }}
                                                                footer={[
                                                                    <Button
                                                                        key="submit"
                                                                        type="primary"
                                                                        onClick={(e) => {
                                                                            this.setState({ hidden: false }, this.setModal2Visible(false));
                                                                        }}>
                                                                        Cerrar / Publicar
                                                                    </Button>,
                                                                ]}>
                                                                <CameraFeed sendFile={this.uploadImage} />
                                                            </Modal>
                                                        </div>
                                                    </Row>
                                                    <Row>
                                                        {//Se valida si existe getImage y se valida si contiene mas de 100 caracteres para mostrar la selfie
                                                            document.getElementById("getImage") ? (
                                                                document.getElementById("getImage").src.length > 100 ? (
                                                                    <div id="divImage" style={{ marginTop: "2%" }}>
                                                                        <Card
                                                                            hoverable
                                                                            style={{ width: 240 }}
                                                                            cover={
                                                                                <img
                                                                                    id="frontImage"
                                                                                    key={this.state.keyImage}
                                                                                    src={document.getElementById("getImage").src}
                                                                                />
                                                                            }>
                                                                            <Button onClick={this.cancelUploadImage}>Cancelar</Button>
                                                                        </Card>
                                                                    </div>
                                                                ) : (
                                                                        <div />
                                                                    )
                                                            ) : (
                                                                    <div />
                                                                )}

                                                        {/* Se oculta este div para mostrar el archivo solamente cuando se suba el archivo */}
                                                        <div style={{ marginTop: "2%", marginLeft: "1%" }} id="previewImage" hidden>
                                                            <Card hoverable style={{ width: 240 }} cover={<img id="imagePost" src={image} />}>
                                                                <Button onClick={this.cancelImage}>Cancelar</Button>
                                                            </Card>
                                                        </div>
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
                                        </Modal>
                                    </div>
                                )
                            // aqui termina modal de publicacion de post
                        }
                    </div>
                    {/* Componente de listado de post y comentarios */}
                    <ListWall key={this.state.keyList} event={event} />
                </Card>
            </Fragment>
        )
    }
}

export default CreatePost