import { List, ListProps } from 'antd';
import React from 'react';
import { UserOrganizationToEvent } from '../interface/table-user-oranization-to-event';
import { UserOrgToEventUserItem } from './UserOrgToEventUserItem';
interface Props extends ListProps<UserOrganizationToEvent> {}

const UserOrganizationToEventList = ({ grid, ...listProps }: Props) => {
  return (
    <List
      grid={
        grid
          ? grid
          : {
              xs: 1,
              sm: 1,
              md: 1,
              lg: 1,
              xl: 1,
              xxl: 1,
            }
      }
      {...listProps}
      renderItem={(user) => <UserOrgToEventUserItem userOrg={user} />}
    />
  );
};

export default UserOrganizationToEventList;
