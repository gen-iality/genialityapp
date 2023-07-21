import { List, ListProps } from 'antd';
import React from 'react';
import { UserOrganizationToEvent } from '../interface/table-user-oranization-to-event';
import { UserOrgToEventUserItem } from './UserOrgToEventUserItem';
interface Props extends ListProps<UserOrganizationToEvent> {
  getNewUsersOrgList: () => void;
}

const UserOrganizationToEventList = ({ grid, getNewUsersOrgList, ...listProps }: Props) => {
  return (
    <List
      {...listProps}
      renderItem={(user) => <UserOrgToEventUserItem userOrg={user} getNewUsersOrgList={getNewUsersOrgList} />}
    />
  );
};

export default UserOrganizationToEventList;
