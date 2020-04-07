import React, { Component } from "react"
import { FaqsApi } from "../../helpers/request"
import { Collapse } from 'antd'

const { Panel } = Collapse

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
            <Collapse defaultActiveKey={['0']}>
                {
                    faqsData.map((faqs, key) => (
                        <Panel key={key} header={faqs.title} >
                            <div dangerouslySetInnerHTML={{ __html: faqs.content}}/>
                        </Panel>
                    ))
                }

            </Collapse>
        )
    }
}

export default Faqs

