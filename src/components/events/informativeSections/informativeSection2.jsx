import React, { Component, Fragment } from "react";
import { Card } from 'antd';
import Parser from 'html-react-parser'

class InformativeSection2 extends Component {
    constructor(props) {
        super(props);
        this.state = {           
            markup: '',
            informativeSection1:[]
        }
    }

    componentDidMount() {        
        this.setState({            
            markup: this.props.event.itemsMenu.informativeSection1.markup,
            informativeSection1: this.props.event.itemsMenu.informativeSection1
        })    
    }
    render() {
        const { markup, informativeSection1 } = this.state
        return (
            <Fragment>                
                {
                    informativeSection1 && (
                        <div className="site-card-border-less-wrapper">
                            <Card title={informativeSection1.name} bordered={false} style={{ width: 1000 }}>
                                {Parser(markup) }
                            </Card>
                        </div>
                    )
                }
            </Fragment>
        )
    }
}

export default InformativeSection2
