/** React's libraries */
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

/** Antd imports */
import { Table } from 'antd';

/** Components */
import Header from '@antdComponents/Header';
import { columns } from './tableColums/registeredTableColumns';

/** Helpers and utils */
import { OrganizationApi } from '@helpers/request';
import { firestore } from '@helpers/firebase';

/** Context */
import withContext from '@context/withContext';

function OrgRegisteredUsers(props) {
  const { _id: organizationId } = props.org;

  const [usersSuscribedData, setUsersSuscribedData] = useState([]);
  //const [orgEventsList, setOrgEventsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  useEffect(() => {
    getRegisteredUsers();
  }, []);

  function formattedRealDate(timestamp) {
    console.log('timestamp', timestamp);

    //const segundos = dayjs(timestamp);
    const segundos = timestamp?.seconds;
    console.log('segundos', segundos);

    const formattedDate = dayjs.unix(segundos).format('YYYY-MM-DD');
    console.log('formattedDate', formattedDate);

    return formattedDate;
  }

  const getRegisteredUsers = async () => {
    const { data: orgEvents } = await OrganizationApi.events(organizationId);
    console.log('orgEvents', orgEvents);

    const inscritos = orgEvents.map(async (orgEvent) => {
      const asistentes = firestore.collection(`${orgEvent._id}_event_attendees`);
      const querySnapshot = await asistentes.get();
      const propertiesList = [];

      querySnapshot.forEach((doc) => {
        console.log('doc.data()', doc.data());
        const properties = {
          checkedin_at: doc.data()?.checkedin_at ? formattedRealDate(doc.data()?.checkedin_at) : 'Sin registro',
          eventUser_name: doc.data()?.properties?.names,
          eventUser_email: doc.data()?.properties?.email,
          event_name: orgEvent.name,
          created_at: orgEvent.created_at,
        };

        console.log('5. properties', properties);
        propertiesList.push(properties);
      });
      return propertiesList;
    });

    const userSuscribedData = (await Promise.all(inscritos)).flat();

    console.log('Antes de hacer seteo');
    console.log('7. userSuscribedData', userSuscribedData);
    setUsersSuscribedData(userSuscribedData);
    setIsLoading(false);
    console.log('Despues de hacer seteo');
  };

  const columnsData = {
    searchedColumn,
    setSearchedColumn,
    searchText,
    setSearchText,
  };

  return (
    <>
      {console.log('8. usersSuscribedData', usersSuscribedData)}
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
