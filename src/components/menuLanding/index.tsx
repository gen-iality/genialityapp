import { Card, Input, Col, Row, Spin, Form, InputNumber, Switch } from 'antd';
import Header from '@/antdComponents/Header';
import BackTop from '@/antdComponents/BackTop';
import useMenuLanding from './hooks/useMenuLanding';
import { MenuLandingProps } from './interfaces/menuLandingProps';


const formLayout = { labelCol: { span: 24 }, wrapperCol: { span: 24 }, size: 'small' };

export default function MenuLanding(props: MenuLandingProps) {
  const {
    menu,
    isLoading,
    titleheader,
    updateValue,
    orderPosition,
    submit,
    mapActiveItemsToAvailable,
  } = useMenuLanding(props);

  return (
    <Form {...formLayout} onFinish={submit}>
      <Header title={titleheader} save form />
      <Spin tip='Cargando...' size='large' spinning={isLoading}>
        <Row gutter={[8, 8]} wrap>
          {Object.keys(menu).map((key, index) => (
            <Col key={key} xs={24} sm={8} md={6} lg={6} xl={6} xxl={6}>
              <Card title={menu[key].name} bordered={true} style={{ maxHeight: '350px' }}>
                <Form.Item name={menu[key].name}>
                  <Switch checked={menu[key].checked} onChange={() => mapActiveItemsToAvailable(key)} />
                </Form.Item>
                <Form.Item label={'Cambiar nombre de la sección'}>
                  <Input
                    name={`name${index}`}
                    disabled={menu[key].checked === true ? false : true}
                    onChange={(e) => updateValue(key, parseInt(e?.toString() || '0'), 'name')}
                    placeholder={menu[key].name}
                  />
                </Form.Item>
                <Form.Item label={'Posición en el menú'}>
                  <InputNumber
                    name={`position${index}`}
                    disabled={menu[key].checked === true ? false : true}
                    placeholder={(index + 1).toString()}
                    min={1}
                    onChange={(e) => orderPosition(key, parseInt(e?.toString() || '0'))}
                  />
                </Form.Item>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
      <BackTop />
    </Form>
  );
}
