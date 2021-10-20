/*global google*/
import React, { useState, useEffect } from 'react';
import { OrganizationApi } from '../../helpers/request';
import Loading from '../loaders/loading';
import { Form, Input, Button, Row, Col, message } from 'antd';
import Header from '../../antdComponents/Header';

const formLayout = {
   labelCol: { span: 24 },
   wrapperCol: { span: 24 }
};

function OrganizationInformation(props) {
   let { name, description, _id: organizationId } = props.org;

   async function updateOrganization(values) {
      const { name, description } = values.organization;
      const body = {
         name,
         description,
      };
      try {
         await OrganizationApi.editOne(body, organizationId);
         message.success('Información actualizada correctamente');
      } catch (error) {
         message.error('No se pudo actualizar la información');
      }
   }
   return (
      <div>
         <Form 
            {...formLayout} 
            name='nest-messages' 
            onFinish={updateOrganization}
         >

         <Header 
            title={'Información'}
            save
            form
         />

            <Row justify='center' gutter={[8, 8]} wrap>
               <Col span={12}>
                  <Form.Item name={['organization', 'name']} label='Nombre' initialValue={name}>
                     <Input />
                  </Form.Item>
                  <Form.Item name={['organization', 'description']} label='Descripción' initialValue={description}>
                     <Input.TextArea />
                  </Form.Item>
                  {/* <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                     <Button type='primary' htmlType='submit'>
                        Editar
                     </Button>
                  </Form.Item> */}
               </Col>
            </Row>
         </Form>
      </div>
   );
}

export default OrganizationInformation;
