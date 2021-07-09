import { EventsApi } from "../../helpers/request";
import moment from "moment";
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

export const totalsMetricasMail = async (eventId) => {
  return new Promise((resolve, reject) => {
    fetch(`http://18.211.124.171/api/events/${eventId}/messages`)
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
      fetch(`http://18.211.124.171/api/events/${eventId}/message/${idBell}/messageUser`)
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
    const metrics = await EventsApi.metrics(eventId)  
    return  metrics;
  };
  
  export const totalsMetricasActivityDetails = async (eventId) => {
    const metrics = await EventsApi.metricsByActivity(eventId)  
    return  metrics;
  };
  
  export const metricasRegisterByDate = async (eventId) => { 
    const metrics = await EventsApi.metricsRegisterBydate(eventId,"created_at");  
    console.log(metrics)  
    return  metrics;
  };
  
  export const metricasCheckedByDate = async (eventId) => { 
    const metrics = await EventsApi.metricsRegisterBydate(eventId,"checkedin_at");  
    console.log(metrics)  
    return  metrics;
  };

//Esta funcion realiza la consulta de los datos a la API de analytics
export const queryReportGnal = async (eventID) => {
    const devEvius='http://apiprueba.evius.co/api/googleanalytics';
    let fechaActual=moment().format("YYYY-MM-DD")
    const data={
      startDate: "2019-01-01",
      endDate: fechaActual,     
      filtersExpression: `ga:pagePath=@/landing/${eventID};ga:pagePath!@token`,
      metrics: "ga:pageviews, ga:users, ga:sessions, ga:sessionDuration, ga:avgTimeOnPage",
      dimensions: "ga:pagePath",
      fieldName: "ga:pagePath",
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
   return respjson;       
};

//Esta funcion trae datos por fecha
export const queryReportGnalByMoth = async (eventID) => {
  const devEvius='http://apiprueba.evius.co/api/googleanalytics';  
  let fechaActual=moment().format("YYYY-MM-DD")  
  const data={
    startDate: "2019-01-01",
    endDate: fechaActual,     
    filtersExpression: `ga:pagePath=@/landing/${eventID};ga:pagePath!@token`,
    metrics: "ga:pageviews, ga:avgTimeOnPage, ga:pageviewsPerSession",
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
    return respjson;
  };