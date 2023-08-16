/*global google*/
import { useState, useEffect } from 'react';
import { OrganizationApi, TypesApi } from '../../helpers/request';
import { Form, Input, Row, Col, Select, Checkbox } from 'antd';
import Header from '../../antdComponents/Header';
import { DispatchMessageService } from '../../context/MessageService';
import { isValidUrl } from '@/hooks/useIsValidUrl';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

const socialNetworksInitialValue = {
  facebook: '',
  twitter: '',
  instagram: '',
  linkedln: '',
  youtube: '',
  yourSite: '',
};

function OrganizationInformation(props) {
  let {
    name,
    description,
    _id: organizationId,
    type_event,
    show_my_certificates = false,
    social_networks = socialNetworksInitialValue,
  } = props.org;
  const [typeEvents, setTypeEvents] = useState([]);
  const [showMyCertificates, setShowMyCertificates] = useState(false);

  async function updateOrganization(values) {
    const { name, description, type_event } = values.organization;
    const body = {
      name,
      description,
      type_event: type_event,
      show_my_certificates: showMyCertificates,
      social_networks:values.social_networks
    };
    try {
      await OrganizationApi.editOne(body, organizationId);
      DispatchMessageService({
        type: 'success',
        msj: 'Información actualizada correctamente',
        action: 'show',
      });
    } catch (error) {
      DispatchMessageService({
        type: 'error',
        msj: 'No se pudo actualizar la información',
        action: 'show',
      });
    }
  }

  const validateUrl = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }
    /* const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlPattern.test(value)) {
      return Promise.reject('Ingresa una URL válida');
    } */

    if (!isValidUrl(value)) {
      return Promise.reject('Ingresa una URL válida');
    }

    return Promise.resolve();
  };

  async function obtenerTypeEvents() {
    let resp = await TypesApi.getAll();
    if (resp) {
      setTypeEvents(resp);
    }
  }

  useEffect(() => {
    if (show_my_certificates !== undefined) {
      setShowMyCertificates(show_my_certificates);
    }
  }, [show_my_certificates]);

  useEffect(() => {
    obtenerTypeEvents();
  }, []);
  return (
    <div>
      <Form {...formLayout} name='nest-messages' onFinish={updateOrganization}>
        <Header title={'Información'} save form />

        <Row justify='center' gutter={[8, 8]} wrap>
          <Col span={12}>
            <Form.Item name={['organization', 'name']} label='Nombre' initialValue={name}>
              <Input />
            </Form.Item>
            <Form.Item name={['organization', 'description']} label='Descripción' initialValue={description}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label='Tipo de eventos'
              initialValue={type_event || 'Corporativo'}
              name={['organization', 'type_event']}>
              <Select onChange={null}>
                {' '}
                {typeEvents.map((type) => (
                  <Option value={type.label}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label='Mostrar "Mis certificados"' name={'showMyCertificates'}>
              <Checkbox
                checked={showMyCertificates}
                onChange={({ target: { checked } }) => setShowMyCertificates(checked)}>
                Mostrar "Ver mis certificados" en landing de Organizaciones
              </Checkbox>
            </Form.Item>

            <Form.Item
              name={['social_networks', 'facebook']}
              label='Facebook'
              initialValue={social_networks.facebook}
              rules={[
                {
                  validator: validateUrl,
                },
              ]}>
              <Input placeholder='https:facebook.com/yourprofile' />
            </Form.Item>
            <Form.Item
              name={['social_networks', 'twitter']}
              label='Twitter'
              initialValue={social_networks.twitter}
              rules={[
                {
                  validator: validateUrl,
                },
              ]}>
              <Input placeholder='https:twitter.com/yourprofile' />
            </Form.Item>
            <Form.Item
              name={['social_networks', 'instagram']}
              label='Instagram'
              initialValue={social_networks.instagram}
              rules={[
                {
                  validator: validateUrl,
                },
              ]}>
              <Input placeholder='https:instagram.com/yourprofile' />
            </Form.Item>
            <Form.Item
              name={['social_networks', 'linkedln']}
              label='Linekdln'
              initialValue={social_networks.linkedln}
              rules={[
                {
                  validator: validateUrl,
                },
              ]}>
              <Input placeholder='https:linkedln.com/yourprofile' />
            </Form.Item>
            <Form.Item
              name={['social_networks', 'youtube']}
              label='Youtube'
              initialValue={social_networks.youtube}
              rules={[
                {
                  validator: validateUrl,
                },
              ]}>
              <Input placeholder='https:youtube.com/yourprofile' />
            </Form.Item>
            <Form.Item
              name={['social_networks', 'yourSite']}
              label='Sitio web'
              initialValue={social_networks.yourSite}>
              <Input placeholder='https:yourSite.com/' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default OrganizationInformation;
