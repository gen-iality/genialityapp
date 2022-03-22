import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { EventsApi } from '../../helpers/request';
import { Button, Row, Col, Typography, Space, message } from 'antd';
import loadable from '@loadable/component';

Moment.locale('es');
momentLocalizer();

const ErrorServe = loadable(() => import('../modal/serverError'));
const ModalFeedback = loadable(() => import('../../components/authentication/ModalFeedback'));
const LoadingEvent = loadable(() => import('../loaders/loadevent'));
const EventCard = loadable(() => import('../shared/eventCard'));

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      typeEvent: 'next',
      events: [],
      tabEvt: false,
      tabEvtType: false,
      tabEvtCat: false,
      loadingState: false,
      serverError: false,
      errorData: {},
      nelements: 20,
      pageSize: 20,
      limit: 100,
      hasMore: undefined,
    };
    this.fetchEvent = this.fetchEvent.bind(this);
  }

  async componentDidMount() {
    await this.fetchEvent(this.state.typeEvent);
  }

  FriendLyUrl = (url) => {
    let slug = url?.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ');
    slug = url?.replace(/^\s+|\s+$/gm, '');
    slug = url?.replace(/\s+/g, '-');
    return slug;
  };

  async fetchEvent(type) {
    try {
      this.setState({ events: [] });
      let { pageSize } = this.state;
      type == 'prev' && pageSize >= this.state.limit
        ? this.setState({ hasMore: false })
        : type == 'prev'
        ? this.setState({ hasMore: true })
        : pageSize >= this.state.total
        ? this.setState({ hasMore: false })
        : this.setState({ hasMore: true });
      this.setState({ loading: true, typeEvent: type });
      const resp =
        type === 'next'
          ? await EventsApi.getNextEvents(`?pageSize=${pageSize}`)
          : await EventsApi.getOldEvents(`?pageSize=${pageSize}`);

      console.log('resp.meta.current_page', resp.meta.current_page, pageSize, resp.meta.total);
      //FILTERED
      const events = resp.data.filter((item) => item?.organizer);

      this.setState({
        events,
        loading: false,
        current_page: resp.meta.current_page,
        total: resp.meta.total,
      });
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401)
          message.open({
            type: 'error',
            content: <>Error : {data?.message || status}</>,
          });
        else this.setState({ serverError: true, loader: false });
      } else {
        if (error.request) console.error(error.request);
        this.setState({ serverError: true, loader: false });
      }
    }
  }
  // Funcion usada para incrementar el numero de eventos pasados consultados a la API
  seeMore = async (page, type) => {
    let { pageSize } = this.state;
    pageSize = pageSize + page;
    this.setState({ pageSize }, async () => await this.fetchEvent(type));
  };

  render() {
    const { typeEvent, serverError, errorData, events, loading, hasMore } = this.state;

    return (
      <div style={{ padding: '20px' }}>
        <ModalFeedback />
        <Row gutter={[16, 16]} wrap>
          <Col span={24}>
            <Typography.Title level={1}>Eventos</Typography.Title>
          </Col>
          <Col span={24}>
            <Space wrap>
              <Button
                onClick={
                  !loading
                    ? () => this.setState({ pageSize: this.state.nelements }, async () => this.fetchEvent('next'))
                    : null
                }
                type={typeEvent === 'next' ? 'primary' : 'text'}
                size='large'
                shape='round'>
                Próximos
              </Button>
              <Button
                onClick={
                  !loading
                    ? () => this.setState({ pageSize: this.state.nelements }, async () => this.fetchEvent('prev'))
                    : null
                }
                type={typeEvent === 'prev' ? 'primary' : 'text'}
                size='large'
                shape='round'>
                Pasados
              </Button>
            </Space>
          </Col>
          <Col span={24}>
            <section className='home'>
              {/* <div className='tabs'>
            <ul>
              <li
                onClick={
                  !loading
                    ? () => this.setState({ pageSize: this.state.nelements }, async () => this.fetchEvent('next'))
                    : null
                }
                className={typeEvent === 'next' ? 'is-active' : ''}>
                <a>Próximos</a>
              </li>
              <li
                onClick={
                  !loading
                    ? () => this.setState({ pageSize: this.state.nelements }, async () => this.fetchEvent('prev'))
                    : null
                }
                className={typeEvent === 'prev' ? 'is-active' : ''}>
                <a>Pasados</a>
              </li>
            </ul>
          </div> */}
              <div className='dynamic-content'>
                {loading ? (
                  <LoadingEvent />
                ) : (
                  <Row gutter={[16, 16]}>
                    {events.length <= 0 ? (
                      <p className='sin-evento'>No hay eventos próximos</p>
                    ) : (
                      events.map((event, key) => {
                        return (
                          <Col key={key} xs={24} sm={12} md={12} lg={8} xl={6}>
                            <EventCard
                              bordered={false}
                              key={event._id}
                              event={event}
                              action={{
                                name: 'Ver',
                                url: `event/${this.FriendLyUrl(event.name)}`,
                              }}
                            />
                          </Col>
                        );
                      })
                    )}
                  </Row>
                )}
                {/*hasMore === true && typeEvent === 'prev'*/}
                {hasMore === true && events.length > 10 ? (
                  <Button
                    size='large'
                    block
                    loading={loading}
                    onClick={() => this.seeMore(this.state.pageSize, typeEvent)}>
                    {!loading ? 'Ver más'.toUpperCase() : 'Cargando...'.toUpperCase()}
                  </Button>
                ) : typeEvent === 'next' ? (
                  loading && 'Buscando...'
                ) : (
                  <Button disabled block>
                    {loading ? 'Buscando...' : 'No hay más eventos'}
                  </Button>
                )}
              </div>
            </section>
          </Col>
        </Row>

        {/* <h2 className='is-size-2 bold-text'>Eventos</h2> */}

        {serverError && <ErrorServe errorData={errorData} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  categories: state.categories.items,
  loginInfo: state.user.data,
  types: state.types.items,
  error: state.categories.error,
});

export default connect(mapStateToProps)(withRouter(Home));
