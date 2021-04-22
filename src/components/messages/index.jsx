import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import InvitationDetail from './invitationDetail';
import LogOut from '../shared/logOut';
import InvitationsList from './list';
import { Button, Row, Space, Typography } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { timeout } = this.state;
    const { match } = this.props;
    return (
      <div className={'invitations'}>
        <Row justify='space-between' style={{ paddingBottom: '20px' }}>
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            <Text type='secondary'>La información en la tabla puede demorar un tiempo en reflejarse.</Text>
          </Space>
          <Button shape='round' size='small' type='primary' icon={<ReloadOutlined />}>
            Actualizar tabla
          </Button>
        </Row>
        <Route exact path={`${match.url}/`} render={() => <InvitationsList eventId={this.props.event._id} />} />
        <Route
          exact
          path={`${match.url}/detail`}
          render={() => <InvitationDetail event={this.props.event} close={this.closeDetail} />}
        />
        {timeout && <LogOut />}
      </div>
    );
  }
}

export default withRouter(Messages);
