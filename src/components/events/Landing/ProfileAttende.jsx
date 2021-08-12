import React, { useContext } from 'react';
import { HelperContext } from '../../../Context/HelperContext';
import { List } from 'antd';
import { formatDataToString } from '../../../helpers/utils';
const ProfileAttende = () => {
  let { propertiesOtherprofile } = useContext(HelperContext);

  return (
    <div className='ant-list ant-list-split ant-list-bordered'>
      <List.Item>
        <List.Item.Meta
          title={'Nombre'}
          description={formatDataToString(
            propertiesOtherprofile.name ? propertiesOtherprofile.name : propertiesOtherprofile.names
          )}
        />
      </List.Item>

      <List.Item>
        <List.Item.Meta
          title={'Celular'}
          description={formatDataToString(
            propertiesOtherprofile.celular ? propertiesOtherprofile.celular : 'No registra'
          )}
        />
      </List.Item>

      <List.Item>
        <List.Item.Meta title={'Correo electronico'} description={formatDataToString(propertiesOtherprofile.email)} />
      </List.Item>

      <List.Item>
        <List.Item.Meta
          title={'Edad'}
          description={formatDataToString(propertiesOtherprofile.age ? propertiesOtherprofile.age : 'No registra')}
        />
      </List.Item>
    </div>
  );
};

export default ProfileAttende;
