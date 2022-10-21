import { useEffect, useState } from 'react';
import { OrganizationApi, RolAttApi, EventsApi, AgendaApi } from '@helpers/request';
import { FormattedDate, FormattedTime } from 'react-intl';
import { firestore } from '@helpers/firebase';
/** export Excel */
import { useHistory } from 'react-router-dom';
import { Table, Button, Row, Col, Tag } from 'antd';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { columns } from './tableColums/membersTableColumns';
import ModalMembers from '@components/modal/modalMembers';
import dayjs from 'dayjs';
import withContext from '@context/withContext';
import { utils, writeFileXLSX } from 'xlsx';
import Header from '@antdComponents/Header';

function OrgMembers(props) {
  const [membersData, setMembersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [addOrEditUser, setAddOrEditUser] = useState(false);
  const [extraFields, setExtraFields] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [editMember, setEditMember] = useState(false);
  const { _id: organizationId } = props.org;
  const history = useHistory();

  async function getEventsStatisticsData() {
    const { data } = await OrganizationApi.getUsers(organizationId);
    const { data: dataEvents } = await OrganizationApi.events(organizationId);

    const fieldsMembersData = [];
    // console.log('Array de OrgAPI - GetUsers', data);
    // console.log('Array de OrgAPI - Events', dataEvents);
    //console.log('Array de EventAPI - GetEventUser', dataEventUser);
    const userActivities = {};

    for (let indexOrganization = 0; indexOrganization < data.length; indexOrganization++) {
      const userId = data[indexOrganization].account_id;
      const email = data[indexOrganization].user.email;

      let totalActividades = 0;
      let totalActividadesVistas = 0;

      for (let indexEvent = 0; indexEvent < dataEvents.length; indexEvent++) {
        const eventId = dataEvents[indexEvent]._id;
        //const { data: dataEventUser } = await EventsApi.getEventUser(eventId, userId);

        const thing = await EventsApi.getStatusRegister(eventId, email)
        if (thing.data.length === 0) continue;
        const eventUser = thing.data[0];

        const { data: activities } = await AgendaApi.byEvent(eventId);

        const existentActivities = await activities.map(async (activity) => {
          const activity_attendee = await firestore
            .collection(`${activity._id}_event_attendees`)
            .doc(eventUser._id)
            .get();
          if (activity_attendee.exists) {
            return activity_attendee.data();
          }
          return null;
        });
        // Filter non-null result that means that the user attendees them
        const attendee = (await Promise.all(existentActivities)).filter((item) => item !== null);
        totalActividades += activities.length;
        totalActividadesVistas += attendee.length;
      }
      userActivities[userId] = `${totalActividadesVistas}/${totalActividades}`;
    }

    // console.log(userActivities);

    data.map((membersData) => {
      const properties = {
        _id: membersData._id,
        created_at: membersData.created_at,
        updated_at: membersData.updated_at,
        position: membersData.rol.name,
        // names: membersData?.user?.name || membersData?.user?.names,
        // email: membersData?.user?.email,
        stats: userActivities[membersData.account_id],
        ...membersData.properties,
      };

      fieldsMembersData.push(properties);
    });

    dataEvents;

    setMembersData(fieldsMembersData);
    setIsLoading(false);
  }

  async function getRoleList() {
    const roleListData = await RolAttApi.byEventRolsGeneral();
    setRoleList(roleListData);
  }

  function startingComponent() {
    getEventsStatisticsData();
    setLastUpdate(new Date());
    getRoleList();
    setExtraFields(props.org.user_properties);
  }
  useEffect(() => {
    startingComponent();
  }, [props.org.user_properties]);

  function goToEvent(eventId) {
    const url = `/eventadmin/${eventId}/agenda`;
    history.replace({ pathname: url });
  }

  async function exportFile(e) {
    e.preventDefault();
    e.stopPropagation();

    const ws = utils.json_to_sheet(membersData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Members');
    writeFileXLSX(wb, `Miembros_${dayjs().format('l')}.xlsx`);
  }

  function closeOrOpenModalMembers() {
    setAddOrEditUser((prevState) => {
      return !prevState;
    });
  }

  function addUser() {
    setSelectedUser({});
    closeOrOpenModalMembers();
  }
  function editModalUser(item) {
    setSelectedUser(item);
    closeOrOpenModalMembers();
    setEditMember(true);
  }

  const columnsData = {
    searchedColumn,
    setSearchedColumn,
    searchText,
    setSearchText,
  };

  return (
    <>
      <Header
        title={'Miembros'}
        description={
          'Se muestran los primeros 50 usuarios, para verlos todos por favor descargar el excel o realizar una búsqueda.'
        }
      />

      <p>
        <small>
          Última Sincronización : <FormattedDate value={lastUpdate} /> <FormattedTime value={lastUpdate} />
        </small>
      </p>

      <p>
        <Tag>Inscritos: {membersData.length || 0}</Tag>
      </p>

      <Table
        columns={columns(columnsData, editModalUser)}
        dataSource={membersData}
        size='small'
        rowKey='index'
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
        title={() => (
          <Row wrap justify='end' gutter={[8, 8]}>
            <Col>
              {membersData.length > 0 && (
                <Button type='primary' icon={<DownloadOutlined />} onClick={exportFile}>
                  Exportar
                </Button>
              )}
            </Col>
            <Col>
              <Button type='primary' icon={<PlusCircleOutlined />} onClick={addUser}>
                {'Agregar'}
              </Button>
            </Col>
          </Row>
        )}
      />
      {addOrEditUser && (
        <ModalMembers
          handleModal={closeOrOpenModalMembers}
          modal={addOrEditUser}
          rolesList={roleList}
          extraFields={extraFields}
          value={selectedUser}
          editMember={editMember}
          closeOrOpenModalMembers={closeOrOpenModalMembers}
          organizationId={organizationId}
          startingComponent={startingComponent}
        />
      )}
    </>
  );
}
export default withContext(OrgMembers);
