import { Modal } from 'antd'
import { Component } from 'react'

/**
 * @deprecated its parent is deprecated too
 */
export default class ModalRelation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  componentDidMount() {
    this.setState({
      visible: this.props.showModal,
    })
  }
  handleOk = () => {
    this.setState({
      visible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    return (
      <div>
        <Modal
          title="Basic modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    )
  }
}
