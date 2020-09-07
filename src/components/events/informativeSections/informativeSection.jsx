import React, { Component, Fragment } from "react";
import { Card } from 'antd';

class InformativeSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            informativeSection: [],            
        }
    }

    componentDidMount() {
        this.setState({
            informativeSection: this.props.event.itemsMenu.informativeSection,
        })       
    }
    render() {
        const { informativeSection } = this.state
        return (
            <Fragment>
                {
                    informativeSection && (
                        <div className="site-card-border-less-wrapper">
                            <Card title={informativeSection.name} bordered={false} style={{ width: 1000 }}>
                                <div dangerouslySetInnerHTML={{ __html: informativeSection.markup }} />
                            </Card>
                        </div>
                    )
                }                
            </Fragment>
        )
    }
}

export default InformativeSection
