import { useHistory, useLocation, useRouteMatch, useParams, Link } from 'react-router-dom';
import { Table, Button, Row, Col, Spin } from 'antd';
import withContext from '../../context/withContext';
import Header from '../../antdComponents/Header';
import { useState, useEffect } from 'react';
import { GetTokenUserFirebase } from '@/helpers/HelperAuth';
import privateInstance, { UsersApi, CertsApi } from '@/helpers/request';
import { useGetCertificatesByEvents } from '../../components/eventOrganization/hooks/useGetCertificatesByEvents';
import moment from 'moment'
const getEventByAccountId = async (account_id) => {
  account_id = account_id || '64c9632e99b7ec0c050a20c2';
  try {
    let token = await GetTokenUserFirebase();
    const { data } = await privateInstance.get(`api/events/byaccountid/${account_id}?order=desc&token=${token}`);
    return {
      data: data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};

const certificatesByEvents = async (orgUserId) => {
  try {
    const data = await CertsApi.getByOrganizationUser(orgUserId);
    return {
      data: (data),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};

function OrgEvents(props: any) {
  let history = useHistory();
  let location = useLocation();
  let routeMatch = useRouteMatch();
  let { id, account_id, orguser_id } = useParams();

  const [events, setEvents] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [certificates, setCertificates] = useState(undefined);
  useEffect(() => {
    if (!account_id || !orguser_id) return;
    async function asinc() {
      let remoteData = await getEventByAccountId(account_id);
      console.log('events', remoteData);
      setEvents(remoteData.data);
      setError(remoteData.error);

      let remoteCertificates = await certificatesByEvents(orguser_id);
      setCertificates(remoteCertificates.data);
    }
    asinc();
  }, [account_id, orguser_id, id]);

  console.log('paramssss', id, account_id);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Fecha',
      dataIndex: 'datetime_from',
      key: 'datetime_from',
      render:(text,item) => {return <p>{moment(item.datetime_from).format('YYYY-MM-DD')}</p>}
    },
  ];


  const columns_certificados = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Fecha',
      dataIndex: 'datetime_from',
      key: 'datetime_from',
      render:(text,item) => {return <p>{moment(item?.event?.datetime_from).format('YYYY-MM-DD')}</p>}
    },
  ];

  return (
    <>
      <Link to={'/admin/organization/' + id + '/members'}>Regresar</Link>
      <Header title='Cursos' />
      <p>Account ID {account_id}</p>
      <p>Miembro Organización: {orguser_id}</p>

      {events === undefined ? (
        <Spin />
      ) : error ? (
        <>
          <h3>Problema al cargar los datos intente nuevamente más tarde</h3>
          <p>{error.message}</p>
        </>
      ) : (
        <>
          <p>Total: {events?.length || 0}</p>
          <Table
            columns={columns}
            dataSource={events}
            // loading={isLoading}
            size='small'
            rowKey='index'
            // pagination={pagination}
          />

<Header title='Certificados' />
          {certificates           &&
          
          <Table
            columns={columns_certificados}
            dataSource={certificates}
            // loading={isLoading}
            size='small'
            rowKey='index'
            // pagination={pagination}
          />} 
         
        </>
      )}
    </>
  );
}

export default withContext(OrgEvents);
