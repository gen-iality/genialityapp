import { useEffect, useState } from 'react'
import { PositionsApi, OrganizationApi } from '@helpers/request'

/** Antd imports */
import { Table, Button, Row, Col, Radio } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

/** Components */
import Header from '@antdComponents/Header'
import PositionsFormModal from '@components/modal/PositionsFormModal'
import positionsTableColumns from './tableColums/positionsTableColumns'

/** Context */
import withContext from '@context/withContext'
import { PositionResponseType } from '@Utilities/types/PositionType'

interface Props {
  path: string
  org: { _id: string; default_position_id?: string | null }
}

function OrganizationPositionsPage(props: Props) {
  const [positionsData, setPositionsData] = useState<any[]>([])
  const [orgEventsData, setOrgEventsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { _id: organizationId } = props.org

  const modalHandler = PositionsFormModal.usePositionsFormModal()

  async function requestAllPositions() {
    setIsLoading(true)
    const positions: PositionResponseType[] = await PositionsApi.getAllByOrganization(
      organizationId,
    )
    const positionsWithUsers = await Promise.all(
      positions.map(async (position) => {
        const users: any[] = await PositionsApi.Organizations.getUsers(
          organizationId,
          position._id,
        )
        return {
          ...position,
          users,
          key: position._id,
        }
      }),
    )
    setPositionsData(positionsWithUsers)
    setIsLoading(false)
    console.debug('OrganizationPositionsPage: got positions', { positions })
  }

  async function requestOrgEvents() {
    setIsLoading(true)
    const response = await OrganizationApi.events(organizationId)
    const orgEvents = response.data
    setOrgEventsData(orgEvents)
    setIsLoading(false)
    console.debug('OrganizationPositionsPage: got orgEvents', { orgEvents })
  }

  const onDefaultPositionChange = async (positionId: string) => {
    console.log('default position changed to', positionId)
    OrganizationApi.editDefaultPosition(organizationId, positionId)
  }

  useEffect(() => {
    requestAllPositions()
    requestOrgEvents()
  }, [modalHandler.isOpened])

  return (
    <Radio.Group
      onChange={(e) => {
        const positionId = e.target.value
        onDefaultPositionChange(positionId)
      }}
      defaultValue={props.org.default_position_id}>
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
          <Row wrap justify="end" gutter={[8, 8]}>
            <Col>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => modalHandler.open()}>
                Agregar cargo
              </Button>
            </Col>
          </Row>
        )}
      />
      <PositionsFormModal handler={modalHandler} organizationId={organizationId} />
    </Radio.Group>
  )
}
export default withContext(OrganizationPositionsPage)
