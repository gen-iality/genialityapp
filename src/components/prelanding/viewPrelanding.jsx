import { CurrentEventContext } from '@/context/eventContext';
import { Col, Row } from 'antd';
/** ant design */
import { Layout } from 'antd';

import { useContext } from 'react';

const { Content } = Layout;

const ViewPrelanding = (props) => {
  const cEventContext = useContext(CurrentEventContext);
  return (
    <Content className='site-layout-background'>
      <img src={cEventContext?.value && cEventContext.value?.styles?.banner_image}></img>
      <Row justify='center'>ViewPrelanding</Row>
    </Content>
  );
};

export default ViewPrelanding;
