/** React's libraries */
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

/** Antd imports */
import { Table } from 'antd';

/** Components */
import Header from '@antdComponents/Header';
import { columns } from './tableColums/registeredTableColumns';

/** Helpers and utils */
import { OrganizationApi, CerticationsApi } from '@helpers/request';
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
    const segundos = timestamp?.seconds;
    const formattedDate = dayjs.unix(segundos).format('YYYY-MM-DD');
    return formattedDate;
  }

  const getRegisteredUsers = async () => {
    const { data: orgEvents } = await OrganizationApi.events(organizationId);
    console.log('orgEvents', orgEvents);

    const totalRegistered = (
      await Promise.all(
        orgEvents.map(async (orgEvent) => {
          const asistentes = firestore.collection(`${orgEvent._id}_event_attendees`);
          const querySnapshot = await asistentes.get();
          console.log('querySnapshot', querySnapshot);

          const certificationsByEvent = await CerticationsApi.getByUserAndEvent(null, orgEvent._id);
          console.log('1. certificationsByEvent', certificationsByEvent);

          const registeredByEvent = querySnapshot.docs.map((doc) => {
            const infoEventUser = doc.data();
            const properties = {
              checkedin_at: infoEventUser?.checkedin_at
                ? formattedRealDate(infoEventUser?.checkedin_at)
                : 'Sin registro',
              eventUser_name: infoEventUser?.properties?.names,
              eventUser_email: infoEventUser?.properties?.email,
              validity_date: null,
              event_name: orgEvent.name,
              created_at: orgEvent.created_at,
            };

            const userCertification = certificationsByEvent.find(
              (certificationByEvent) => certificationByEvent.user_id === infoEventUser?.account_id,
            );
            console.log('1. certification', userCertification);
            if (userCertification?.approved_until_date) {
              properties.validity_date = userCertification.approved_until_date;
              properties.approved_until_date = userCertification.approved_until_date;
              properties.approved_from_date = userCertification.approved_from_date;
            } else {
              properties.validity_date = null;
              properties.approved_until_date = null;
              properties.approved_from_date = null;
            }

            return properties;
          });

          return registeredByEvent;
        }),
      )
    ).flat();

    console.log('totalRegistered', totalRegistered);
    setUsersSuscribedData(totalRegistered);
    setIsLoading(false);
  };

  const columnsData = {
    searchedColumn,
    setSearchedColumn,
    searchText,
    setSearchText,
  };

  return (
    <>
      <Header title="Inscritos" description="Se muestran los usuarios inscritos a los cursos de la organización" />
      {console.log('usersSuscribedData', usersSuscribedData)}
      <Table
        columns={columns(columnsData)}
        dataSource={usersSuscribedData}
        size="small"
        rowKey="index"
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
      />
    </>
  );
}
export default withContext(OrgRegisteredUsers);
