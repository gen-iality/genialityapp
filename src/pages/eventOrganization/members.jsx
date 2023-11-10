import { useState } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Table, Button, Row, Col, Tag } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { columns } from './tableColums/membersTableColumns';
import withContext from '../../context/withContext';
import Header from '../../antdComponents/Header';
import { ModalAddAndEditUsers } from './components/ModalAddAndEditUsersOrganization';
import { useGetEventsStatisticsData } from './tableColums/utils/useGetEventsStatisticsData';
import { parseMembersColumsExcel, parseDataMembersToExcel } from './tableColums/utils/parseData.utils';
import { ExportExcel } from '@/components/export-excel/ExportExcel';
import { useModalLogic } from '@/hooks/useModalLogic';

const OrgMembers = (props) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const { isOpenModal, closeModal, openModal, selectedItem, handledSelectedItem } = useModalLogic();
  const { _id: organizationId, user_properties: userPropertiesOrg } = props.org;

  const { getDataOrgUser, isLoadingMembersParsed, membersParsed, pagination, lastUpdate } = useGetEventsStatisticsData(
    organizationId
  );



  const addUser = () => {
    openModal()
  };

  const editModalUser = (item) => {
    handledSelectedItem(item);
    openModal();
  };

  const columnsData = {
    searchedColumn,
    setSearchedColumn,
    searchText,
    setSearchText,
  };

  const columsMembersView = columns(membersParsed, columnsData, editModalUser, organizationId, getDataOrgUser);
  const columsMembersExcel = parseMembersColumsExcel(userPropertiesOrg);

  return (
    <>
      <Header title={'Miembros'} />

      <p>
        <small>
          Última Sincronización : <FormattedDate value={lastUpdate} /> <FormattedTime value={lastUpdate} />
        </small>
      </p>

      <p>
        <Tag>Inscritos: {membersParsed.length || 0}</Tag>
      </p>
      <Table
        columns={columsMembersView}
        dataSource={membersParsed}
        size='small'
        rowKey='index'
        pagination={pagination}
        loading={isLoadingMembersParsed}
        scroll={{ x: 'auto' }}
        title={() => (
          <Row wrap justify='end' gutter={[8, 8]}>
            <Col>
              <ExportExcel
                list={parseDataMembersToExcel(membersParsed, columsMembersExcel)}
                fileName={'memberReport'}
                columns={columsMembersExcel}
              />
            </Col>
            <Col>
              <Button type='primary' icon={<PlusCircleOutlined />} onClick={addUser}>
                {'Agregar'}
              </Button>
            </Col>
          </Row>
        )}
      />
      {isOpenModal && (
        <ModalAddAndEditUsers
          visible={isOpenModal}
          onCancel={closeModal}
          organizationId={organizationId}
          selectedUser={selectedItem}
          getEventsStatisticsData={getDataOrgUser}
        />
      )}
    </>
  );
};
export default withContext(OrgMembers);
