import React, { Component } from 'react';
import { FaqsApi, Actions } from '../../helpers/request';
import { Collapse, Col } from 'antd';

const { Panel } = Collapse;

const center = {
  margin: '0 auto',
};
class Faqs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faqsData: [],
      styles: {},
    };
  }

  async componentDidMount() {
    this.getFaqs();
  }

  async getFaqs() {
    let eventId = this.props.event?._id;
    const faqsData = await FaqsApi.byEvent(eventId);
    // const info = await Actions.getAll(`/api/events/${eventId}`);
    if (this.props.event.styles !== {}) {
      this.setState({
        styles: {
          textAlign: 'left',
          fontWeight: 500,
          backgroundColor:
            this.props.event.styles.toolbarDefaultBg !== '#ffffff'
              ? this.props.event.styles.toolbarDefaultBg
              : '#7d8485d4',
        },
      });
    }
    this.setState({ faqsData });
  }
  render() {
    const { faqsData, styles } = this.state;
    return (
      <Col xs={22} sm={22} md={18} lg={18} xl={18} style={center}>
        <Collapse
          className='collapse_question'
          style={{
            backgroundColor:
              this.props.event.styles.toolbarDefaultBg !== '#ffffff'
                ? this.props.event.styles.toolbarDefaultBg
                : '#7d8485d4',
          }}
          defaultActiveKey={['3']}>
          {faqsData.map((faqs, key) => (
            <Panel key={key} header={<span style={{ color: this.props.event.styles.textMenu }}>{faqs.title}</span>}>
              <div dangerouslySetInnerHTML={{ __html: faqs.content }} />
            </Panel>
          ))}
        </Collapse>
      </Col>
    );
  }
}

export default Faqs;
