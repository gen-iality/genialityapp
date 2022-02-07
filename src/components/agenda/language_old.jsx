import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Moment from 'moment';
import EventContent from '../events/shared/content_old';
import EvenTable from '../events/shared/table';
import SearchComponent from '../shared/searchTable';
import { Actions } from '../../helpers/request';

class Agenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      days: [],
      day: '',
      filtered: [],
      toShow: [],
      redirect: false,
    };
  }

  componentDidMount() {
    const { event } = this.props.state;
    let days = [];
    const init = Moment(event.date_start);
    const end = Moment(event.date_end);
    const diff = end.diff(init, 'days');
    //Se hace un for para sacar los días desde el inicio hasta el fin, inclusivos
    for (let i = 0; i < diff + 1; i++) {
      days.push(Moment(init).add(i, 'd'));
    }
    this.setState({ days, day: days[0] }, this.fetchAgenda);
  }

  fetchAgenda = async () => {
    const { data } = await Actions.getAll(`/api/events/${this.props.state.event._id}/activities?locale=en`);

    //Después de traer la info se filtra por el primer día por defecto
    const filtered = this.filterByDay(this.state.days[0], data);
    this.setState({ list: data, filtered, toShow: filtered });
  };

  filterByDay = (day, agenda) => {
    //First filter activities by day. Use include to see if has the same day
    //Sort the filtered list by hour start, use moment format HHmm to get a number and used it to sort
    const list = agenda
      .filter((a) => a.datetime_start.includes(day.format('YYYY-MM-DD')))
      .sort(
        (a, b) =>
          Moment(a.datetime_start, 'YYYY-MM-DD HH:mm').format('HHmm') -
          Moment(b.datetime_start, 'YYYY-MM-DD HH:mm').format('HHmm')
      );
    //Se mapea el listado filtrado y se parsean variables para mostrar mejor
    list.map((item) => {
      item.restriction =
        item.access_restriction_type === 'EXCLUSIVE'
          ? 'Exclusiva para: '
          : item.access_restriction_type === 'SUGGESTED'
          ? 'Sugerida para: '
          : 'Abierta';
      item.roles = item.access_restriction_roles.map(({ name }) => name);
      return item;
    });
    return list;
  };

  //Fn para manejar cuando se selecciona un dia, ejecuta el filtrado
  selectDay = (day) => {
    const filtered = this.filterByDay(day, this.state.list);
    this.setState({ filtered, toShow: filtered, day });
  };

  //Fn para el resultado de la búsqueda
  searchResult = (data) => this.setState({ toShow: !data ? [] : data });

  redirect = () => this.setState({ redirect: true });

  render() {
    if (this.state.redirect)
      return <Redirect to={{ pathname: `${this.props.state.matchUrl}/Language`, state: { new: true } }} />;
    const { days, day, filtered, toShow } = this.state;
    return (
      <EventContent title={'Programación'} classes={'agenda-list'}>
        <nav className='level'>
          <div className='level-left'>
            {days.map((date, key) => (
              <div
                onClick={() => this.selectDay(date)}
                key={key}
                className={`level-item date ${date === day ? 'active' : ''}`}>
                <p className='subtitle is-5'>
                  <strong>{date.format('MMM DD')}</strong>
                </p>
              </div>
            ))}
          </div>
        </nav>
        <SearchComponent
          data={filtered}
          placeholder={'por Nombre, Espacio o Conferencista'}
          kind={'agenda'}
          classes={'field'}
          searchResult={this.searchResult}
        />
        <EvenTable
          head={['Hora', 'Actividad', 'Categorías', 'Espacio', 'Conferencista', '']}
          headStyle={[
            { width: '12%' },
            { width: '48%' },
            { width: '10%' },
            { width: '10%' },
            { width: '18%' },
            { width: '2%' },
          ]}>
          {toShow.map((agenda) => (
            <tr key={agenda._id}>
              <td>
                {Moment(agenda.datetime_start, 'YYYY-MM-DD HH:mm').format('HH:mm')} -{' '}
                {Moment(agenda.datetime_end, 'YYYY-MM-DD HH:mm').format('HH:mm')}
              </td>
              <td>
                <p>{agenda.name}</p>
                <small className='is-italic'>
                  {agenda.restriction} {agenda.roles.map((rol) => rol)}
                </small>
                {agenda.type && (
                  <p>
                    <strong>{agenda.type.name}</strong>
                  </p>
                )}
              </td>
              <td>
                {agenda.activity_categories.map((cat) => (
                  <span style={{ background: cat.color, color: cat.color ? 'white' : '' }} className='tag'>
                    {cat.name}
                  </span>
                ))}
              </td>
              <td>{agenda.space ? agenda.space.name : ''}</td>
              <td>
                {agenda.hosts.map(({ name }) => (
                  <p>{name}</p>
                ))}
              </td>
              <td>
                <Link to={{ pathname: `${this.props.state.matchUrl}/Language`, state: { edit: agenda._id } }}>
                  <button>
                    <span className='icon'>
                      <i className='fas fa-2x fa-chevron-right' />
                    </span>
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </EvenTable>
      </EventContent>
    );
  }
}

export default Agenda;
