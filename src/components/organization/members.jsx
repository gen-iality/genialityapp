import React, { useEffect, useState } from 'react';
import { OrganizationApi, RolAttApi } from '../../helpers/request';
import { parseData2Excel } from '../../helpers/utils';
import Loading from '../loaders/loading';
import { FormattedDate, FormattedTime } from 'react-intl';
import SearchComponent from '../shared/searchTable';
import Pagination from '../shared/pagination';
import ErrorServe from '../modal/serverError';
import ImportUsers from '../import-users/importUser';
import UserOrg from '../modal/userOrg';
/** export Excel */
import { useHistory } from 'react-router-dom';
import { Table, Typography, Button, Select, Row } from 'antd';
import { UserAddOutlined, DownloadOutlined } from '@ant-design/icons';
import { columns } from './tableColums/membersTableColumns';
import { Background } from 'react-parallax';
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
   const [selectedUser, setSelectedUser] = useState([]);
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

   useEffect(() => {
      getEventsStatisticsData();
      setLastUpdate(new Date());
      getRoleList();
      setExtraFields(props.org.user_properties);
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
      console.log('10. Agregar o editar usuario');
      setSelectedUser(null);
      closeOrOpenModalMembers();
   }
   function editModalUser(item) {
      console.log('10. SELECTED ITEM==>', item);
      setSelectedUser(item);
      closeOrOpenModalMembers();
      setEditMember(true)
   }

   const columnsData = {
      searchedColumn,
      setSearchedColumn,
      searchText,
      setSearchText,
   };

   return (
      <>
         {isLoading ? (
            <Loading />
         ) : (
            <>
               <p>
                  <small>
                     {' '}
                     Se muestran los primeros 50 usuarios, para verlos todos porfavor descargar el excel o realizar una
                     búsqueda.
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
                     }}>
                     Inscritos: {membersData.length}
                  </Title>
               </Row>

               <div>
                  <small>
                     Última Sincronización : <FormattedDate value={lastUpdate} /> <FormattedTime value={lastUpdate} />
                  </small>
               </div>

               <Row justify='end' style={{ marginBottom: '10px' }}>
                  <Button onClick={addUser} style={{ marginLeft: 20 }} icon={<UserAddOutlined />}>
                     Agregar Usuario
                  </Button>
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
               />
               {addOrEditUser && (
                  <ModalMembers
                     handleModal={closeOrOpenModalMembers}
                     modal={addOrEditUser}
                     rolesList={roleList}
                     extraFields={extraFields}
                     value={selectedUser || []}
                     editMember={editMember}
                     closeOrOpenModalMembers={closeOrOpenModalMembers}
                  />
               )}
            </>
         )}
      </>
   );
}
export default withContext(OrgMembers);
