import React, { Component } from "react"
import { FaqsApi } from "../../helpers/request"
import { Space, Card } from 'antd'


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
            <Space direction="vertical">
                {
                    faqsData.map((faqs, key) => (
                        <Card title={faqs.title} key={key} style={{ width: 600 }}>
                            <div dangerouslySetInnerHTML={{ __html: faqs.content }} />
                        </Card>
                    ))
                }
            </Space>
        )
    }
}

export default Faqs

