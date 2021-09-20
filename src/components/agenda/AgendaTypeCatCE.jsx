import { useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { CategoriesAgendaApi, TypesAgendaApi } from '../../helpers/request';
import { Table, Tag, Row, Col, Tooltip, Button, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import { async } from 'ramda-adjunct';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const initialValues = {
  name: '',
  color: ''
}

const AgendaTypeCatCE = ( props ) => {
  const { onSubmit } = props;
  const categoryValues = useState(initialValues);

  const onFinish = async ( values ) => {

  }

  return (
    <div>
      <Header 
        title={'Categoría'}
        back
        save
      />

      <Form
        onFinish={onFinish}
        initialValues={categoryValues}
        {...formLayout}
      >
        <Row justify='center' wrap gutter={12}>
          <Col span={12}>
            <Form.Item label={'Nombre'} name={'name'} >
              <Input 
                placeholder={'Nombre de la categoría'}
              />
            </Form.Item>
            <Form.Item label={'Color'} name={'color'} >
              <Input 
                placeholder={'Color de la categoría'}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default withRouter(AgendaTypeCatCE);
