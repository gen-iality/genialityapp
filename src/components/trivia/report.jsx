import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";

import EventContent from "../events/shared/content";

import { Input, List, Card } from "antd";

const data = [
  {
    title: "Title 1",
  },
  {
    title: "Title 2",
  },
  {
    title: "Title 3",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 5",
  },
  {
    title: "Title 6",
  },
];

class TriviaReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSurvey: {
        name: "Encuesta 1",
      },
    };
  }

  componentDidMount() {
    console.log(this.props);
  }

  goBack = () => this.props.history.goBack();

  render() {
    let { currentSurvey } = this.state;
    return (
      <Fragment>
        <EventContent title="Encuestas" closeAction={this.goBack}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.title}>Card content</Card>
              </List.Item>
            )}
          />
          ,
        </EventContent>
      </Fragment>
    );
  }
}

export default withRouter(TriviaReport);
