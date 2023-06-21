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
import { AttendeeApi, OrganizationApi } from '@helpers/request'
import { CheckOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { UsersApi } from '@helpers/request'
import { StateMessage } from '@context/MessageService'
import { useIntl } from 'react-intl'

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
  eventId?: string
  onClose?: () => void
}

// TODO: take a enrolled user to show as added already

const EnrollEventUserFromOrganizationMember: FunctionComponent<
  IEnrollEventUserFromOrganizationMemberProps
> = (props) => {
  const { eventId, orgId, onClose = () => {} } = props

  const [isLoadingOrgMembers, setIsLoadingOrgMembers] = useState(false)
  const [isLoadingEventUsers, setIsLoadingEventUsers] = useState(false)
  const [thisOrganizationMemberIsEnrolling, setThisOrganizationMemberIsEnrolling] =
    useState<string | undefined>()
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [orgMembers, setOrgMembers] = useState<any[]>([])
  const [eventUsers, setEventUsers] = useState<any[]>([])
  const [canEnrollFromOrganization, setCanEnrollFromOrganization] = useState(false)

  const intl = useIntl()

  const loadOrganizationMembers = async () => {
    const { data: orgUsers } = await OrganizationApi.getUsers(orgId)
    console.log('orgUsers', orgUsers)
    setOrgMembers(orgUsers)
  }

  const loadEventUsers = async () => {
    const { data: attendees } = await AttendeeApi.getAll(eventId)
    console.log('attendees:', attendees)
    setEventUsers(attendees)
  }

  const reloadOrganizationMembers = () => {
    if (orgId) {
      setIsLoadingOrgMembers(true)
      loadOrganizationMembers().finally(() => setIsLoadingOrgMembers(false))
    } else {
      setCanEnrollFromOrganization(true)
    }
  }

  const reloadEventUsers = () => {
    if (eventId) {
      setIsLoadingEventUsers(true)
      loadEventUsers().finally(() => setIsLoadingEventUsers(false))
    } else {
      setIsLoadingEventUsers(false)
    }
  }

  const enrollOrganizationMember = async (user: any) => {
    setThisOrganizationMemberIsEnrolling(user._id)

    // Back-End says that the required params are:
    const userProperties = {
      properties: {
        email: user.email,
        names: user.names,
      },
    }
    console.debug('send userProperties:', userProperties)
    const noSendMail = true

    try {
      const respUser = await UsersApi.createOne(userProperties, eventId, noSendMail)
      if (respUser && respUser._id) {
        StateMessage.show(
          null,
          'success',
          intl.formatMessage({
            id: 'text_error.successfully_registered',
            defaultMessage: 'Te has inscrito correctamente a este curso',
          }),
        )
      }
    } catch (err) {
      console.error(err)
      StateMessage.show(null, 'error', 'No se ha podido registrar a ese usuario')
    } finally {
      setThisOrganizationMemberIsEnrolling(undefined)
    }
  }

  const checkEnrolling = (userId: string) => {
    return eventUsers.some((attendee) => attendee.account_id === userId)
  }

  useEffect(() => {
    setIsModalOpened(true)

    reloadOrganizationMembers()
    reloadEventUsers()
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
      <Tabs onChange={() => reloadOrganizationMembers()}>
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
              loading={isLoadingOrgMembers || isLoadingEventUsers}
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
                        type={checkEnrolling(item.user._id) ? 'primary' : 'dashed'}
                        onClick={() => {
                          enrollOrganizationMember(item.user)
                        }}
                        disabled={
                          thisOrganizationMemberIsEnrolling === item.user._id ||
                          checkEnrolling(item.user._id)
                        }
                        icon={
                          checkEnrolling(item.user._id) ? (
                            <CheckOutlined />
                          ) : thisOrganizationMemberIsEnrolling === item.user._id ? (
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
