import { useEffect, useState } from 'react'
import { PositionsApi, OrganizationApi } from '@helpers/request'

/** Antd imports */
import { Table, Button, Row, Col } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

/** Components */
import Header from '@antdComponents/Header'
import PositionsFormModal from '@components/modal/PositionsFormModal'
import positionsTableColumns from './tableColums/positionsTableColumns'

/** Context */
import withContext from '@context/withContext'
import { PositionResponseType } from '@Utilities/types/PositionType'

function OrganizationPositionsPage(props: { path: string, org: { _id: string } }) {
  const [positionsData, setPositionsData] = useState<any[]>([])
  const [orgEventsData, setOrgEventsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addOrEditPosition, setAddOrEditPosition] = useState(false)
  const { _id: organizationId } = props.org

  const modalHandler = PositionsFormModal.usePositionsFormModal()

  async function getOrgPositions() {
    setIsLoading(true)
    const positions: PositionResponseType[] = await PositionsApi.getAllByOrganization(organizationId)
    const positionsWithUsers = await Promise.all(positions.map(async (position) => {
      const users: any[] = await PositionsApi.Organizations.getUsers(organizationId, position._id)
      return {
        ...position,
        users,
        key: position._id,
      }
    }))
    setPositionsData(positionsWithUsers)
    setIsLoading(false)
    console.debug('OrganizationPositionsPage: got positions', { positions })
  }

  async function getOrgEvents() {
    setIsLoading(true)
    const response = await OrganizationApi.events(organizationId)
    const orgEvents = response.data
    setOrgEventsData(orgEvents)
    setIsLoading(false)
    console.debug('OrganizationPositionsPage: got orgEvents', { orgEvents })
  }

  useEffect(() => {
    getOrgPositions()
    getOrgEvents()
  }, [modalHandler.isOpened])

  return (
    <>
      <Header title="Cargos" />
      <Table
        columns={positionsTableColumns(modalHandler.open, orgEventsData, props.path)}
        dataSource={positionsData}
        size="small"
        rowKey="index"
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
        title={() => (
          <Row wrap justify='end' gutter={[8, 8]}>
            <Col>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => modalHandler.open()}
              >
                  Agregar cargo
              </Button>
            </Col>
          </Row>
        )}
      />
      <PositionsFormModal
        handler={modalHandler}
        organizationId={organizationId}
      />
    </>
  )
}
export default withContext(OrganizationPositionsPage)
