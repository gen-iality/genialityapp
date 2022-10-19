import { Component, Fragment } from 'react';
import withContext from '@context/withContext';

class MySection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: '',
      event: {},
    };
  }

  componentDidMount() {
    this.setState({
      eventId: this.props.eventId,
      event: this.props.event,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.event !== prevProps.event) {
      this.setState({
        eventId: this.props.eventId,
        event: this.props.event,
      });
    }
  }

  createMarkup(html) {
    return { __html: html };
  }

  render() {
    const { event } = this.state;
    return (
      <Fragment>
        <div dangerouslySetInnerHTML={this.createMarkup(this.props.cEvent?.value?.itemsMenu?.my_section.markup)} />
      </Fragment>
    );
  }
}

export default withContext(MySection);
