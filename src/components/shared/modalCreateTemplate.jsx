import { useState } from 'react';
import { Modal, Form, Input, Button, Typography, Spin } from 'antd';
import { DefaultProperties } from './propertiesdefault';
import { OrganizationPlantillaApi } from '@helpers/request';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { DispatchMessageService } from '@context/MessageService';

const ModalCreateTemplate = (props) => {
  const [loading, setloading] = useState(false);
  const { helperDispatch } = useHelper();

  const onFinish = async (values) => {
    //por defecto
    values.user_properties = DefaultProperties;
    const organizerid = props.organizationid;
    setloading(true);
    await OrganizationPlantillaApi.createTemplate(organizerid, { template_properties: [values] });
    DispatchMessageService({
      type: 'success',
      msj: 'Template creada',
      action: 'show',
    });
    setloading(false);
    props.handlevisibleModal();
    helperDispatch({ type: 'reloadTemplatesCms' });
  };

  return (
    <Modal
      bodyStyle={{ textAlign: 'center', paddingRight: '80px', paddingLeft: '80px', paddingTop: '80px', height: 'auto' }}
      centered
      footer={null}
      zIndex={1000}
      closable={true}
      onCancel={() => props.handlevisibleModal()}
      visible={props.visible}>
      <Form onFinish={onFinish} layout='vertical'>
        <Typography.Title level={4} type='secondary'>
          Nuevo template de datos a recolectar
        </Typography.Title>
        <Form.Item label={'Nombre del template'} name='name' style={{ marginBottom: '10px', marginTop: '20px' }}>
          <Input type='text' size='large' placeholder={'Nombre del template'} />
        </Form.Item>
        <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
          {loading ? (
            <Spin />
          ) : (
            <Button
              id={'submitButton'}
              htmlType='submit'
              block
              style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
              size='large'>
              Crear template
            </Button>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateTemplate;
