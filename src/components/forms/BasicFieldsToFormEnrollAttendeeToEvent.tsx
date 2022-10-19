import { imageforDefaultProfile } from '@helpers/constants';
import { nameAndEmailBasicFieldsStyles } from '@Utilities/checkInUtils';
import { Card, Comment, Image, Space, Typography } from 'antd';
import { useIntl } from 'react-intl';

const { Title, Text } = Typography;

const BasicFieldsToFormEnrollAttendeeToEvent = ({ basicFields, attendee }: any) => {
  const intl = useIntl();
  const { names, email } = attendee?.properties || {};
  const { picture } = attendee?.user || {};

  return (
    <>
      {attendee?._id && (
        <Card
          style={{ borderRadius: '8px', marginBottom: '20px', textAlign: 'center', cursor: 'auto' }}
          bodyStyle={{ padding: '20px' }}
          hoverable>
          <Title level={4} style={{ marginBottom: '30px' }}>
            {intl.formatMessage({
              id: 'title.user_data',
              defaultMessage: 'Datos del usuario',
            })}
          </Title>
          <Image width={250} src={picture ? picture : imageforDefaultProfile} />
          <Comment
            style={{ textAlign: 'center' }}
            content={
              <Space direction='vertical'>
                <Text style={nameAndEmailBasicFieldsStyles}>{names}</Text>
                <Text style={nameAndEmailBasicFieldsStyles}>{email}</Text>
              </Space>
            }
          />
        </Card>
      )}
      <div style={{ display: attendee?._id ? 'none' : 'block' }}>
        {basicFields?.length > 0 &&
          basicFields.map((field: any) => {
            return field;
          })}
      </div>
    </>
  );
};

export default BasicFieldsToFormEnrollAttendeeToEvent;
