import React, { useEffect, useState } from 'react';
import { OrganizationApi, RolAttApi } from '../../helpers/request';
import { FormattedDate, FormattedTime } from 'react-intl';
/** export Excel */
import { useHistory } from 'react-router-dom';
import { Table, Typography, Button, Row, Col, Tag } from 'antd';
import { UserAddOutlined, DownloadOutlined, LoadingOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { columns } from './tableColums/membersTableColumns';
import ModalMembers from '../modal/modalMembers';
import moment from 'moment';
import withContext from '../../context/withContext';
import XLSX from 'xlsx';
import Header from '../../antdComponents/Header';
import ExportExcel from '../newComponent/ExportExcel';

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
      console.log('debug membersData ', membersData);
      const properties = {
        _id: membersData._id,
        created_at: membersData.created_at,
        updated_at: membersData.updated_at,
        position: membersData.rol_id,
        // names: membersData?.user?.name || membersData?.user?.names,
        // email: membersData?.user?.email,
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
      <Header
        title={'Miembros'}
        description={
          'Se muestran los primeros 50 usuarios, para verlos todos porfavor descargar el excel o realizar una búsqueda.'
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
        scroll={{ x: 1200 }}
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
