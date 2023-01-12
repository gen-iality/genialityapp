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

function OrgPositions(props) {
  console.log('300. Props - OrgPositions', props);

  const [positionsData, setPositionsData] = useState([]);
  const [orgEventsData, setOrgEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addOrEditPosition, setAddOrEditPosition] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const { _id: organizationId } = props.org;

  async function getOrgPositions() {
    console.log('2. Antes de hacer petición de positions: ');
    const positions = await PositionsApi.Organizations.getAll(organizationId);
    console.log('2. positions', positions);
    setPositionsData(positions);
    setIsLoading(false);
  }

  async function getOrgEvents() {
    console.log('1. Antes de hacer petición de eventos: ');
    const response = await OrganizationApi.events(organizationId);
    const orgEvents = response.data;
    console.log('1. orgEvents', orgEvents);
    setOrgEventsData(orgEvents);
    setIsLoading(false);

    const positionData = positionsData.map((positionData) => {
      const eventsFiltered = orgEventsData.filter((orgEvent) => positionData.event_ids.includes(orgEvent._id));
      console.log('3. eventsFiltered', eventsFiltered);

      return {
        ...positionData,
        event_names: eventsFiltered.map((eventFiltered) => eventFiltered.name),
      };
    });

    setPositionsData(positionData);
  }

  useEffect(() => {
    getOrgEvents();
    getOrgPositions();
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
      {console.log('300. positionsData', positionsData)}
      <Header title={'Cargos'} />
      <Table
        columns={columns(editModalPosition)}
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
                {'Agregar'}
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
export default withContext(OrgPositions);
