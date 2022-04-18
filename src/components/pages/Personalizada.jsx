import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import EditarHtml from '../shared/crud/components/editorHtml';

class PagePersonalizada extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const pageInfo = this.props.location.state.info;
    if (!pageInfo) return this.props.history.goBack();
    return (
      <div>
        <h2 className='title'>{pageInfo.name}</h2>
        <h3 className='subtitle'>{pageInfo.label}</h3>
        <p>{pageInfo.description}</p>
        <EditarHtml />
      </div>
    );
  }
}

export default withRouter(PagePersonalizada);
