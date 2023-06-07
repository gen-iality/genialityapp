import { Card, Input, Col, Row, Spin, Form, InputNumber, Switch } from 'antd';
import Header from '@/antdComponents/Header';
import BackTop from '@/antdComponents/BackTop';
import useMenuLanding from './hooks/useMenuLanding';
import { MenuLandingProps } from './interfaces/menuLandingProps';


/* `const formLayout` is defining an object that contains the layout configuration for the `Form`
component from the `antd` library. It specifies that the label column should span the entire width
of the form, the wrapper column should also span the entire width, and the size of the form should
be small. This object is then passed as props to the `Form` component to apply the specified layout
configuration. */
const formLayout = { labelCol: { span: 24 }, wrapperCol: { span: 24 }, size: 'small' };

export default function MenuLanding(props: MenuLandingProps) {
  const {
    menu,
    isLoading,
    titleheader,
    updateValue,
    submit,
    checkedItem,
  } = useMenuLanding(props);

  return (
    //@ts-ignore
    <Form {...formLayout} onFinish={submit}>
      <Header title={titleheader} save form />
      <Spin tip='Cargando...' size='large' spinning={isLoading}>
        <Row gutter={[8, 8]} wrap>
          {Object.keys(menu).map((key, index) => (
            <Col key={key} xs={24} sm={8} md={6} lg={6} xl={6} xxl={6}>
              <Card title={menu[key].name} bordered={true} style={{ maxHeight: '350px' }}>
                <Form.Item name={menu[key].name}>
                  <Switch checked={menu[key].checked} onChange={(value) => checkedItem(key, value)} />
                </Form.Item>
                <Form.Item label={'Cambiar nombre de la sección'}>
                  <Input
                    size='small'
                    name={`name${index}`}
                    disabled={menu[key].checked === true ? false : true}
                    onChange={(e) => updateValue(key, e.target.value, 'name')}
                    placeholder={menu[key].name}
                  />
                </Form.Item>
                <Form.Item label={'Posición en el menú'}>
                  <InputNumber
                    size= 'small'
                    name={`position${index}`}
                    disabled={menu[key].checked === true ? false : true}
                    placeholder={(menu[key].position && menu[key].position !== 30) ? menu[key].position.toString() : (index + 1).toString()}
                    min={1}
                    onChange={(e) => {e && updateValue(key, e , 'position')}}
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
