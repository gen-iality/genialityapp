import React, { useEffect, useState } from 'react';
import { OrganizationApi } from '../../helpers/request';
import { parseData2Excel } from '../../helpers/utils';
import Loading from '../loaders/loading';
import { FormattedDate, FormattedTime } from 'react-intl';
import SearchComponent from '../shared/searchTable';
import Pagination from '../shared/pagination';
import ErrorServe from '../modal/serverError';
import ImportUsers from '../import-users/importUser';
import UserOrg from '../modal/userOrg';
/** export Excel */
import XLSX from 'xlsx';
import { useHistory } from 'react-router-dom';
import { Table, Typography, Button, Select, Row } from 'antd';
import { UserAddOutlined, QrcodeOutlined, IdcardOutlined, ScanOutlined } from '@ant-design/icons';
import { columns } from './tableColums/membersTableColumns';
import { Background } from 'react-parallax';
import ExcelExportColumns from './tableColums/excelExportColumns';

const { Title, Text } = Typography;

function OrgMembers(props) {
   const [membersData, setMembersData] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [lastUpdate, setLastUpdate] = useState();
   let { _id: organizationId } = props.org;
   const history = useHistory();

   async function getEventsStatisticsData() {
      const { data } = await OrganizationApi.getUsers(organizationId);

      setMembersData(data);
      setIsLoading(false);
   }

   useEffect(() => {
      getEventsStatisticsData();
      setLastUpdate(new Date());
   }, []);

   function goToEvent(eventId) {
      const url = `/eventadmin/${eventId}/agenda`;
      history.replace({ pathname: url });
   }

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
                     Inscritos: {membersData.length} | Participantes: {membersData.length}
                  </Title>
               </Row>

               <div>
                  <small>
                     Última Sincronización : <FormattedDate value={lastUpdate} /> <FormattedTime value={lastUpdate} />
                  </small>
               </div>

               <Row justify='end' style={{ marginBottom: '10px' }}>
                  <Button style={{ marginLeft: 20 }} icon={<UserAddOutlined />}>
                     Agregar Usuario
                  </Button>
                  {membersData.length > 0 && <ExcelExportColumns membersData={membersData} />}

                  <Select
                     defaultValue={`options`}
                     style={{ width: 200, marginLeft: 20 }}
                     // value={this.state.typeScanner}
                     // defaultValue={this.state.typeScanner}
                     // onChange={this.handleChange}
                  >
                     <option key={1} value='options'>
                        <ScanOutlined /> Escanear...
                     </option>
                     <option key={2} value='scanner-qr'>
                        <QrcodeOutlined /> Escanear QR
                     </option>
                     <option key={3} value='scanner-document'>
                        <IdcardOutlined /> Escanear Documento
                     </option>
                  </Select>
               </Row>

               <Table
                  columns={columns(goToEvent)}
                  dataSource={membersData}
                  size='small'
                  rowKey='index'
                  pagination={false}
                  scroll={{ x: 1300 }}
               />
            </>
         )}
      </>
   );
}
export default OrgMembers;
