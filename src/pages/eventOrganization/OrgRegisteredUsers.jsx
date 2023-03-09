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

  const [extraFields, setExtraFields] = useState([])

  useEffect(() => {
    getRegisteredUsers();
    setExtraFields(props.org.user_properties.filter((item) => (!['email', 'names'].includes(item.name))))
  }, []);

  function formattedRealDate(timestamp) {
    const segundos = timestamp?.seconds;
    const formattedDate = dayjs.unix(segundos).format('YYYY-MM-DD');
    return formattedDate;
  }

  const getRegisteredUsers = async () => {
    const { data: orgEvents } = await OrganizationApi.events(organizationId);
    // con//sole.log('orgEvents', orgEvents);
    const { data: orgUsers } = await OrganizationApi.getUsers(organizationId);
    // con//sole.log('orgUsers', orgUsers)

    const totalRegistered = (
      await Promise.all(
        orgEvents.map(async (orgEvent) => {
          const asistentes = firestore.collection(`${orgEvent._id}_event_attendees`);
          const querySnapshot = await asistentes.get();
          // con//sole.log('querySnapshot', querySnapshot);

          const certificationsByEvent = await CerticationsApi.getByUserAndEvent(null, orgEvent._id);
          // con//sole.log('1. certificationsByEvent', certificationsByEvent);

          const registeredByEvent = querySnapshot.docs.map((doc) => {
            const infoEventUser = doc.data();
            // con//sole.log('infoEventUser', infoEventUser)
            const properties = {
              checkedin_at: infoEventUser?.checkedin_at
                ? formattedRealDate(infoEventUser?.checkedin_at)
                : 'Sin registro',
              eventUser_name: infoEventUser?.properties?.names,
              eventUser_email: infoEventUser?.properties?.email,
              validity_date: null,
              event_name: orgEvent.name,
              created_at: orgEvent.created_at,
              // Why "organiser"? anyway...
            };

            const userId = infoEventUser.account_id
            const orgMember = orgUsers.find((member) => member.account_id === userId)

            // Inject the dynamic field
            const filteredDynamicField = (orgEvent.organiser.user_properties || []).filter((data) => !['email', 'names'].includes(data.name))
            if (orgMember) {
              filteredDynamicField.forEach((field) => {
                properties[field.name] = orgMember.properties[field.name]
              })
            }

            const userCertification = certificationsByEvent.find(
              (certificationByEvent) => certificationByEvent.user_id === infoEventUser?.account_id,
            );
            if (userCertification?.approved_until_date) {
              properties.validity_date = dayjs(userCertification.approved_until_date);
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

      <Table
        columns={columns(columnsData, extraFields)}
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
