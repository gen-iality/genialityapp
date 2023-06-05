import axios from 'axios'
import { ApiUrlCountry, KeyCountry, ApiUrl, ApiEviusZoomSurvey } from './constants'
import { handleSelect } from './utils'
import { firestore } from './firebase'
import dayjs from 'dayjs'
import { GetTokenUserFirebase } from './HelperAuth'
import { StateMessage } from '@context/MessageService'

const publicInstance = axios.create({
  url: ApiUrl,
  baseURL: ApiUrl,
  pushURL: 'https://104.248.125.133:6477/pushNotification',
})

const privateInstance = axios.create({
  url: ApiUrl,
  baseURL: ApiUrl,
  withCredentials: true,
})
const countryInstance = axios.create({
  url: ApiUrlCountry,
  baseURL: ApiUrlCountry,
  headers: {
    'Content-Type': 'application/json',
    'X-CSCAPI-KEY': KeyCountry,
  },
})
/*PROXIMAMENTE DEPRECADO, 
//PREGUNTE A MARIO MONTERO O JUAN LOPEZ DONDE SE PUEDE USAR*/

/*PROXIMAMENTE DEPRECADO, 
//PREGUNTE A MARIO MONTERO O JUAN LOPEZ DONDE SE PUEDE USAR*/

/*PROXIMAMENTE DEPRECADO, 
//PREGUNTE A MARIO MONTERO O JUAN LOPEZ DONDE SE PUEDE USAR*/

/*PROXIMAMENTE DEPRECADO, 
//PREGUNTE A MARIO MONTERO O JUAN LOPEZ DONDE SE PUEDE USAR*/

/*PROXIMAMENTE DEPRECADO, 
//PREGUNTE A MARIO MONTERO O JUAN LOPEZ DONDE SE PUEDE USAR*/

export const fireStoreApi = {
  createOrUpdate: (eventId, activityId, eventUser) => {
    const agendaRef = firestore.collection(
      `event_activity_attendees/${eventId}/activities/${activityId}/attendees`,
    )
    return agendaRef.add({
      activity_id: activityId,
      attendee_id: eventUser._id,
      created_at: new Date(),
      properties: eventUser.properties,
      updated_at: new Date(),
      checked_in: true,
      checked_at: new Date(),
    })
  },
}

export const Actions = {
  create: async (url, data, unsafe) => {
    if (unsafe) return publicInstance.post(url, data).then(({ data }) => data)
    return privateInstance.post(url, data).then(({ data }) => data)
  },
  delete: async (url, id, unsafe) => {
    if (unsafe) return publicInstance.delete(`${url}${id}`).then(({ data }) => data)
    return privateInstance.delete(`${url}/${id}`).then(({ data }) => data)
  },
  edit: async (url, data, unsafe) => {
    if (unsafe) return publicInstance.put(`${url}`, data).then(({ data }) => data)
    return privateInstance.put(`${url}`, data).then(({ data }) => data)
  },
  post: async (url, data, unsafe) => {
    if (unsafe) return publicInstance.post(url, data).then(({ data }) => data)
    return privateInstance.post(url, data).then(({ data }) => data)
  },
  get: async (url, unsafe) => {
    if (unsafe) return publicInstance.get(url).then(({ data }) => data)
    return privateInstance.get(url).then(({ data }) => data)
  },

  put: async (url, data, unsafe) => {
    if (unsafe) return publicInstance.put(url, data).then(({ data }) => data)
    return privateInstance.put(url, data).then(({ data }) => data)
  },
  getOne: async (url, id, unsafe) => {
    if (unsafe) return publicInstance.get(`${url}${id}`).then(({ data }) => data)
    return privateInstance.get(`${url}${id}`).then(({ data }) => data)
  },
  getAll: async (url, unsafe) => {
    if (unsafe) return publicInstance.get(`${url}`).then(({ data }) => data)
    return privateInstance.get(`${url}`).then(({ data }) => data)
  },
}

export const SearchUserbyEmail = (email) => {
  const url = `${ApiUrl}/api/users/findByEmail/${email}`
  return Actions.get(url)
}

//BACKLOG --> ajustar a la nueva estructura el setState que se comentó para evitar fallos por no contar con el estado
export const getCurrentUser = async () => {
  const token = await GetTokenUserFirebase()

  return new Promise(async (resolve) => {
    if (!token || token == 'undefined') {
      resolve(null)
    } else {
      try {
        const resp = await privateInstance.get(`/auth/currentUser?token=${token}`)
        if (resp.status === 200) {
          resolve(resp.data)
        }
      } catch (error) {
        if (error.response) {
          // eslint-disable-next-line no-unused-vars
          const { status } = error.response
          if (status === 401) {
            StateMessage.show(
              null,
              'error',
              'Tu token a caducado, redirigiendo al login!',
            )
          } else {
            StateMessage.show(null, 'error', 'Ocurrió un error distinto al token!')
          }
        } else {
          const errorData = {}
          console.error('Error', error.message)
          if (error.message) {
            errorData.message = error.message
            StateMessage.show(null, 'error', errorData.message)
          } else if (error.request) {
            console.error(error.request)
            errorData.message = JSON.stringify(error.request)
            StateMessage.show(null, 'error', errorData.message)
          }
          errorData.status = 708
        }
        console.error(error.config)
      }
    }
  })
}

export const EventsApi = {
  getEventUser: async (user_id, event_id) => {
    const snapshot = await firestore
      .collection(`${event_id}_event_attendees`)
      .where('account_id', '==', user_id)
      .get()
    const eventUser = !snapshot.empty ? snapshot.docs[0].data() : null
    return eventUser
  },

  getcurrentUserEventUser: async (event_id) => {
    const token = await GetTokenUserFirebase()
    const response = await Actions.getAll(
      `/api/me/eventusers/event/${event_id}?token=${token}`,
      false,
    )
    const eventUser = response.data && response.data[0] ? response.data[0] : null
    return eventUser
  },

  /* Según un nuevo modelo de los eventUsers un solo usuario puede tener varios eventUsers para un curso */
  getcurrentUserEventUsers: async (event_id) => {
    const token = await GetTokenUserFirebase()
    const response = await Actions.getAll(
      `/api/me/eventusers/event/${event_id}?token=${token}`,
      false,
    )
    const eventUsers = response.data ? response.data : null
    return eventUsers
  },

  getPublic: async (query) => {
    return await Actions.getAll(`/api/events${query}`, true)
  },
  getOldEvents: async (query) => {
    return await Actions.getAll(`/api/eventsbeforetoday${query}`, true)
  },
  getNextEvents: async (query) => {
    return await Actions.getAll(`/api/eventsaftertoday${query}`, true)
  },
  landingEvent: async (id) => {
    return await Actions.getOne('/api/events/', id, true)
  },
  hostAvailable: async () => {
    return await Actions.get('api/events/zoomhost')
  },
  invitations: async (id) => {
    return await Actions.getOne(`/api/events/${id}/`, 'invitations')
  },
  sendMeetingRequest: async (eventId, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.post(
      `/api/events/${eventId}/meetingrequest/notify?token=${token}`,
      data,
    )
  },

  sendInvitation: async (eventId, data) => {
    return await Actions.post(`/api/events/${eventId}/invitation`, data)
  },
  sendRsvp: async (data, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.post(`/api/rsvp/sendeventrsvp/${id}?token=${token}`, data, true)
  },
  mine: async () => {
    const token = await GetTokenUserFirebase()
    const events = await Actions.getAll(
      `/api/me/contributors/events/?token=${token}`,
      true,
    )
    return events
  },
  getOne: async (id) => {
    return await Actions.getOne('/api/events/', id)
  },
  getOneByNameEvent: async (eventName) => {
    return await Actions.get(
      `/api/events/?filtered=[{"field":"name","value":[%22${eventName}%22]}]`,
    )
  },
  editOne: async (data, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(`/api/events/${id}?token=${token}`, data, true)
  },
  deleteOne: async (id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(`/api/events/${id}?token=${token}`, '', true)
  },
  editItsPositions: async (id, positionIds) => {
    const data = {
      position_ids: positionIds,
    }
    const token = await GetTokenUserFirebase()
    return await Actions.put(`/api/events/${id}/positions?token=${token}`, data, true)
  },
  getStyles: async (id) => {
    return await Actions.get(`/api/events/${id}/stylestemp`, true)
  },
  metrics: async (id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getOne(
      `/api/events/${id}/totalmetricsbyevent/?token=${token}`,
      '',
    )
  },
  metricsByActivity: async (id) => {
    return await Actions.getOne(`/api/events/${id}/`, 'totalmetricsbyactivity')
  },
  metricsRegisterBydate: async (id, type, fechaInicial, fechaFinal) => {
    const token = await GetTokenUserFirebase()
    return await Actions.get(
      `/api/events/${id}/metricsbydate/eventusers/?token=${token}&metrics_type=${type}&datetime_from=${fechaInicial}&datetime_to=${fechaFinal}`,
    )
  },

  //obtener products subasta silenciosa
  getProducts: async (eventId) => {
    return await Actions.get(`/api/events/${eventId}/products`)
  },
  storeOfert: async (eventId, productId, data) => {
    return await Actions.post(
      `/api/events/${eventId}/products/${productId}/silentauctionmail`,
      data,
    )
  },
  getOneProduct: async (eventId, idproduct) => {
    return await Actions.get(`/api/events/${eventId}/products/${idproduct}`)
  },
  editProduct: async (data, eventId, idproduct) => {
    const token = await GetTokenUserFirebase()
    return await Actions.put(
      `/api/events/${eventId}/products/${idproduct}?token=${token}`,
      data,
    )
  },
  createProducts: async (data, eventId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.post(`/api/events/${eventId}/products?token=${token}`, data)
  },
  deleteProduct: async (galleryId, eventId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `/api/events/${eventId}/products/${galleryId}?token=${token}`,
      '',
      true,
    )
  },
  validPrice: async (eventId, productId) => {
    return await Actions.get(
      `/api/events/${eventId}/products/${productId}/minimumauctionvalue`,
    )
  },
  ofertsProduct: async (eventId, productId) => {
    return await Actions.get(
      `api/events/${eventId}/orders/ordersevent?filtered=[{"field":"items","value":"${productId}"}]`,
    )
  },
  acceptOrRejectRequest: async (eventId, requestId, status) => {
    return await Actions.get(`api/event/${eventId}/meeting/${requestId}/${status}`)
  },
  getStatusRegister: async (eventId, email) => {
    let token
    /** Se agrega el try catch para evitar que si no hay una sesion se detenga el flujo */
    try {
      token = await GetTokenUserFirebase()
    } catch (error) {
      token = false
    }
    return await Actions.get(
      `api/events/${eventId}/eventusers${
        token ? `/?token=${token}` : '/'
      }&filtered=[{"field":"properties.email","value":"${email}", "comparator":"="}]&${new Date()}`,
      true,
    )
  },
  recoveryPassword: async (eventId, url, email) => {
    return await Actions.put(
      `/api/events/${eventId}/changeUserPassword?destination=${url}`,
      email,
    )
  },
  //RESTABLECER CONTRASEÑA
  changePassword: async (eventId, email) => {
    //URL DE PRUEBAS
    return await Actions.put(`/api/changeuserpassword`, {
      email: email,
      event_id: eventId,
    })
  },

  changePasswordUser: async (email, hostname) => {
    //URL DE PRUEBAS
    return await Actions.put(`/api/changeuserpassword`, {
      email: email,
      hostName: hostname,
    })
  },
  //ACCEDER POR LINK AL CORREO
  requestLinkEmail: async (eventId, email) => {
    return await Actions.post(`/api/getloginlink`, { email: email, event_id: eventId })
  },
  //ACCEDER POR LINK AL CORREO SIN CURSO
  requestLinkEmailUSer: async (email) => {
    return await Actions.post(`/api/getloginlink`, { email: email })
  },
  //REFRESH URL LINK DE ACCESSO
  refreshLinkEmailUser: async (email) => {
    return await Actions.post(`/api/getloginlink`, { email: email, refreshlink: true })
  },
  generalMagicLink: async (email, url, content) => {
    return await Actions.post(`/api/general-magic-link`, { email, url, content })
  },
  sendGenericMail: async (email, url, content, actionText, subject) => {
    const params = {
      email,
      url,
      content,
    }
    if (actionText) params.action_text = actionText
    if (subject) params.subject = subject

    const query = new URLSearchParams(params)
    return await Actions.post(`/api/generic-mail?${query.toString()}`)
  },
  //REFRESH URL LINK DE ACCESSO A CURSO
  refreshLinkEmailUserEvent: async (email, eventId) => {
    return await Actions.post(`/api/getloginlink`, {
      email: email,
      refreshlink: true,
      event_id: eventId,
    })
  },
  requestUrlEmail: async (eventId, url, email) => {
    return await Actions.put(
      `/api/events/${eventId}/changeUserPassword?destination=${url}&firebase_password_change=true`,
      email,
    )
  },
  signInWithEmailAndPassword: async (data) => {
    return await Actions.post(`/api/users/signInWithEmailAndPassword`, data)
  },
  createTemplateEvent: async (eventId, idTemplate) => {
    const token = await GetTokenUserFirebase()
    return await Actions.put(
      `/api/events/${eventId}/templateproperties/${idTemplate}/addtemplateporperties?token=${token}`,
      {},
    )
  },
}
export const InvitationsApi = {
  getAll: async (id) => {
    return await Actions.getAll(`/api/events/${id}/invitation`)
  },
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/invitation`, true).then(
      ({ data }) => data,
    )
  },
}

export const UsersApi = {
  getAll: async (id, query) => {
    const token = await GetTokenUserFirebase()
    query = query ? query : ''
    return await Actions.getAll(`/api/events/${id}/eventusers?token=${token}&${query}`)
  },
  getOne: async (event_id, user_id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getAll(
      `api/events/${event_id}/eventusers/${user_id}?token=${token}`,
    )
  },
  getEventUserByUser: async (eventId, userId) => {
    return await Actions.getOne(
      `/api/events/${eventId}/eventusers-by-user/${userId}`,
      '',
      true,
    )
  },
  mineTickets: async () => {
    return await Actions.getAll('/api/me/eventUsers/')
  },
  getProfile: async (id) => {
    return await Actions.getOne('/api/users/', id)
  },
  editProfile: async (data, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(`/api/users/${id}/?token=${token}`, data, true)
  },
  findByEmail: async (email) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getOne(`api/users/findByEmail/${email}?token=${token}`, true)
  },

  validateEmail: async (email) => {
    return await Actions.post(`api/validateEmail`, email, true)
  },
  validateAttendeeData: async (event_id, eventUser_id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.get(
      `api/events/${event_id}/eventusers/${eventUser_id}/validate-attendee-data?token=${token}`,
      true,
    )
  },

  mineOrdes: async (id) => {
    return await Actions.getAll(`/api/users/${id}/orders`)
  },
  createOne: async (data, id, noSendEmail) => {
    //Este primero es que deberia estar pero no sirve
    //return await Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${id}`, data);
    /** Se envia token para validar si el rol es cambiado por un damin */
    let token
    /** Se agrega el try catch para evitar que si no hay una sesion se detenga el flujo */
    try {
      token = await GetTokenUserFirebase()
    } catch (error) {
      token = false
    }

    const params = {}
    if (token) {
      params['token'] = token
    }

    params['no_send_mail'] = noSendEmail

    const query = new URLSearchParams(params)

    return await Actions.post(
      `/api/events/${id}/adduserwithemailvalidation/?${query.toString()}`,
      data,
      true,
    )
  },
  deleteOne: async (user, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(`/api/user/events/${id}?token=${token}`, user)
  },

  deleteUsers: async (user) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(`/api/users`, `${user}?token=${token}`)
  },
  createUser: async (user) => {
    return await Actions.post(`/api/users`, user)
  },
  editEventUser: async (data, eventId, eventUserId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.put(
      `/api/events/${eventId}/eventusers/${eventUserId}?token=${token}`,
      data,
      true,
    )
  },

  createUserInEventAndAssignToActivity: async (data, activityId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.post(
      `api/activities/${activityId}/eventUsers?token=${token}`,
      data,
      true,
    )
  },
  deleteAttendeeInActivity: async (activityId, eventUserId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `/api/activities/${activityId}/eventUsers/${eventUserId}?token=${token}`,
    )
  },
}

export const AttendeeApi = {
  getAll: async (eventId) => {
    return await Actions.getAll(`/api/events/${eventId}/eventusers`)
  },
  create: async (eventId, data) => {
    /** Se envia token para validar si el rol es cambiado por un damin */
    let token
    /** Se agrega el try catch para evitar que si no hay una sesion se detenga el flujo */
    try {
      token = await GetTokenUserFirebase()
    } catch (error) {
      token = false
    }
    return await Actions.post(
      `/api/events/${eventId}/eventusers/?token=${token}`,
      data,
      true,
    )
  },
  update: async (eventId, data, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.put(
      `api/events/${eventId}/eventusers/${id}?token=${token}`,
      data,
      true,
    )
  },
  delete: async (eventId, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `api/events/${eventId}/eventusers/`,
      `${id}?token=${token}`,
      true,
    )
  },
}

export const eventTicketsApi = {
  byEvent: async (eventId) => {
    return await Actions.getAll(`api/events/${eventId}/tickets`)
  },
  getOne: async (id, eventId) => {
    return await Actions.get(`api/events/${eventId}/tickets/${id}`)
  },
  getAll: async (eventId) => {
    return await Actions.getAll(`/api/events/${eventId}/tickets`)
  },
  create: async (eventId, data) => {
    return await Actions.post(`/api/events/${eventId}/tickets`, data)
  },
  update: async (eventId, data, id) => {
    return await Actions.put(`api/events/${eventId}/tickets/${id}`, data)
  },
  delete: async (eventId, id) => {
    return await Actions.delete(`api/events/${eventId}/tickets`, id)
  },
  deleteOne: async (id, eventId) => {
    return await Actions.delete(`api/events/${eventId}/tickets`, id)
  },
}

export const TicketsApi = {
  getAll: async () => {
    const token = await GetTokenUserFirebase()
    return await Actions.getAll(`/api/me/eventUsers/?token=${token}&limit=20`, true)
  },
  getByEvent: async (event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getOne(
      `/api/me/eventusers/event/${event}${token ? `/?token=${token}` : '/'}`,
    )
  },
  transferToUser: async (event, event_user, data) => {
    return await Actions.post(
      `/api/eventusers/${event}/tranfereventuser/${event_user}`,
      data,
    )
  },

  addCheckIn: async (eventUser_id, checkInType) => {
    const token = await GetTokenUserFirebase()
    const checkedin_type = checkInType
    return await Actions.put(
      `/api/eventUsers/${eventUser_id}/checkin/?token=${token}`,
      { checkedin_type },
      true,
    )
  },

  deleteCheckIn: async (eventUser_id) => {
    const token = await GetTokenUserFirebase()

    return await Actions.put(
      `/api/eventUsers/${eventUser_id}/uncheck/?token=${token}`,
      {},
      true,
    )
  },
}

export const EventFieldsApi = {
  getAll: async (event) => {
    return await Actions.getAll(`/api/events/${event}/userproperties`)
  },
  byEvent: async (event) => {
    return await Actions.getAll(`/api/events/${event}/userproperties`)
  },
  getOne: async (event, id) => {
    return await Actions.getOne(`/api/events/${event}/userproperties/${id}`)
  },
  createOne: async (data, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.post(`/api/events/${event}/userproperties?token=${token}`, data)
  },
  editOne: async (data, id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(
      `/api/events/${event}/userproperties/${id}?token=${token}`,
      data,
      true,
    )
  },
  registerListFieldOptionTaken: async (data, id, event) => {
    return await Actions.put(
      `/api/events/${event}/userproperties/${id}/RegisterListFieldOptionTaken`,
      data,
    )
  },
  deleteOne: async (id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `/api/events/${event}/userproperties`,
      `${id}?token=${token}`,
    )
  },
}

export const SurveysApi = {
  getAll: async (event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getAll(`/api/events/${event}/surveys/?token=${token}`)
  },
  byEvent: async (event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getAll(`api/events/${event}/surveys/?token=${token}`, true).then(
      ({ data }) => data,
    )
  },
  getByActivity: async (event, activity_id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getAll(
      `/api/events/${event}/surveys/?token=${token}&indexby=activity_id&value=${activity_id}`,
    )
  },
  getOne: async (event, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getOne(
      `/api/events/${event}/surveys/${id}/?token=${token}`,
      true,
    )
  },
  createOne: async (event, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.create(
      `/api/events/${event}/surveys/?token=${token}`,
      data,
      true,
    )
  },
  editOne: async (data, id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(
      `/api/events/${event}/surveys/${id}/?token=${token}`,
      data,
      true,
    )
  },
  deleteOne: async (id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `/api/events/${event}/surveys/${id}/?token=${token}`,
      '',
      true,
    )
  },
  createQuestion: async (event, id, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.put(
      `/api/events/${event}/surveys/${id}/?token=${token}&newquestion=1`,
      data,
      true,
    )
  },
  deleteQuestion: async (event, surveyId, index) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `/api/events/${event}/surveys/${surveyId}/?token=${token}&delete=${index}`,
      '',
      true,
    )
  },
  editQuestion: async (event, id, index, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.put(
      `/api/events/${event}/questionedit/${id}/?token=${token}&questionNo=${index}`,
      data,
      true,
    )
  },
  sendCommunicationUser: async (surveyId, eventUserId) => {
    return await Actions.get(
      `/api/surveys/${surveyId}/eventusers/${eventUserId}/sendcode`,
    )
  },
  sendCommunicationOpen: async (surveyId) => {
    return await Actions.get(`/api/surveys/${surveyId}/open`)
  },
}

export const DocumentsApi = {
  getAll: async (event) => {
    return await Actions.getAll(`api/events/${event}/documents`, true)
  },
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/documents`, true).then(
      ({ data }) => data,
    )
  },
  getFiles: async (id, event) => {
    return await Actions.getAll(`api/events/${event}/documents?father_id=${id}`)
  },
  getOne: async (id, event) => {
    return await Actions.getOne(`api/events/${event}/documents/`, id)
  },
  editOne: async (data, id, event) => {
    return await Actions.edit(`api/events/${event}/documents/${id}`, data, true)
  },
  deleteOne: async (id, event) => {
    return await Actions.delete(`api/events/${event}/documents`, id)
  },
  create: async (data, event) => {
    return await Actions.create(`api/events/${event}/documents`, data)
  },
}

export const CategoriesApi = {
  getAll: async () => {
    const resp = await Actions.getAll('api/categories', true)
    return handleSelect(resp.data)
  },
}
export const TypesApi = {
  getAll: async () => {
    const resp = await Actions.getAll('api/eventTypes', true)
    return handleSelect(resp.data)
  },
}
export const OrganizationApi = {
  mine: async () => {
    const token = await GetTokenUserFirebase()

    const resp = await Actions.getAll(`api/me/organizations?token=${token}`)
    const data = resp.data.map((item) => {
      return {
        _id: item._id,
        rol: item.rol,
        id: item.organization?._id,
        name: item.organization?.name,
        styles: item.organization?.styles,
        created_at: item.organization?.created_at,
        itemsMenu: item.organization?.itemsMenu,
      }
    })
    return data
  },
  getOne: async (id) => {
    return await Actions.getOne('/api/organizations/', id)
  },
  createOrganization: async (data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.post(`/api/organizations?token=${token}`, data, true)
  },
  editOne: async (data, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(`/api/organizations/${id}?token=${token}`, data, true)
  },
  events: async (id) => {
    return await Actions.getOne(`/api/organizations/${id}/`, 'events')
  },
  getUsers: async (id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.get(`/api/organizations/${id}/organizationusers?token=${token}`)
  },
  getEpecificUser: async (orgId, memberId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getOne(
      `/api/organizations/${orgId}/organizationusers/${memberId}?token=${token}`,
      '',
      true,
    )
  },
  getMeUser: async (orgId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getOne(
      `/api/me/organizations/${orgId}/?token=${token}`,
      '',
      true,
    )
  },
  saveUser: async (org, data) => {
    return await Actions.post(`/api/organizations/${org}/addorganizationuser`, data)
  },
  editUser: async (org, member, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(
      `/api/organizations/${org}/organizationusers/${member}?token=${token}`,
      data,
      true,
    )
  },
  deleteUser: async (org, member) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `/api/organizations/${org}/organizationusers`,
      `/${member}?token=${token}`,
      true,
    )
  },
  getEventsStatistics: async (org) => {
    return await Actions.get(`/api/organizations/${org}/eventsstadistics`)
  },
  editAllUserProperties: async (org, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.put(`api/organizations/${org}?token=${token}`, data)
  },
  editOneUserProperties: async (org, fieldId, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(
      `api/organizations/${org}/userproperties/${fieldId}?token=${token}`,
      data,
      true,
    )
  },
  createOneUserProperties: async (org, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.post(
      `/api/organizations/${org}/userproperties?token=${token}`,
      data,
      true,
    )
  },
  getUserProperties: async (org) => {
    return await Actions.get(`/api/organizations/${org}/userproperties`)
  },
  deleteUserProperties: async (org, fieldId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `/api/organizations/${org}/userproperties/${fieldId}?token=${token}`,
      '',
      true,
    )
  },
  getTemplateOrganization: async (org) => {
    const token = await GetTokenUserFirebase()
    return await Actions.get(
      `/api/organizations/${org}/templateproperties?token=${token}`,
    )
  },
  updateTemplateOrganization: async (orgId, idTemplate, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.put(
      `/api/organizations/${orgId}/templateproperties/${idTemplate}?token=${token}`,
      data,
    )
  },
  editMenu: async (data, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.put(
      `/api/organizations/${id}?update_events_itemsMenu=false&token=${token}`,
      data,
    )
  },
  editDefaultPosition: async (organizationId, positionId) => {
    const data = { position_id: positionId }
    return await Actions.put(
      `/api/organizations/${organizationId}/default-position`,
      data,
    )
  },
  Roles: {
    getAll: async (organizationId) => {
      return await Actions.get(`/api/organizations/${organizationId}/roles`)
    },
  },
}
export const BadgeApi = {
  create: async (data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.post(`/api/escarapelas?token=${token}`, data)
  },
  edit: async (data, id) => {
    return await Actions.edit(`/api/escarapelas/${id}`, data)
  },
  get: async (id) => {
    return await Actions.getOne('/api/escarapelas/', id)
  },
}
export const HelperApi = {
  listHelper: async (id) => {
    return await Actions.getOne(`api/contributors/events/`, id)
  },
  rolesOne: async (event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.get(`api/contributors/events/${event}/me?token=${token}`)
  },
  saveHelper: async (event, data) => {
    return await Actions.post(`api/events/${event}/contributors`, data)
  },
  editHelper: async (event, id, data) => {
    return await Actions.put(`api/events/${event}/contributors/${id}`, data)
  },
  removeHelper: async (id, event) => {
    return await Actions.delete(`api/events/${event}/contributors`, id)
  },
}

export const discountCodesApi = {
  exchangeCode: async (template_id, data) => {
    const url = `api/code/exchangeCode`
    return await publicInstance.put(url, data).then(({ data }) => data)
  },
}

export const CertsApi = {
  byEvent: async (event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getAll(`api/events/${event}/certificates?token=${token}`).then(
      ({ data }) => data,
    )
  },
  getOne: async (id) => {
    return await Actions.getOne(`api/certificate/`, id)
  },
  generate: async (content, image) => {
    return await Actions.get(
      `api/pdfcertificate?content=` + content + '&image=' + image + '&download=1',
    )
  },
  editOne: async (data, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.put(`/api/certificates/${id}?token=${token}`, data)
  },
  deleteOne: async (id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(`/api/certificates/${id}?token=${token}`, '', true)
  },
  create: async (data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.create(`/api/certificates?token=${token}`, data)
  },
  generateCert: async (body) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise(async (resolve) => {
      const token = await GetTokenUserFirebase()
      publicInstance
        .post(`/api/generatecertificate?token=${token}&download=1`, body, {
          responseType: 'blob',
        })
        .then((response) => {
          resolve({
            type: response.headers['content-type'],
            blob: response.data,
          })
        })
    })
  },
}

export const NewsFeed = {
  byEvent: async (eventId) => {
    //ESTE ENDPOINT ES PÚBLICO
    return await Actions.getAll(`api/events/${eventId}/newsfeed`).then(({ data }) => data)
  },
  getOne: async (eventId, idnew) => {
    //ESTE ENDPOINT ES PÚBLICO
    return await Actions.get(`api/events/${eventId}/newsfeed/${idnew}`)
  },
  editOne: async (data, id, eventId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(
      `api/events/${eventId}/newsfeed/${id}?token=${token}`,
      data,
      true,
    )
  },
  deleteOne: async (id, eventId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(`api/events/${eventId}/newsfeed`, `${id}?token=${token}`)
  },
  create: async (data, eventId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.create(`api/events/${eventId}/newsfeed?token=${token}`, data)
  },
}

export const PushFeed = {
  byEvent: async (id) => {
    return await Actions.getAll(`api/events/${id}/sendpush`).then(({ data }) => data)
  },
  getOne: async (id) => {
    return await Actions.get(`api/events/${id}/sendpush/`, id)
  },
  editOne: async (data, id) => {
    return await Actions.edit(`api/events/${id}/sendpush`, data)
  },
  deleteOne: async (id) => {
    return await Actions.delete(`api/events/${id}/sendpush`, id)
  },
  create: async (data, id) => {
    return await Actions.create(`api/events/${id}/sendpush`, data)
  },
}

export const FaqsApi = {
  byEvent: async (id) => {
    return await Actions.getAll(`api/events/${id}/faqs`).then(({ data }) => data)
  },
  getOne: async (id, eventId) => {
    return await Actions.get(`api/events/${eventId}/faqs/`, id)
  },
  editOne: async (data, id, eventId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(
      `api/events/${eventId}/faqs/${id}/?token=${token}`,
      data,
      true,
    )
  },
  deleteOne: async (id, eventId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `api/events/${eventId}/faqs/${id}/?token=${token}`,
      '',
      true,
    )
  },
  create: async (data, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.create(`api/events/${id}/faqs/?token=${token}`, data, true)
  },
}

export const RolAttApi = {
  byEvent: async (event) => {
    const token = await GetTokenUserFirebase()
    const rollsByEvent = await Actions.getAll(
      `api/events/${event}/rolesattendees?token=${token}`,
      true,
    )

    /** Se discriminan estos dos rol id debido a que no se deben editar ni eliminar y aunque el back tiene dicha validacion en el componente CMS es dificil validar dicha accion ya que es un componente que se reutiliza varias veces y puede alterar la logica de otras funcionalidades, este arreglo es temporal mientras se estructura la logica para roles */

    const rollsByEventFiltered = rollsByEvent.filter(
      (rol) =>
        rol._id !== '5c1a59b2f33bd40bb67f2322' && rol._id !== '60e8a7e74f9fb74ccd00dc22',
    )
    return rollsByEventFiltered
  },
  byEventRolsGeneral: async () => {
    const token = await GetTokenUserFirebase()
    return await Actions.getAll(`api/rols?token=${token}`)
  },
  getOne: async (event, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.get(
      `api/events/${event}/rolesattendees/${id}/?token=${token}`,
      true,
    )
  },
  editOne: async (data, id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(
      `/api/events/${event}/rolesattendees/${id}?token=${token}`,
      data,
      true,
    )
  },
  deleteOne: async (id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `/api/events/${event}/rolesattendees/${id}?token=${token}`,
      '',
      true,
    )
  },
  create: async (data, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.create(`api/events/${event}/rolesattendees?token=${token}`, data)
  },
  getRoleHasPermissionsinThisEvent: async (rolId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.get(
      `api/rolespermissionsevents/findbyrol/${rolId}/?token=${token}`,
      true,
    )
  },
  ifTheRoleExists: async (rolId) => {
    const token = await GetTokenUserFirebase()
    try {
      return await Actions.get(`api/rols/${rolId}/rolseventspublic/?token=${token}`, true)
    } catch (error) {
      if (error?.response?.status === 404) return { type: 'the role does not exist' }
    }
  },
}

export const MessageApi = {
  byEvent: async (eventId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getAll(`api/events/${eventId}/messages/?token=${token}`, true)
  },
  getOne: async (id, eventId) => {
    /* return await Actions.get(`api/events/${eventId}/messages/`, id); */
    const token = await GetTokenUserFirebase()
    return await Actions.get(
      `/api/events/${eventId}/message/${id}/messageUser/?token=${token}`,
      true,
    )
  },
  updateOne: async (eventId, id) => {
    /* return await Actions.get(`api/events/${eventId}/messages/`, id); */
    const token = await GetTokenUserFirebase()
    return await Actions.put(
      `/api/events/${eventId}/updateStatusMessageUser/${id}?token=${token}`,
      true,
    )
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
}

export const SpacesApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/spaces`).then(({ data }) => data)
  },
  getOne: async (id, event) => {
    return await Actions.get(`api/events/${event}/spaces/`, id)
  },
  editOne: async (data, id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(
      `api/events/${event}/spaces/${id}?token=${token}`,
      data,
      true,
    )
  },
  deleteOne: async (id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `api/events/${event}/spaces/${id}?token=${token}`,
      '',
      true,
    )
  },
  create: async (data, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.create(`api/events/${event}/spaces?token=${token}`, data, true)
  },
}

export const ToolsApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/tools`).then(({ data }) => data)
  },
  getOne: async (id, event) => {
    return await Actions.get(`api/events/${event}/tools/`, id)
  },
  editOne: async (data, id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(
      `api/events/${event}/tools/${id}?token=${token}`,
      data,
      true,
    )
  },
  deleteOne: async (id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `api/events/${event}/tools/${id}?token=${token}`,
      '',
      true,
    )
  },
  create: async (data, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.create(`api/events/${event}/tools?token=${token}`, data, true)
  },
}

export const CategoriesAgendaApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/categoryactivities`).then(
      ({ data }) => data,
    )
  },
  getOne: async (id, event) => {
    return await Actions.getOne(`api/events/${event}/categoryactivities/`, id)
  },
  editOne: async (data, id, event) => {
    return await Actions.edit(`api/events/${event}/categoryactivities/${id}`, data, true)
  },
  deleteOne: async (id, event) => {
    return await Actions.delete(`api/events/${event}/categoryactivities`, id)
  },
  create: async (event, data) => {
    return await Actions.create(`api/events/${event}/categoryactivities`, data)
  },
}
export const TypesAgendaApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/type`).then(({ data }) => data)
  },
  getOne: async (id, event) => {
    return await Actions.getOne(`api/events/${event}/type/`, id)
  },
  editOne: async (data, id, event) => {
    return await Actions.edit(`api/events/${event}/type/${id}`, data, true)
  },
  deleteOne: async (id, event) => {
    return await Actions.delete(`api/events/${event}/type/`, id, true)
  },
  create: async (event, data) => {
    return await Actions.create(`api/events/${event}/type`, data)
  },
}
export const AgendaApi = {
  byEvent: async (event, query) => {
    return await Actions.getAll(
      `api/events/${event}/activities${query ? query : ''}`,
      true,
    )
  },
  usersByActivities: async (event) => {
    return await Actions.getAll(`api/events/${event}/activities_attendees`)
  },
  getOne: async (id, event) => {
    return await Actions.getOne(`api/events/${event}/activities/`, id)
  },
  editOne: async (data, id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(
      `api/events/${event}/activities/${id}?token=${token}`,
      data,
      true,
    )
  },
  deleteOne: async (id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(`api/events/${event}/activities`, `${id}?token=${token}`)
  },
  create: async (event, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.create(`api/events/${event}/activities?token=${token}`, data)
  },
  duplicate: async (event, data, id) => {
    return await Actions.create(`api/events/${event}/duplicateactivitie/${id}`, data)
  },
  zoomConference: async (event, id, data) => {
    return await Actions.create(`api/events/${event}/createmeeting/${id}`, data)
  },
}
export const SpeakersApi = {
  byEvent: async (event) => {
    return await Actions.getAll(`api/events/${event}/host`).then(({ data }) => data)
  },
  getOne: async (id, event) => {
    return await Actions.getOne(`api/events/${event}/host/`, id)
  },
  editOne: async (data, id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.edit(`api/events/${event}/host/${id}?token=${token}`, data, true)
  },
  deleteOne: async (id, event) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(`api/events/${event}/host`, `${id}?token=${token}`)
  },
  create: async (event, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.create(`api/events/${event}/host?token=${token}`, data, true)
  },
}

export const PlansApi = {
  getAll: async () => {
    return await Actions.getAll(`api/plans`, true)
  },
  getOne: async (id) => {
    return await Actions.getOne(`api/plans/`, id)
  },
  getTotalRegisterdUsers: async () => {
    const token = await GetTokenUserFirebase()
    return await Actions.get(`api/users/me/totaluser?token=${token}`, true)
  },
  getCurrentConsumptionPlanByUsers: async (userId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.get(`api/users/${userId}/currentPlan?token=${token}`, true)
  },
}

export const AlertsPlanApi = {
  getAll: async () => {
    return await Actions.getAll(`api/notfitications`, true)
  },
  getByUser: async (userId) => {
    //1ra objeto es el ultimo que se creo
    const token = await GetTokenUserFirebase()
    return await Actions.getAll(`api/users/${userId}/notifications?token=${token}`, true)
  },
  getOne: async (id) => {
    return await Actions.getOne(`api/notifications/`, id)
  },

  createOne: async (data) => {
    return await Actions.post(`api/notifications/`, data, true)
  },

  editOne: async (id, data) => {
    return await Actions.put(`api/notifications/${id}`, data, true)
  },

  deleteOne: async (userId, eventId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `api/users/${userId}/notifications/${eventId}`,
      `${userId}?token=${token}`,
    )
  },
}

export const BillssPlanApi = {
  getByUser: async (userId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.getAll(`api/users/${userId}/billings?token=${token}`, true)
  },
  getAddonByUser: async (userId) => {
    return await Actions.get(`api/users/${userId}/addons`)
  },
}

export const OrganizationPlantillaApi = {
  createTemplate: async (organization, data) => {
    const token = await GetTokenUserFirebase()
    return await Actions.post(
      `api/organizations/${organization}/templateproperties?token=${token}`,
      data,
    )
  },

  byEvent: async (organization) => {
    const token = await GetTokenUserFirebase()
    return await Actions.get(
      `api/organizations/${organization}/templateproperties?token=${token}`,
    )
  },
  putOne: async (event, templatepropertie) => {
    const token = await GetTokenUserFirebase()
    return await Actions.put(
      `api/events/${event}/templateproperties/${templatepropertie}/addtemplateporperties?token=${token}`,
    )
  },
  deleteOne: async (template, organization) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `api/organizations/${organization}/templateproperties`,
      `${template}?token=${token}`,
    )
  },
}

export const ExternalSurvey = async (meeting_id) => {
  return await Actions.get(`${ApiEviusZoomSurvey}/?meeting_id=${meeting_id}`)
}

export const Activity = {
  Register: async (event, user_id, activity_id) => {
    const token = await GetTokenUserFirebase()
    const info = {
      event_id: event,
      user_id,
      activity_id,
    }
    return await Actions.create(
      `api/events/${event}/activities_attendees/?token=${token}`,
      info,
    )
  },
  GetUserActivity: async (event, user_id) => {
    return await Actions.get(
      `api/events/${event}/activities_attendees?user_id=${user_id}`,
    )
  },

  getActivyAssitants: async (event, activity_id) => {
    return await Actions.get(
      `api/events/${event}/activities_attendees?activity_id=` + activity_id,
    )
  },
  getActivyAssitantsAdmin: async (event, activity_id) => {
    return await Actions.get(
      `api/events/${event}/activities_attendeesAdmin?activity_id=` + activity_id,
    )
  },

  checkInAttendeeActivity: async (event_id, activity_id, user_id) => {
    const token = await GetTokenUserFirebase()
    const data = {
      user_id,
      activity_id,
      checkedin_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
    const result = await Actions.put(
      `api/events/${event_id}/activities_attendees/checkin?token=${token}`,
      data,
    )
    return result
  },

  DeleteRegister: async (event, id) => {
    const token = await GetTokenUserFirebase()
    return await Actions.delete(
      `api/events/${event}/activities_attendees`,
      `${id}?token=${token}`,
    )
  },

  Update: async (event, user_id, data) => {
    const token = await GetTokenUserFirebase()
    // const info = {
    //   event_id: event,
    //   user_id,
    //   // activity_id,
    // }
    return await Actions.put(
      `api/events/${event}/activities_attendees/${user_id}?token=${token}`,
      data,
    )
  },
  addCheckIn: async (eventUser_id, checkInType, activityId) => {
    const token = await GetTokenUserFirebase()
    const checkedin_type = checkInType
    return await Actions.put(
      `/api/eventUsers/${eventUser_id}/checkinactivity/${activityId}?token=${token}`,
      { checkedin_type },
      true,
    )
  },
  deleteCheckIn: async (eventUser_id, activityId) => {
    const token = await GetTokenUserFirebase()

    return await Actions.put(
      `api/eventUsers/${eventUser_id}/uncheckinactivity/${activityId}?token=${token}`,
      {},
      true,
    )
  },
}

export const Networking = {
  getInvitationsReceived: async (eventId, userId) => {
    const token = await GetTokenUserFirebase()
    console.log('OBTENINENDO INVITACIONES===>')
    return await Actions.get(
      `api/events/${eventId}/indexinvitationsrecieved/${userId}?token=${token}`,
    )
  },
  getInvitationsSent: async (eventId, userId) => {
    const token = await GetTokenUserFirebase()
    return await Actions.get(
      `api/events/${eventId}/indexinvitations/${userId}?token=${token}`,
    )
  },
  acceptOrDeclineInvitation: async (eventId, userId, data) => {
    return await Actions.put(`/api/events/${eventId}/acceptordecline/${userId}`, data)
  },
  getContactList: async (eventId, userId) => {
    return await Actions.getOne(`/api/events/${eventId}/contactlist/`, userId)
  },
}

export const countryApi = {
  getCountries: async () => {
    return countryInstance.get('/countries').then(({ data }) => data)
  },
  getCountry: async (id) => {
    return countryInstance.get(`/countries/${id}`).then(({ data }) => data)
  },
  getStates: async () => {
    return countryInstance.get(`/states`).then(({ data }) => data)
  },
  getStatesByCountry: async (id) => {
    return countryInstance.get(`/countries/${id}/states`).then(({ data }) => data)
  },

  getCitiesByCountry: async (id) => {
    return countryInstance.get(`/countries/${id}/cities`).then(({ data }) => data)
  },

  getCities: async (country, state) => {
    return countryInstance
      .get(`/countries/${country}/states/${state}/cities`)
      .then(({ data }) => data)
  },
}

export const ActivityBySpeaker = {
  byEvent: async (event, idSpeaker) => {
    return await Actions.getOne(`api/events/${event}/activitiesbyhost/`, idSpeaker)
  },
}

export const OrganizationFuction = {
  // OBTENER CURSOS PROXIMOS POR ORGANIZACION
  getEventsNextByOrg: async (orgId) => {
    const events = await Actions.getAll(`api/organizations/${orgId}/events`)
    return events.data
  },

  // OBTENER DATOS DE LA ORGANIZACION
  obtenerDatosOrganizacion: async (orgId) => {
    const organization = await OrganizationApi.getOne(orgId)
    return organization
  },
}
//ENDPOINT PARA CREAR ORDENES
export const OrderFunctions = {
  createOrder: async (data) => {
    return await Actions.post(`/api/orders`, data)
  },
}

// Endpoint for position handlering
export const PositionsApi = {
  getAll: async () => {
    return await Actions.getAll('/api/positions', true)
  },
  getAllByOrganization: async (organizationId) => {
    return await Actions.getAll(
      `/api/positions?organization_id=${organizationId || ''}`,
      true,
    )
  },
  getOne: async (positionId) => {
    return await Actions.get(`api/positions/${positionId}`, true)
  },
  getOneByOrganization: async (positionId, organizationId) => {
    return await Actions.get(
      `api/positions/${positionId}?organization_id=${organizationId || ''}`,
      true,
    )
  },
  create: async (data) => {
    return await Actions.create('/api/positions', data, true)
  },
  delete: async (positionId) => {
    return await Actions.delete('api/positions/', positionId, true)
  },
  update: async (positionId, data) => {
    return await Actions.put(`api/positions/${positionId}`, data, true)
  },
  Organizations: {
    getUsers: async (organizationId, positionId) => {
      return await Actions.get(
        `api/positions/${positionId}/organization/${organizationId}/users`,
        true,
      )
    },
    addUser: async (organizationId, positionId, userId) => {
      const data = { user_id: userId }
      return await Actions.post(
        `api/positions/${positionId}/organization/${organizationId}/users`,
        data,
        true,
      )
    },
    deleteUser: async (organizationId, positionId, userId) => {
      return await Actions.delete(
        `api/positions/${positionId}/organization/${organizationId}/users/`,
        userId,
        true,
      )
    },
  },
}

// Endpoint for module handlering
export const ModulesApi = {
  getAll: async () => {
    return await Actions.getAll('api/modules', true)
  },
  getOne: async (moduleId) => {
    return await Actions.get(`api/modules/${moduleId}`, true)
  },
  create: async (moduleName, eventId) => {
    const data = {
      module_name: moduleName,
      event_id: eventId || undefined,
    }
    return await Actions.create('/api/modules', data, true)
  },
  deleteOne: async (moduleId) => {
    return await Actions.delete('api/modules/', moduleId, true)
  },
  update: async (moduleId, moduleName, order) => {
    const data = {
      module_name: moduleName,
      order: order || 0,
    }
    return await Actions.put(`api/modules/${moduleId}`, data, true)
  },
  getActivities: async (moduleId) => {
    return await Actions.get(`api/modules/${moduleId}/activities`, true)
  },
  setActivities: async (moduleId, activityIds) => {
    const data = {
      activity_ids: activityIds,
    }
    return await Actions.put(`api/modules/${moduleId}/activities`, data, true)
  },
  getModulesForActivity: async (activityId) => {
    return await Actions.get(`api/modules/activity/${activityId}/modules`, true)
  },
  getModulesForNoActivity: async (eventId) => {
    return await Actions.get(
      `api/modules/event/${eventId}/with-no-module/activities`,
      true,
    )
  },
  byEvent: async (eventId, query) => {
    console.log('byEvent', eventId, 'query', query)
    return await Actions.get(`api/modules/event/${eventId}/modules`, true)
  },
}

// Endpoint for certification logs handlering
export const CerticationLogsApi = {
  getAll: async () => {
    return await Actions.getAll('api/certification-logs', true)
  },
  getOne: async (certificationLogID) => {
    return await Actions.get(`api/certification-logs/${certificationLogID}`, true)
  },
  create: async (data) => {
    return await Actions.create('/api/certification-logs', data, true)
  },
  deleteOne: async (certificationLogID) => {
    return await Actions.delete('api/certification-logs/', certificationLogID, true)
  },
  update: async (certificationLogID, data) => {
    return await Actions.put(`api/certification-logs/${certificationLogID}`, data, true)
  },
  byEvent: async (eventId, query) => {
    console.log('byEvent', eventId, 'query', query)
    return await Actions.get(
      `api/certification-logs/event-certification-logs/${eventId}`,
      true,
    )
  },
}

// Endpoints for certifications handlering
export const CerticationsApi = {
  getAll: async (organizationId) => {
    return await Actions.getAll(`api/certifications/${organizationId}`, true)
  },
  getOne: async (certificationID) => {
    return await Actions.get(`api/certifications/${certificationID}`, true)
  },
  create: async (data) => {
    return await Actions.create('/api/certifications', data, true)
  },
  deleteOne: async (certificationID) => {
    return await Actions.delete('api/certifications/', certificationID, true)
  },
  update: async (certificationID, data) => {
    return await Actions.put(`api/certifications/${certificationID}`, data, true)
  },
  getByUserAndEvent: async (userId, eventId) => {
    return await Actions.getAll(
      `api/certifications?user_id=${userId || ''}&event_id=${eventId || ''}`,
      true,
    )
  },
  /**
   * Requests all the certifications for an specify position events and (maybe) an user
   * @param {string} positionId The position ID
   * @param {string} [userId] The user ID
   * @returns A certification list for this position and (maybe) this user
   */
  getByPositionAndMaybeUser: async (positionId, userId) => {
    let url = `api/certifications/by-position/${positionId}`
    if (userId) {
      url = `${url}?user_id=${userId}`
    }
    return await Actions.getAll(url, true)
  },
}

export default privateInstance
window.EventsApi = EventsApi
window.PositionsApi = PositionsApi
window.OrganizationApi = OrganizationApi
window.TicketsApi = TicketsApi
window.ModulesApi = ModulesApi
window.AgendaApi = AgendaApi
window.UsersApi = UsersApi
window.CerticationLogsApi = CerticationLogsApi
window.CerticationsApi = CerticationsApi
