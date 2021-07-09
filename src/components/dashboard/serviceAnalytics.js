import { EventsApi } from "../../helpers/request";

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