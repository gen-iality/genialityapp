import { imageforDefaultProfile } from '@/helpers/constants';
import { Card, Comment, Divider, Image, Typography } from 'antd';
import { useIntl } from 'react-intl';

const { Title, Text } = Typography;

const BasicFieldsToFormEnrollUserToEvent = ({ basicFields, editUser }: any) => {
  console.log('🚀 debug ~ BasicFieldsToFormEnrollUserToEvent ~ { basicFields, editUser }', { basicFields, editUser });
  const intl = useIntl();
  const { names, email } = editUser?.properties || {};
  const { picture } = editUser?.user || {};

  return (
    <>
      {editUser?._id && (
        <Card
          style={{ borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}
          bodyStyle={{ padding: '20px' }}
          hoverable>
          <Title level={4}>
            {intl.formatMessage({
              id: 'title.user_data',
              defaultMessage: 'Datos del usuario',
            })}
          </Title>
          <Image width={150} src={picture ? picture : imageforDefaultProfile} />
          <Comment
            style={{ textAlign: 'start' }}
            content={
              <>
                <Text style={{ fontSize: '18px' }}>{names}</Text>
                <Divider style={{ margin: '5px' }} />
                <Text style={{ fontSize: '18px' }}>{email}</Text>
              </>
            }
          />
        </Card>
      )}
      <div style={{ display: editUser?._id ? 'none' : 'block' }}>
        {basicFields?.length > 0 &&
          basicFields.map((field: any) => {
            return field;
          })}
      </div>
    </>
  );
};

export default BasicFieldsToFormEnrollUserToEvent;
