/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { RolAttApi } from '../../helpers/request';
import { FormattedDate, FormattedTime } from 'react-intl';
/** export Excel */
import { useHistory } from 'react-router-dom';
import { Table, Button, Row, Col, Tag } from 'antd';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { columns } from './tableColums/membersTableColumns';
import moment from 'moment';
import withContext from '../../context/withContext';
import { utils, writeFileXLSX } from 'xlsx';
import Header from '../../antdComponents/Header';
import { ModalAddAndEditUsers } from './components/ModalAddAndEditUsersOrganization';
import { useGetEventsStatisticsData } from './tableColums/utils/useGetOrganizations';

function OrgMembers(props) {
  const [lastUpdate, setLastUpdate] = useState();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [addOrEditUser, setAddOrEditUser] = useState(false);
  const [, setExtraFields] = useState([]);
  const [, setRoleList] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [, setEditMember] = useState(false);
  let { _id: organizationId } = props.org;
  const history = useHistory();

  const { membersDat, isLoading, fetchEventsStatisticsData} = useGetEventsStatisticsData(organizationId)
  async function getRoleList() {
    const roleListData = await RolAttApi.byEventRolsGeneral();
    setRoleList(roleListData);
  }

  function startingComponent() {
    fetchEventsStatisticsData();
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

    const ws = utils.json_to_sheet(membersDat);
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
        <Tag>Inscritos: {membersDat.length || 0}</Tag>
      </p>
      <Table
        columns={columns(columnsData, editModalUser, organizationId, fetchEventsStatisticsData)}
        dataSource={membersDat}
        size='small'
        rowKey='index'
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
        title={() => (
          <Row wrap justify='end' gutter={[8, 8]}>
            <Col>
              {membersDat.length > 0 && (
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
          getEventsStatisticsData={fetchEventsStatisticsData}
        />
      )}
    </>
  );
}
export default withContext(OrgMembers);
