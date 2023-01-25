/** React's libraries */
import { useEffect, useState } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

/** export Excel */
import { utils, writeFileXLSX } from 'xlsx';

/** Antd imports */
import { Table, Button, Row, Col, Tag, Spin } from 'antd';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';

/** Components */
import Header from '@antdComponents/Header';
import ModalMembers from '@components/modal/modalMembers';
import { columns } from './tableColums/registeredTableColumns';

/** Helpers and utils */
import { OrganizationApi, RolAttApi, EventsApi, AgendaApi, PositionsApi } from '@helpers/request';
import { firestore } from '@helpers/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

/** Context */
import withContext from '@context/withContext';
import { async } from 'ramda-adjunct';

function OrgRegisteredUsers(props) {
  const { _id: organizationId } = props.org;

  const [usersSuscribedData, setUsersSuscribedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const getRegisteredUsers = async (organizationId) => {
    const userSuscribedData = [];

    const { data: orgEvents } = await OrganizationApi.events(organizationId);
    console.log('orgEvents', orgEvents);

    /* const eventIdGeniality = '633c3faf6ddd2a144254b192';
    const asistentes = firestore.collection(`${eventIdGeniality}_event_attendees`); */

    orgEvents.map(async (orgEvent) => {
      const asistentes = firestore.collection(`${orgEvent._id}_event_attendees`);
      const querySnapshot = await getDocs(asistentes);
      querySnapshot.forEach((doc) => {
        const properties = {
          //checked_in: orgEvent.checked_in,
          eventUser_name: doc.data().properties.names,
          event_name: orgEvent.name,
          created_at: orgEvent.created_at,
        };

        console.log('5. properties', properties);

        userSuscribedData.push(properties);

        console.log('6. userSuscribedData', userSuscribedData);
      });
    });

    setUsersSuscribedData(userSuscribedData);
    setIsLoading(false);
  };

  useEffect(() => {
    getRegisteredUsers(organizationId);
  }, [organizationId]);

  const columnsData = {
    searchedColumn,
    setSearchedColumn,
    searchText,
    setSearchText,
  };

  return (
    <>
      {console.log('usersSuscribedData', usersSuscribedData)}
      <Header title={'Inscritos'} description={'Se muestran los usuarios inscritos a los cursos de la organización'} />

      <Table
        columns={columns(columnsData)}
        dataSource={usersSuscribedData}
        size='small'
        rowKey='index'
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
      />
    </>
  );
}
export default withContext(OrgRegisteredUsers);
