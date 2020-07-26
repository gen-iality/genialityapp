import { Button, Empty, Row, Table, Tag, Typography } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import Loading from '../loaders/loading'
import useGetEventCompanies from './customHooks/useGetEventCompanies'

const { Title } = Typography
const tableLocale = {
  emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No hay datos" />
}

function Empresas({ event, match }) {
  const [companies, loadingCompanies] = useGetEventCompanies(event._id)

  const companyColumns = useMemo(() => {
    return [
      {
        title: 'Nombre',
        dataIndex: 'name',
        render(companyName, record) {
          return (
            <Link
              to={`${match.url}/editar/${record.id}`}
              title="Editar"
            >
              {companyName}
            </Link>
          )
        }
      },
      {
        title: 'Tipo',
        dataIndex: 'stand_type'
      },
      {
        title: 'Visible',
        dataIndex: 'visible',
        render(visible) {
          return visible
            ? <Tag color="green">{'Visible'}</Tag>
            : <Tag color="red">{'Oculto'}</Tag>
        }
      },
    ]
  }, [match.url])

  if (loadingCompanies) {
    return <Loading />
  }

  return (
    <div>
      <Title level={4}>{'Empresas'}</Title>

      <Row justify="end" style={{ marginBottom: '10px' }}>
        <Link to={`${match.url}/crear`}>
          <Button type="primary" icon={<PlusCircleOutlined />}>
            {'Crear empresa'}
          </Button>
        </Link>
      </Row>

      <Table
        locale={tableLocale}
        dataSource={companies}
        columns={companyColumns}
        pagination={false}
      />
    </div>
  )
}

export default Empresas
