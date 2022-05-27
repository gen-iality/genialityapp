import { Component } from 'react';
import { withRouter } from 'react-router';
import { Modal, Typography, Descriptions, Button } from 'antd';
import TimeStamp from 'react-timestamp';
const { Title } = Typography;

class DetailTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      visible: this.props.visible,
      propertyName: [],
    };
    this.handleOk = this.handleOk.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      const propertiesData = [];
      Object.keys(this.props.item.properties).map((propertyName) => propertiesData.push(propertyName));
      this.setState({ propertyName: propertiesData, item: this.props.item, visible: true });
    }
    if (this.props.visible !== prevProps.visible) {
      this.setState({ item: this.props.item, visible: true });
    }
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, item, propertyName } = this.state;
    return (
      <div>
        <Modal
          title={item.event}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          style={{ height: '100%' }}
          footer={[
            <Button key='back' type='primary' onClick={this.handleOk}>
              Ok
            </Button>,
          ]}>
          <Descriptions title={item.event} size='small' column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            {<Descriptions.Item label='Rol'>{item.rol ? item.rol : 'No tienes un rol asignado'}</Descriptions.Item>}
            {item.state && <Descriptions.Item label='Estado'>{item.state}</Descriptions.Item>}
            {item.event_start && (
              <Descriptions.Item label='Fecha de inicio'>
                <TimeStamp date={item.event_start} />
              </Descriptions.Item>
            )}
            {item.event_end && (
              <Descriptions.Item label='Fecha Finalización'>
                <TimeStamp date={item.event_end} />
              </Descriptions.Item>
            )}
            {
              <Descriptions.Item label='Registro'>
                {item.status === true ? 'Asistencia Confirmada' : 'Asistencia sin confirmar'}
              </Descriptions.Item>
            }
            {item.author && <Descriptions.Item label='Organizador'>{item.author}</Descriptions.Item>}
            {item.properties && (
              <Descriptions.Item title='Tu información en el curso' span={4}>
                <Title level={4}>Tu información en el curso</Title>
              </Descriptions.Item>
            )}
            {item.properties &&
              propertyName.map((key) => (
                <Descriptions.Item key={key} label={key} span={4}>
                  {item.properties[key] === item.properties.meta_data
                    ? 'Información no disponible por el momento'
                    : item.properties[key] === item.properties.properties
                    ? 'Información no disponible por el momento'
                    : item.properties[key]}
                </Descriptions.Item>
              ))}
          </Descriptions>
        </Modal>
      </div>
    );
  }
}

export default withRouter(DetailTickets);
