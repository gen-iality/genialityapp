import { useEffect, useState } from 'react';
import { PositionsApi, OrganizationApi } from '@helpers/request';

/** Antd imports */
import { Table, Button, Row, Col } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

/** Components */
import Header from '@antdComponents/Header';
import ModalPositions from '@components/modal/modalPositions';
import { columns } from './tableColums/positionsTableColumns';

/** Context */
import withContext from '@context/withContext';

function OrganizationPositionsPage(props) {
  console.debug('OrganizationPositionsPage: Props - OrgPositions', { props });

  const [positionsData, setPositionsData] = useState([]);
  const [orgEventsData, setOrgEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addOrEditPosition, setAddOrEditPosition] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const { _id: organizationId } = props.org;

  async function getOrgPositions() {
    const positions = await PositionsApi.Organizations.getAll(organizationId);
    const positionsWithUsers = await Promise.all(positions.map(async (position) => {
      const users = await PositionsApi.Organizations.getUsers(organizationId, position._id);
      return {
        ...position,
        users,
        key: position._id,
      }
    }))
    setPositionsData(positionsWithUsers);
    setIsLoading(false);
    console.debug('OrganizationPositionsPage: got positions', { positions });
  }

  async function getOrgEvents() {
    const response = await OrganizationApi.events(organizationId);
    const orgEvents = response.data;
    setOrgEventsData(orgEvents);
    setIsLoading(false);
    console.debug('OrganizationPositionsPage: got orgEvents', { orgEvents });
  }

  useEffect(() => {
    getOrgPositions();
    getOrgEvents();
  }, [addOrEditPosition]);

  function closeOrOpenModalPositions() {
    setAddOrEditPosition((prevState) => {
      return !prevState;
    });
  }

  function addPosition() {
    setSelectedPosition(null);
    closeOrOpenModalPositions();
  }

  function editModalPosition(item) {
    setSelectedPosition(item);
    closeOrOpenModalPositions();
  }

  return (
    <>
      <Header title={'Cargos'} />
      <Table
        columns={columns(editModalPosition, orgEventsData, props.path)}
        dataSource={positionsData}
        size='small'
        rowKey='index'
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
        title={() => (
          <Row wrap justify='end' gutter={[8, 8]}>
            <Col>
              <Button type='primary' icon={<PlusCircleOutlined />} onClick={addPosition}>
                {'Agregar cargo'}
              </Button>
            </Col>
          </Row>
        )}
      />
      {addOrEditPosition && (
        <ModalPositions
          value={selectedPosition}
          closeOrOpenModalPositions={closeOrOpenModalPositions}
          organizationId={organizationId}
        />
      )}
    </>
  );
}
export default withContext(OrganizationPositionsPage);
