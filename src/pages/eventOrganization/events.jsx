import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { OrganizationApi } from '../../helpers/request';
import { Table, Button, Row, Col } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { columns } from './tableColums/eventTableColumns';
import withContext from '../../context/withContext';
import Header from '../../antdComponents/Header';
// import ExportExcel from '../newComponent/ExportExcel';

function OrgEvents(props) {
  const [eventData, setEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let { _id: organizationId } = props.org;
  const history = useHistory();

  async function getEventsStatisticsData() {
    const { data } = await OrganizationApi.getEventsStatistics(organizationId);

    setEventData(data);
    setIsLoading(false);
  }

  useEffect(() => {
    getEventsStatisticsData();
  }, []);

  function goToEvent(eventId) {
    const url = `/eventadmin/${eventId}/agenda`;
    history.replace({ pathname: url });
  }

  function linkToTheMenuRouteS(menuRoute) {
    window.open(`${window.location.origin}${menuRoute}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      <Header title='Cursos' />
      <Table
        columns={columns(goToEvent)}
        dataSource={eventData}
        loading={isLoading}
        size='small'
        rowKey='index'
        pagination={false}
        title={() => (
          <Row wrap justify='end' gutter={[8, 8]}>
            <Col>{/* <ExportExcel columns={columns(goToEvent)} list={eventData} fileName={'eventReport'} /> */}</Col>
            <Col>
              <Button
                type='primary'
                icon={<PlusCircleOutlined />}
                onClick={() => linkToTheMenuRouteS(`/create-event/${props.cUser?.value?._id}?orgId=${organizationId}`)}>
                {'Agregar'}
              </Button>
            </Col>
          </Row>
        )}
      />
    </>
  );
}

export default withContext(OrgEvents);
