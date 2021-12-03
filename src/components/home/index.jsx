import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import LoadingEvent from '../loaders/loadevent';
import EventCard from '../shared/eventCard';
import { EventsApi } from '../../helpers/request';
import API from '../../helpers/request';
import LogOut from '../shared/logOut';
import ErrorServe from '../modal/serverError';
import { Button, Row, Col } from 'antd';

Moment.locale('es');
momentLocalizer();

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
      timeout: false,
      serverError: false,
      errorData: {},
      nelements:10,
      pageSize: 10,
      limit:100,
      hasMore: undefined,
    };
    this.fetchEvent = this.fetchEvent.bind(this);
  }

  async componentDidMount() {
    await this.fetchEvent(this.state.typeEvent);
  }

  async fetchEvent(type) {
    try {
      this.setState({ events: [] });
      let { pageSize } = this.state;
      type=="prev" && pageSize>=this.state.limit?this.setState({ hasMore: false}):  type=="prev"?this.setState({ hasMore: true }): pageSize >= this.state.total? this.setState({ hasMore: false}) : this.setState({ hasMore: true });
      this.setState({ loading: true, typeEvent: type });
      const resp =
        type === 'next'
          ? await EventsApi.getNextEvents(
            `?pageSize=${pageSize}`
            )
          : await EventsApi.getOldEvents(`?pageSize=${pageSize}`);

          console.log("resp.meta.current_page",resp.meta.current_page,pageSize,resp.meta.total)
       //FILTERED
       //&filtered=[{%22field%22:%22datetime_to%22,%22value%22:%222021-10-10%22,%22comparator%22:%22%3E%22}]
      const events = resp.data.filter((item) => item?.organizer);

      this.setState({ events, loading: false, current_page: resp.meta.current_page, total: resp.meta.total });
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 401) this.setState({ timeout: true, loader: false });
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
    this.setState({ pageSize },async()=>await this.fetchEvent(type));
  };

  //ESTE MÉTODO GENERA BUG Y HACE CARGAR TODOS LOS EVENTOS
 /* UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("EJECUTADO UNSAFE===>")
    const search = nextProps.location.search;
    const params = new URLSearchParams(search);
    const type = params.get('type');
    const category = params.get('category');
    let query = '?';
    let queryFilter = [];
    if (type) {
      queryFilter.push({ id: 'event_type_id', value: type, comparator: 'like' });
    }
    if (category) {
      queryFilter.push({ id: 'category_ids', value: category, comparator: 'like' });
    }
    queryFilter = JSON.stringify(queryFilter);
    query = query + `filtered=${queryFilter}`;
    this.setState({ loading: true });
    API.get(`/api/events${query}`)
      .then(({ data }) => {
        const events = data.data.filter((item) => item.organizer);
        this.setState({ events, loading: false, type, category });
      })
      .catch((error) => {
        if (error.response) {
          const {
            status,
            data: { message },
          } = error.response;

          if (status === 401) this.setState({ timeout: true, loader: false });
          else this.setState({ serverError: true, loader: false, errorData: { status, message } });
        } else {
          let errorData = { message: error.message };

          errorData.status = 520;
          this.setState({ serverError: true, loader: false, errorData });
        }
      });
  }*/

  render() {
    const { timeout, typeEvent, serverError, errorData, events, loading, hasMore } = this.state;
    return (
      <React.Fragment>
        <h2 className='is-size-2 bold-text'>Eventos</h2>
        <section className='home'>
          <div className='tabs'>
            <ul>
              <li
                onClick={!loading ? () => this.setState({pageSize:this.state.nelements},async()=>this.fetchEvent('next')): null}
                className={typeEvent === 'next' ? 'is-active' : ''}>
                <a>Próximos</a>
              </li>
              <li
                onClick={!loading ? () => this.setState({pageSize:this.state.nelements},async()=>this.fetchEvent('prev')): null}
                className={typeEvent === 'prev' ? 'is-active' : ''}>
                <a>Pasados</a>
              </li>
            </ul>
          </div>
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
                          action={{ name: 'Ver', url: `landing/${event._id}` }}
                        />
                      </Col>
                    );
                  })
                )}
              </Row>
            )}
            {/*hasMore === true && typeEvent === 'prev'*/}
            {hasMore === true ? (
              <Button
                className='button is-primary is-medium is-fullwidth is-outlined'
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
        {timeout && <LogOut />}
        {serverError && <ErrorServe errorData={errorData} />}
      </React.Fragment>
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
