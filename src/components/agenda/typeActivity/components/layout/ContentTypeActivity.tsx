;
import { Row, Col } from 'antd';
import CardOption from '../CardOption';

interface propsOptions {
  options?: Array<any>;
}

const ContentTypeActivity = ({ options }: propsOptions) => {
  return (
    <Row /* style={{width: '100%'}} */ gutter={[16, 16]} justify='center'>
      {options &&
        options.length > 0 && options.length < 3 ?
        options.map((option) => (
          <Col span={6} offset={2} key={'key-' + option.title}>
            <CardOption id={option.key} title={option.title} description={option?.description} image={option?.image} />
          </Col>
        ))
        :
        options.map((option) => (
          <Col span={7} offset={1} key={'key-' + option.title}>
            <CardOption id={option.key} title={option.title} description={option?.description} image={option?.image} />
          </Col>
        ))
      }
    </Row>
  );
};

export default ContentTypeActivity;
