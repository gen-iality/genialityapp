import { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { CategoriesAgendaApi, TypesAgendaApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { Row, Col, Form, Input, message } from 'antd';
import Header from '../../antdComponents/Header';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const AgendaTypeCatCE = ( props ) => {
  const matchUrl = props.match.url;
  const eventID = props.event._id;
  const locationState = props.location.state; //si viene new o edit en el state, si es edit es un id
  const subject = matchUrl.split('/').slice(-1)[0];
  const apiURL = subject === 'categoria' ? CategoriesAgendaApi : TypesAgendaApi;
  const history = useHistory();
  const [ categoryValues, setCategoryValues ] = useState({});
  const [ name, setName ] = useState('');
  const [ color, setColor ] = useState('');
  
  useEffect(() => {
    if(locationState.edit) {
      const getOne = async () => {
        const response = await apiURL.getOne(locationState.edit, eventID);
        setName(response.name);
        setColor(response.color);
      }
      getOne();
    }
  }, []);

  const onFinish = async () => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras se guarda la configuración..</>,
    });
    try {
      if(subject === 'categoria') {
        setCategoryValues({name, color});
      } else {
        setCategoryValues({name});
      }

      if(locationState.edit) {
        await apiURL.editOne(categoryValues, locationState.edit, eventID);
      } else {
        await apiURL.create(eventID, categoryValues);
      }
      message.destroy(loading.key);
      message.open({
        type: 'success',
        content: <> Configuración guardada correctamente!</>,
      });
      history.push(`${props.matchUrl}/categorias`);
    } catch (e) {
      message.destroy(loading.key);
      message.open({
        type: 'error',
        content: handleRequestError(e).message,
      });
    }
  }

  const handleChangeComplete = (color) => {
    setColor(color.hex);
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <Form
      onFinish={onFinish}
      {...formLayout}
    >
      <Header 
        title={'Categoría'}
        back
        save={onFinish}
      />
      
      <Row justify='center' wrap gutter={12}>
        <Col span={12}>
          <Form.Item label={'Nombre'} >
            <Input 
              name={'name'}
              placeholder={'Nombre de la categoría'}
              value={name}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>
          <Form.Item label={'Color'} >
            <ChromePicker color={color} onChange={handleChangeComplete} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default withRouter(AgendaTypeCatCE);
