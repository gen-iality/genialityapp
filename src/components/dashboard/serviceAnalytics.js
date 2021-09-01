import { EventsApi } from '../../helpers/request';
import moment from 'moment';
import API from '../../helpers/request';
//METRICAS QUE SE PUEDEN OBTENER
/*let startDate = '7daysAgo'
    let endDate = 'today'
    let metrics = [
      'ga:users', //The total number of users for the requested time period.
      'ga:newUsers', //The number of sessions marked as a user's first sessions.
      'ga:pageviews', //The total number of pageviews for the property.
      'ga:entrances', //The number of entrances to the property measured as the first pageview in a session, typically used with landingPagePath
      'ga:entranceRate', //The percentage of pageviews in which this page was the entrance.
      'ga:avgTimeOnPage', //The average time users spent viewing this page or a set of pages.
      'ga:pageviewsPerSession', //The average number of pages viewed during a session, including repeated views of a single page.
      'ga:sessions', //The total number of sessions.
      'ga:sessionDuration', //Total duration (in seconds) of users' sessions.
      'ga:avgSessionDuration', //The average duration (in seconds) of users' sessions.    
    ]*/
//CONSTANTES COLORES DE GRAFICAS
const backgroud = 'rgba(80, 211, 201, 0.7)';
const lineBackground = 'rgba(80, 211, 201, 1)';

export const totalsMetricasMail = async (eventId) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.evius.co/api/events/${eventId}/messages`)
      .then((response) => response.json())
      .then(({ data }) => {       
        resolve(data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const totalsMetricasMailDetails = async (eventId, idBell) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.evius.co/api/events/${eventId}/message/${idBell}/messageUser`)
      .then((response) => response.json())
      .then(({ data }) => {        
        resolve(data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const totalsMetricasEventsDetails = async (eventId) => {
  const metrics = await EventsApi.metrics(eventId);
  return metrics;
};

export const totalsMetricasActivityDetails = async (eventId) => {
  const metrics = await EventsApi.metricsByActivity(eventId);
  return metrics;
};

export const metricasRegisterByDate = async (eventId) => {
  let listmetric=[]
  let fechaActual=moment().format("YYYY-MM-DD")  
  let metrics = await EventsApi.metricsRegisterBydate(eventId, 'created_at','2016-01-01',fechaActual); 
  metrics.map((metric)=>{
    metric={...metric,date:moment(metric.date).format("YYYY/MM/DD")}
    listmetric.push(metric)
  })
 
  return listmetric;
};

export const metricasCheckedByDate = async (eventId) => {
  const metrics = await EventsApi.metricsRegisterBydate(eventId, 'checkedin_at');
  return metrics;
};

//Esta funcion realiza la consulta de los datos a la API de analytics
export const queryReportGnal = async (eventID) => {
    const devEvius='https://api.evius.co/api/googleanalytics';
    let fechaActual=moment().format("YYYY-MM-DD")
    const data={
      startDate: "2021-06-01",
      endDate: fechaActual,     
      filtersExpression: `ga:pagePath=@/landing/${eventID};ga:pagePath!@token;ga:pagePath!@fbclid`,
      metrics: "ga:pageviews, ga:users, ga:sessions, ga:sessionDuration, ga:avgTimeOnPage",
      dimensions: "ga:pagePath",
      fieldName: "ga:pagePath",
      sortOrder: "ASCENDING"
    }  
    //paveview=impresiones
    //Usuarios totales del evento ga:sessions
    let resp=await fetch(devEvius, {
      headers: {
        'content-type': 'application/json',
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
      method: 'POST'
    })
    let respjson= await resp.json()
    const dataEvents = respjson.rows;
    const totalMetrics = respjson.totalsForAllResults;      
    let metrics = [];
    if(dataEvents!=null){
    dataEvents.map((data, i) => {
      let objeto = {
        view: dataEvents[i][0],
        metrics: Array.from(dataEvents[i].slice(1,dataEvents[i].length)),
      };       
      metrics.push(objeto);
    });
    let totalAvg=parseFloat(totalMetrics["ga:sessionDuration"]/totalMetrics["ga:users"]);   
    console.log("REPORTE GNAL==>",queryReportGnal)
   return {metrics,totalAvg,totalMetrics}; 
  }      
};

//Esta funcion trae datos por fecha
export const queryReportGnalByMoth = async (eventID) => {
  const devEvius = 'https://api.evius.co/api/googleanalytics';
  let fechaActual = moment().format('YYYY-MM-DD');
  const data = {
    startDate: '2019-01-01',
    endDate: fechaActual,
    filtersExpression: `ga:pagePath=@/landing/${eventID};ga:pagePath!@token`,
    metrics: "ga:pageviews, ga:sessions,ga:avgTimeOnPage, ga:pageviewsPerSession,ga:users,ga:sessionDuration",
    dimensions: "ga:date",
    fieldName: "ga:date",
    sortOrder: "ASCENDING"
  }   
  let resp=await fetch(devEvius, {
      headers: {
        'content-type': 'application/json',
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
      method: 'POST'
    })
    let respjson= await resp.json()
    let datos = respjson.rows;  
        let totalMetrics = [];
        datos.map((dat) => {
          let metric = {
            month: moment(dat[0]).format("YYYY/MM/DD"),
            view: dat[2],
            time: dat[1]? parseInt(dat[1]):0,
          };
          totalMetrics.push(metric);
        });
        console.log("TOTAL METRICS==>",totalMetrics)
    return totalMetrics;
  }

   //FUNCION QUE PERMITE CREAR OBJETO PARA ASIGNAR A LA GRAFICA
   export const setDataGraphic=(labels, values, name) =>{
    let data = {
      labels: labels,
      datasets: [
        {
          label: name,
          data: values,
          fill: false,
          backgroundColor: backgroud,
          borderColor: lineBackground,
          tension:0.3
        },
      ],
    };
    return data;
  }
    //Función que permite obtener metricas por vistas de actividad
   export const obtenerMetricasByView = (view,metricsGnal) => {
      let metrics = metricsGnal?.filter((m) => m.view == view)[0];
      return metrics;
    };
   

      //Función que permite exportar los reportes formato excel
  export const exportDataReport = (datos,type) => {    

    let data = [];
    if (datos.length > 0) {
      if (type == 'register') {
        data = datos.map((item) => {
          return { fecha: item.date, cantidadregistros: item.quantity };
        });
      }
      if (type == 'views') {
        data = datos.map((item) => {
          return { fecha: moment(item.month).format('YYYY-MM-DD'), 'Número de usuarios': item.view };
        });
      }

      if (type == 'time') {
        data = datos.map((item) => {
          return {
            fecha: moment(item.month).format('YYYY-MM-DD'),
            'Número de visitas': parseFloat(item.time).toFixed(0),
          };
        });
      }
      return data;
    }
  }



   //Función que permite obtener las métricas por cada actividad
  export const updateMetricasActivity = (data,eventId,metricsGActivity) => {
    if (data.length > 0) {     
      let metricsActivity = [];
      data.map((activity) => {        
        let metricsView = obtenerMetricasByView('/landing/' + eventId + '/activity/' + activity._id,metricsGActivity);        
        let metricaActivity = {
          name: activity.name,
          view: metricsView ? metricsView.metrics[1] : 0,
          prints: metricsView ? metricsView.metrics[0] : 0,
          time: metricsView ? (metricsView.metrics[4] / 60).toFixed(2) + ' min' : '0 min',
        };
        metricsActivity.push(metricaActivity)
      });
      return metricsActivity;
    }    
  } 
