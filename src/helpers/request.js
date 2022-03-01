import axios from 'axios';
import { ApiDEVUrl, ApiUrl, ApiEviusZoomSurvey } from './constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleSelect } from './utils';
import { firestore } from './firebase';
import Moment from 'moment';
import { GetTokenUserFirebase } from './HelperAuth';
const publicInstance = axios.create({
  url: ApiUrl,
  baseURL: ApiUrl,
  pushURL: 'https://104.248.125.133:6477/pushNotification',
});

const privateInstance = axios.create({
  url: ApiUrl,
  baseURL: ApiUrl,
  withCredentials: true,
});

/* SI EL USUARIO ESTA LOGUEADO POR DEFECTO AGREGAMOS EL TOKEN A LAS PETICIONES 
PRIMERO MIRAMOS  si viene en la URL
luego miramos si viene en las cookies
*/

export const fireStoreApi = {
  createOrUpdate: (eventId, activityId, eventUser) => {
    let agendaRef = firestore.collection(`event_activity_attendees/${eventId}/activities/${activityId}/attendees`);
    return agendaRef.add({
      activity_id: activityId,
      attendee_id: eventUser._id,
      created_at: new Date(),
      properties: eventUser.properties,
      updated_at: new Date(),
      checked_in: true,
      checked_at: new Date(),
    });
  },
};
export const Actions = {
  create: async (url, data, unsafe) => {
    if (unsafe) return publicInstance.post(url, data).then(({ data }) => data);
    return privateInstance.post(url, data).then(({ data }) => data);
  },
  delete: async (url, id, unsafe) => {
    if (unsafe) return publicInstance.delete(`${url}${id}`).then(({ data }) => data);
    return privateInstance.delete(`${url}/${id}`).then(({ data }) => data);
  },
  edit: async (url, data, unsafe) => {
    if (unsafe) return publicInstance.put(`${url}`, data).then(({ data }) => data);
    return privateInstance.put(`${url}/${id}`, data).then(({ data }) => data);
  },
  post: async (url, data, unsafe) => {
    if (unsafe) return publicInstance.post(url, data).then(({ data }) => data);
    return privateInstance.post(url, data).then(({ data }) => data);
  },
  get: async (url, unsafe) => {
    if (unsafe) return publicInstance.get(url).then(({ data }) => data);
    return privateInstance.get(url).then(({ data }) => data);
  },

  put: async (url, data, unsafe) => {
    if (unsafe) return publicInstance.put(url, data).then(({ data }) => data);
    return privateInstance.put(url, data).then(({ data }) => data);
  },
  getOne: async (url, id, unsafe) => {
    if (unsafe) return publicInstance.get(`${url}${id}`).then(({ data }) => data);
    return privateInstance.get(`${url}${id}`).then(({ data }) => data);
  },
  getAll: async (url, unsafe) => {
    if (unsafe) return publicInstance.get(`${url}`).then(({ data }) => data);
    return privateInstance.get(`${url}`).then(({ data }) => data);
  },
};

export const SearchUserbyEmail = (email) => {
  const url = `${ApiUrl}/api/users/findByEmail/${email}`;
  return Actions.get(url);
};

//BACKLOG --> ajustar a la nueva estructura el setState que se comentó para evitar fallos por no contar con el estado
export const getCurrentUser = async () => {
  let token = await GetTokenUserFirebase();

  return new Promise(async (resolve) => {
    if (!token || token == 'undefined') {
      resolve(null);
    } else {
      try {
        const resp = await privateInstance.get(`/auth/currentUser?token=${token}`);
        if (resp.status === 200) {
          resolve(resp.data);
        }
      } catch (error) {
        if (error.response) {
          // eslint-disable-next-line no-unused-vars
          const { status, data } = error.response;
          if (status === 401) {
            toast.error('🔑 Tu token a caducado, redirigiendo al login!', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            // YA NO DE REDIRIGIR EL TOKEN CADUCADO
            /* alert('RELOAD ACA');
            setTimeout(() => {
              window.location.reload();
            }, 2000);*/
            //this.setState({ timeout: true, loader: false })
          } else {
            //this.setState({ serverError: true, loader: false, errorData: data })
          }
        } else {
          let errorData = {};
          console.error('Error', error.message);
          if (error.message) {
            errorData.message = error.message;
          } else if (error.request) {
            console.error(error.request);
            errorData.message = JSON.stringify(error.request);
          }
          errorData.status = 708;
          //this.setState({ serverError: true, loader: false, errorData });
        }
        console.error(error.config);
      }
    }
  });
};

export const EventsApi = {
  getEventUser: async (user_id, event_id) => {
    const snapshot = await firestore
      .collection(`${event_id}_event_attendees`)
      .where('account_id', '==', user_id)
      .get();
    const eventUser = !snapshot.empty ? snapshot.docs[0].data() : null;
    return eventUser;
  },

  getcurrentUserEventUser: async (event_id) => {
    let token = await GetTokenUserFirebase();
    let response = await Actions.getAll(`/api/me/eventusers/event/${event_id}?token=${token}`, false);
    let eventUser = response.data && response.data[0] ? response.data[0] : null;
    return eventUser;
  },

  /* Según un nuevo modelo de los eventUsers un solo usuario puede tener varios eventUsers para un evento */
  getcurrentUserEventUsers: async (event_id) => {
    let token = await GetTokenUserFirebase();
    let response = await Actions.getAll(`/api/me/eventusers/event/${event_id}?token=${token}`, false);
    let eventUsers = response.data ? response.data : null;
    return eventUsers;
  },

  getPublic: async (query) => {
    return await Actions.getAll(`/api/events${query}`, true);
  },
  getOldEvents: async (query) => {
    return await Actions.getAll(`/api/eventsbeforetoday${query}`, true);
  },
  getNextEvents: async (query) => {
    return await Actions.getAll(`/api/eventsaftertoday${query}`, true);
  },
  landingEvent: async (id) => {
    return await Actions.getOne('/api/events/', id, true);
  },
  hostAvailable: async () => {
    return await Actions.get('api/events/zoomhost');
  },
  invitations: async (id) => {
    return await Actions.getOne(`/api/events/${id}/`, 'invitations');
  },
  sendMeetingRequest: async (eventId, data) => {
    return await Actions.post(`/api/events/${eventId}/meetingrequest/notify`, data);
  },

  sendInvitation: async (eventId, data) => {
    return await Actions.post(`/api/events/${eventId}/invitation`, data);
  },
  sendRsvp: async (data, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.post(`/api/rsvp/sendeventrsvp/${id}?token=${token}`, data, true);
  },
  mine: async () => {
    let token = await GetTokenUserFirebase();
    const events = await Actions.getAll(`/api/me/contributors/events/?token=${token}`, true);
    return events;
  },
  getOne: async (id) => {
    return await Actions.getOne('/api/events/', id);
  },
  getOneByNameEvent: async (eventName) => {
    return await Actions.get(`/api/events/?filtered=[{"field":"name","value":[%22${eventName}%22]}]`);
  },
  editOne: async (data, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`/api/events/${id}?token=${token}`, data, true);
  },
  deleteOne: async (id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`/api/events/${id}/?token=${token}`, '', true);
  },
  getStyles: async (id) => {
    return await Actions.get(`/api/events/${id}/stylestemp`, true);
  },
  metrics: async (id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getOne(`/api/events/${id}/totalmetricsbyevent/?token=${token}`, '');
  },
  metricsByActivity: async (id) => {
    return await Actions.getOne(`/api/events/${id}/`, 'totalmetricsbyactivity');
  },
  metricsRegisterBydate: async (id, type, fechaInicial, fechaFinal) => {
    let token = await GetTokenUserFirebase();
    return await Actions.get(
      `/api/events/${id}/metricsbydate/eventusers/?token=${token}&metrics_type=${type}&datetime_from=${fechaInicial}&datetime_to=${fechaFinal}`
    );
  },

  //obtener products subasta silenciosa
  getProducts: async (eventId) => {
    return await Actions.get(`/api/events/${eventId}/products`);
  },
  storeOfert: async (eventId, productId, data) => {
    return await Actions.post(`/api/events/${eventId}/products/${productId}/silentauctionmail`, data);
  },
  getOneProduct: async (eventId, idproduct) => {
    return await Actions.get(`/api/events/${eventId}/products/${idproduct}`);
  },
  editProduct: async (data, eventId, idproduct) => {
    let token = await GetTokenUserFirebase();
    return await Actions.put(`/api/events/${eventId}/products/${idproduct}?token=${token}`, data);
  },
  createProducts: async (data, eventId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.post(`/api/events/${eventId}/products?token=${token}`, data);
  },
  deleteProduct: async (galleryId, eventId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`/api/events/${eventId}/products/${galleryId}?token=${token}`, '', true);
  },
  validPrice: async (eventId, productId) => {
    return await Actions.get(`/api/events/${eventId}/products/${productId}/minimumauctionvalue`);
  },
  ofertsProduct: async (eventId, productId) => {
    return await Actions.get(
      `api/events/${eventId}/orders/ordersevent?filtered=[{"field":"items","value":"${productId}"}]`
    );
  },
  acceptOrRejectRequest: async (eventId, requestId, status) => {
    return await Actions.get(`api/event/${eventId}/meeting/${requestId}/${status}`);
  },
  getStatusRegister: async (eventId, email) => {
    let token;
    /** Se agrega el try catch para evitar que si no hay una sesion se detenga el flujo */
    try {
      token = await GetTokenUserFirebase();
    } catch (error) {
      token = false;
    }
    return await Actions.get(
      `api/events/${eventId}/eventusers${
        token ? `/?token=${token}` : '/'
      }&filtered=[{"field":"properties.email","value":"${email}", "comparator":"="}]&${new Date()}`,
      true
    );
  },
  recoveryPassword: async (eventId, url, email) => {
    return await Actions.put(`/api/events/${eventId}/changeUserPassword?destination=${url}`, email);
  },
  //RESTABLECER CONTRASEÑA
  changePassword: async (eventId, email) => {
    //URL DE PRUEBAS
    return await Actions.put(`/api/changeuserpassword`, { email: email, event_id: eventId });
  },

  changePasswordUser: async (email, hostname) => {
    //URL DE PRUEBAS
    return await Actions.put(`/api/changeuserpassword`, { email: email, hostName: hostname });
  },
  //ACCEDER POR LINK AL CORREO
  requestLinkEmail: async (eventId, email) => {
    return await Actions.post(`/api/getloginlink`, { email: email, event_id: eventId });
  },
  //ACCEDER POR LINK AL CORREO SIN EVENTO
  requestLinkEmailUSer: async (email) => {
    return await Actions.post(`/api/getloginlink`, { email: email });
  },
  //REFRESH URL LINK DE ACCESSO
  refreshLinkEmailUser: async (email) => {
    return await Actions.post(`/api/getloginlink`, { email: email, refreshlink: true });
  },
  //REFRESH URL LINK DE ACCESSO A EVENTO
  refreshLinkEmailUserEvent: async (email, eventId) => {
    return await Actions.post(`/api/getloginlink`, { email: email, refreshlink: true, event_id: eventId });
  },
  requestUrlEmail: async (eventId, url, email) => {
    return await Actions.put(
      `/api/events/${eventId}/changeUserPassword?destination=${url}&firebase_password_change=true`,
      email
    );
  },
  signInWithEmailAndPassword: async (data) => {
    return await Actions.post(`/api/users/signInWithEmailAndPassword`, data);
  },
  createTemplateEvent: async (eventId, idTemplate) => {
    let token = await GetTokenUserFirebase();
    return await Actions.put(
      `/api/events/${eventId}/templateproperties/${idTemplate}/addtemplateporperties?token=${token}`,
      {}
    );
  },
};
export const InvitationsApi = {
  getAll: async (id) => {
    return await Actions.getAll(`/api/events/${id}/invitation`);
  },
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/invitation`, true).then(({ data }) => data);
  },
};

export const UsersApi = {
  getAll: async (id, query) => {
    let token = await GetTokenUserFirebase();
    query = query ? query : '';
    return await Actions.getAll(`/api/events/${id}/eventusers?token=${token}&${query}`);
  },
  getOne: async (event_id, user_id) => {
    return await Actions.getAll(`api/events/${event_id}/eventusers/${user_id}`);
  },
  mineTickets: async () => {
    return await Actions.getAll('/api/me/eventUsers/');
  },
  getProfile: async (id) => {
    return await Actions.getOne('/api/users/', id);
  },
  editProfile: async (data, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`/api/users/${id}/?token=${token}`, data, true);
  },
  findByEmail: async (email) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getOne(`api/users/findByEmail/${email}?token=${token}`, true);
  },

  mineOrdes: async (id) => {
    return await Actions.getAll(`/api/users/${id}/orders`);
  },
  createOne: async (data, id) => {
    //Este primero es que deberia estar pero no sirve
    //return await Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${id}`, data);
    /** Se envia token para validar si el rol es cambiado por un damin */
    let token;
    /** Se agrega el try catch para evitar que si no hay una sesion se detenga el flujo */
    try {
      token = await GetTokenUserFirebase();
    } catch (error) {
      token = false;
    }

    return await Actions.post(
      `/api/events/${id}/adduserwithemailvalidation${token ? `/?token=${token}` : '/'}`,
      data,
      true
    );
  },
  deleteOne: async (user, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`/api/user/events/${id}?token=${token}`, user);
  },

  deleteUsers: async (user) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`/api/users`, `${user}?token=${token}`);
  },
  createUser: async (user) => {
    return await Actions.post(`/api/users`, user);
  },
  editEventUser: async (data, eventId, eventUserId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.put(`/api/events/${eventId}/eventusers/${eventUserId}?token=${token}`, data, true);
  },
};

export const AttendeeApi = {
  getAll: async (eventId) => {
    return await Actions.getAll(`/api/events/${eventId}/eventusers`);
  },
  create: async (eventId, data) => {
    /** Se envia token para validar si el rol es cambiado por un damin */
    let token;
    /** Se agrega el try catch para evitar que si no hay una sesion se detenga el flujo */
    try {
      token = await GetTokenUserFirebase();
    } catch (error) {
      token = false;
    }
    return await Actions.post(`/api/events/${eventId}/eventusers/?token=${token}`, data, true);
  },
  update: async (eventId, data, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.put(`api/events/${eventId}/eventusers/${id}?token=${token}`, data, true);
  },
  delete: async (eventId, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`api/events/${eventId}/eventusers`, `${id}?token=${token}`);
  },
};

export const eventTicketsApi = {
  byEvent: async (eventId) => {
    return await Actions.getAll(`api/events/${eventId}/tickets`);
  },
  getOne: async (id, eventId) => {
    return await Actions.get(`api/events/${eventId}/tickets/${id}`);
  },
  getAll: async (eventId) => {
    return await Actions.getAll(`/api/events/${eventId}/tickets`);
  },
  create: async (eventId, data) => {
    return await Actions.post(`/api/events/${eventId}/tickets`, data);
  },
  update: async (eventId, data, id) => {
    return await Actions.put(`api/events/${eventId}/tickets/${id}`, data);
  },
  delete: async (eventId, id) => {
    return await Actions.delete(`api/events/${eventId}/tickets`, id);
  },
  deleteOne: async (id, eventId) => {
    return await Actions.delete(`api/events/${eventId}/tickets`, id);
  },
};

export const TicketsApi = {
  getAll: async (id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getAll(`/api/me/eventUsers/?token=${token}&limit=20`, true);
  },
  getByEvent: async (event) => {
    return await Actions.getOne(`/api/me/eventusers/event/${event}`);
  },
  transferToUser: async (event, event_user, data) => {
    return await Actions.post(`/api/eventusers/${event}/tranfereventuser/${event_user}`, data);
  },

  checkInAttendee: async (event_id, eventUser_id) => {
    let token = await GetTokenUserFirebase();
    let data = {
      event: event_id,
      checkedin_at: Moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    return await Actions.put(`/api/eventUsers/${eventUser_id}/checkin/?token=${token}`, data);
  },
};

export const EventFieldsApi = {
  getAll: async (event) => {
    return await Actions.getAll(`/api/events/${event}/userproperties`);
  },
  byEvent: async (event) => {
    return await Actions.getAll(`/api/events/${event}/userproperties`);
  },
  getOne: async (event, id) => {
    return await Actions.getOne(`/api/events/${event}/userproperties/${id}`);
  },
  createOne: async (data, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.post(`/api/events/${event}/userproperties?token=${token}`, data);
  },
  editOne: async (data, id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`/api/events/${event}/userproperties/${id}?token=${token}`, data, true);
  },
  registerListFieldOptionTaken: async (data, id, event) => {
    return await Actions.put(`/api/events/${event}/userproperties/${id}/RegisterListFieldOptionTaken`, data);
  },
  deleteOne: async (id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`/api/events/${event}/userproperties`, `${id}?token=${token}`);
  },
};

export const SurveysApi = {
  getAll: async (event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getAll(`/api/events/${event}/surveys/?token=${token}`);
  },
  byEvent: async (event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getAll(`api/events/${event}/surveys/?token=${token}`, true).then(({ data }) => data);
  },
  getByActivity: async (event, activity_id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getAll(
      `/api/events/${event}/surveys/?token=${token}&indexby=activity_id&value=${activity_id}`
    );
  },
  getOne: async (event, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getOne(`/api/events/${event}/surveys/${id}/?token=${token}`, true);
  },
  createOne: async (event, data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.create(`/api/events/${event}/surveys/?token=${token}`, data, true);
  },
  editOne: async (data, id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`/api/events/${event}/surveys/${id}/?token=${token}`, data, true);
  },
  deleteOne: async (id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`/api/events/${event}/surveys/${id}/?token=${token}`, '', true);
  },
  createQuestion: async (event, id, data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.put(`/api/events/${event}/surveys/${id}/?token=${token}&newquestion=1`, data, true);
  },
  deleteQuestion: async (event, surveyId, index) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`/api/events/${event}/surveys/${surveyId}/?token=${token}&delete=${index}`, '', true);
  },
  editQuestion: async (event, id, index, data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.put(`/api/events/${event}/questionedit/${id}/?token=${token}&questionNo=${index}`, data, true);
  },
};

export const DocumentsApi = {
  getAll: async (event) => {
    return await Actions.getAll(`api/events/${event}/documents`, true);
  },
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/documents`, true).then(({ data }) => data);
  },
  getFiles: async (id, event) => {
    return await Actions.getAll(`api/events/${event}/documents?father_id=${id}`);
  },
  getOne: async (id, event) => {
    return await Actions.getOne(`api/events/${event}/documents/`, id);
  },
  editOne: async (data, id, event) => {
    return await Actions.edit(`api/events/${event}/documents/${id}`, data, true);
  },
  deleteOne: async (id, event) => {
    return await Actions.delete(`api/events/${event}/documents`, id);
  },
  create: async (data, event) => {
    return await Actions.create(`api/events/${event}/documents`, data);
  },
};

export const CategoriesApi = {
  getAll: async () => {
    const resp = await Actions.getAll('api/categories', true);
    return handleSelect(resp.data);
  },
};
export const TypesApi = {
  getAll: async () => {
    const resp = await Actions.getAll('api/eventTypes', true);
    return handleSelect(resp.data);
  },
};
export const OrganizationApi = {
  mine: async () => {
    let token = await GetTokenUserFirebase();

    const resp = await Actions.getAll(`api/me/organizations?token=${token}`);
    let data = resp.data.map((item) => {
      return {
        _id: item._id,
        id: item.organization?._id,
        name: item.organization?.name,
        styles: item.organization?.styles,
        created_at: item.organization?.created_at,
      };
    });
    return data;
  },
  getOne: async (id) => {
    return await Actions.getOne('/api/organizations/', id);
  },
  createOrganization: async (data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.post(`/api/organizations?token=${token}`, data, true);
  },
  editOne: async (data, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`/api/organizations/${id}?token=${token}`, data, true);
  },
  events: async (id) => {
    return await Actions.getOne(`/api/organizations/${id}/`, 'events');
  },
  getUsers: async (id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.get(`/api/organizations/${id}/organizationusers?token=${token}`);
  },
  getEpecificUser: async (orgId, memberId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getOne(`/api/organizations/${orgId}/organizationusers/${memberId}?token=${token}`, '', true);
  },
  getMeUser: async (orgId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getOne(`/api/me/organizations/${orgId}/?token=${token}`, '', true);
  },
  saveUser: async (org, data) => {
    return await Actions.post(`/api/organizations/${org}/addorganizationuser`, data);
  },
  editUser: async (org, member, data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`/api/organizations/${org}/organizationusers/${member}?token=${token}`, data, true);
  },
  deleteUser: async (org, member) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`/api/organizations/${org}/organizationusers`, `/${member}?token=${token}`, true);
  },
  getEventsStatistics: async (org) => {
    return await Actions.get(`/api/organizations/${org}/eventsstadistics`);
  },
  editAllUserProperties: async (org, data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.put(`api/organizations/${org}?token=${token}`, data);
  },
  editOneUserProperties: async (org, fieldId, data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`api/organizations/${org}/userproperties/${fieldId}?token=${token}`, data, true);
  },
  createOneUserProperties: async (org, data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.post(`/api/organizations/${org}/userproperties?token=${token}`, data, true);
  },
  getUserProperties: async (org) => {
    return await Actions.get(`/api/organizations/${org}/userproperties`);
  },
  deleteUserProperties: async (org, fieldId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`/api/organizations/${org}/userproperties/${fieldId}?token=${token}`, '', true);
  },
  getTemplateOrganization: async (org) => {
    let token = await GetTokenUserFirebase();
    return await Actions.get(`/api/organizations/${org}/templateproperties?token=${token}`);
  },
  updateTemplateOrganization: async (orgId, idTemplate, data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.put(`/api/organizations/${orgId}/templateproperties/${idTemplate}?token=${token}`, data);
  },
  editMenu: async (data, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.put(`/api/organizations/${id}?update_events_itemsMenu=false&token=${token}`, data);
  },
};
export const BadgeApi = {
  create: async (data) => {
    return await Actions.post(`/api/escarapelas`, data);
  },
  edit: async (data, id) => {
    return await Actions.edit('/api/escarapelas/', data, id);
  },
  get: async (id) => {
    return await Actions.getOne('/api/escarapelas/', id);
  },
};
export const HelperApi = {
  listHelper: async (id) => {
    return await Actions.getOne(`api/contributors/events/`, id);
  },
  rolesOne: async (event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.get(`api/contributors/events/${event}/me?token=${token}`);
  },
  saveHelper: async (event, data) => {
    return await Actions.post(`api/events/${event}/contributors`, data);
  },
  editHelper: async (event, id, data) => {
    return await Actions.put(`api/events/${event}/contributors/${id}`, data);
  },
  removeHelper: async (id, event) => {
    return await Actions.delete(`api/events/${event}/contributors`, id);
  },
};

export const discountCodesApi = {
  exchangeCode: async (template_id, data) => {
    let url = `api/code/exchangeCode`;
    return await publicInstance.put(url, data).then(({ data }) => data);
  },
};

export const CertsApi = {
  byEvent: async (event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getAll(`api/events/${event}/certificates?token=${token}`).then(({ data }) => data);
  },
  getOne: async (id) => {
    return await Actions.getOne(`api/certificate/`, id);
  },
  generate: async (content, image) => {
    return await Actions.get(`api/pdfcertificate?content=` + content + '&image=' + image + '&download=1');
  },
  editOne: async (data, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.put(`/api/certificates/${id}?token=${token}`, data);
  },
  deleteOne: async (id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`/api/certificates/${id}?token=${token}`);
  },
  create: async (data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.create(`/api/certificates?token=${token}`, data);
  },
  generateCert: async (body) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise(async (resolve, reject) => {
      let token = await GetTokenUserFirebase();
      publicInstance
        .post(`/api/generatecertificate?token=${token}&download=1`, body, {
          responseType: 'blob',
        })
        .then((response) => {
          resolve({
            type: response.headers['content-type'],
            blob: response.data,
          });
        });
    });
  },
};

export const NewsFeed = {
  byEvent: async (eventId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getAll(`api/events/${eventId}/newsfeed?token=${token}`).then(({ data }) => data);
  },
  getOne: async (eventId, idnew) => {
    let token = await GetTokenUserFirebase();
    return await Actions.get(`api/events/${eventId}/newsfeed/${idnew}?token=${token}`);
  },
  editOne: async (data, id, eventId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`api/events/${eventId}/newsfeed/${id}?token=${token}`, data, true);
  },
  deleteOne: async (id, eventId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`api/events/${eventId}/newsfeed`, `${id}?token=${token}`);
  },
  create: async (data, eventId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.create(`api/events/${eventId}/newsfeed?token=${token}`, data);
  },
};

export const PushFeed = {
  byEvent: async (id) => {
    return await Actions.getAll(`api/events/${id}/sendpush`).then(({ data }) => data);
  },
  getOne: async (id) => {
    return await Actions.get(`api/events/${id}/sendpush/`, id);
  },
  editOne: async (data, id) => {
    return await Actions.edit(`api/events/${id}/sendpush`, data, id);
  },
  deleteOne: async (id) => {
    return await Actions.delete(`api/events/${id}/sendpush`, id);
  },
  create: async (data, id) => {
    return await Actions.create(`api/events/${id}/sendpush`, data);
  },
};

export const FaqsApi = {
  byEvent: async (id) => {
    return await Actions.getAll(`api/events/${id}/faqs`).then(({ data }) => data);
  },
  getOne: async (id, eventId) => {
    return await Actions.get(`api/events/${eventId}/faqs/`, id);
  },
  editOne: async (data, id, eventId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`api/events/${eventId}/faqs/${id}/?token=${token}`, data, true);
  },
  deleteOne: async (id, eventId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`api/events/${eventId}/faqs/${id}/?token=${token}`, '', true);
  },
  create: async (data, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.create(`api/events/${id}/faqs/?token=${token}`, data, true);
  },
};

export const RolAttApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/rolesattendees`);
  },
  byEventRolsGeneral: async () => {
    let token = await GetTokenUserFirebase();
    return await Actions.getAll(`api/rols?token=${token}`);
  },
  getOne: async (event, id) => {
    return await Actions.get(`api/events/${event}/rolesattendees/`, id);
  },
  editOne: async (data, id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`/api/events/${event}/rolesattendees/${id}`, data, `?token=${token}`);
  },
  deleteOne: async (id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`/api/events/${event}/rolesattendees`, `${id}?token=${token}`);
  },
  create: async (data, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.create(`api/events/${event}/rolesattendees?token=${token}`, data);
  },
  getRoleHasPermissionsinThisEvent: async (rolId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.get(`api/rolespermissionsevents/findbyrol/${rolId}/?token=${token}`, true);
  },
  ifTheRoleExists: async (rolId) => {
    let token = await GetTokenUserFirebase();
    try {
      return await Actions.get(`api/rols/${rolId}/rolseventspublic/?token=${token}`, true);
    } catch (error) {
      if (error?.response?.status === 404) return { type: 'the role does not exist' };
    }
  },
};

export const MessageApi = {
  byEvent: async (eventId) => {
    let token = await GetTokenUserFirebase();
    return await Actions.getAll(`api/events/${eventId}/messages/?token=${token}`, true);
  },
  getOne: async (id, eventId) => {
    /* return await Actions.get(`api/events/${eventId}/messages/`, id); */
    let token = await GetTokenUserFirebase();
    return await Actions.get(`/api/events/${eventId}/message/${id}/messageUser/?token=${token}`, true);
  },
  /* editOne: async (data, id, eventId) => {
    return await Actions.edit(`/api/events/${eventId}/messages`, data, id);
  },
  deleteOne: async (id, eventId) => {
    return await Actions.delete(`/api/events/${eventId}/messages`, id);
  },
  create: async (data, eventId) => {
    return await Actions.create(`api/events/${eventId}/messages`, data);
  }, */
};

export const SpacesApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/spaces`).then(({ data }) => data);
  },
  getOne: async (id, event) => {
    return await Actions.get(`api/events/${event}/spaces/`, id);
  },
  editOne: async (data, id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`api/events/${event}/spaces/${id}?token=${token}`, data, true);
  },
  deleteOne: async (id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`api/events/${event}/spaces/${id}?token=${token}`, true);
  },
  create: async (data, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.create(`api/events/${event}/spaces?token=${token}`, data, true);
  },
};
export const CategoriesAgendaApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/categoryactivities`).then(({ data }) => data);
  },
  getOne: async (id, event) => {
    return await Actions.getOne(`api/events/${event}/categoryactivities/`, id);
  },
  editOne: async (data, id, event) => {
    return await Actions.edit(`api/events/${event}/categoryactivities`, data, id);
  },
  deleteOne: async (id, event) => {
    return await Actions.delete(`api/events/${event}/categoryactivities`, id);
  },
  create: async (event, data) => {
    return await Actions.create(`api/events/${event}/categoryactivities`, data);
  },
};
export const TypesAgendaApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/type`).then(({ data }) => data);
  },
  getOne: async (id, event) => {
    return await Actions.getOne(`api/events/${event}/type/`, id);
  },
  editOne: async (data, id, event) => {
    return await Actions.edit(`api/events/${event}/type`, data, id);
  },
  deleteOne: async (id, event) => {
    return await Actions.delete(`api/events/${event}/type`, id);
  },
  create: async (event, data) => {
    return await Actions.create(`api/events/${event}/type`, data);
  },
};
export const AgendaApi = {
  byEvent: async (event, query) => {
    return await Actions.getAll(`api/events/${event}/activities${query ? query : ''}`, true);
  },
  usersByActivities: async (event) => {
    return await Actions.getAll(`api/events/${event}/activities_attendees`);
  },
  getOne: async (id, event) => {
    return await Actions.getOne(`api/events/${event}/activities/`, id);
  },
  editOne: async (data, id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`api/events/${event}/activities/${id}?token=${token}`, data, true);
  },
  deleteOne: async (id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`api/events/${event}/activities`, `${id}?token=${token}`);
  },
  create: async (event, data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.create(`api/events/${event}/activities?token=${token}`, data);
  },
  duplicate: async (event, data, id) => {
    return await Actions.create(`api/events/${event}/duplicateactivitie/${id}`, data);
  },
  zoomConference: async (event, id, data) => {
    return await Actions.create(`api/events/${event}/createmeeting/${id}`, data);
  },
};
export const SpeakersApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/host`).then(({ data }) => data);
  },
  getOne: async (id, event) => {
    return await Actions.getOne(`api/events/${event}/host/`, id);
  },
  editOne: async (data, id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.edit(`api/events/${event}/host/${id}?token=${token}`, data, true);
  },
  deleteOne: async (id, event) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`api/events/${event}/host`, `${id}?token=${token}`);
  },
  create: async (event, data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.create(`api/events/${event}/host?token=${token}`, data, true);
  },
};

export const OrganizationPlantillaApi = {
  createTemplate: async (organization, data) => {
    let token = await GetTokenUserFirebase();
    return await Actions.post(`api/organizations/${organization}/templateproperties?token=${token}`, data);
  },

  byEvent: async (organization) => {
    let token = await GetTokenUserFirebase();
    return await Actions.get(`api/organizations/${organization}/templateproperties?token=${token}`);
  },
  putOne: async (event, templatepropertie) => {
    let token = await GetTokenUserFirebase();
    return await Actions.put(
      `api/events/${event}/templateproperties/${templatepropertie}/addtemplateporperties?token=${token}`
    );
  },
  deleteOne: async (template, organization) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`api/organizations/${organization}/templateproperties`, `${template}?token=${token}`);
  },
};

export const ExternalSurvey = async (meeting_id) => {
  return await Actions.get(`${ApiEviusZoomSurvey}/?meeting_id=${meeting_id}`);
};

export const Activity = {
  Register: async (event, user_id, activity_id) => {
    let token = await GetTokenUserFirebase();
    var info = {
      event_id: event,
      user_id,
      activity_id,
    };
    return await Actions.create(`api/events/${event}/activities_attendees/?token=${token}`, info);
  },
  GetUserActivity: async (event, user_id) => {
    return await Actions.get(`api/events/${event}/activities_attendees?user_id=${user_id}`);
  },

  getActivyAssitants: async (event, activity_id) => {
    return await Actions.get(`api/events/${event}/activities_attendees?activity_id=` + activity_id);
  },
  getActivyAssitantsAdmin: async (event, activity_id) => {
    return await Actions.get(`api/events/${event}/activities_attendeesAdmin?activity_id=` + activity_id);
  },

  checkInAttendeeActivity: async (event_id, activity_id, user_id) => {
    let token = await GetTokenUserFirebase();
    //let data = { checkedin_at: new Date().toISOString() };
    let data = {
      user_id,
      activity_id,
      checkedin_at: Moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    let result = await Actions.put(`api/events/${event_id}/activities_attendees/checkin?token=${token}`, data);
    return result;
  },

  DeleteRegister: async (event, id) => {
    let token = await GetTokenUserFirebase();
    return await Actions.delete(`api/events/${event}/activities_attendees`, `${id}?token=${token}`);
  },

  Update: async (event, user_id, data) => {
    let token = await GetTokenUserFirebase();
    var info = {
      event_id: event,
      user_id,
      // activity_id,
    };
    return await Actions.put(`api/events/${event}/activities_attendees/${user_id}?token=${token}`, data);
  },
};

export const Networking = {
  getInvitationsReceived: async (eventId, userId) => {
    return await Actions.get(`api/events/${eventId}/indexinvitationsrecieved/${userId}`);
  },
  getInvitationsSent: async (eventId, userId) => {
    return await Actions.get(`api/events/${eventId}/indexinvitations/${userId}`);
  },
  acceptOrDeclineInvitation: async (eventId, userId, data) => {
    return await Actions.put(`/api/events/${eventId}/acceptordecline/${userId}`, data);
  },
  getContactList: async (eventId, userId) => {
    return await Actions.getOne(`/api/events/${eventId}/contactlist/`, userId);
  },
};

export const ActivityBySpeaker = {
  byEvent: async (event, idSpeaker) => {
    return await Actions.getOne(`api/events/${event}/activitiesbyhost/`, idSpeaker);
  },
};

export const OrganizationFuction = {
  // OBTENER EVENTOS PROXIMOS POR ORGANIZACION
  getEventsNextByOrg: async (orgId) => {
    const events = await Actions.getAll(`api/organizations/${orgId}/events`);
    return events.data;
  },

  // OBTENER DATOS DE LA ORGANIZACION
  obtenerDatosOrganizacion: async (orgId) => {
    const organization = await OrganizationApi.getOne(orgId);
    return organization;
  },
};
//ENDPOINT PARA CREAR ORDENES
export const OrderFunctions = {
  createOrder: async (data) => {
    return await Actions.post(`/api/orders`, data);
  },
};
export default privateInstance;
