/*global google*/
import React, { useState, useEffect } from "react";
import { OrganizationApi } from "../../helpers/request";
import Loading from "../loaders/loading";
import { Form, Input, Button, Row, message,Select,Col } from "antd";

const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 10,
  },
};

const { Option } = Select;

function OrganizationInformation(props) {
  let { name, description, _id: organizationId ,typeevent} = props.org;

  async function updateOrganization(values) {
    const { name, description} = values.organization;
    const body = {
      name,
      description,
      typeevent      
    };    
    try {
      await OrganizationApi.editOne(body, organizationId);
      message.success("Información actualizada correctamente");
    } catch (error) {
      message.error("No se pudo actualizar la información");
    }
  }
 
  

  return (
    <Row style={{marginTop:20}} align="middle" justify="center">
      <Col  span={24}>
      <Form  {...layout} name="nest-messages" onFinish={updateOrganization}>
        <Form.Item
          name={["organization", "name"]}
          label="Nombre"
          initialValue={name}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["organization", "description"]}
          label="Descripción"
          initialValue={description}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Tipo de eventos" initialValue={typeevent || "onlineEvent"} name={["organization","typevento"]} >
          <Select        
            onChange={null}> <Option value="physicalEvent">Evento físico</Option>
            <Option value="onlineEvent">Evento virtual</Option>           
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
          <Button type="primary" htmlType="submit">
            Editar
          </Button>
        </Form.Item>
      </Form>
      </Col>
    </Row>
  );
}

export default OrganizationInformation;
