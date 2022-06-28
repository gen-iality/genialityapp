import { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { DocumentsApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { Form, Row, Col, Input, Modal, Upload, Button, Checkbox, Spin, Progress } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import { fireStorage } from '@/helpers/firebase';
import Header from '../../antdComponents/Header';
import moment from 'moment';
import { DispatchMessageService } from '../../context/MessageService';

const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Document = (props) => {
  const locationState = props.location.state;
  const history = useHistory();
  const [document, setDocument] = useState({});
  const [documentList, setDocumentList] = useState([]);
  let [files, setFiles] = useState('');
  let [fileName, setFileName] = useState('');
  let [extention, setExtention] = useState('');
  const [folder, setFolder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [fromEditing, setFromEditing] = useState(false);

  useEffect(() => {
    if (locationState?.edit) {
      getDocument();
    }
  }, []);

  const getDocument = async () => {
    const response = await DocumentsApi.getOne(locationState.edit, props.event._id);
    setDocument(response);
    setFolder(response.folder);
    setFiles([response.file]);
    setDocumentList(response.documentList);
    setLoading(false);
    setFromEditing(true);
  };

  const onSubmit = async () => {
    setLoading(true);
    if (folder) {
      setDocument({ ...document, type: 'folder', folder });
    }

    if (!document.title) {
      DispatchMessageService({
        type: 'error',
        msj: 'El título es requerido',
        action: 'show',
      });
    } else if (!files && document.type !== 'folder') {
      DispatchMessageService({
        type: 'error',
        msj: 'El archivo es requerido',
        action: 'show',
      });
    } else {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: ' Por favor espere mientras se guarda la información...',
        action: 'show',
      });

      try {
        if (locationState.edit) {
          await DocumentsApi.editOne(
            !folder ? document : { title: document.title, type: 'folder', folder },
            locationState.edit,
            props.event._id
          );
        } else {
          await DocumentsApi.create(
            !folder ? document : { title: document.title, type: 'folder', folder },
            props.event._id
          );
        }

        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: 'Información guardada correctamente!',
          action: 'show',
        });
        history.push(`${props.matchUrl}`);
        setLoading(false);
      } catch (e) {
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: handleRequestError(e).message,
          action: 'show',
        });
      }
    }
  };

  const remove = () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se borra la información...',
      action: 'show',
    });
    if (locationState.edit) {
      confirm({
        title: `¿Está seguro de eliminar la información?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              /* if(document.type === 'folder') {
                const files = await DocumentsApi.getFiles(props.event._id, locationState.edit);

                files.data.forEach((element) => {
                  const ref = firebase.storage().ref(`documents/${props.event._id}/`);
                  var desertRef = ref.child(`${element.name}`);

                  //Delete the file
                  desertRef
                    .delete()
                    .then(function() {
                      //El dato se elimina aqui
                    })
                    .catch(function() {
                      //Si no muestra el error
                    });
                });
              } */
              await DocumentsApi.deleteOne(locationState.edit, props.event._id);
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
              history.push(`${props.matchUrl}`);
            } catch (e) {
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'error',
                msj: handleRequestError(e).message,
                action: 'show',
              });
            }
          };
          onHandlerRemove();
        },
      });
    }
  };

  const handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    setDocument({
      ...document,
      [name]: value,
    });
  };

  const onHandlerFile = async (e) => {
    /* console.log(e.file.originFileObj); */
    setLoading(true);
    setDocumentList(e.fileList);

    const ref = fireStorage.ref();
    setFiles(e.file.originFileObj);

    //Se crea el nombre con base a la fecha y nombre del archivo
    const name = moment().format('YYYY-DD-MM') + '-' + files.name;
    setFileName(name);
    //Se extrae la extencion del archivo por necesidad del aplicativo

    setExtention(name.split('.').pop());

    /* this.setState({ fileName: name }); */
    /* console.log(fileName, name); */
    let uploadTaskRef = ref.child(`documents/${props.event._id}/${name}`).put(files);
    /* setUploadTask(uploadTaskRef); */
    /* console.log(uploadTaskRef); */
    //Se envia a firebase y se pasa la validacion para poder saber el estado del documento

    uploadTaskRef.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setLoadPercentage(progress);
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        succesUploadFile(uploadTaskRef);
      }
    );
  };

  const succesUploadFile = async (uploadTaskRef) => {
    let file;
    try {
      await uploadTaskRef.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        file = downloadURL;
        console.log(downloadURL);
        setLoading(false);
      });
      setDocument({
        ...document,
        format: extention,
        title: fileName,
        name: fileName,
        file: file,
        type: 'file',
        documentList: documentList,
      });
    } catch (e) {
      setLoading(true);
    }
  };

  /* const createFolder = async () => {
    let value = document.getElementById('folderName').value;

    const data = {
      type: 'folder',
      title: value,
    };
    await DocumentsApi.create(this.props.event._id, data);
    this.getDocuments();
    this.setState({
      visible: false,
    });
  }; */

  const reload = () => {
    history.go(0);
  };

  return (
    <Form onFinish={onSubmit} {...formLayout}>
      <Header
        title={'Documento'}
        back
        save={(loadPercentage > 0 && true) || fromEditing}
        form
        remove={remove}
        edit={locationState?.edit}
        loadingSave={loading}
      />

      <Spin
        spinning={loading}
        tip={
          <>
            Por favor espere mientras cargue... <br />
            Si el problema persiste, favor de recargar <br />
            <Button type='primary' icon={<ReloadOutlined />} onClick={() => reload()}>
              Recargar
            </Button>
          </>
        }>
        <Row justify='center' wrap gutter={12}>
          <Col span={14}>
            {/* <Form.Item label={'¿Desea crear carpeta?'} >
              <Checkbox 
                checked={folder}
                onChange={(e) => setFolder(e.target.checked)}
              />
            </Form.Item> */}
            {!folder && (
              <Form.Item
                label={
                  <label style={{ marginTop: '2%' }}>
                    Archivo <label style={{ color: 'red' }}>*</label>
                  </label>
                }
                rules={[{ required: true, message: 'El archivo es requerido' }]}>
                <Upload
                  multiple={false}
                  name={'file'}
                  type='file'
                  fileList={documentList}
                  defaultValue={documentList}
                  onChange={(e) => {
                    onHandlerFile(e);
                    e.file.status = 'success';
                  }}
                  listType='picture'
                  maxCount={1}>
                  <Button block icon={<UploadOutlined />}>
                    Toca para subir archivo
                  </Button>
                </Upload>
              </Form.Item>
            )}
            {loadPercentage > 0 && <Progress percent={loadPercentage} />}

            <Form.Item
              label={
                <label style={{ marginTop: '2%' }}>
                  Título <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[{ required: true, message: 'El título es requerido' }]}>
              <Input
                name={'title'}
                placeholder={folder ? 'Título de la carpeta' : 'Título del documento'}
                value={document.title}
                onChange={(e) => handleChange(e)}
                disabled={documentList.length === 0 ? true : loading}
              />
            </Form.Item>
          </Col>
        </Row>
      </Spin>
    </Form>
  );
};

export default withRouter(Document);
