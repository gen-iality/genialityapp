import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { SurveysApi, AgendaApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { Form, Row, Col, message, Input, Modal, Upload, Button, InputNumber, Switch } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import firebase from 'firebase';
import Header from '../../antdComponents/Header';
import moment from 'moment';

const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const triviaEdit = ( props ) => {
  const locationState = props.location ? props.location : '';
  const history = useHistory();
  const [trivia, setTrivia] = useState({});
  const [agenda, setAgenda] = useState({});

  

  useEffect(() => {
    if(locationState.edit) {
      getOne();
    }
  }, []);

  const getOne = async () => {
    const response = await SurveysApi.getOne(locationState.edit, props.event._id);
    
  }

  const onSubmit = async () => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras se guarda la información..</>,
    });

    try {
      if(locationState.edit) {
        await SurveysApi.editOne(document, locationState.edit, props.event._id);
      } else {
        await SurveysApi.create(document, props.event._id);
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
              await SurveysApi.deleteOne(locationState.edit, props.event._id);
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
    console.log(e, 'handler');
    const { name } = e.target;
    const { value } = e.target;
    setTrivia({
      ...trivia,
      [name] : value
    })
  };

  

  return (
    <Form
      onFinish={onSubmit}
      {...formLayout}
    >
      <Header 
        title={'Encuesta'}
        back
        save
        form
        remove={remove}
        edit={locationState.edit}
      />
      
      <Row justify='center' wrap gutter={12}>
        <Col span={14}>
          <Form.Item label={'Nombre'} >
            <Input 
              name={'survey'}
              placeholder={'Nombre de la Encuesta'}
              value={trivia.survey}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>
          <Form.Item label={'Tiempo límite en segundos por pregunta'}>
            <InputNumber 
              min={0}
              value={trivia.time}
              name={''}
            />
          </Form.Item>
          <Row justify='space-between' wrap gutter={[8, 8]}>
            <Col>
              <Form.Item label={'Publicar encuesta'}>
                <Switch
                  checked={publish === 'true' || publish === true}
                  onChange={(checked) => this.setState({ publish: checked ? 'true' : 'false' })}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label={'Encuesta abierta'}>
                <Switch
                  checked={openSurvey === 'true' || openSurvey === true}
                  onChange={(checked) => this.setState({ openSurvey: checked ? 'true' : 'false' })}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label={'Permitir usuarios anonimos'}>
                <Switch
                  checked={allow_anonymous_answers === 'true' || allow_anonymous_answers === true}
                  onChange={(checked) => this.setState({ allow_anonymous_answers: checked ? 'true' : 'false' })}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label={'Mostar gráficas en las encuestas'}>
                <Switch
                  checked={displayGraphsInSurveys === 'true' || displayGraphsInSurveys === true}
                  onChange={(checked) => this.toggleSwitch('displayGraphsInSurveys', checked)}
                />
              </Form.Item>
            </Col>
          </Row>
          {/* <Form.Item label={'Archivo'} >
            <Upload
              name={'file'}
              type='file'
              defaultFileList={documentList}
              onChange={(e) => onHandlerFile(e)}
            >
              <Button icon={<UploadOutlined />}>Toca para subir archivo</Button>
            </Upload>
          </Form.Item> */}
        </Col>
      </Row>
    </Form>
  )
}

export default triviaEdit;
