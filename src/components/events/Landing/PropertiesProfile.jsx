import { List, Col, Spin } from 'antd';
import { formatDataToString } from '../../../helpers/utils';

const PropertiesProfile = (props) => {
  return (
    <Col
      className='asistente-list' //agrega el estilo a la barra de scroll
      span={24}
      style={{ marginTop: '20px', height: '45vh', maxHeight: '45vh', overflowY: 'auto' }}>
      {!props.propertiesUserPerfil && <Spin style={{ padding: '50px' }} size='large' tip='Cargando...'></Spin>}
      <List
        bordered
        dataSource={props.propertiesUserPerfil && props.propertiesUserPerfil}
        renderItem={(item) =>
          !item.visibleByContacts &&
          !item.visibleByAdmin &&
          this.props.cUser[item.name] && (
            <List.Item>
              <List.Item.Meta title={item.label} description={formatDataToString(this.props.cUser[item.name], item)} />
            </List.Item>
          )
        }
      />
    </Col>
  );
};

export default PropertiesProfile;
