import { Link } from 'react-router-dom';
import { Tooltip, Typography, Row, Col, Button } from 'antd';
import { PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Header = ( props ) => {
  const { title, titleTooltip, add, addUrl, edit, remove, save } = props;

  return (
    <>
      <Tooltip placement='bottomLeft' title={titleTooltip} >
        <Title level={4} >{title}</Title>
      </Tooltip>

      <Row wrap justify='end' gutter={[8, 8]}>
        <Col>
          {
            addUrl && (
              <Link 
                to={addUrl}
              >
                <Button type="primary" icon={<PlusCircleOutlined />} size="middle" >
                  {'Agregar'}
                </Button>
              </Link>
            )
          }
        </Col>
        <Col>
          {
            save && (
              <Button 
                  onClick={save} 
                  type='primary' 
                  icon={<SaveOutlined />}
                  size="middle"
                >
                  {'Guardar'}
                </Button>
            )
          }
        </Col>
      </Row>
    </>
  )
}

export default Header;