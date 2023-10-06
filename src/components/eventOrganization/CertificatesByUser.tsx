import { LoadingOutlined } from '@ant-design/icons'
import { StateMessage } from '@context/MessageService'
import { UsersApi, EventsApi } from '@helpers/request'
import { Result, Space, Table, Typography } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useCertificateFinder from './hooks/useCertificateFinder'
import { ColumnsType } from 'antd/lib/table'

type Params = {
  id: string
  userId: string
}

interface ICertificatesByUserProps {}

const CertificatesByUser: FunctionComponent<ICertificatesByUserProps> = (props) => {
  const { id: organizationId, userId } = useParams<Params>()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [certs, setCerts] = useState<any[]>([])

  const [dataSource, setDataSource] = useState<any>([])
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const [cacheEvents, setCacheEvents] = useState<{ [key: string]: any }>({})

  const [columns] = useState<ColumnsType>([
    {
      title: 'Certificado',
      dataIndex: 'name',
    },
    {
      title: 'Curso',
      dataIndex: 'event',
      render: (event: any) => event.name,
    },
  ])

  const { loadCertsByUser } = useCertificateFinder(organizationId)

  useEffect(() => {
    if (!userId) return

    UsersApi.getProfile(userId).then((data) => {
      setUser(data)
    })

    setIsLoading(true)
    loadCertsByUser(userId)
      .then((certs) => {
        setCerts(certs)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [userId])

  useEffect(() => {
    setIsLoadingTable(true)
    Promise.all(
      certs.map(async (cert) => {
        const { name, event_id } = cert

        let event: any = cacheEvents[event_id]
        if (!event) {
          event = await EventsApi.getOne(event_id)

          setCacheEvents((previous) => ({
            ...previous,
            [event_id]: event,
          }))
        }

        console.debug({ name, event })

        return { name, event }
      }),
    )
      .then((result) => {
        console.debug('result', result)
        setDataSource(result)
      })
      .finally(() => {
        setIsLoadingTable(false)
      })
  }, [certs])

  if (isLoading) {
    return (
      <Result
        icon={<LoadingOutlined />}
        title="Cargando"
        subTitle="Recuperando datos (esto puede demorar una eternidad)..."
      />
    )
  }

  return (
    <Space direction="vertical">
      {user && <Typography.Title>{user.names}</Typography.Title>}
      <Table loading={isLoadingTable} dataSource={dataSource} columns={columns} />
    </Space>
  )
}

export default CertificatesByUser
