import { LoadingOutlined } from '@ant-design/icons'
import { StateMessage } from '@context/MessageService'
import { OrganizationApi, UsersApi } from '@helpers/request'
import { Result } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'
import { useParams } from 'react-router'

type Params = {
  id: string
  userId: string
}

interface ICertificatesByUserProps {}

const CertificatesByUser: FunctionComponent<ICertificatesByUserProps> = (props) => {
  const { id: organizationId, userId } = useParams<Params>()

  const [isLoading, setisLoading] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [organization, setOrganization] = useState<any | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [eventUsers, setEventUsers] = useState<any[]>([])

  const requestData = async () => {
    try {
      const value = await OrganizationApi.getOne(organizationId)
      setOrganization(value)
    } catch (err) {
      StateMessage.show(null, 'error', JSON.stringify(err))
      console.error(err)
    }

    try {
      const value = await UsersApi.getProfile(userId)
      setUser(value)
    } catch (err) {
      StateMessage.show(null, 'error', JSON.stringify(err))
      console.error(err)
    }

    let events: any[] = []
    try {
      const { data: value } = await OrganizationApi.events(organizationId)
      console.log(value)
      events = [...value]
      setEvents(value)
    } catch (err) {
      StateMessage.show(null, 'error', JSON.stringify(err))
      console.error(err)
    }

    try {
      const value = await Promise.all(
        events.map(async (event) => {
          return await UsersApi.getOne(event._id, userId)
        }),
      )
      setEventUsers(value)
    } catch (err) {
      StateMessage.show(null, 'error', JSON.stringify(err))
      console.error(err)
    }
  }

  useEffect(() => {
    if (!userId || !organizationId) return

    setisLoading(true)
    requestData().finally(() => setisLoading(false))
  }, [userId, organizationId])

  return (
    <>
      events: {events.length} - event users: {eventUsers.length}
    </>
  )

  if (isLoading) {
    return (
      <Result
        icon={<LoadingOutlined />}
        title="Cargando"
        subTitle="Recuperando datos..."
      />
    )
  }

  return null
}

export default CertificatesByUser
