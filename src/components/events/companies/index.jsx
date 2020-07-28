import React, { Component, Fragment } from "react";
import { withRouter, Link } from "react-router-dom"
import { getEventCompanies } from "../../empresas/services"
import { Card, Button } from 'antd';
import DescriptionCompany from "./description_company"

const { Meta } = Card;

class Company extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataPage: {},
            showData: false
        }
        this.setDataToComponent = this.setDataToComponent.bind(this)
        this.gotoActivityList = this.gotoActivityList.bind(this)
    }

    async componentDidMount() {
        if (this.props.eventId) {
            const { eventId } = this.props
            const data = await getEventCompanies(eventId)
            console.log(data)
            this.setState({ data: data })
        }
    }

    setDataToComponent(item) {
        this.setState({ dataPage: item, showData: true })
        console.log(this.state.dataPage)
    }

    gotoActivityList = () => {
        console.log("reconoce funcion")
        this.setState({ showData: false });
        console.log(this.state)
    };

    render() {
        const { data, showData, dataPage } = this.state
        const { eventId } = this.props
        return (
            <Fragment>
                {
                    showData === true ? (
                        <DescriptionCompany data={dataPage} eventId={eventId} gotoActivityList={this.gotoActivityList} />
                    ) : (
                            data.map((item, key) => {
                                return <Card
                                    hoverable
                                    style={{ width: 240 }}
                                    key={key}
                                    extra={
                                        <a onClick={() => this.setDataToComponent(item)}>Mas</a>
                                    }
                                >
                                    <Meta title={item.name} />
                                    <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
                                </Card>
                            })

                        )
                }
            </Fragment>
        )
    }
}

export default withRouter(Company);