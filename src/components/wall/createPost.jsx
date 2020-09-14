import React, { Component } from "react"
import CameraFeed from "./cameraFeed";
import * as Cookie from "js-cookie";

//custom
import { AuthUrl } from "../../helpers/constants";
import API from "../../helpers/request";
import { saveFirebase } from "./helpers";
import { Comment, Form, Button, Input, Card, Row, Col, Modal, Alert } from "antd";
import { CloudUploadOutlined,  CameraOutlined } from "@ant-design/icons";
import { message } from 'antd';
const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div>
        <Form.Item>
            <TextArea placeholder="¿Qué está pasando?" rows={4} onChange={onChange} value={value} />
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
            inputKey: Date.now(),
            keyImage: Date.now(),
            keyList: Date.now(),
            user: undefined,
            submitting: false,
            value: "",
            hidden: true,
            modal2Visible: false,
            showInfo: false,
            loading: false,
            visible: false,
            user: false,
            image: ""
        }
        this.savePost = this.savePost.bind(this);
        this.previewImage = this.previewImage.bind(this);
        this.cancelUploadImage = this.cancelUploadImage.bind(this);
        this.getImage = this.getImage.bind(this);
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
    //Funcion para guardar el post y enviar el mensaje de publicacion
    async savePost() {
        let data = {
            urlImage: this.state.image,
            post: this.state.value,
            author: this.state.user._id,
            datePost: new Date(),
        }


        //savepost se realiza para publicar el post
        var newPost = await saveFirebase.savePost(data, this.props.event._id);

        this.setState({ value: "", image: "", showInfo: true, });
        this.setState({ showInfo: false, visible: false, keyList: Date.now() });
        message.success('Mensaje Publicado');
        this.props.addPosts(newPost);

    }

    //Funcion para mostrar el archivo, se pasa a base64 para poder mostrarlo
    previewImage(event) {
        event.preventDefault();
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.setState({ image: reader.result, inputKey: Date.now() });
        };
    }

    //Funcion para poder pasarla por props y obtener la selfie de cameraFeed en este componente
    getImage(image) {
        this.setState({ image })
    }

    //Funcion para actualizar el canvas y poder tomar la foto
    uploadImage() {
        const formData = new FormData();
        formData.append("file", formData);
    }

    //Funcion para cerrar la modal
    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible, keyImage: Date.now() });
    }

    //Funcion para limpiar el input de la selfie y ocultar el componente card que muestra la selfie
    cancelUploadImage() {
        this.setState({ image: "" })
    }

    //Funcion para enviar al estado el comentario del post
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

    //Funcion para cerrar el modal de publicacion en caso de no realizar ninguna publicación
    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };

    //Funcion para cerrar el modal de publicacion en caso de no realizar ninguna publicación
    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { user, visible, hidden, image, submitting, value } = this.state;        
        return (


            <div>
                {/* Se renueva el formulario de publicacion de post para poder mostrar el respectivo mensaje o modal */}
                {// Si showInfo es falso muestra el modal, de lo contrario muestra el mensaje this.state.showInfo === true ? (
                }

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
                            <Col style={{ textAlign: "center" }} xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div>
                                    {/* Boton para subir foto desde la galeria del dispositivo */}
                                    <Button type="primary">
                                        <input
                                            key={this.state.inputKey}
                                            className="file-input"
                                            type="file"
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
                                                    Listo usar esta
                                                </Button>,
                                            ]}>
                                            <CameraFeed getImage={this.getImage} sendFile={this.uploadImage} />
                                        </Modal>
                                    </div>
                                </div>
                                <div>
                                    {
                                        image &&
                                        <Card
                                            hoverable
                                            style={{ marginRight: "auto", marginLeft: "auto", width: "100%" }}
                                            cover={
                                                <img
                                                    key={this.state.keyImage}
                                                    src={image}
                                                />
                                            }>
                                            <Button onClick={this.cancelUploadImage}>Eliminar Foto</Button>
                                        </Card>

                                    }
                                </div>
                            </Col>
                        </Row>
                        {/* Se importa el componente de textArea para agregar un comentario al post */}

                        <Comment
                            content={
                                <Editor
                                    onChange={this.handleChange}
                                    onSubmit={this.savePost}
                                    submitting={submitting}
                                    value={value}
                                />
                            }
                        />
                    </Modal>
                </div>


            </div>

        )
    }
}

export default CreatePost