import React, { Component } from "react"
import { FaqsApi, Actions } from "../../helpers/request"
import { Collapse, Col } from 'antd'
import { Background } from "react-parallax";

const { Panel } = Collapse

const center = {
    margin: "0 auto"
};
class Faqs extends Component {

    constructor(props) {
        super(props)
        this.state = {
            faqsData: [],
            styles:{}
        }
    }

    async componentDidMount() {
        this.getFaqs()
    }

    async getFaqs() {
        const faqsData = await FaqsApi.byEvent(this.props.eventId)
        const info = await Actions.getAll(`/api/events/${this.props.eventId}`)
        if(info.styles !== {}){
            this.setState({
                styles: {
                textAlign: "left",
                fontWeight: 500,
                backgroundColor: info.styles.toolbarDefaultBg !== "#ffffff" ? info.styles.toolbarDefaultBg : "#7d8485d4"
                }
                })
        }
        this.setState({ faqsData })
        console.log(faqsData)
    }
    render() {
        const { faqsData, styles } = this.state
        return (
            <Col
                xs={22}
                sm={22}
                md={18}
                lg={18}
                xl={18}
                style={center}
            >
                <Collapse className="collapse_question" style={styles} defaultActiveKey={['3']}>
                    {
                        faqsData.map((faqs, key) => (
                            <Panel key={key} header={faqs.title}>
                                <div dangerouslySetInnerHTML={{ __html: faqs.content }} />
                            </Panel>
                        ))
                    }

                </Collapse>
            </Col>
        )
    }
}

export default Faqs

