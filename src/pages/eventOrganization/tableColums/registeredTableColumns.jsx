import { useHistory } from 'react-router';
import { Tooltip, Button, Row, Col, Popover, Image, Avatar, Empty, Spin } from 'antd';
import { ClockCircleOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { membersGetColumnSearchProps } from '../searchFunctions/membersGetColumnSearchProps';
import { useEffect, useState } from 'react';

export const columns = (columnsData) => {
  const columns = [];

  const checkedin_at = {
    key: 'checkedin_at',
    title: 'Inscrito',
    dataIndex: 'checkedin_at',
    /* align: 'center', */
    ellipsis: true,
    sorter: (a, b) => a.checkedin_at.localeCompare(b.checkedin_at),
    ...membersGetColumnSearchProps('created_at', columnsData),
    render(val, item) {
      return item.checkedin_at;
    },
  };

  const name = {
    key: 'eventUser_name',
    title: 'Nombres y apellidos',
    dataIndex: 'eventUser_name',
    ellipsis: true,
    sorter: (a, b) => a.eventUser_name.localeCompare(b.eventUser_name),
    ...membersGetColumnSearchProps('eventUser_name', columnsData),
    render: (val, item) => {
      return item.eventUser_name;
    },
  };

  const email = {
    key: 'eventUser_email',
    title: 'Email',
    dataIndex: 'eventUser_email',
    ellipsis: true,
    sorter: (a, b) => a.eventUser_email.localeCompare(b.eventUser_email),
    ...membersGetColumnSearchProps('eventUser_email', columnsData),
    render: (val, item) => {
      return item.eventUser_email;
    },
  };

  const course = {
    key: 'event_name',
    title: 'Curso',
    dataIndex: 'event_name',
    ellipsis: true,
    sorter: (a, b) => a.event_name.localeCompare(b.event_name),
    ...membersGetColumnSearchProps('event_name', columnsData),
    /* render(val, item) {
      return item.event_name;
    }, */
  };

  const created_at = {
    key: 'created_at',
    title: 'Creado',
    dataIndex: 'created_at',
    /* align: 'center', */
    ellipsis: true,
    sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    ...membersGetColumnSearchProps('created_at', columnsData),
    /* render(val, item) {
      return item.created_at;
    }, */
  };

  columns.push(checkedin_at);
  columns.push(name);
  columns.push(email);
  columns.push(course);
  columns.push(created_at);
  return columns;
};
