import { PictureOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  List,
  Modal,
  Spin,
  message,
  Upload,
  Space,
  Tabs,
} from 'antd'
import { useCurrentUser } from '@context/userContext'
import { useState, useEffect, FunctionComponent } from 'react'
import { useNewEventContext, NewEventActionEnum } from '@context/newEventContext'
import ImgCrop from 'antd-img-crop'
import functionCreateNewOrganization from '@components/profile/functionCreateNewOrganization'

export interface ModalOrgListCreateProps {
  modalListOrgIsVisible?: boolean
  orgId?: string
}

const ModalOrgListCreate: FunctionComponent<ModalOrgListCreateProps> = (props) => {
  const { modalListOrgIsVisible, orgId } = props

  const { newOrganization, OrganizationsList, state, dispatch, createOrganization } =
    useNewEventContext()
  const cUser = useCurrentUser()
  const [imageAvatar, setImageAvatar] = useState<any>(null)
  const [form] = Form.useForm()
  const { TabPane } = Tabs

  const beforeUpload = (file: any) => {
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!')
    }
    return isLt5M
  }

  const resetFields = () => {
    form.resetFields()
    setImageAvatar(null)
  }

  const linkToCreateNewEvent = (menuRoute: string) => {
    window.location.href = `${window.location.origin}${menuRoute}`
  }

  const redirectOrganization = () => {
    linkToCreateNewEvent(
      `/create-event/${cUser.value._id}/?orgId=${state.selectOrganization.id}`,
    )
  }

  const obtainOrganizations = async () => {
    const organizations = await OrganizationsList()
    if (organizations.length === 0) {
      const newOrganization = {
        name: cUser.value?.names || cUser.value?.name,
        styles: { event_image: null },
      }
      const createOrganizationR = await createOrganization(newOrganization)
      dispatch({
        type: NewEventActionEnum.ORGANIZATIONS,
        payload: { organizationList: [createOrganizationR] },
      })
      dispatch({
        type: NewEventActionEnum.SELECT_ORGANIZATION,
        payload: { orgId: orgId, organization: createOrganizationR },
      })
    } else {
      dispatch({
        type: NewEventActionEnum.SELECT_ORGANIZATION,
        payload: { orgId: orgId },
      })
    }
  }

  const createNewOrganization = async (value: any) => {
    dispatch({ type: NewEventActionEnum.LOADING })
    await functionCreateNewOrganization({ name: value.name, logo: imageAvatar })
    setTimeout(async () => {
      await obtainOrganizations()
      resetFields()
      newOrganization(false)
    }, 500)
    dispatch({ type: NewEventActionEnum.SELECT_TAB, payload: { tab: 'list' } })
    dispatch({ type: NewEventActionEnum.COMPLETE })
  }

  useEffect(() => {
    if (cUser.value || modalListOrgIsVisible) {
      obtainOrganizations()
    }
  }, [cUser.value, modalListOrgIsVisible, orgId])

  return (
    <Modal
      footer={
        state?.tab == 'create' ? null : !state.isLoading ? (
          [
            <Button
              key="back"
              onClick={() =>
                dispatch({
                  type: NewEventActionEnum.VISIBLE_MODAL,
                  payload: { visible: false },
                })
              }
            >
              Cerrar
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                if (modalListOrgIsVisible) {
                  redirectOrganization()
                }
                dispatch({
                  type: NewEventActionEnum.VISIBLE_MODAL,
                  payload: { visible: false },
                })
              }}
            >
              Seleccionar
            </Button>,
          ]
        ) : (
          <Spin />
        )
      }
      onOk={() => {
        if (modalListOrgIsVisible) {
          redirectOrganization()
        }
        dispatch({ type: NewEventActionEnum.VISIBLE_MODAL, payload: { visible: false } })
      }}
      okText="Seleccionar"
      cancelText="Cerrar"
      open={state?.visible}
      onCancel={() =>
        dispatch({ type: NewEventActionEnum.VISIBLE_MODAL, payload: { visible: false } })
      }
    >
      <Tabs
        activeKey={state?.tab}
        onChange={(key) =>
          dispatch({ type: NewEventActionEnum.SELECT_TAB, payload: { tab: key } })
        }
      >
        <TabPane tab="Mis organizaciones" key="list">
          <List
            style={{ height: 350, overflowY: 'auto', borderRadius: '8px' }}
            size="small"
            bordered
            dataSource={state.organizations}
            renderItem={(item: any) => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  color:
                    state.selectOrganization?.id == item.id
                      ? 'white'
                      : 'rgba(0, 0, 0, 0.85)',
                  background:
                    state.selectOrganization?.id == item.id ? '#40a9ff' : 'white',
                  borderRadius: '8px',
                }}
                onClick={() =>
                  dispatch({
                    type: NewEventActionEnum.SELECT_ORGANIZATION,
                    payload: { orgId: null, organization: item },
                  })
                }
              >
                {item.name}
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Nueva organización" key="create">
          <div
            style={{
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <Form
              onFinish={createNewOrganization}
              form={form}
              autoComplete="off"
              style={{ width: '80%' }}
              layout="vertical"
            >
              <Form.Item>
                <ImgCrop rotate shape="round">
                  <Upload
                    accept="image/png,image/jpeg"
                    onChange={(file) => {
                      const fls = (file ? file.fileList : []).map((fl) => ({
                        ...fl,
                        status: 'success',
                      }))
                      if (file.fileList.length > 0) {
                        setImageAvatar(fls)
                      } else {
                        setImageAvatar(null)
                      }
                    }}
                    multiple={false}
                    listType="picture"
                    maxCount={1}
                    fileList={imageAvatar}
                    beforeUpload={beforeUpload}
                  >
                    {imageAvatar === null && (
                      <Button
                        type="primary"
                        shape="circle"
                        style={{ height: '150px', width: '150px' }}
                      >
                        <Space direction="vertical">
                          <PictureOutlined style={{ fontSize: '40px' }} />
                          Subir logo
                        </Space>
                      </Button>
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>
              <Form.Item
                label="Nombre de la organizacion"
                name="name"
                style={{ marginBottom: '10px' }}
                rules={[
                  { required: true, message: 'Ingrese un nombre para su organización!' },
                ]}
              >
                <Input type="text" size="large" placeholder="Nombre de la organizacion" />
              </Form.Item>
              {!state.isLoading ? (
                <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
                  <Button
                    id="submitButton"
                    htmlType="submit"
                    block
                    style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
                    size="large"
                  >
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
  )
}

export default ModalOrgListCreate
