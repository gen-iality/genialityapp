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
  const [membersDataSource, setMembersDataSource] = useState([]);
  const [lastUpdate, setLastUpdate] = useState();
  const [orgUsersList, setOrgUsersList] = useState([]);
  const [orgEventsList, setOrgEventsList] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [userActivities, setUserActivities] = useState({});

  /** Flag States */
  const [isLoading, setIsLoading] = useState(true);
  const [isStaticsLoading, setIsStaticsLoading] = useState(true);
  const [shouldRenderModal, setShouldRenderModel] = useState(false);
  const [isEditingThetMember, setIsEditingThetMember] = useState(false);

  /** Columns CMS States */
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [extraFields, setExtraFields] = useState([]);

  const [filtersToDataSource, setFiltersToDataSource] = useState({});

  useEffect(() => {
    startingComponent();
  }, []);

  useEffect(() => {
    updateDataMembers();
  }, [orgUsersList, userActivities]);

  useEffect(() => {
    async function interna() {
      const userActivitiesData = await getEventsStatisticsData(orgUsersList, orgEventsList);
      setUserActivities(userActivitiesData);
    }

    interna();
  }, [orgUsersList, orgEventsList]);

  useEffect(() => {
    if (Object.keys(userActivities).length === 0) {
      console.log('El objeto está vacio');
    } else {
      console.log('else - setIsStaticsLoading');
      setIsStaticsLoading(false);
    }
  }, [userActivities]);

  async function startingComponent() {
    setLastUpdate(new Date());
    await setFormFields();
    await getOrgUsersList();
    await getOrgEventsList();
  }

  async function getEventsStatisticsData(orgUsersList, orgEventsList) {
    const userActivitiesData = {};

    for (let indexOrganization = 0; indexOrganization < orgUsersList.length; indexOrganization++) {
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
    const allMemberFields = [];

    console.log('1. orgUsersList', orgUsersList);

    const positionList = await getPositionList();

    orgUsersList?.map(async (orgUser) => {
      console.log('Estado - Lista de cargos', positionList);

      const properties = {
        ...orgUser.properties,
        _id: orgUser._id,
        created_at: orgUser.created_at,
        updated_at: orgUser.updated_at,
        role: orgUser.rol?.name || 'Sin rol',
        picture: orgUser.user.picture,
        position: orgUser.position?.position_name || 'Sin cargo',
        position_id: orgUser.position?._id || null,
        stats: userActivities[orgUser.account_id],
      };

      allMemberFields.push(properties);
    });

    console.log('Variable - Miembros de la organización', allMemberFields);

    setMembersDataSource(allMemberFields);
    setIsLoading(false);
  }

  async function getOrgUsersList() {
    const { data: orgUsers } = await OrganizationApi.getUsers(organizationId);
    console.log('Petición de solicitud - Usuarios de la organización: ', orgUsers);
    setOrgUsersList(orgUsers);
  }

  async function getOrgEventsList() {
    const { data: orgEvents } = await OrganizationApi.events(organizationId);
    console.log('Petición de solicitud - Cursos de la organización: ', orgEvents);
    setOrgEventsList(orgEvents);
  }

  async function getPositionList() {
    const positionListData = await PositionsApi.getAllByOrganization(organizationId);
    console.log('Petición de solicitud - Lista de Cargos : ', positionListData);

    const positionsOptions = positionListData.map((position) => {
      return {
        label: position.position_name,
        value: position._id,
      };
    });

    return positionsOptions;
  }

  const getRolesAsOptions = async () => {
    const roles = await OrganizationApi.Roles.getAll(organizationId);
    return (roles || []).map((role) => ({
      value: role._id,
      label: role.name,
      type: role.type,
    }));
  };

  async function setFormFields() {
    const positionList = await getPositionList();
    const rolList = await getRolesAsOptions();

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

    const rolField = {
      name: 'role',
      label: 'Rol',
      mandatory: true,
      type: 'list',
      options: rolList,
    };

    setExtraFields([rolField, ...props.org.user_properties, positionField]);
  }

  async function exportFile(e) {
    e.preventDefault();
    e.stopPropagation();

    const ws = utils.json_to_sheet(
      membersDataSource
        .map((user) => {
          delete user._id;
          delete user.created_at;
          delete user.updated_at;
          delete user.position;
          delete user.position_id;
          delete user.rol_id;
          delete user.stats;
          delete user.picture;
          // What else?
          const { password } = user;
          if (password) {
            user['documento de identidad'] = password;
            delete user.password;
          }
          return user;
        })
        .filter((user) => {
          // Before we send the user data, we have to check if its dataIndex
          // contains a filtered value to remove this value
          return Object.entries(filtersToDataSource).every(([key, value]) => {
            if (typeof user[key] === 'undefined' || user[key] === undefined) return true;
            return user[key] === value;
          });
        }),
    );
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Members');
    writeFileXLSX(wb, `Miembros_${dayjs().format('l')}.xlsx`);
  }

  function closeOrOpenModalMembers() {
    setShouldRenderModel((prevState) => !prevState);
  }

  function addUser() {
    setSelectedUser({});
    closeOrOpenModalMembers();
    setIsEditingThetMember(false);
  }

  function editModalUser(item) {
    setSelectedUser(item);
    closeOrOpenModalMembers();
    setIsEditingThetMember(true);
  }

  function thisDataIndexWasFiltered(currentDataIndex, filterValue) {
    console.info('this dataIndex was filtered', currentDataIndex, filterValue);

    setFiltersToDataSource((previous) => {
      const clone = { ...previous };
      if (typeof filterValue === 'undefined' || filterValue === undefined) {
        // Remove this dataIndex if the value is undefined only
        delete clone[currentDataIndex];
      } else {
        // Update the new value
        clone[currentDataIndex] = filterValue;
      }
      return clone;
    });
  }

  const columnsData = {
    searchedColumn,
    setSearchedColumn,
    searchText,
    setSearchText,
    thisDataIndexWasFiltered,
  };

  return (
    <>
      <Header title="Miembros" />

      <p>
        <small>
          Última Sincronización : <FormattedDate value={lastUpdate} /> <FormattedTime value={lastUpdate} />
        </small>
      </p>

      <p>
        <Tag>Inscritos: {membersDataSource.length || 0}</Tag>
      </p>

      <Table
        columns={columns(columnsData, editModalUser, extraFields, userActivities, isStaticsLoading)}
        dataSource={membersDataSource}
        size="small"
        rowKey="index"
        pagination={{ pageSize: 50 }}
        loading={isLoading || membersDataSource.length === 0}
        scroll={{ x: 'auto' }}
        title={() => (
          <Row wrap justify="end" gutter={[8, 8]}>
            <Col>
              {membersDataSource.length > 0 && (
                <Button type="primary" icon={<DownloadOutlined />} onClick={exportFile}>
                  Exportar
                </Button>
              )}
            </Col>
            <Col>
              <Button type="primary" icon={<PlusCircleOutlined />} onClick={addUser}>
                Agregar
              </Button>
            </Col>
          </Row>
        )}
      />

      {shouldRenderModal && (
        <ModalMembers
          extraFields={extraFields}
          value={selectedUser}
          editMember={isEditingThetMember}
          closeOrOpenModalMembers={closeOrOpenModalMembers}
          organizationId={organizationId}
          startingComponent={startingComponent}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}
export default withContext(OrgMembers);
