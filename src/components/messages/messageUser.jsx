import React, { Fragment } from 'react';
import Table from '../../antdComponents/Table';

const MessageUser = (props) => {
  const users = props.users;
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Estatus',
      dataIndex: 'status',
      key: 'status',
    }
  ];

  return (
    <Fragment>
      <Table 
        header={columns}
        list={users}
        pagination
        exportData
        fileName={'ReportSends'}
      />
    </Fragment>
  );
}

export default MessageUser;
