import { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Button } from 'antd';

class ModalInvitationError extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
    };
    this.handleOk = this.handleOk.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: true });
    }
  }

  handleOk = () => {
    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    return (
      <Fragment>
        <div>
          <Modal
            visible={visible}
            title='No seleccionaste ningún Usuario'
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button key='submit' type='primary' onClick={this.handleOk}>
                Cerrar
              </Button>,
            ]}>
            <p>Por favor Selecciona un usuario para poder envíar una invitación e intenta nuevamente</p>
          </Modal>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(ModalInvitationError);
