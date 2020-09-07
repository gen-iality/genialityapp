import React, { Component, Fragment } from "react";
import { Card } from 'antd';

class InformativeSection2 extends Component {
    constructor(props) {
        super(props);
        this.state = {           
            informativeSection1: []
        }
    }

    componentDidMount() {
        this.setState({            
            informativeSection1: this.props.event.itemsMenu.informativeSection1
        })    
    }
    render() {
        const { informativeSection1 } = this.state
        return (
            <Fragment>                
                {
                    informativeSection1 && (
                        <div className="site-card-border-less-wrapper">
                            <Card title={informativeSection1.name} bordered={false} style={{ width: 1000 }}>
                                <div dangerouslySetInnerHTML={{ __html: informativeSection1.markup }}/>
                            </Card>
                        </div>
                    )
                }
            </Fragment>
        )
    }
}

export default InformativeSection2
