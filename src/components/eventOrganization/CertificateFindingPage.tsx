import { LinkOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  Col,
  Input,
  List,
  Result,
  Row,
  Space,
  Spin,
  Table,
  Typography,
} from 'antd'
import { FunctionComponent } from 'react'
import { useParams } from 'react-router'
import useCertificateFinder from './hooks/useCertificateFinder'
import { Link } from 'react-router-dom'
import { ColumnsType } from 'antd/lib/table'

interface ICertificateFindingPageProops {}

const CertificateFindingPage: FunctionComponent<ICertificateFindingPageProops> = () => {
  const params = useParams()
  const orgId = params.id

  const {
    isLoading,
    isSearching,
    organization,
    items,
    search,
    pattern,
    updatePattern,
    isRequestingForCerts,
    // limitOfPreloading,
    preloadedCerts,
    preloadCertsByUser,
  } = useCertificateFinder(orgId)

  if (isLoading) {
    return <Spin size="large" spinning tip="Cargando datos de la organización" />
  }

  if (organization === null) {
    return (
      <Result
        status="error"
        title="Error al obtener los datos"
        subTitle="No se ha podido cargar los datos. Intente nuevamente"
      />
    )
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Nombre',
      width: '300px',
      render: (item) => (
        <>
          <Link to={`./${item.account_id}`}>
            <Typography.Title level={5}>
              <LinkOutlined /> {item.user?.names}
            </Typography.Title>
          </Link>
          {preloadedCerts[item.user._id] ? (
            <Typography.Text italic style={{ fontSize: '1rem' }}>
              Tiene {preloadedCerts[item.user._id].length} certificados
            </Typography.Text>
          ) : (
            <Button
              type="link"
              onClick={() => {
                preloadCertsByUser(item.user._id)
              }}
              style={{
                fontSize: '1rem',
              }}
            >
              Click para consultar el número de certificados
            </Button>
          )}
        </>
      ),
    },
    {
      title: 'Correo',
      render: (item) => <Typography.Text>{item.user?.email}</Typography.Text>,
    },
    {
      title: 'Opciones',
      width: '300px',
      render: (item) => (
        <>
          <Link to={`./${item.account_id}`}>
            <Badge
              count="Consultar"
              style={{
                backgroundColor: preloadedCerts[item.user._id] ? 'green' : 'red',
              }}
            />
          </Link>
        </>
      ),
    },
  ]

  const SearchStatus = ({ results }: { results: any[] }) => (
    <>
      {results.length} Resultados
      {isRequestingForCerts && (
        <>
          {' - '}
          Precargando certificados <LoadingOutlined />
        </>
      )}
    </>
  )

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col flex="auto">
          <Space
            direction="horizontal"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Input
              autoFocus
              size="large"
              style={{ width: '400px' }}
              value={pattern}
              onChange={(event) => updatePattern(event.target.value)}
              placeholder="Término a buscar: correo, nombre, etc. (quizás)"
              onPressEnter={() => search()}
            />
            <Button icon={<SearchOutlined />} size="large" onClick={() => search()}>
              Buscar
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ margin: 15 }}>
        <Col flex="auto">
          <Table
            sticky
            loading={isSearching}
            columns={columns}
            dataSource={items}
            title={() => <SearchStatus results={items} />}
            footer={() => (pattern ? `término buscado: ${pattern}` : undefined)}
            pagination={{ defaultPageSize: 15 }}
          />
        </Col>
      </Row>
    </>
  )
}

export default CertificateFindingPage
