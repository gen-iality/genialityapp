import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Moment from 'moment';
import { AgendaApi } from '../../helpers/request';
import EventContent from '../events/shared/content';
import SearchComponent from '../shared/searchTable';
import { Select, Table } from 'antd';
import { RightOutlined } from '@ant-design/icons';
const { Option } = Select;


class ReportList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      days: [],
      day: '',
      filtered: [],
      toShow: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { event } = this.props;

    let days = [];
    const init = Moment(event.date_start);
    const end = Moment(event.date_end);
    const diff = end.diff(init, 'days');

    //Si el array dates del evento existe, envia al estado el array
    //days con las fechas del array dates con su respectivo formato
    if (event.dates && event.dates.length > 0) {
      let date = event.dates;

      Date.parse(date);

      for (var i = 0; i < date.length; i++) {
        days.push(Moment(date[i]).format('MMMM-DD'));
      }

      this.setState({ days: date }, this.fetchAgenda);
    } else {
      for (let i = 0; i < diff + 1; i++) {
        days.push(Moment(init).add(i, 'd'));
      }
      this.setState({ days }, this.fetchAgenda);
    }
  }

  fetchAgenda = async () => {
    const { data } = await AgendaApi.byEvent(this.props.event._id);

    //Como se neceista registrados, cupos y total. Se hace el caclulo para traer el campo faltante
    // data.map(item=>{
    //     item.remaining_capacity = item.remaining_capacity ? item.remaining_capacity : item.capacity;
    //     return item;
    // });
    const filtered = this.filterByDay(this.state.day, data);
    this.setState({
      list: data,
      filtered,
      toShow: filtered,
    });
  };

  filterByDay(day, agenda) {
    let list;
    if(day && day!=''){
     list = agenda.filter(
      (agenda) =>
        Moment(agenda.datetime_start, ['YYYY-MM-DD']).format('YYYY-MM-DD') ===
        Moment(day, ['YYYY-MM-DD']).format('YYYY-MM-DD')
    );
    }else{
     list=agenda;
    }
    return list;
  }

handleChange(date){
  console.log( Moment(date, ['YYYY-MM-DD']).format('YYYY-MM-DD'))
  this.selectDay(date)
  }

  selectDay = (day) => {
    const filtered = this.filterByDay(day, this.state.list);
    this.setState({ filtered, toShow: filtered, day });
  };

  searchResult = (data) => this.setState({ toShow: !data ? [] : data });

  render() {
    const { days, day, filtered, toShow } = this.state;
    const columns = [
      {
        title: 'Fecha inicio',
        render: (text) => (
          <a>
            {Moment(text.datetime_start, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')}            
          </a>
        ),
      },
      {
        title: 'Fecha fin',
        render: (text) => (
          <a>           
            {Moment(text.datetime_end, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')}
          </a>
        ),
      },
      {
        title: 'Actividad',
        dataIndex: 'name',
      },
      {
        title: 'Action',
        render: (text) => (
          <Link
            to={{
              pathname: `${this.props.url}/checkin/${text._id}`,
              state: { name: text.name, id: text._id, event: this.props.event },
            }}>
            <RightOutlined />
          </Link>
        ),
      },
    ];
    return (
      <EventContent title={'CheckIn por Actividad'} classes={'agenda-list'}>
      
      <Select value={day} style={{ width: 120 }} onChange={this.handleChange}>
        <Option value={''}>Todos</Option>
            {days.map((date, key) => (
              <Option
               value= {Moment(date, ['YYYY-MM-DD']).format('YYYY-MM-DD')}
                key={'OptionDate'+key}
                >            
                  {Moment(date, ['YYYY-MM-DD']).format('MMMM-DD')}               
              </Option>
            ))}
          </Select>       
        
        <SearchComponent
          data={filtered}
          placeholder={'por Nombre, Espacio o Conferencista'}
          kind={'agenda'}
          classes={'field'}
          searchResult={this.searchResult}
        />
        <div className='checkin-warning'>
          <p className='is-size-7 has-text-right has-text-centered-mobile'>
            Para actualizar valores, refrescar la página
          </p>
        </div>
        <Table columns={columns} dataSource={toShow} />
      </EventContent>
    );
  }
}

export default withRouter(ReportList);
