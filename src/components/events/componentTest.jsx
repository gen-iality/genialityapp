import React, { Component, Fragment } from "react"
import WithUserEventRegistered from "../shared/withUserEventRegistered"
import { List, Avatar } from 'antd';
const data = [
    {
        title: 'Ant Design Title 1',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
];

class componentTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    render() {
        return (
            <Fragment>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<a href="https://ant.design">{item.title}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />
            </Fragment>
        )
    }
}

export default WithUserEventRegistered(componentTest)