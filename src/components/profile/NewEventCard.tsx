import { FunctionComponent, useState } from 'react'
import { Space, Typography, Card } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ModalCreateOrg from './modalCreateOrg'
import ModalOrgListCreate from '@components/events/createEvent/newEvent/ModalOrgListCreate'
import functionCreateNewOrganization from './functionCreateNewOrganization'
import { useNewEventContext, NewEventActionEnum } from '@context/newEventContext'

interface INewEventCardProps {
  entityType: string
  org?: any[]
  fetchItem?: any
  user: any
}

const NewEventCard: FunctionComponent<INewEventCardProps> = (props) => {
  const { entityType, org, fetchItem, user } = props

  const entity = entityType ?? 'event'
  const [modalCreateOrgIsVisible, setModalCreateOrgIsVisible] = useState(false)
  const [modalListOrgIsVisible, setModalListOrgIsVisible] = useState(false)
  const { dispatch } = useNewEventContext()

  const newOrganization = () => {
    setModalCreateOrgIsVisible(true)
  }
  const newEvent = () => {
    if (org && org.length > 0) {
      setModalListOrgIsVisible(true)
      dispatch({ type: NewEventActionEnum.VISIBLE_MODAL, payload: { visible: true } })
    } else {
      const newValues = {
        name: user.value.names || user.value.displayName,
        logo: null,
        newEventWithoutOrganization: true,
        closeModal: setModalListOrgIsVisible,
      }
      functionCreateNewOrganization(newValues)
    }
  }

  return (
    <>
      {modalCreateOrgIsVisible && (
        <ModalCreateOrg
          modalCreateOrgIsVisible={modalCreateOrgIsVisible}
          setModalCreateOrgIsVisible={setModalCreateOrgIsVisible}
          fetchItem={fetchItem}
        />
      )}

      {/*modalListOrgIsVisible && (
        <ModalListOrg
          modalListOrgIsVisible={modalListOrgIsVisible}
          setModalListOrgIsVisible={setModalListOrgIsVisible}
          org={org}
          cUserId={user._id}
        />
      )*/}

      {modalListOrgIsVisible && (
        <ModalOrgListCreate
          modalListOrgIsVisible={modalListOrgIsVisible}
          setModalListOrgIsVisible={setModalListOrgIsVisible}
          org={org}
        />
      )}

      <Card
        onClick={entity === 'event' ? newEvent : newOrganization}
        style={{
          borderRadius: '10px',
          border: '2px dashed #cccccc',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Space
          size={5}
          direction="vertical"
          style={{ textAlign: 'center', width: '100%' }}
        >
          <PlusOutlined
            style={{
              fontSize: '80px',
              paddingTop: '10%',
              paddingBottom: '10%',
              color: '#cccccc',
            }}
          />
          <Typography.Text
            style={{
              fontSize: '15px',
              width: '120px',
              color: '#cccccc',
              fontWeight: 'bold',
            }}
          >
            {entity === 'event' ? 'Nuevo curso' : 'Nueva organizacion'}
          </Typography.Text>
        </Space>
      </Card>
    </>
  )
}

export default NewEventCard
