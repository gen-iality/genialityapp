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
import { columns } from './tableColums/membersTableColumns';

/** Helpers and utils */
import { OrganizationApi, RolAttApi, EventsApi, AgendaApi, PositionsApi } from '@helpers/request';
import { firestore } from '@helpers/firebase';

/** Context */
import withContext from '@context/withContext';
import { async } from 'ramda-adjunct';

function OrgMembers(props) {
  console.log('Props - OrgMembers (CMS) ->', props);
  const { _id: organizationId } = props.org;
  const history = useHistory();

  /** Data States */
  const [membersData, setMembersData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState();
  const [orgUsersList, setOrgUsersList] = useState([]);
  const [orgEventsList, setOrgEventsList] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [userActivities, setUserActivities] = useState({});

  /** Flag States */
  const [isLoading, setIsLoading] = useState(true);
  const [isStaticsLoading, setIsStaticsLoading] = useState(true);
  const [addOrEditUser, setAddOrEditUser] = useState(false);
  const [editMember, setEditMember] = useState(false);

  /** Columns CMS States */
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [extraFields, setExtraFields] = useState([]);

  useEffect(
    () => {
      console.log('Efecto de startingComponent');
      startingComponent();
    },
    [
      /* props.org.user_properties */
    ],
  );

  useEffect(() => {
    console.log('Efecto de updateDataMembers');
    updateDataMembers();
  }, [orgUsersList, userActivities]);

  useEffect(() => {
    console.log('Efecto de getEventsStatisticsData');
    async function interna() {
      const userActivitiesData = await getEventsStatisticsData(orgUsersList, orgEventsList);
      setUserActivities(userActivitiesData);
    }

    interna();
  }, [orgUsersList, orgEventsList]);

  useEffect(() => {
    console.log('Incio de metodo setIsStaticsLoading');
    console.log('userActivities', userActivities);

    if (Object.keys(userActivities).length === 0) {
      console.log('El objeto está vacio');
    } else {
      console.log('else - setIsStaticsLoading');
      setIsStaticsLoading(false);
    }
  }, [userActivities]);

  async function startingComponent() {
    console.log('Inicio de función de startingComponent');
    setLastUpdate(new Date());
    await setFormFields();
    await getOrgUsersList();
    await getOrgEventsList();
    console.log('Fin de función de startingComponent');
  }

  async function getEventsStatisticsData(orgUsersList, orgEventsList) {
    console.log('2. Inicio - getEventsStatisticsData ');
    const userActivitiesData = {};

    for (let indexOrganization = 0; indexOrganization < orgUsersList.length; indexOrganization++) {
      console.log('2. Inicio - primer for ');

      const userId = orgUsersList[indexOrganization].account_id;
      const email = orgUsersList[indexOrganization].user.email;

      let totalActividades = 0;
      let totalActividadesVistas = 0;

      for (let indexEvent = 0; indexEvent < orgEventsList.length; indexEvent++) {
        const eventId = orgEventsList[indexEvent]._id;
        //const { data: dataEventUser } = await EventsApi.getEventUser(eventId, userId);

        const thing = await EventsApi.getStatusRegister(eventId, email);
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
      userActivitiesData[userId] = `${totalActividadesVistas}/${totalActividades}`;
      console.log('2. userActivitiesData[userId]', userActivitiesData[userId]);
    }

    console.log('2. userActivitiesData', userActivitiesData);

    return userActivitiesData;
  }

  async function updateDataMembers() {
    const fieldsMembersData = [];

    console.log('1. orgUsersList', orgUsersList);

    const positionList = await getPositionList();

    orgUsersList?.map(async (orgUser) => {
      console.log('Estado - Lista de cargos', positionList);

      const position_name = positionList
        .filter((position) => orgUser.properties.position_id === position.value)
        .map((position) => position.label);

      console.log('position_name', position_name);

      /* const specificUser = await OrganizationApi.getEpecificUser(organizationId, orgUser._id);
      console.log('specificUser', specificUser); */

      const properties = {
        _id: orgUser._id,
        created_at: orgUser.created_at,
        updated_at: orgUser.updated_at,
        role: orgUser.rol.name,
        picture: orgUser.user.picture,
        position: position_name[0],
        // names: membersData?.user?.name || membersData?.user?.names,
        // email: membersData?.user?.email,
        stats: userActivities[orgUser.account_id],
        ...orgUser.properties,
      };

      fieldsMembersData.push(properties);
    });

    //dataEvents;

    console.log('Variable - Miembros de la organización', fieldsMembersData);

    setMembersData(fieldsMembersData);
    setIsLoading(false);
  }

  async function getOrgUsersList() {
    console.log('Inicio de petición getOrgUsersList');
    const { data: orgUsers } = await OrganizationApi.getUsers(organizationId);
    console.log('Petición de solicitud - Usuarios de la organización: ', orgUsers);
    setOrgUsersList(orgUsers);
  }

  async function getOrgEventsList() {
    console.log('Inicio de petición getOrgEventsList');
    const { data: orgEvents } = await OrganizationApi.events(organizationId);
    console.log('Petición de solicitud - Cursos de la organización: ', orgEvents);
    setOrgEventsList(orgEvents);
  }

  async function getPositionList() {
    console.log('Inicio de petición getPositionList');
    const positionListData = await PositionsApi.Organizations.getAll(organizationId);
    console.log('Petición de solicitud - Lista de Cargos : ', positionListData);

    const positionsOptions = positionListData.map((position) => {
      return {
        label: position.position_name,
        value: position._id,
      };
    });

    return positionsOptions;
  }

  async function setFormFields() {
    console.log('Inicio de función de setFormFields');
    const positionList = await getPositionList();

    const positionField = {
      name: 'position_id',
      label: 'Cargo',
      unique: false,
      index: 2,
      mandatory: false,
      order_weight: 3,
      type: 'list',
      options: positionList,
      _id: { $oid: '614260d226e7862220497eac3' },
    };

    setExtraFields([...props.org.user_properties, positionField]);
    console.log('Fin de función de setFormFields');
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
    setEditMember(false);
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
      {console.log('Aquí inicia el render de Members')}
      {console.log('Estado de extraFields', extraFields)}
      {console.log('Estado de isStaticsLoading', isStaticsLoading)}
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
        columns={columns(columnsData, editModalUser, extraFields, userActivities, isStaticsLoading)}
        dataSource={membersData}
        size='small'
        rowKey='index'
        pagination={false}
        loading={isLoading || membersData.length === 0}
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
          extraFields={extraFields}
          value={selectedUser}
          editMember={editMember}
          closeOrOpenModalMembers={closeOrOpenModalMembers}
          organizationId={organizationId}
          startingComponent={startingComponent}
          setIsLoading={setIsLoading}
        />
      )}
      {console.log('Aquí termina el render de Members')}
    </>
  );
}
export default withContext(OrgMembers);
