import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import List from './listado_old';
import Certificado from './certificado';

class Certificados extends Component {
  constructor(props) {
    super(props);
    this.state = { step: 0, data: {} };
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.setState({ step: 0 });
  }

  certTab = (data) => {
    this.setState({ step: 1, data });
  };

  listTab = () => {
    this.setState({ step: 0 });
  };

  render() {
    const layout = [
      <List key={1} certTab={this.certTab} event={this.props.event} />,
      <Certificado key={2} data={this.state.data} event={this.props.event} listTab={this.listTab} />
    ];
    return <section>{layout[this.state.step]}</section>;
  }
}

export default withRouter(Certificados);
