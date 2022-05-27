import { useState } from 'react';
import { Modal, Form, Select, Button, Typography } from 'antd';
import functionCreateNewOrganization from './functionCreateNewOrganization';

const { Option } = Select;
const ModalListOrg = (props) => {
  function linkToCreateNewEvent(menuRoute) {
    window.location.href = `${window.location.origin}${menuRoute}`;
  }
  function selectOrganization(values) {
    const { selectedOrg } = values;
    linkToCreateNewEvent(`/create-event/${props.cUserId}/?orgId=${selectedOrg}`);
  }

  return (
    <Modal
      bodyStyle={{ textAlign: 'center', paddingRight: '80px', paddingLeft: '80px', paddingTop: '80px', height: '40vh' }}
      centered
      footer={null}
      zIndex={1000}
      closable={true}
      visible={props.modalListOrgIsVisible}
      onCancel={() => {
        props.setModalListOrgIsVisible(false);
      }}>
      <Form onFinish={selectOrganization} autoComplete='off' layout='vertical'>
        <Typography.Title level={4} type='secondary'>
          Organizaciones a las que pertenezco
        </Typography.Title>
        <Form.Item
          label={'Listado de organizaciones'}
          name='selectedOrg'
          style={{ marginBottom: '10px' }}
          hasFeedback
          rules={[
            { required: true, message: 'Por favor seleccione una organización bajo la cual se creara este curso!' },
          ]}>
          {props.org && props.org.length > 0 && (
            <Select placeholder='Por favor seleccione una organización'>
              {props?.org?.map((orgItem, key) => {
                return (
                  <Option key={key} value={orgItem.id}>
                    {orgItem.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
          <Button
            id={'submitButton'}
            htmlType='submit'
            block
            style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
            size='large'>
            Crear Curso
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalListOrg;
