import { Card, Col, Comment, Row, Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';
import { useIntl } from 'react-intl';
import { IUserToOrganization } from '../../interface/organization.interface';

interface Props {
  selectedUser: Omit<IUserToOrganization, 'password'>;
}

export const UnchangeableUserData = ({ selectedUser: userOrganization }: Props) => {
  const intl = useIntl();

  return (
    <Row style={{ paddingBottom: '5px' }} gutter={[8, 8]}>
      <Col span={24}>
        <Card style={{ borderRadius: '8px' }} bodyStyle={{ padding: '20px' }}>
          <Typography.Title level={5}>
            {intl.formatMessage({
              id: 'title.user_data',
              defaultMessage: 'Datos del usuario',
            })}
          </Typography.Title>
          <Comment
            avatar={
              <Avatar
                src={
                  userOrganization.picture ??
                  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                }
              />
            }
            author={<Typography.Text style={{ fontSize: '18px' }}>{userOrganization?.names}</Typography.Text>}
            content={<p>{userOrganization?.email}</p>}
          />
        </Card>
      </Col>
    </Row>
  );
};
