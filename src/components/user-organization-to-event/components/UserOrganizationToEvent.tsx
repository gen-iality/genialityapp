import { ConfigProvider, List, ListProps } from 'antd';
import { UserOrganizationToEvent } from '../interface/table-user-oranization-to-event';
import { UserOrgToEventUserItem } from './UserOrgToEventUserItem';
interface Props extends ListProps<UserOrganizationToEvent> {
  getNewUsersOrgList: () => void;
}

const UserOrganizationToEventList = ({ grid, getNewUsersOrgList, ...listProps }: Props) => {
  return (
    <ConfigProvider
      renderEmpty={(componentName?: string | undefined) => {
        return 'No se encontraron usuarios con dicho nombre';
      }}>
      <List
        {...listProps}
        renderItem={(user) => <UserOrgToEventUserItem userOrg={user} getNewUsersOrgList={getNewUsersOrgList} />}
      />
    </ConfigProvider>
  );
};

export default UserOrganizationToEventList;
