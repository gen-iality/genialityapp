import { Card, Comment, Typography } from 'antd';
import { useIntl } from 'react-intl';

const { Title, Text } = Typography;

const BasicFieldsToFormEnrollUserToEvent = ({ basicFields, editUser }: any) => {
  // console.log('🚀 BasicFieldsToFormEnrollUserToEvent ', basicFields);
  const intl = useIntl();
  const { names, email } = editUser?.properties || {};

  return (
    <>
      {editUser && (
        <Card style={{ borderRadius: '8px', marginBottom: '20px' }} bodyStyle={{ padding: '20px' }} hoverable>
          <Title level={5}>
            {intl.formatMessage({
              id: 'title.user_data',
              defaultMessage: 'Datos del usuario',
            })}
          </Title>
          <Comment
            author={<Text style={{ fontSize: '18px' }}>{names}</Text>}
            content={<Text style={{ fontSize: '18px' }}>{email}</Text>}
          />
        </Card>
      )}
      <div style={{ display: editUser ? 'none' : 'block' }}>
        {basicFields?.length > 0 &&
          basicFields.map((field: any) => {
            return field;
          })}
      </div>
    </>
  );
};

export default BasicFieldsToFormEnrollUserToEvent;
