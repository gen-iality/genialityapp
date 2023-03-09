/** React's libraries */
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';

/** Antd imports */
import { Button, Table } from 'antd';

/** Components */
import Header from '@antdComponents/Header';
import { columns } from './tableColums/registeredTableColumns';

/** Helpers and utils */
import { OrganizationApi, CerticationsApi } from '@helpers/request';
import { firestore } from '@helpers/firebase';

/** Context */
import withContext from '@context/withContext';
import { DownloadOutlined } from '@ant-design/icons';

/** export Excel */
import { utils, writeFileXLSX } from 'xlsx';

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

  const exportPDF = useCallback(() => {
    console.log('exporting to PDF....')
    const ws = utils.json_to_sheet(usersSuscribedData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Registered');
    writeFileXLSX(wb, `Inscritos_${dayjs().format('l')}.xlsx`);
  }, [usersSuscribedData])

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

            // Inject the position
            properties.position = orgMember.position?.position_name

            const userCertification = certificationsByEvent.find(
              (certificationByEvent) => certificationByEvent.user_id === infoEventUser?.account_id,
            );
            if (userCertification?.approved_until_date) {
              properties.validity_date = dayjs(userCertification.approved_until_date);
              properties.approved_until_date = dayjs(userCertification.approved_until_date);
              properties.approved_from_date = dayjs(userCertification.approved_from_date);
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

      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={() => exportPDF()}
      >
        Exportar PDF
      </Button>
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
