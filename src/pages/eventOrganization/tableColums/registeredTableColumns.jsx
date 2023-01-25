import { useHistory } from 'react-router';
import { Tooltip, Button, Row, Col, Popover, Image, Avatar, Empty, Spin } from 'antd';
import { ClockCircleOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { membersGetColumnSearchProps } from '../searchFunctions/membersGetColumnSearchProps';
import { useEffect, useState } from 'react';

export const columns = (columnsData) => {
  const columns = [];

  const checked_in = {
    title: 'Inscrito',
    dataIndex: 'checked_in',
    /* align: 'center', */
    ellipsis: true,
    sorter: (a, b) => a.checked_in.localeCompare(b.checked_in),
    ...membersGetColumnSearchProps('created_at', columnsData),
    render(val, item) {
      return item.checked_in;
    },
  };

  const name = {
    title: 'Nombres y apellidos',
    dataIndex: 'eventUser_name',
    ellipsis: true,
    sorter: (a, b) => a.eventUser_name.localeCompare(b.eventUser_name),
    ...membersGetColumnSearchProps('eventUser_name', columnsData),
    render(val, item) {
      return item.eventUser_name;
    },
  };

  const course = {
    title: 'Curso',
    dataIndex: 'event_name',
    ellipsis: true,
    sorter: (a, b) => a.event_name.localeCompare(b.event_name),
    ...membersGetColumnSearchProps('event_name', columnsData),
    render(val, item) {
      return item.event_name;
    },
  };

  const created_at = {
    title: 'Creado',
    dataIndex: 'created_at',
    /* align: 'center', */
    ellipsis: true,
    sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    ...membersGetColumnSearchProps('created_at', columnsData),
    render(val, item) {
      return item.created_at;
    },
  };

  columns.push(checked_in);
  columns.push(name);
  columns.push(course);
  columns.push(created_at);
  return columns;
};
