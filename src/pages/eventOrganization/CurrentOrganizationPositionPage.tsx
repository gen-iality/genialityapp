import { useState, useEffect } from 'react'
import {
  Table,
  Row,
  Col,
  Button,
  Typography,
  Spin,
  Modal,
  Form,
  Select,
  Tooltip,
} from 'antd'
import {
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import Header from '@antdComponents/Header'

// API
import {
  PositionsApi,
  OrganizationApi,
} from '@helpers/request';

export interface CurrentOrganizationPositionPageProps {
  org: any,
  match: {
    params: {
      positionId: string,
    },
  },
}

function CurrentOrganizationPositionPage(props: CurrentOrganizationPositionPageProps) {
  const [currentPosition, setCurrentPosition] = useState<any | null>(null);
  const [allOrgUsers, setAllOrgUsers] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpened, setIsModalOpened] = useState(false);

  const [form] = Form.useForm()

  const organizationId: string = props.org._id;
  const positionId = props.match.params.positionId;

  const openModal = () => setIsModalOpened(true)
  const closeModal = () => setIsModalOpened(false)
  
  const onAddOrganizationUser = () => {
    form.resetFields()
    openModal()
  }

  const addOrgUserToPosition = async (orgUserId: string) => {
    const result = await PositionsApi.Organizations.addUser(
      organizationId,
      positionId,
      orgUserId,
    )
    console.debug('CurrentOrganizationPositionPage: addOrgUserToPosition', {result})
  }

  const deleteOrgUser = async (orgUser: any) => {
    console.debug('CurrentOrganizationPositionPage: deleteOrgUser', {orgUser})
    const position = await PositionsApi.Organizations.deleteUser(organizationId, positionId, orgUser.user._id)
    console.debug('CurrentOrganizationPositionPage: deleteOrgUser', {position})
  }

  const loadPositionData = async () => {
    const position = await PositionsApi.getOne(positionId)
    setCurrentPosition(position)
    console.debug('CurrentOrganizationPositionPage: loadPositionData',  {position})
  }

  const loadOrgUsers = async () => {
    const { data: orgUsers } = await OrganizationApi.getUsers(organizationId)
    setAllOrgUsers(orgUsers)
    console.debug('CurrentOrganizationPositionPage: loadOrgUsers',  {orgUsers})
  }

  const loadUsers = async () => {
    const users = await PositionsApi.Organizations.getUsers(organizationId, positionId)
    setDataSource(users)
    console.debug('CurrentOrganizationPositionPage: loadUsers',  {gotUsers: users})
  }

  const columns: any[] = [
    {
      title: 'Miembros',
      render: (orgUser: any) => <p>{orgUser.user.names}</p>
    },
    {
      title: 'Opciones',
      width: 80,
      render: (orgUser: any) => (
        <Tooltip title='Borrar'>
          <Button
            id={`deleteAction${orgUser._id}`}
            type='primary'
            size='small'
            onClick={(e) => deleteOrgUser(orgUser).finally(() => loadUsers())}
            icon={<DeleteOutlined />}
          />
        </Tooltip>
      )
    },
  ]

  // Load all users for this position
  useEffect(() => {
    setIsLoading(true)

    loadOrgUsers()
    loadPositionData()
    loadUsers().finally(() => setIsLoading(false))
  }, [])

  return (
    <>
      <Header
        title={`Miembros en el cargo: ${currentPosition ? currentPosition.position_name : <Spin />}`}
      />
      <Typography.Text>
        {'Agregue, edite y borre los miembros que están asignado al cargo de '}
        {currentPosition ? currentPosition.position_name : <Spin />}
      </Typography.Text>
      <Table
        columns={columns}
        dataSource={dataSource}
        size='small'
        rowKey='index'
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
        title={() => (
          <Row wrap justify='end' gutter={[8, 8]}>
            <Col>
              <Button type='primary' icon={<PlusCircleOutlined />} onClick={onAddOrganizationUser}>
                {'Agregar'}
              </Button>
            </Col>
          </Row>
        )}
      />
      <Modal
        visible={isModalOpened}
        title="Agrega miembro"
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Typography.Paragraph>
          Agrega miembros de la organización a este cargo.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Hay {allOrgUsers.length} usuarios que pueden ser agregados.
        </Typography.Paragraph>

        <Form
          form={form}
          onFinish={(values: any) => {
            console.debug('CurrentOrganizationPositionPage: Form', {values})
            setIsLoading(true)
            Promise.all(values.orgUsers.map(async (userId: string) => {
              await addOrgUserToPosition(userId)
              console.debug('CurrentOrganizationPositionPage: onFinish', {userId})
            })).finally(() => loadUsers().finally(() => setIsLoading(false)))
            closeModal()
          }}
        >
          <Form.Item
            label="Usuario"
            name="orgUsers"
            rules={[{required: true, message: 'Es necesario agregar al menos algo'}]}
          >
            <Select
              mode="multiple"
              options={allOrgUsers.map((orgUser: any) => {
                return {
                  label: orgUser.user.names,
                  value: orgUser.user._id,
                }
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CurrentOrganizationPositionPage;