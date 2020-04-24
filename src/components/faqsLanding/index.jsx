import React, { Component } from "react"
import { FaqsApi } from "../../helpers/request"
import { Collapse, Col } from 'antd'

const { Panel } = Collapse

const faqs = {
    textAlign: "left"
};

const center = {
    margin: "0 auto"
};
class Faqs extends Component {

    constructor(props) {
        super(props)
        this.state = {
            faqsData: []
        }
    }

    async componentDidMount() {
        this.getFaqs()
    }

    async getFaqs() {
        const faqsData = await FaqsApi.byEvent(this.props.eventId)

        this.setState({ faqsData })
        console.log(faqsData)
    }
    render() {
        const { faqsData } = this.state
        return (
            <Col
                xs={22}
                sm={22}
                md={18}
                lg={18}
                xl={18}
                style={center}
            >
                <Collapse style={faqs} defaultActiveKey={['0']}>
                    {
                        faqsData.map((faqs, key) => (
                            <Panel key={key} header={faqs.title} >
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

