import { useHelper } from '@context/helperContext/hooks/useHelper';
import { List } from 'antd';

import { formatDataToString } from '@helpers/utils';
const ProfileAttende = () => {
  const { propertiesOtherprofile } = useHelper();
  return (
    <div className='ant-list ant-list-split ant-list-bordered'>
      <List.Item>
        <List.Item.Meta
          title={'Nombre'}
          description={formatDataToString(
            propertiesOtherprofile.properties.name
              ? propertiesOtherprofile.properties.name
              : propertiesOtherprofile.properties.names
          )}
        />
      </List.Item>

      <List.Item>
        <List.Item.Meta
          title={'Celular'}
          description={formatDataToString(
            propertiesOtherprofile.properties.celular ? propertiesOtherprofile.properties.celular : 'No registra'
          )}
        />
      </List.Item>

      <List.Item>
        <List.Item.Meta title={'Correo electronico'} description={formatDataToString(propertiesOtherprofile.email)} />
      </List.Item>

      <List.Item>
        <List.Item.Meta
          title={'Edad'}
          description={formatDataToString(
            propertiesOtherprofile.properties.age ? propertiesOtherprofile.properties.age : 'No registra'
          )}
        />
      </List.Item>
    </div>
  );
};

export default ProfileAttende;
