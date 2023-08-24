import { List, ListProps } from 'antd';
import React, { useState } from 'react';
import { UserEventCertificatesItem } from './UserEventCertificatesItem';
import { Certificates } from '@/components/agenda/types';

interface EventUser {}

interface Props extends ListProps<EventUser> {
  certificate: Certificates;
  eventValue: any;
  dataSource: EventUser[];
}

export const UsersByCertificatesList = ({ certificate, eventValue, dataSource, ...listProps }: Props) => {
  

 
  return (
    <List
      style={{ height: '100%' }}
      bordered={false}
      dataSource={dataSource}
      renderItem={(eventUser) => (
        <UserEventCertificatesItem eventUser={eventUser} certificate={certificate} eventValue={eventValue} />
      )}
      {...listProps}
    />
  );
};
