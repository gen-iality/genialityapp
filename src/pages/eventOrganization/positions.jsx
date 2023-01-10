import { useEffect, useState } from 'react';
import { PositionsApi } from '@helpers/request';

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
  console.log('300. OrgPositions - props', props);

  const [positionsData, setPositionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addOrEditPosition, setAddOrEditPosition] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const { _id: organizationId } = props.org;

  async function getOrgPositions() {
    const positions = await PositionsApi.Organizations.getAll(organizationId);
    console.log('300. positions', positions);
    setPositionsData(positions);
    setIsLoading(false);
  }

  useEffect(() => {
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
