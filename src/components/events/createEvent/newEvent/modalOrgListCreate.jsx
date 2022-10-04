import { PictureOutlined } from '@ant-design/icons';
import { Button, Form, Input, List, Modal, Row, Spin, message, Upload, Typography, Space, Tabs } from 'antd';
import { useCurrentUser } from '@context/userContext';
import { useState, useEffect } from 'react';
import { useContextNewEvent } from '../../../../context/newEventContext';
import ImgCrop from 'antd-img-crop';
import functionCreateNewOrganization from '../../../profile/functionCreateNewOrganization';

const ModalOrgListCreate = ({ modalListOrgIsVisible, orgId }) => {
  const { newOrganization, OrganizationsList, state, dispatch, createOrganization } = useContextNewEvent();
  const cUser = useCurrentUser();
  let [imageAvatar, setImageAvatar] = useState(null);
  const [form] = Form.useForm();
  const { TabPane } = Tabs;

  const beforeUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }
    return isLt5M ? true : false;
  };

  function resetFields() {
    form.resetFields();
    setImageAvatar(null);
  }

  function linkToCreateNewEvent(menuRoute) {
    window.location.href = `${window.location.origin}${menuRoute}`;
  }
  function redirectOrganization() {
    linkToCreateNewEvent(`/create-event/${cUser.value._id}/?orgId=${state.selectOrganization.id}`);
  }

  useEffect(() => {
    if (cUser.value || modalListOrgIsVisible) {
      obtainOrganizations();
    } // console.log("ISBYORGANIZATION==>",isbyOrganization)
  }, [cUser.value, modalListOrgIsVisible]);
  // }, [props.orgId, cUser.value]);

  async function obtainOrganizations() {
    const organizations = await OrganizationsList();
    if (organizations.length === 0) {
      let newOrganization = {
        name: cUser.value?.names || cUser.value?.name,
        styles: { event_image: null },
      };
      const createOrganizationR = await createOrganization(newOrganization);
      dispatch({ type: 'ORGANIZATIONS', payload: { organizationList: [createOrganizationR] } });
      dispatch({ type: 'SELECT_ORGANIZATION', payload: { orgId: orgId, organization: createOrganizationR } });
    } else {
      //dispatch({ type: 'ORGANIZATIONS', payload: { organizationList: organizations } });
      dispatch({ type: 'SELECT_ORGANIZATION', payload: { orgId: orgId } });
    }
  }

  const createNewOrganization = async (value) => {
    dispatch({ type: 'LOADING' });
    await functionCreateNewOrganization({ name: value.name, logo: imageAvatar });
    setTimeout(async () => {
      await obtainOrganizations();
      resetFields();
      newOrganization(false);
    }, 500);
    dispatch({ type: 'SELECT_TAB', payload: { tab: 'list' } });
    dispatch({ type: 'COMPLETE' });
  };

  return (
    <Modal
      footer={
        state?.tab == 'create' ? null : !state.loading ? (
          [
            <Button key='back' onClick={() => dispatch({ type: 'VISIBLE_MODAL', payload: { visible: false } })}>
              Cerrar
            </Button>,
            <Button
              key='submit'
              type='primary'
              onClick={() => {
                if (modalListOrgIsVisible) {
                  redirectOrganization();
                }
                dispatch({ type: 'VISIBLE_MODAL', payload: { visible: false } });
              }}>
              Seleccionar
            </Button>,
          ]
        ) : (
          <Spin />
        )
      }
      onOk={() => {
        if (modalListOrgIsVisible) {
          redirectOrganization();
        }
        dispatch({ type: 'VISIBLE_MODAL', payload: { visible: false } });
      }}
      okText='Seleccionar'
      cancelText='Cerrar'
      visible={state?.visible}
      onCancel={() => dispatch({ type: 'VISIBLE_MODAL', payload: { visible: false } })}>
      <Tabs activeKey={state?.tab} onChange={(key) => dispatch({ type: 'SELECT_TAB', payload: { tab: key } })}>
        <TabPane tab='Mis organizaciones' key='list'>
          <List
            style={{ height: 350, overflowY: 'auto', borderRadius: '8px' }}
            size='small'
            bordered
            dataSource={state.organizations}
            renderItem={(item) => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  color: state.selectOrganization?.id == item.id ? 'white' : 'rgba(0, 0, 0, 0.85)',
                  background: state.selectOrganization?.id == item.id ? '#40a9ff' : 'white',
                  borderRadius: '8px',
                }}
                onClick={() => dispatch({ type: 'SELECT_ORGANIZATION', payload: { orgId: null, organization: item } })}>
                {item.name}
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab='Nueva organización' key='create'>
          <div
            style={{
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              textAlign: 'center',
            }}>
            <Form
              onFinish={createNewOrganization}
              form={form}
              autoComplete='off'
              style={{ width: '80%' }}
              layout='vertical'>
              <Form.Item>
                <ImgCrop rotate shape='round'>
                  <Upload
                    accept='image/png,image/jpeg'
                    onChange={(file) => {
                      const fls = (file ? file.fileList : []).map((fl) => ({
                        ...fl,
                        status: 'success',
                      }));
                      if (file.fileList.length > 0) {
                        setImageAvatar(fls);
                      } else {
                        setImageAvatar(null);
                      }
                    }}
                    multiple={false}
                    listType='picture'
                    maxCount={1}
                    fileList={imageAvatar}
                    beforeUpload={beforeUpload}>
                    {imageAvatar === null && (
                      <Button type='primary' shape='circle' style={{ height: '150px', width: '150px' }}>
                        <Space direction='vertical'>
                          <PictureOutlined style={{ fontSize: '40px' }} />
                          Subir logo
                        </Space>
                      </Button>
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>
              <Form.Item
                label={'Nombre de la organizacion'}
                name='name'
                style={{ marginBottom: '10px' }}
                rules={[{ required: true, message: 'Ingrese un nombre para su organización!' }]}>
                <Input type='text' size='large' placeholder={'Nombre de la organizacion'} />
              </Form.Item>
              {!state.loading ? (
                <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
                  <Button
                    id={'submitButton'}
                    htmlType='submit'
                    block
                    style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
                    size='large'>
                    Crear organizacion
                  </Button>
                </Form.Item>
              ) : (
                <div>
                  <Spin />
                </div>
              )}
            </Form>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ModalOrgListCreate;
