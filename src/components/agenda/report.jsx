import React, { Component, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Moment from 'moment';
import { AgendaApi } from '../../helpers/request';
import EventContent from '../events/shared/content_old';
import SearchComponent from '../shared/searchTable';
import { Select, Table as TableA, Row, Col } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../../components/speakers/getColumnSearch';

const { Option } = Select;

const ReportList = ( props ) => {
  const [columnsData, setColumnsData] = useState({});
  const columns = [
    {
      title: 'Fecha inicio', 
      dataIndex: 'datetime_start',
      ellipsis: true,
      sorter: (a, b) => a.datetime_start.localeCompare(b.datetime_start),
      ...getColumnSearchProps('datetime_start', columnsData),
      render: (text) => (
        <>
          {Moment(text).format('YYYY-MM-DD HH:mm')}            
        </>
      ),
    },
    {
      title: 'Fecha fin',
      dataIndex: 'datetime_end',
      ellipsis: true,
      sorter: (a, b) => a.datetime_end.localeCompare(b.datetime_end),
      ...getColumnSearchProps('datetime_end', columnsData),
      render: (text) => (
        <>           
          {Moment(text).format('YYYY-MM-DD HH:mm')}
        </>
      ),
    },
    {
      title: 'Actividad',
      dataIndex: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', columnsData),
    },
    /* {
      title: 'Action',
      render: (text) => (
        <Link
          to={{
            pathname: `${props.url}/checkin/${text._id}`,
            state: { name: text.name, id: text._id, event: props.event },
          }}>
          <RightOutlined />
        </Link>
      ),
    }, */
  ];

  return (
    <div>
      <CMS 
        API={AgendaApi}
        eventId={props.event._id}
        title={'CheckIn por Actividad'}
        description={'Para actualizar valores, refrescar la página'}
        columns={columns}
        search
        setColumnsData={setColumnsData}
        actions
        noRemove
        extraPath={`${props.url}/checkin`}
        extraPathIcon={<RightOutlined />}
        extraPathTitle={'Detalle'}
        exportData
        fileName={'CheckInActivity'}
      />
    </div>
  );
}

export default withRouter(ReportList);
