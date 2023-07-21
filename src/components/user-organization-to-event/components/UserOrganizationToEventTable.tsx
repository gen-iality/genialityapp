import { Button, Table, TableColumnsType, TableProps } from 'antd';
import React from 'react';
import { UserOrganizationToEvent } from '../interface/table-user-oranization-to-event';
import { createEventUserFromUserOrganization } from '../helpers/helper';

interface Props extends TableProps<UserOrganizationToEvent> {}

const columns: TableColumnsType<UserOrganizationToEvent> = [
  {
    key: 'name',
    title: 'Nombres y apellidos',
    dataIndex: 'name',
  },
  {
    key: 'rol',
    title: 'Rol',
    dataIndex: 'rol',
  },
  {
    key: 'email',
    title: 'Correo',
    dataIndex: 'email',
  },
  {
    key: 'action',
    title: 'Accion',
    dataIndex: 'action',
    render: (_, record) => {
      return (
        <Button disabled={record.isAlreadyEventUser} onClick={() => createEventUserFromUserOrganization(record)}>
          {record.isAlreadyEventUser ? 'Ya inscrito' : 'Agregar'}
        </Button>
      );
    },
  },
];

const UserOrganizationToEventTable = ({ ...tableProps }: Props) => {
  return <Table columns={columns} {...tableProps} />;
};

export default UserOrganizationToEventTable;
