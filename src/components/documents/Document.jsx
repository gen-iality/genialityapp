import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { DocumentsApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { Form, Row, Col, message, Input, Modal, Upload, Button } from 'antd';
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

  useEffect(() => {
    if(locationState.edit) {
      getDocument();
    }
  }, []);

  const getDocument = async () => {
    const response = await DocumentsApi.getOne(locationState.edit, props.event._id);
    setDocument(response);
    setFiles([response.file])
  }

  const onSubmit = async () => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras se guarda la información..</>,
    });

    try {
      if(locationState.edit) {
        await DocumentsApi.editOne(document, locationState.edit, props.event._id);
      } else {
        await DocumentsApi.create(document, props.event._id);
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
              await DocumentsApi.deleteOne(locationState.edit, props.event._id);
              message.destroy(loading.key);
              message.open({
                type: 'success',
                content: <> Se eliminó la información correctamente!</>,
              });
              history.push(`${props.matchUrl}/faqs`);
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
    console.log(e.file);
    setDocumentList(e.fileList);
    
    const ref = firebase.storage().ref();
    setFiles(e.file);
    
    //Se crea el nombre con base a la fecha y nombre del archivo
    const name = moment().format('YYYY-DD-MM') + '-' + files.name;
    setFileName(name);
    //Se extrae la extencion del archivo por necesidad del aplicativo
    
    setExtention(name.split('.').pop());
    setDocument({...document, format: extention, title: fileName, name: fileName, file: files, type: 'type', format: extention});

    /* this.setState({ fileName: name }); */
    setUploadTask(ref.child(`documents/${props.event._id}/${name}`).put(files));
    //Se envia a firebase y se pasa la validacion para poder saber el estado del documento
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, stateUploadFile, wrongUpdateFiles);

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
          <Form.Item label={'Título'} >
            <Input 
              name={'title'}
              placeholder={'Título del documento'}
              value={document.title}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>
          <Form.Item label={'Archivo'} >
            <Upload
              name={'file'}
              type='file'
              defaultFileList={documentList}
              onChange={(e) => onHandlerFile(e)}
            >
              <Button icon={<UploadOutlined />}>Toca para subir archivo</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Document;
