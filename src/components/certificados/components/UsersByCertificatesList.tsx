import { List, ListProps } from 'antd';
import React from 'react';
import { UserEventCertificatesItem } from './UserEventCertificatesItem';
import { Certificates } from '@/components/agenda/types';

interface EventUser {}

interface Props extends ListProps<EventUser> {
  certificate: Certificates;
  eventValue: any;
}

export const UsersByCertificatesList = ({ certificate, eventValue, ...listProps }: Props) => {
  return (
    <List
      bordered={false}
      renderItem={(eventUser) => (
        <UserEventCertificatesItem eventUser={eventUser} certificate={certificate} eventValue={eventValue} />
      )}
      {...listProps}
    />
  );
};
