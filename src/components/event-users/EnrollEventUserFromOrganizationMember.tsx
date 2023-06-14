/**
 * This component will replace the legacy code.
 *
 * This is the 1 of 65 parts (?)
 *
 * NOTE: The name can change in a future...
 */

import { Modal } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'
import RegisterUserAndEventUser from '@components/authentication/RegisterUserAndEventUser'

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
  onClose?: () => void
}

const EnrollEventUserFromOrganizationMember: FunctionComponent<
  IEnrollEventUserFromOrganizationMemberProps
> = (props) => {
  const { onClose = () => {} } = props

  const [isModalOpened, setIsModalOpened] = useState(false)

  useEffect(() => {
    setIsModalOpened(true)
  }, [])

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
      <RegisterUserAndEventUser
        screens={[]}
        stylePaddingMobile={stylePaddingMobile}
        stylePaddingDesktop={stylePaddingDesktop}
        requireAutomaticLoguin={false}
      />
    </Modal>
  )
}

export default EnrollEventUserFromOrganizationMember
