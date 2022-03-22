import { Component, createRef } from 'react';
import CameraFeed from './cameraFeed';

//custom
import { AuthUrl } from '../../helpers/constants';
import { saveFirebase } from './helpers';
import { Comment, Form, Button, Input, Card, Row, Col, Modal, Alert, Space, Spin, Upload } from 'antd';
import { CloudUploadOutlined, CameraOutlined } from '@ant-design/icons';
import { message } from 'antd';
const { TextArea } = Input;
import withContext from '../../context/withContext';

const Editor = ({ onSubmit, submitting, value, loadingsave, errimage, errNote, refText }) => (
  <Form ref={refText} onFinish={onSubmit}>
    <Form.Item name='post'>
      <TextArea placeholder='¿Qué está pasando?' rows={4} />
    </Form.Item>
    {errimage && (
      <div style={{ marginBottom: 30 }}>
        <Alert type='error' message='Formato de archivo incorrecto!' />
      </div>
    )}
    {errNote && (
      <div style={{ marginBottom: 30 }}>
        <Alert type='error' message='Ingrese una texto válido o una imagen!' />
      </div>
    )}

    <Form.Item>
      {!loadingsave && (
        <Button
          id='submitPost'
          style={{ background: loadingsave ? 'white' : '#333F44' }}
          htmlType='submit'
          loading={submitting}
          type='primary'>
          Enviar
        </Button>
      )}

      {loadingsave && (
        <>
          <Spin /> <span style={{ color: '#333F44' }}>Por Favor espere...</span>
        </>
      )}
    </Form.Item>
  </Form>
);

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/avatar0.png?alt=media&token=26ace5bb-f91f-45ca-8461-3e579790f481',
      inputKey: Date.now(),
      keyImage: Date.now(),
      keyList: Date.now(),

      submitting: false,
      value: '',
      hidden: true,
      modal2Visible: false,
      showInfo: false,
      loading: false,
      visible: false,
      user: null,
      image: '',
      errimage: false,
      loadingsave: false,
      errNote: false,
    };
    this.savePost = this.savePost.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.cancelUploadImage = this.cancelUploadImage.bind(this);
    this.getImage = this.getImage.bind(this);
    this.formRef = createRef();
  }

  componentDidMount() {}

  cleanValue() {
    this.setState({ value: '' });
  }

  //Funcion para guardar el post y enviar el mensaje de publicacion
  async savePost(values) {
    if (values.post || this.state.image) {
      this.setState({
        loadingsave: true,
      });
      let data = {
        urlImage: this.state.image,
        post: values.post || '',
        author: this.props.cUser.value._id,
        datePost: new Date(),
        likes: 0,
        usersLikes: [],
        authorName: this.props.cUser.value.names
          ? this.props.cUser.value.names
          : this.props.cUser.value.name
          ? this.props.cUser.value.name
          : this.props.cUser.value.email,
        authorImage: this.props.cUser.value.picture || null,
      };

      //savepost se realiza para publicar el post
      var newPost = await saveFirebase.savePost(data, this.props.cEvent.value._id);
      if (newPost) {
        this.setState({ value: '', image: '' }, () =>
          this.setState({
            loadingsave: false,
            errNote: false,
            showInfo: false,
            visible: false,
            keyList: Date.now(),
          })
        );
        //this.setState({ showInfo: false, visible: false, keyList: Date.now(),value:'' });
        //RESET FORMULARIO
        this.formRef.current.resetFields();
        message.success('Mensaje Publicado');
      } else {
        message.error('Error al guardar');
      }

      //this.props.addPosts(newPost);
    } else {
      this.setState({ errNote: true });
    }
  }

  //Funcion para mostrar el archivo, se pasa a base64 para poder mostrarlo
  previewImage(event) {
    console.log(event);
    const permitFile = ['png', 'jpg', 'jpeg', 'gif'];
    //event.preventDefault();
    let file = event.fileList[0];
    let extension = file.name.split('.').pop();
    /* if (permitFile.indexOf(extension) > -1) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.setState({ image: reader.result, inputKey: Date.now(), errimage: false });
      };
    } else {
      this.setState({ errimage: true });
    } */
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onloadend = () => {
        this.setState({ image: reader.result, inputKey: Date.now(), errimage: false });
      };
    } else {
      this.setState({ errimage: true });
    }
  }

  //Funcion para poder pasarla por props y obtener la selfie de cameraFeed en este componente
  getImage(image) {
    this.setState({ image });
  }

  //Funcion para actualizar el canvas y poder tomar la foto
  uploadImage() {
    const formData = new FormData();
    formData.append('file', formData);
  }

  //Funcion para cerrar la modal
  setModal2Visible(modal2Visible) {
    this.setState({ modal2Visible, keyImage: Date.now() });
  }

  //Funcion para limpiar el input de la selfie y ocultar el componente card que muestra la selfie
  cancelUploadImage() {
    this.setState({ image: '' });
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
    this.setState({ visible: false, errimage: false });
  };

  render() {
    const { visible, hidden, image, submitting, value } = this.state;
    return (
      <div>
        <div>
          {this.props.cUser && (
            <Button style={{ marginBottom: '3%', marginTop: '3%' }} type='primary' onClick={this.showModal}>
              Crear Publicación
            </Button>
          )}

          {!this.props.cUser && (
            <Alert
              message={
                <p>
                  <b>Para públicar:</b> Para públicar un mensaje debes estar autenticado, inicia sesión para poder
                  realizar publicaciones &nbsp;&nbsp;
                  <Button type='primary'>
                    <a href={AuthUrl}>Ir a Ingreso</a>
                  </Button>
                </p>
              }
              type='error'
            />
          )}

          <Modal visible={visible} title='Publicaciones' onOk={this.handleOk} onCancel={this.handleCancel} footer={[]}>
            <Row>
              <Col style={{ textAlign: 'center' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                <Space>
                  {/* Boton para subir foto desde la galeria del dispositivo */}
                  <Upload
                    type='file'
                    accept='image/*'
                    multiple={false}
                    showUploadList={false}
                    onChange={(e) => this.previewImage(e)}>
                    <Button type='primary' icon={<CloudUploadOutlined />}>
                      Subir Foto
                    </Button>
                  </Upload>
                  {/* <Space className='file-label ant-btn ant-btn-primary'>
                    <input
                      key={this.state.inputKey}
                      style={{ width: 120 }}
                      className='file-input '
                      accept='image/*'
                      type='file'
                      onChange={this.previewImage}
                    />
                    <span style={{ paddingLeft: 2 }}>Subir Foto</span>
                    <span>
                      <CloudUploadOutlined />
                    </span>
                  </Space> */}

                  {/* Boton para abrir la camara */}
                  <Space>
                    <Button
                      style={{ marginLeft: '3%' }}
                      onClick={(e) => {
                        this.setState({ hidden: true }, this.setModal2Visible(true));
                      }}>
                      <CameraOutlined />
                    </Button>
                  </Space>
                  {/* Modal para camara  */}

                  <div hidden={hidden} className='App'>
                    {/* En esta modal se muestra la imagen de selfie */}
                    <Modal
                      title='Camara'
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
                          key='submit'
                          type='primary'
                          onClick={(e) => {
                            this.setState({ hidden: false }, this.setModal2Visible(false));
                          }}>
                          Listo usar esta
                        </Button>,
                      ]}>
                      <CameraFeed getImage={this.getImage} sendFile={this.uploadImage} />
                    </Modal>
                  </div>
                </Space>
                <div>
                  {image && (
                    <Card
                      hoverable
                      style={{ marginRight: 'auto', marginLeft: 'auto', width: '100%' }}
                      cover={<img key={this.state.keyImage} src={image} />}>
                      <Button onClick={this.cancelUploadImage}>Eliminar Foto</Button>
                    </Card>
                  )}
                </div>
              </Col>
            </Row>
            {/* Se importa el componente de textArea para agregar un comentario al post */}

            <Comment
              content={
                <Editor
                  refText={this.formRef}
                  onChange={this.handleChange}
                  onSubmit={this.savePost}
                  submitting={submitting}
                  value={value}
                  errNote={this.state.errNote}
                  errimage={this.state.errimage}
                  loadingsave={this.state.loadingsave}
                />
              }
            />
          </Modal>
        </div>
      </div>
    );
  }
}

let CreatePostWithContext = withContext(CreatePost);
export default CreatePostWithContext;
