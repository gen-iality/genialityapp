import { Button, List, Space, Tag } from 'antd';
import React from 'react';
import { UserOrganizationToEvent } from '../interface/table-user-oranization-to-event';
import { CheckCircleOutlined } from '@ant-design/icons';
import { createEventUserFromUserOrganization } from '../helpers/helper';

interface Props {
  userOrg: UserOrganizationToEvent;
}
export const UserOrgToEventUserItem = ({ userOrg }: Props) => {
  return (
    <List.Item
      key={userOrg.id}
      actions={[
        <Space align='center'>
          {userOrg.isAlreadyEventUser ? (
            <>
              <Tag color={'success'} style={{ padding: '4px 8px', fontSize: '14px' }}>
                Inscrito
              </Tag>
            </>
          ) : (
            <Button onClick={() => createEventUserFromUserOrganization(userOrg)} type='primary'>
              Inscribir
            </Button>
          )}
        </Space>,
      ]}>
      <List.Item.Meta title={userOrg.name} description={userOrg.email} />
    </List.Item>
  );
};
