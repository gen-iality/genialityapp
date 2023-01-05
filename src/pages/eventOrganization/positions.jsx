import { useEffect, useState } from 'react';
import { OrganizationApi, RolAttApi, EventsApi, AgendaApi, PositionsApi } from '@helpers/request';
import { FormattedDate, FormattedTime } from 'react-intl';
import { firestore } from '@helpers/firebase';
/** export Excel */
import { useHistory } from 'react-router-dom';
import { Table, Button, Row, Col, Tag } from 'antd';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { columns } from './tableColums/positionsTableColumns';
import ModalPositions from '@components/modal/modalPositions';
import dayjs from 'dayjs';
import withContext from '@context/withContext';
import { utils, writeFileXLSX } from 'xlsx';
import Header from '@antdComponents/Header';

//const positionsData = [{ position: 'Operador junior' }, { position: 'Operador senior' }];

function OrgPositions(props) {
  const [positionsData, setPositionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [searchText, setSearchText] = useState('');
  //const [searchedColumn, setSearchedColumn] = useState('');
  const [addOrEditPosition, setAddOrEditPosition] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  //const [editPosition, setEditPosition] = useState(false);
  const { _id: organizationId } = props.org;
  //const history = useHistory();

  console.log('300. OrgPositions - props', props);

  async function getOrgPositions() {
    const positions = await PositionsApi.Organizations.getAll(organizationId);
    setPositionsData(positions);
    console.log('300. positions', positions);
  }

  useEffect(() => {
    //setTimeout(() => getOrgPositions(), 5000);
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
    //setEditPosition(true);
  }

  /* const columnsData = {
    searchedColumn,
    setSearchedColumn,
    searchText,
    setSearchText,
  }; */

  return (
    <>
      <Header title={'Cargos'} />
      {console.log('300. positionsData', positionsData)}

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
          {...props}
        />
      )}
    </>
  );
}
export default withContext(OrgPositions);
