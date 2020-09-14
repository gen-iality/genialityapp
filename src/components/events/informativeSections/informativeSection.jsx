import React, { Component, Fragment } from "react";
import { Card } from 'antd';
import Parser from 'html-react-parser';

class InformativeSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markup: '',
            informativeSection: [],            
        }
    }

    componentDidMount() {
        this.setState({
            informativeSection: this.props.event.itemsMenu.informativeSection,
            markup: this.props.event.itemsMenu.informativeSection.markup,
        })       
    }
    render() {
        const { markup, informativeSection } = this.state
        return (
            <Fragment>
                {
                    informativeSection && (
                        <div className="site-card-border-less-wrapper">
                            <Card title={informativeSection.name} bordered={false} style={{ width: 1000 }}>
                                {Parser(markup)}
                            </Card>
                        </div>
                    )
                }                
            </Fragment>
        )
    }
}

export default InformativeSection
