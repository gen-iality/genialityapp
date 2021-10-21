import React, { useEffect, useState } from 'react';
import { OrganizationApi, RolAttApi } from '../../helpers/request';
import { FormattedDate, FormattedTime } from 'react-intl';
/** export Excel */
import { useHistory } from 'react-router-dom';
import { Table, Typography, Button, Row } from 'antd';
import { UserAddOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { columns } from './tableColums/membersTableColumns';
import ModalMembers from '../modal/modalMembers';
import moment from 'moment';
import withContext from '../../Context/withContext';
import XLSX from 'xlsx';

const { Title } = Typography;

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
  let { _id: organizationId } = props.org;
  const history = useHistory();

  async function getEventsStatisticsData() {
    const { data } = await OrganizationApi.getUsers(organizationId);
    const fieldsMembersData = [];
    data.map((membersData) => {
      const properties = {
        _id: membersData._id,
        created_at: membersData.created_at,
        updated_at: membersData.updated_at,
        ...membersData.properties,
      };

      fieldsMembersData.push(properties);
    });

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

    const ws = XLSX.utils.json_to_sheet(membersData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Members');
    XLSX.writeFile(wb, `Miembros_${moment().format('l')}.xlsx`);
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
      <>
        <p>
          <small>
            {' '}
            Se muestran los primeros 50 usuarios, para verlos todos porfavor descargar el excel o realizar una búsqueda.
          </small>{' '}
        </p>
        <Row justify='start'>
          <Title
            level={5}
            type='secondary'
            style={{
              backgroundColor: '#F5F5F5',
              textAlign: 'center',
              borderRadius: 4,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
            Inscritos: {isLoading ? <LoadingOutlined style={{ fontSize: '15px' }} /> : membersData.length}
          </Title>
        </Row>

        <div>
          <small>
            Última Sincronización : <FormattedDate value={lastUpdate} /> <FormattedTime value={lastUpdate} />
          </small>
        </div>

        <Row justify='end' style={{ marginBottom: '10px', marginRight: '10px' }}>
          {extraFields && extraFields.length > 0 ? (
            <Button onClick={addUser} style={{ marginLeft: 20 }} icon={<UserAddOutlined />}>
              Agregar Usuario
            </Button>
          ) : (
            <small>
              Para agregar un usuario, por favor cree los campos con los datos a recolectar en el menú: configuración
              miembros
            </small>
          )}

          {membersData.length > 0 && (
            <Button style={{ marginLeft: 20 }} icon={<DownloadOutlined />} onClick={exportFile}>
              Exportar
            </Button>
          )}
        </Row>
        <Table
          columns={columns(columnsData, editModalUser)}
          dataSource={membersData}
          size='small'
          rowKey='index'
          pagination={false}
          scroll={{ x: 1300 }}
          loading={isLoading}
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
    </>
  );
}
export default withContext(OrgMembers);
