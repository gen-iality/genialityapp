import { LoadingOutlined } from '@ant-design/icons'
import { UsersApi, EventsApi, RolAttApi } from '@helpers/request'
import { Button, Result, Space, Table, Typography } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useCertificateFinder from './hooks/useCertificateFinder'
import { ColumnsType } from 'antd/lib/table'
import CertificateType from '@Utilities/types/CertificateType'

import CertificateDownloader from '@components/certificates/CertificateDownloader'

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
  const [cacheRoles, setCacheRoles] = useState<{ [key: string]: any }>({})
  const [currentEvent, setCurrentEvent] = useState<any | null>(null)

  const [roles, setRoles] = useState<any[]>([])

  const [selectedCertificateToDownload, setSelectedCertificateToDownload] = useState<
    CertificateType | undefined
  >()

  const [columns] = useState<ColumnsType<any>>([
    {
      title: 'Certificado',
      dataIndex: 'name',
    },
    {
      title: 'Curso',
      dataIndex: 'event',
      render: (event: any) => event.name,
    },
    {
      title: 'Opciones',
      render: ({ cert, roles, event }) => {
        return (
          <Button
            onClick={() => {
              setCurrentEvent(event)
              setSelectedCertificateToDownload(cert)
              setRoles(roles)
            }}
          >
            Precargar
          </Button>
        )
      },
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
        let roles: any[] = cacheRoles[event_id]
        if (!event) {
          event = await EventsApi.getOne(event_id)

          setCacheEvents((previous) => ({
            ...previous,
            [event_id]: event,
          }))
        }

        if (!roles) {
          roles = await RolAttApi.byEvent(event_id)
          setCacheRoles
        }

        setRoles(roles)

        console.debug({ name, event, roles })

        return { name, event, cert, roles }
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
      {selectedCertificateToDownload && (
        <p>Seleccionado: {selectedCertificateToDownload.name}</p>
      )}
      <Table loading={isLoadingTable} dataSource={dataSource} columns={columns} />
      <CertificateDownloader
        user={user}
        event={currentEvent}
        roles={roles}
        organizationId={organizationId}
        cert={selectedCertificateToDownload}
        certificateName={`certificate of ${user?.names} para ${currentEvent?.name}.pdf`}
      />
    </Space>
  )
}

export default CertificatesByUser
