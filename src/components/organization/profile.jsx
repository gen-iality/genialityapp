/*global google*/
import React, { useState, useEffect } from 'react';
import { OrganizationApi } from '../../helpers/request';
import Loading from '../loaders/loading';
import { Form, Input, Button, Row, message } from 'antd';

const layout = {
   labelCol: {
      span: 8,
   },
   wrapperCol: {
      span: 16,
   },
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
         const organizationEdit = await OrganizationApi.editOne(body, organizationId);
         props.setOrganization(organizationEdit)
         console.log("10. organizationEdit ", organizationEdit)
         message.success('Información actualizada correctamente');
      } catch (error) {
         message.error('No se pudo actualizar la información');
      }
   }
   return (
      <Row align='middle' justify='center'>
         <Form {...layout} name='nest-messages' onFinish={updateOrganization}>
            <Form.Item name={['organization', 'name']} label='Nombre' initialValue={name}>
               <Input />
            </Form.Item>
            <Form.Item name={['organization', 'description']} label='Descripción' initialValue={description}>
               <Input.TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
               <Button type='primary' htmlType='submit'>
                  Editar
               </Button>
            </Form.Item>
         </Form>
      </Row>
   );
}

export default OrganizationInformation;
