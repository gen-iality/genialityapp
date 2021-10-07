import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addLoginInformation } from '../../redux/user/actions';
//Libraries and stuffs
import { CategoriesApi, EventsApi, UsersApi } from '../../helpers/request';
import Loading from '../loaders/loading';
import EventCard from '../shared/eventCard';
import 'react-toastify/dist/ReactToastify.css';
import ErrorServe from '../modal/serverError';
import { Row, Col, Space } from 'antd';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      user: {},
      error: {},
      loading: true,
      valid: true
    };
  }

  async componentDidMount() {
    let userId = this.props.match.params.id;
    try {
      const categories = await CategoriesApi.getAll();
      const events = await EventsApi.mine();
      const user = await UsersApi.getProfile(userId, true);
      this.setState({ loading: false, user, events: events || [], categories, valid: false }, this.handleScroll);
    } catch (e) {
      this.setState({
        timeout: true,
        loading: false,
        errorData: { status: e.response.status, message: JSON.stringify(e.response.data) }
      });
    }
  }

  handleScroll = () => {
    const hash = this.props.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        let topOfElement = element.offsetTop + 60;
        window.scroll({ top: topOfElement });
      }
    }
  };

  render() {
    const { loading, timeout, events, errorData } = this.state;
    return (
      <section className='section profile'>
        {loading ? (
          <Loading />
        ) : (
          <div className='container org-profile'>
            <div className='profile-data columns'>
              <div className='column is-12'>
                <h2 className='data-title'>
                  <small className='is-italic has-text-grey-light has-text-weight-300'>Tus</small>
                  <br />
                  <span className='has-text-grey-dark is-size-3'>Eventos</span>
                </h2>
                <Row gutter={[16, 24]}>
                  {events.map((event) => {
                    return (
                      <Col key={event._id} xs={24} sm={12} md={12} lg={8} xl={8}>
                        <EventCard
                          event={event}
                          action={''}
                          bordered={false}
                          right={[
                            <div className='edit' key={'event-' + event._id}>
                              <Link className='button-edit has-text-grey-light' to={`/eventadmin/${event._id}`}>
                                <Space>
                                  <span>
                                    <i className='fas fa-lg fa-cogs' />
                                  </span>
                                  <span>Administrar</span>
                                </Space>
                              </Link>
                            </div>
                          ]}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </div>
          </div>
        )}
        {timeout && <ErrorServe errorData={errorData} />}
      </section>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addLoginInformation: bindActionCreators(addLoginInformation, dispatch)
});

export default connect(null, mapDispatchToProps)(withRouter(Events));
