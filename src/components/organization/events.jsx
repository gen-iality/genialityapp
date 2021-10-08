import React, { useEffect, useState } from 'react';
import Loading from '../loaders/loading';
import { useHistory } from 'react-router-dom';
import { getCurrentUser, OrganizationApi } from '../../helpers/request';
import { Table, Button, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { columns } from './tableColums/eventTableColumns';
import withContext from '../../Context/withContext';

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
      window.open(`${window.location.origin}${menuRoute}`, '_blank', 'noopener,noreferrer')
   }
console.log("10. props ", props)
   return (
      <>
         {isLoading ? (
            <Loading />
         ) : (
            <>
               <Row justify='start' style={{ marginBottom: '10px' }}>
                  <Button
                     onClick={() => linkToTheMenuRouteS(`/create-event/${props.cUser?.value?._id}?orgId=${organizationId}`)}
                     style={{ marginLeft: 20 }}
                     icon={<PlusOutlined />}>
                     Crear Evento
                  </Button>
               </Row>
               <Table
                  columns={columns(goToEvent)}
                  dataSource={eventData}
                  size='small'
                  rowKey='index'
                  pagination={false}
                  scroll={{ x: 1300 }}
               />
            </>
         )}
      </>
   );
}

export default withContext(OrgEvents);
