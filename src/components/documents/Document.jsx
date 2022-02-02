import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { DocumentsApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { Form, Row, Col, message, Input, Modal, Upload, Button, Checkbox } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import firebase from 'firebase';
import Header from '../../antdComponents/Header';
import moment from 'moment';

const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const Document = ( props ) => {
  const locationState = props.location.state;
  const history = useHistory();
  const [document, setDocument] = useState({});
  const [documentList, setDocumentList] = useState([]);
  let [uploadTask, setUploadTask] = useState('');
  let [files, setFiles] = useState('');
  let [fileName, setFileName] = useState('');
  let [extention, setExtention] = useState('');
  const [folder, setFolder] = useState(false);

  useEffect(() => {
    if(locationState.edit) {
      getDocument();
    }
  }, []);

  const getDocument = async () => {
    const response = await DocumentsApi.getOne(locationState.edit, props.event._id);
    setDocument(response);
    setFolder(response.folder);
    setFiles([response.file])
    
  }

  const onSubmit = async () => {
    if(folder) {
      setDocument({...document, type: 'folder', folder});
    }

    if(!document.title) {
      message.error('El título es requerido');
    } else if(!files && document.type !== 'folder') {
      message.error('El archivo es requerido');
    } else {
      const loading = message.open({
        key: 'loading',
        type: 'loading',
        content: <> Por favor espere miestras se guarda la información..</>,
      });
  
      try {
        if(locationState.edit) {
          await DocumentsApi.editOne(!folder ? document : {title: document.title, type: 'folder', folder}, locationState.edit, props.event._id);
        } else {
          await DocumentsApi.create(!folder ? document : {title: document.title, type: 'folder', folder}, props.event._id);
        }     
      
        message.destroy(loading.key);
        message.open({
          type: 'success',
          content: <> Información guardada correctamente!</>,
        });
        history.push(`${props.matchUrl}`);
      } catch (e) {
        message.destroy(loading.key);
        message.open({
          type: 'error',
          content: handleRequestError(e).message,
        });
      }
    }
  }

  const remove = () => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras borra la información..</>,
    });
    if(locationState.edit) {
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
              message.destroy(loading.key);
              message.open({
                type: 'success',
                content: <> Se eliminó la información correctamente!</>,
              });
              history.push(`${props.matchUrl}`);
            } catch (e) {
              message.destroy(loading.key);
              message.open({
                type: 'error',
                content: handleRequestError(e).message,
              });
            }
          }
          onHandlerRemove();
        }
      });
    }
  }

  const handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    setDocument({
      ...document,
      [name] : value
    })
  };

  const onHandlerFile = async (e) => {
    /* console.log(e.file.originFileObj); */
    setDocumentList(e.fileList);
    
    const ref = firebase.storage().ref();
    setFiles(e.file.originFileObj);
    
    //Se crea el nombre con base a la fecha y nombre del archivo
    const name = moment().format('YYYY-DD-MM') + '-' + files.name;
    setFileName(name);
    //Se extrae la extencion del archivo por necesidad del aplicativo
    
    setExtention(name.split('.').pop());

    /* this.setState({ fileName: name }); */
    /* console.log(fileName, name); */
    let uploadTaskRef = ref.child(`documents/${props.event._id}/${name}`).put(files)
    /* setUploadTask(uploadTaskRef); */
    /* console.log(uploadTaskRef); */
    //Se envia a firebase y se pasa la validacion para poder saber el estado del documento
    uploadTaskRef.on(firebase.storage.TaskEvent.STATE_CHANGED, stateUploadFile, wrongUpdateFiles, succesUploadFile(uploadTaskRef));

  }

  const stateUploadFile = (snapshot) => {
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED:
        //
        break;
      case firebase.storage.TaskState.RUNNING:
        //
        break;
    }
  };

  const wrongUpdateFiles = (error) => {
    //Si hay algun error se valida si fue cancelada la carga, si no tiene acceso o si hay un error al guardar
    switch (error.code) {
      case 'storage/unauthorized':
        break;

      case 'storage/canceled':
        break;

      case 'storage/unknown':
        break;
    }
  };

  const succesUploadFile = async (uploadTaskRef) => {
    let file;
    await uploadTaskRef.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      file = downloadURL;
      console.log(downloadURL);
    });
    setDocument({...document, format: extention, title: fileName, name: fileName, file: file, type: 'file'});
  }

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

  return (
    <Form
      onFinish={onSubmit}
      {...formLayout}
    >
      <Header 
        title={'Documento'}
        back
        save
        form
        remove={remove}
        edit={locationState.edit}
      />
      
      <Row justify='center' wrap gutter={12}>
        <Col span={14}>
          {/* <Form.Item label={'¿Desea crear carpeta?'} >
            <Checkbox 
              checked={folder}
              onChange={(e) => setFolder(e.target.checked)}
            />
          </Form.Item> */}
          <Form.Item 
            label={
              <label style={{ marginTop: '2%' }} className='label'>
                Título <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'El título es requerido' }]}
          >
            <Input 
              name={'title'}
              placeholder={folder ? 'Título de la carpeta' : 'Título del documento'}
              value={document.title}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>
          {
            !folder && (
              <Form.Item  
                label={
                  <label style={{ marginTop: '2%' }} className='label'>
                    Archivo <label style={{ color: 'red' }}>*</label>
                  </label>
                }
              rules={[{ required: true, message: 'El archivo es requerido' }]}
              >
                <Upload
                  name={'file'}
                  type='file'
                  defaultFileList={documentList}
                  onChange={(e) => {
                    onHandlerFile(e);
                    e.file.status = 'success'
                  }}
                >
                  <Button icon={<UploadOutlined />}>Toca para subir archivo</Button>
                </Upload>
              </Form.Item>
            )
          }
        </Col>
      </Row>
    </Form>
  )
}

export default Document;
