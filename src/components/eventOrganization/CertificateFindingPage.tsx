import { SearchOutlined } from '@ant-design/icons'
import { OrganizationApi } from '@helpers/request'
import { Button, Col, Input, List, Result, Row, Space, Spin } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'
import { useParams } from 'react-router'

interface ICertificateFindingPageProops {}

const CertificateFindingPage: FunctionComponent<ICertificateFindingPageProops> = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchedItems, setSearchedItems] = useState<any[]>([])
  const [organization, setOrganization] = useState<any | null>(null)

  const params = useParams()
  const orgId = params.id

  const search: (value: string) => Promise<any[]> = async (value) => {
    console.debug(`searching for "${value}"...`)
    // Wait for the backend development...
    return []
  }

  const startSearching = () => {
    if (!searchText) return

    setIsSearching(true)
    search(searchText)
      .then((values) => {
        setSearchedItems(values)
      })
      .finally(() => {
        setIsSearching(false)
      })
  }

  const onSearch = () => {
    startSearching()
  }

  useEffect(() => {
    if (!orgId) return

    setIsLoading(true)
    OrganizationApi.getOne(orgId)
      .then((value) => {
        setOrganization(value)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [orgId])

  //   useEffect(() => {
  //     startSearching()
  //   }, [searchText])

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
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Término a buscar: correo, nombre, IDs, etc."
            />
            <Button icon={<SearchOutlined />} size="large" onClick={onSearch}>
              Buscar
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ margin: 15 }}>
        <Col flex="auto">
          <List
            dataSource={[]}
            loading={isSearching}
            header={`${searchedItems.length} Resultados`}
            footer={searchText ? `término buscado: ${searchText}` : undefined}
          />
        </Col>
      </Row>
    </>
  )
}

export default CertificateFindingPage
