/**
 * This component will replace the legacy code.
 *
 * This is the 1 of 65 parts (?)
 *
 * NOTE: The name can change in a future...
 */

import { Avatar, Button, Comment, List, Modal, Result, Tabs } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'
import RegisterUserAndEventUser from '@components/authentication/RegisterUserAndEventUser'
import { OrganizationApi } from '@helpers/request'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

const stylePaddingDesktop = {
  paddingLeft: '30px',
  paddingRight: '30px',
  textAlign: 'center',
}

const stylePaddingMobile = {
  paddingLeft: '10px',
  paddingRight: '10px',
  textAlign: 'center',
}

interface IEnrollEventUserFromOrganizationMemberProps {
  orgId?: string
  onClose?: () => void
}

const EnrollEventUserFromOrganizationMember: FunctionComponent<
  IEnrollEventUserFromOrganizationMemberProps
> = (props) => {
  const { orgId, onClose = () => {} } = props

  const [isLoadingOrgMembers, setIsLoadingOrgMembers] = useState(false)
  const [thisOrganizationMemberIsEnrolling, setThisOrganizationMemberIsEnrolling] =
    useState<string | undefined>()
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [orgMembers, setOrgMembers] = useState<any[]>([])
  const [canEnrollFromOrganization, setCanEnrollFromOrganization] = useState(false)

  const loadOrganizationMember = async () => {
    const { data: orgUsers } = await OrganizationApi.getUsers(orgId)
    console.log('orgUsers', orgUsers)
    setOrgMembers(orgUsers)
  }

  const reloadOrganizationMember = () => {
    if (orgId) {
      setIsLoadingOrgMembers(true)
      loadOrganizationMember().finally(() => setIsLoadingOrgMembers(false))
    } else {
      setCanEnrollFromOrganization(true)
    }
  }

  const enrollOrganizationMember = (userId: string) => {
    setThisOrganizationMemberIsEnrolling(userId)
  }

  useEffect(() => {
    setIsModalOpened(true)

    reloadOrganizationMember()
  }, [orgId])

  return (
    <Modal
      closable
      open={isModalOpened}
      onCancel={() => {
        onClose()
        setIsModalOpened(false)
      }}
      footer={false}
    >
      <Tabs onChange={() => reloadOrganizationMember()}>
        <Tabs.TabPane tab="Desde datos" key="from-data">
          <RegisterUserAndEventUser
            screens={[]}
            stylePaddingMobile={stylePaddingMobile}
            stylePaddingDesktop={stylePaddingDesktop}
            requireAutomaticLoguin={false}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Desde miembros" key="from-org-member">
          {canEnrollFromOrganization ? (
            <Result
              status="warning"
              title="No implementado"
              subTitle="No se puede usar esto porque no se ha proporcionado datos de la organización"
            />
          ) : (
            <List
              bordered
              size="small"
              loading={isLoadingOrgMembers}
              header={<>Miembros de la organización</>}
              dataSource={orgMembers}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <Comment
                    author={item.user.names}
                    content={item.position_name ?? 'Sin cargo'}
                    avatar={<Avatar src={item.picture} />}
                    actions={[
                      <Button
                        key={0}
                        type="primary"
                        onClick={() => {
                          enrollOrganizationMember(item.user._id)
                        }}
                        disabled={thisOrganizationMemberIsEnrolling === item.user._id}
                        icon={
                          thisOrganizationMemberIsEnrolling === item.user._id ? (
                            <LoadingOutlined />
                          ) : (
                            <PlusOutlined />
                          )
                        }
                      >
                        Inscribir
                      </Button>,
                    ]}
                  />
                </List.Item>
              )}
            />
          )}
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  )
}

export default EnrollEventUserFromOrganizationMember
