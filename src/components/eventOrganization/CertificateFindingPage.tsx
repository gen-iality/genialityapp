import { SearchOutlined } from '@ant-design/icons'
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
  Typography,
} from 'antd'
import { FunctionComponent } from 'react'
import { useParams } from 'react-router'
import useCertificateFinder from './hooks/useCertificateFinder'

interface ICertificateFindingPageProops {}

const CertificateFindingPage: FunctionComponent<ICertificateFindingPageProops> = () => {
  const params = useParams()
  const orgId = params.id

  const { isLoading, isSearching, organization, items, search, pattern, updatePattern } =
    useCertificateFinder(orgId)

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
          <List
            dataSource={items}
            loading={isSearching}
            header={`${items.length} Resultados`}
            footer={pattern ? `término buscado: ${pattern}` : undefined}
            renderItem={(item) => (
              <List.Item style={{ width: '100%' }}>
                <Row
                  gutter={[10, 10]}
                  style={{
                    width: '100%',
                  }}
                  wrap={false}
                >
                  <Col flex="200px">
                    <Typography.Title level={5}>{item.user?.names}</Typography.Title>
                  </Col>

                  <Col flex="300px">
                    <Typography.Text>{item.user?.email}</Typography.Text>
                  </Col>

                  <Col flex="auto"></Col>

                  <Col>
                    <Button type="text" disabled>
                      <Badge count="Certificado" style={{ backgroundColor: 'red' }} />
                    </Button>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  )
}

export default CertificateFindingPage
