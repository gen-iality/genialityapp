import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Tooltip,
  Table,
  Typography,
  Button,
  Alert,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { UsersApi } from '@helpers/request'
import { DiffOutlined } from '@ant-design/icons'

export interface CertificationLogsByUsersPageProps {
  event: any,
  match: any,
}

/**
 * Create a page that requests for all users data to render an user list and their
 * certification logs. Also, it enables to add a certification log via a new form
 * in a Modal component. The default values are loaded from the current event data.
 * 
 * @param props CertificationLogsByUsersPageProps
 * @returns React Component
 */
function CertificationLogsByUsersPage(props: CertificationLogsByUsersPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const history = useHistory()
  console.log(props.match)

  const loadAllUsers = async () => {
    setIsLoading(true)
    const result: any = await UsersApi.getAll(props.event._id)
    const allUsers = result.data.map((data: any) => data.user) as any[]
    setUsers(allUsers)
    console.log('allUsers:', allUsers)
    setIsLoading(false)
  }

  const columns: ColumnsType<any> = [
    {
      key: 'user',
      title: 'Usuario',
      dataIndex: 'names',
      render: (names: string) => <>{names}</>
    },
    {
      key: 'count',
      title: 'Cantidad de histórico',
      dataIndex: 'certification_logs',
      ellipsis: true,
      render: (certificationLogs: any[]) => <>{certificationLogs.length} historias de certificaciones</>
    },
    {
      key: 'option',
      width: 150,
      title: 'Opciones',
      render: (user: any) => (
        <Tooltip title="Ver certificaciones">
          <Button
            type="primary"
            icon={<DiffOutlined />}
            onClick={() => {
              history.push(`${props.match.path}/${user._id}`)
              // We can send the user by router navigation states, but I think
              // that using the user ID in the URL path is the best implementation
            }}
          />
        </Tooltip>
      ),
    },
  ]

  useEffect(() => {
    // Load users
    loadAllUsers().then()
  }, [])

  return (
    <>
    <Typography.Title>Histório de certificaciones por usuarios</Typography.Title>
    <Typography.Text>
      Agregue o edite el historial de certificaciones a un usuario de este curso
    </Typography.Text>

    {!props.event.is_external && (
      <Alert type="warning" message={<>¡Cuidado! este curso no ha sido configurado como <b>Curso Externo</b></>} />
    )}

    <Table
      loading={isLoading}
      columns={columns}
      dataSource={users}
    />
    </>
  )
}

export default CertificationLogsByUsersPage
