import axios from "axios";
import { ApiUrl } from "./constants";
import * as Cookie from "js-cookie";
import { handleSelect } from "./utils";
import { firestore } from "./firebase";
import { parseUrl } from "../helpers/constants";

const publicInstance = axios.create({
  url: ApiUrl,
  baseURL: ApiUrl,
  pushURL: "https://104.248.125.133:6477/pushNotification",
});
const privateInstance = axios.create({
  url: ApiUrl,
  baseURL: ApiUrl,
  withCredentials: true,
});

const privateInstancePush = axios.create({
  // pushURL: 'https://104.248.125.133:6477/pushNotification',
  withCredentials: false,
});

/* SI EL USUARIO ESTA LOGUEADO POR DEFECTO AGREGAMOS EL TOKEN A LAS PETICIONES 
PRIMERO MIRAMOS  si viene en la URL
luego miramos si viene en las cookies
*/

let evius_token = null;
let dataUrl = parseUrl(document.URL);
if (dataUrl && dataUrl.token) {
  Cookie.set("evius_token", dataUrl.token);
  evius_token = dataUrl.token;
}

if (!evius_token) {
  evius_token = Cookie.get("evius_token");
}

if (evius_token) {
  privateInstance.defaults.params = {};
  privateInstance.defaults.params["evius_token"] = evius_token;
}

/** ACTUALIZAMOS EL BEARER TOKEN SI SE VENCIO Y NOS VIENE UN NUEVO TOKEN EN EL HEADER */
privateInstance.interceptors.response.use((response) => {
  const { headers } = response;
  if (headers.new_token) {
    console.log("Se acab� la moneda");
    Cookie.set("evius_token", headers.new_token);
    privateInstance.defaults.params = {};
    privateInstance.defaults.params["evius_token"] = headers.new_token;
  }
  return response;
});

export const Actions = {
  create: (url, data, unsafe) => {
    if (unsafe) return publicInstance.post(url, data).then(({ data }) => data);
    return privateInstance.post(url, data).then(({ data }) => data);
  },
  delete: (url, id, unsafe) => {
    if (unsafe) return publicInstance.delete(`${url}${id}`).then(({ data }) => data);
    return privateInstance.delete(`${url}/${id}`).then(({ data }) => data);
  },
  edit: (url, data, id, unsafe) => {
    if (unsafe) return publicInstance.put(`${url}${id}`, data).then(({ data }) => data);
    return privateInstance.put(`${url}/${id}`, data).then(({ data }) => data);
  },
  post: (url, data, unsafe) => {
    if (unsafe) return publicInstance.post(url, data).then(({ data }) => data);
    return privateInstance.post(url, data).then(({ data }) => data);
  },
  get: (url, unsafe) => {
    if (unsafe) return publicInstance.get(url).then(({ data }) => data);
    return privateInstance.get(url).then(({ data }) => data);
  },

  put: (url, data, unsafe) => {
    if (unsafe) return publicInstance.put(url, data).then(({ data }) => data);
    return privateInstance.put(url, data).then(({ data }) => data);
  },
  getOne: (url, id, unsafe) => {
    if (unsafe) return publicInstance.get(`${url}${id}`).then(({ data }) => data);
    return privateInstance.get(`${url}${id}`).then(({ data }) => data);
  },
  getAll: (url, unsafe) => {
    if (unsafe) return publicInstance.get(`${url}`).then(({ data }) => data);
    return privateInstance.get(`${url}`).then(({ data }) => data);
  },
};
export const EventsApi = {
  getEventUser: async (user_id, event_id) => {
    const snapshot = await firestore
      .collection(`${event_id}_event_attendees`)
      .where("account_id", "==", user_id)
      .get();
    const eventUser = !snapshot.empty ? snapshot.docs[0].data() : null;
    return eventUser;
  },
  getcurrentUserEventUser: async (event_id) => {
    let response = await Actions.getAll(`/api/me/eventusers/event/${event_id}`, false);
    console.log("checkin eventUser", response);

    let eventUser = response.data && response.data[0] ? response.data[0] : null;
    return eventUser;
  },
  getPublic: async (query) => {
    return await Actions.getAll(`/api/events${query}`, true);
  },
  getOldEvents: async (query) => {
    return await Actions.getAll(`/api/eventsbeforetoday${query}`, true);
  },
  landingEvent: async (id) => {
    return await Actions.getOne("/api/events/", id, true);
  },
  hostAvailable: async () => {
    return await Actions.get("api/events/zoomhost");
  },
  invitations: async (id) => {
    return await Actions.getOne(`/api/events/${id}/`, "invitations");
  },
  sendInvitation: async (eventId, data) => {
    return await Actions.post(`/api/events/${eventId}/invitation`, data);
  },
  sendRsvp: async (data, id) => {
    return await Actions.post(`/api/rsvp/sendeventrsvp/${id}`, data);
  },
  mine: async () => {
    const events = await Actions.getAll("/api/me/contributors/events");
    return events;
  },
  getOne: async (id) => {
    return await Actions.getOne("/api/events/", id);
  },
  editOne: async (data, id) => {
    return await Actions.edit("/api/events", data, id);
  },
  deleteOne: async (id) => {
    return await Actions.delete("/api/events/", id);
  },
  getStyles: async (id) => {
    return await Actions.get(`/api/events/${id}/stylestemp`);
  },
};
export const UsersApi = {
  getAll: async (id, query) => {
    query = query ? query : "";
    return await Actions.getAll(`/api/events/${id}/eventUsers${query}`);
  },
  mineTickets: async () => {
    return await Actions.getAll("/api/me/eventUsers/");
  },
  getProfile: async (id) => {
    return await Actions.getOne("/api/users/", id);
  },
  editProfile: async (data, id) => {
    return await Actions.edit("/api/users", data, id);
  },
  findByEmail: async (email) => {
    return await Actions.getOne(`api/users/findByEmail/`, email);
  },

  mineOrdes: async (id) => {
    return await Actions.getAll(`/api/users/${id}/orders`);
  },
  createOne: async (data, id) => {
    //Este primero es que deberia estar pero no sirve
    //return await Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${id}`, data);
    return await Actions.post(`/api/events/${id}/adduserwithemailvalidation`, data);
  },
  deleteOne: async (user, id) => {
    return await Actions.delete(`/api/user/events/${id}`, user);
  },
};

export const TicketsApi = {
  getAll: async (token) => {
    return await Actions.getAll(`/api/me/eventUsers/?token=${token}?limit=20`);
  },
  getByEvent: async (event, token) => {
    return await Actions.getOne(`/api/me/eventusers/event/${event}/?token=`, token);
  },
  transferToUser: async (event, event_user, data) => {
    return await Actions.post(`/api/eventusers/${event}/tranfereventuser/${event_user}`, data);
  },

  checkInUser: async (event_user) => {
    return await Actions.put(`/api/eventUsers/${event_user}/checkin`);
  },
};

export const EventFieldsApi = {
  getAll: async (event) => {
    return await Actions.getAll(`/api/events/${event}/userproperties`);
  },
  getOne: async (event, id) => {
    return await Actions.getOne(`/api/events/${event}/userproperties`, id);
  },
  createOne: async (data, event) => {
    return await Actions.post(`/api/events/${event}/userproperties`, data);
  },
  editOne: async (data, id, event) => {
    console.log(id, event, data);
    return await Actions.edit(`/api/events/${event}/userproperties`, data, id);
  },
  deleteOne: async (id, event) => {
    return await Actions.delete(`/api/events/${event}/userproperties`, id);
  },
};

export const SurveysApi = {
  getAll: async (event) => {
    return await Actions.getAll(`/api/events/${event}/surveys`);
  },

  getByActivity: async (event, activity_id) => {
    return await Actions.getAll(`/api/events/${event}/surveys?indexby=activity_id&value=${activity_id}`);
  },

  getOne: async (event, id) => {
    return await Actions.getOne(`/api/events/${event}/surveys/`, id);
  },
  createOne: async (event, data) => {
    return await Actions.create(`/api/events/${event}/surveys/`, data);
  },
  editOne: async (data, id, event) => {
    return await Actions.edit(`/api/events/${event}/surveys`, data, id);
  },
  deleteOne: async (event, id) => {
    return await Actions.delete(`/api/events/${event}/surveys`, id);
  },
  createQuestion: async (event, id, data) => {
    return await Actions.put(`/api/events/${event}/surveys/${id}?newquestion=1`, data);
  },
  deleteQuestion: async (event, surveyId, index) => {
    return await Actions.delete(`/api/events/${event}/surveys/${surveyId}?delete=`, index, true);
  },
  editQuestion: async (event, id, index, data) => {
    return await Actions.put(`/api/events/${event}/questionedit/${id}?questionNo=${index}`, data);
  },
};

export const DocumentsApi = {
  getAll: async (event) => {
    return await Actions.getAll(`api/events/${event}/documents`);
  },
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/documents`).then(({ data }) => data);
  },

  getFiles: async (event, id) => {
    return await Actions.getAll(`api/events/${event}/documents?father_id=${id}`);
  },
  getOne: async (event, id) => {
    return await Actions.getOne(`api/events/${event}/documents/`, id);
  },
  editOne: async (event, data, id) => {
    return await Actions.edit(`api/events/${event}/documents`, data, id);
  },
  deleteOne: async (event, id) => {
    return await Actions.delete(`api/events/${event}/documents`, id);
  },
  create: async (event, data) => {
    return await Actions.create(`api/events/${event}/documents`, data);
  },
};

export const CategoriesApi = {
  getAll: async () => {
    const resp = await Actions.getAll("api/categories");
    return handleSelect(resp.data);
  },
};
export const TypesApi = {
  getAll: async () => {
    const resp = await Actions.getAll("api/eventTypes");
    return handleSelect(resp.data);
  },
};
export const OrganizationApi = {
  mine: async () => {
    const resp = await Actions.getAll("api/me/organizations");
    let data = resp.data.map((item) => {
      return { id: item._id, name: item.name };
    });
    return data;
  },
  getOne: async (id) => {
    return await Actions.getOne("/api/organizations/", id);
  },
  editOne: async (data, id) => {
    return await Actions.edit("/api/organizations", data, id);
  },
  events: async (id) => {
    return await Actions.getOne(`/api/organizations/${id}/`, "events");
  },
  getUsers: async (id) => {
    return await Actions.get(`/api/organizations/${id}/users`);
  },
  getUser: async (org, member) => {
    return await Actions.getOne(`/api/organizations/${org}/users/`, member);
  },
  saveUser: async (org, data) => {
    return await Actions.post(`/api/organizations/${org}/users`, data);
  },
  editUser: async (org, member, data) => {
    return await Actions.edit(`/api/organizations/${org}/users`, data, member);
  },
  deleteUser: async (org, member) => {
    return await Actions.delete(`/api/organizations/${org}/users/`, member);
  },
};
export const BadgeApi = {
  create: async (data) => {
    return await Actions.post(`/api/escarapelas`, data);
  },
  edit: async (data, id) => {
    return await Actions.edit("/api/escarapelas/", data, id);
  },
  get: async (id) => {
    return await Actions.getOne("/api/escarapelas/", id);
  },
};
export const HelperApi = {
  listHelper: async (id) => {
    return await Actions.getOne(`api/contributors/events/`, id);
  },
  rolesOne: async (event) => {
    return await Actions.get(`api/contributors/events/${event}/me`);
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
export const CertsApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/certificates`).then(({ data }) => data);
  },
  getOne: async (id) => {
    return await Actions.get(`api/certificate/`, id);
  },
  generate: async (content, image) => {
    return await Actions.get(`api/pdfcertificate?content=` + content + "&image=" + image + "&download=1");
  },
  editOne: async (data, id) => {
    return await Actions.edit("/api/certificates", data, id);
  },
  deleteOne: async (id) => {
    return await Actions.delete("/api/certificates", id);
  },
  create: async (data) => {
    return await Actions.create(`api/certificates`, data);
  },
  generateCert: async (body) => {
    return new Promise((resolve, reject) => {
      privateInstance
        .post("/api/generatecertificate?download=1", body, {
          responseType: "blob",
        })
        .then((response) => {
          resolve({
            type: response.headers["content-type"],
            blob: response.data,
          });
        });
    });
  },
};

export const NewsFeed = {
  byEvent: async (id) => {
    return await Actions.getAll(`api/events/${id}/newsfeed`).then(({ data }) => data);
  },
  getOne: async (id) => {
    return await Actions.get(`api/events/${id}/newsfeed/`, id);
  },
  editOne: async (data, id) => {
    return await Actions.edit(`api/events/${id}/newsfeed`, data, id);
  },
  deleteOne: async (id) => {
    return await Actions.delete(`api/events/${id}/newsfeed`, id);
  },
  create: async (data, id) => {
    return await Actions.create(`api/events/${id}/newsfeed`, data);
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
  getOne: async (id) => {
    return await Actions.get(`api/events/${id}/faqs/`, id);
  },
  editOne: async (data, id) => {
    return await Actions.edit(`api/events/${id}/faqs`, data, id);
  },
  deleteOne: async (id) => {
    return await Actions.delete(`api/events/${id}/faqs`, id);
  },
  create: async (data, id) => {
    return await Actions.create(`api/events/${id}/faqs`, data);
  },
};

export const RolAttApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/rolesattendees`);
  },
  getOne: async (event, id) => {
    return await Actions.get(`api/events/${event}/rolesattendees/`, id);
  },
  editOne: async (data, id, event) => {
    return await Actions.edit(`/api/events/${event}/rolesattendees`, data, id);
  },
  deleteOne: async (id, event) => {
    return await Actions.delete(`/api/events/${event}/rolesattendees`, id);
  },
  create: async (data, event) => {
    return await Actions.create(`api/events/${event}/rolesattendees`, data);
  },
};
export const SpacesApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/spaces`).then(({ data }) => data);
  },
  getOne: async (event, id) => {
    return await Actions.get(`api/events/${event}/spaces/`, id);
  },
  editOne: async (data, id, event) => {
    return await Actions.edit(`api/events/${event}/spaces`, data, id);
  },
  deleteOne: async (id, event) => {
    return await Actions.delete(`api/events/${event}/spaces`, id);
  },
  create: async (data, event) => {
    return await Actions.create(`api/events/${event}/spaces`, data);
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
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/activities`);
  },
  getOne: async (id, event) => {
    return await Actions.getOne(`api/events/${event}/activities/`, id);
  },
  editOne: async (data, id, event) => {
    return await Actions.edit(`api/events/${event}/activities`, data, id);
  },
  deleteOne: async (id, event) => {
    return await Actions.delete(`api/events/${event}/activities`, id);
  },
  create: async (event, data) => {
    return await Actions.create(`api/events/${event}/activities`, data);
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
    return await Actions.edit(`api/events/${event}/host`, data, id);
  },
  deleteOne: async (id, event) => {
    return await Actions.delete(`api/events/${event}/host`, id);
  },
  create: async (event, data) => {
    return await Actions.create(`api/events/${event}/host`, data);
  },
};

export const Activity = {
  Register: async (event, user_id, activity_id) => {
    var info = { user_id, activity_id };
    return await Actions.create(`api/events/${event}/activity/activity_attendee`, info);
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

export default privateInstance;
