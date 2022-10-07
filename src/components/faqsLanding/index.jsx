import { Component } from 'react';
import { FaqsApi } from '@helpers/request';
import { Collapse, Col, Row } from 'antd';
import withContext from '../../context/withContext';
import ReactQuill from 'react-quill';

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
    let eventId = this.props.cEvent.value?._id;
    const faqsData = await FaqsApi.byEvent(eventId);
    if (this.props.cEvent.value.styles) {
      this.setState({
        styles: {
          textAlign: 'left',
          fontWeight: 500,
          backgroundColor:
            this.props.cEvent.value.styles.toolbarDefaultBg !== '#ffffff'
              ? this.props.cEvent.value.styles.toolbarDefaultBg
              : '#7d8485d4',
        },
      });
    }
    this.setState({ faqsData });
  }
  render() {
    const { faqsData, styles } = this.state;
    return (
      <Row gutter={[8, 8]} wrap justify='center'>
        <Col xs={22} sm={22} md={18} lg={18} xl={18}>
          <Collapse
            className='collapse_question'
            /* style={{
              backgroundColor:
                this.props.cEvent.value.styles.toolbarDefaultBg !== '#ffffff'
                  ? this.props.cEvent.value.styles.toolbarDefaultBg
                  : '#7d8485d4',
            }} */
            defaultActiveKey={['3']}>
            {faqsData.map((faqs, key) => (
              <Panel
                key={key}
                header={
                  <span /* style={{ color: this.props.cEvent.value.styles.textMenu }} */>
                    <b>{'Pregunta: '}</b>
                    <br />
                    {faqs.title}
                  </span>
                }>
                <b>Respuesta:</b>{' '}
                <Row>
                  <Col span={24} id='img-informative'>
                    <ReactQuill
                      value={faqs.content}
                      readOnly={true}
                      className='hide-toolbar ql-toolbar'
                      theme='bubble'
                    />
                  </Col>
                </Row>
              </Panel>
            ))}
          </Collapse>
        </Col>
      </Row>
    );
  }
}

let FaqsWithContext = withContext(Faqs);
export default FaqsWithContext;
