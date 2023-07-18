import { useEffect, useState } from 'react';
import { OrganizationApi, RolAttApi } from '../../helpers/request';
import { FormattedDate, FormattedTime } from 'react-intl';
/** export Excel */
import { useHistory } from 'react-router-dom';
import { Table, Button, Row, Col, Tag } from 'antd';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { columns } from './tableColums/membersTableColumns';
import ModalMembers from '@/components/modal/modalMembers';
import moment from 'moment';
import withContext from '../../context/withContext';
import { utils, writeFileXLSX } from 'xlsx';
import Header from '../../antdComponents/Header';
import { ModalAddAndEditUsers } from './components/ModalAddAndEditUsersOrganization';

function OrgMembers(props) {
  const [membersData, setMembersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [addOrEditUser, setAddOrEditUser] = useState(false);
  const [extraFields, setExtraFields] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [editMember, setEditMember] = useState(false);
  let { _id: organizationId } = props.org;
  const history = useHistory();
  async function getEventsStatisticsData() {
    const { data } = await OrganizationApi.getUsers(organizationId);
    const fieldsMembersData = [];
    data.map((membersData,index) => {
      const properties = {
        ...membersData.properties,
        _id: membersData._id,
        created_at: membersData.created_at,
        updated_at: membersData.updated_at,
        position: membersData.rol?.name ?? 'NaN', //Si no viene Rol validar que deba traerlo
        rol_id:membersData.rol_id,
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

    const ws = utils.json_to_sheet(membersData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Members');
    writeFileXLSX(wb, `Miembros_${moment().format('l')}.xlsx`);
  }

  function closeOrOpenModalMembers() {
    setAddOrEditUser((prevState) => {
      return !prevState;
    });
  }

  function addUser() {
    setSelectedUser(undefined);
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
      <Header title={'Miembros'} />

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
              {/* <ExportExcel 
                columns={columns(columnsData, editModalUser)} 
                list={membersData} 
                fileName={'memberReport'} 
              /> */}
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
        <ModalAddAndEditUsers
          visible={addOrEditUser}
          onCancel={()=>{
            setAddOrEditUser(false)
            setSelectedUser(undefined)
          }}
          organizationId={organizationId}
          selectedUser={selectedUser}
        />
      )}
    </>
  );
}
export default withContext(OrgMembers);
