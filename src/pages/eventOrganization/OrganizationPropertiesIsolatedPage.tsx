import OrganizationPropertiesForm from '@components/organization/forms/OrganizationPropertiesForm';
import { OrganizationApi } from '@helpers/request';
import { Button, Modal, Space, Typography } from 'antd';
import { useEffect, useState } from 'react'
import sample from '@components/organization/forms/sample-dynamic-fields'

function OrganizationPropertiesIsolatedPage(props: any) {
  const { _id: organizationId } = props.org

  const [opened, setOpened] = useState(false)
  const [memberName, setMemberName] = useState('')
  const [member, setMember] = useState(null)

  const loadData = async () => {
    const { data: orgUsers } = await OrganizationApi.getUsers(organizationId)
    console.log('Petición de solicitud - Usuarios de la organización: ', orgUsers)

    const [orgUser] = orgUsers

    if (!orgUser) return

    setMemberName(orgUser.user.names)

    const properties = {
      _id: orgUser._id,
      created_at: orgUser.created_at,
      updated_at: orgUser.updated_at,
      role: orgUser.rol.name,
      picture: orgUser.user.picture,
      position: orgUser.position?.position_name || 'Sin cargo',
      position_id: orgUser.position?._id || null,
      // stats: userActivities[orgUser.account_id],
      ...orgUser.properties,
    }

    setMember(properties)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Space direction="vertical">
      <Typography.Title>Organization Properties Isolated Page</Typography.Title>
      <p>Usuario cargado: {memberName}</p>
      <Button
        onClick={() => {
          setOpened(true)
        }}
      >
        Abrir formulario
      </Button>

      {member && (
        <Modal
          visible={opened}
          onCancel={() => setOpened(false)}
          onOk={() => setOpened(false)}
        >
          <OrganizationPropertiesForm
            basicDataUser={{}}
            orgMember={member}
            onProperyChange={() => {}}
            organization={{
              user_properties: Object.values(sample),
            }}
          />
        </Modal>
      )}
    </Space>
  )
}

export default OrganizationPropertiesIsolatedPage
