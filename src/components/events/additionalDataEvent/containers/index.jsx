import React,{Component} from 'react';
import ListSpeakers from '../components/speakers/listSpeakers';
import ListProgramme  from '../components/programme/listProgramme';
import Moment from "moment";

// Muestra la información adicional de el evento como speakers, agenta, boleteria etc...
class AdditonalDataEvent extends Component{
    constructor(props){
        super(props)

        this.state = {
            sessions : [],
            filteredSessions: [],
            headersTable: []
        }
        this.eventId =this.props.eventInfo._id;  
    }

    async componentDidMount(){
        const {sessions} = this.props.eventInfo;
        this.setState({sessions :  this.OrderByDate(sessions,'date') })
        if(this.state.sessions.length > 0){
            this.getHeadersTabs(this.state.sessions)
            this.filterByDays(this.state.sessions)
        }

    }
   
    //Ordenamos el array en base a la fecha, enviamos el array a ordenar y el campo donde esta la fecha en formato 'yyyy-mm-dd' de tipo string
    OrderByDate(array,field){
       let newArray = array.sort((a,b)=> { return Date.parse(a[field])- Date.parse(b[field])})
       return newArray;
    }

   

    //filtra por el dia seleccionado segun el tab
    filterByDays(array,key){
        if(!key) key = array[0]['date'];
        let sessions = array.filter((element)=> element.date === key);
        this.setState({filteredSessions: this.OrderByTime(sessions, 'timeStart') })
    }

    //Prepara los headers de los tabs agrupandolos y agregandole la etiqueta de label para que la fecha sea mas legible
    getHeadersTabs(array){
       let indexes = array.map((item)=>  array.findIndex((elemento)=> elemento.date === item.date))
       let indexesGroup = indexes.filter((item, index, array) => array.indexOf(item) === index)
       let group = indexesGroup.map((index)=>  this.addLabelHeadertab(array[index]))
       this.setState({headersTable : group})
    }

    //Agrega el label al tab para que la fecha sea mas legible
    addLabelHeadertab(session){
        session['label'] = Moment(session.date).format('LL'); 
        return session
    }

     //Ordenamos el array en base a la hora, enviamos el array a ordenar y el campo donde esta la hora en formato 'hh:mm' de tipo string
     OrderByTime(array,field){   
        let resp =  array.sort((a,b)=> this.converHourToNumber(a[field])- this.converHourToNumber((b[field])));
        return resp;
     }

    //Convierte el formato de hora 'hh:mm' a un entero para ordenarlo mas facil, es como si fuera un 'pipe'
    converHourToNumber(hour){
        var horaSeccionada = hour.split(':')
        var numero = horaSeccionada.reduce((before, after)=> before + after)
        return parseInt(numero)
    }

    render() {
        return (
            <React.Fragment>
                <ListSpeakers speakers = {this.props.eventInfo.speaker} /> 
                <ListProgramme eventId={this.eventId} sessions = {this.state.sessions} filterByDays= {this.filterByDays.bind(this)} filteredSessions= {this.state.filteredSessions} headersTable={this.state.headersTable} /> 
             </React.Fragment>
        );
    }
}

export default AdditonalDataEvent;