import axios from 'axios';
import { ApiUrl } from './constants';
import * as Cookie from 'js-cookie';

const publicInstance = axios.create({
    url: ApiUrl,
    baseURL: ApiUrl,
});
const privateInstance = axios.create({
    url: ApiUrl,
    baseURL: ApiUrl,
    withCredentials: true
});
let evius_token = Cookie.get('evius_token');
if (evius_token){
    privateInstance.defaults.params = {}
    privateInstance.defaults.params['evius_token'] = evius_token;
}
privateInstance.interceptors.response.use((response)=> {
    const {headers} = response;
    if(headers.new_token){
        console.log('Se acabó la moneda');
        Cookie.set("evius_token", headers.new_token);
        privateInstance.defaults.params = {};
        privateInstance.defaults.params['evius_token'] = headers.new_token;
    }
    return response
})

export const Actions = {
    create: (url, data, unsafe) => {
        if(unsafe) return publicInstance.post(url, data).then(({data})=>data);
        return privateInstance.post(url, data).then(({data})=>data);
    },
    delete: (url, id, unsafe) => {
        if(unsafe) return publicInstance.delete(`${url}${id}`).then(({data})=>data);
        return privateInstance.delete(`${url}/${id}`).then(({data})=>data);
    },
    edit: (url, data, id, unsafe) => {
        if(unsafe) return publicInstance.put(`${url}${id}`, data).then(({data})=>data);
        return privateInstance.put(`${url}/${id}`, data).then(({data})=>data);
    },
    post: (url, data, unsafe) => {
        if(unsafe) return publicInstance.post(url,data).then(({data})=>data);
        return privateInstance.post(url,data).then(({data})=>data);
    },
    get: (url, unsafe) => {
        if(unsafe) return publicInstance.get(url).then(({data})=>data);
        return privateInstance.get(url).then(({data})=>data);
    },
    put: (url, data, unsafe) => {
        if(unsafe) return publicInstance.put(url,data).then(({data})=>data);
        return privateInstance.put(url,data).then(({data})=>data);
    },
    getOne: (url, id, unsafe) => {
        if(unsafe) return publicInstance.get(`${url}${id}`).then(({data})=>data);
        return privateInstance.get(`${url}${id}`).then(({data})=>data);
    },
    getAll: (url, unsafe) => {
        if(unsafe) return publicInstance.get(`${url}`).then(({data})=>data);
        return privateInstance.get(`${url}`).then(({data})=>data);
    }
};
export const EventsApi = {
    getPublic: async(query) => {
      return await Actions.getAll(`/api/events${query}`,true)
    },
    landingEvent: async(id) => {
      return await Actions.getOne('/api/events/', id, true);
    },
    invitations: async(id) => {
        return await Actions.getOne(`/api/events/${id}/`, 'invitations');
    },
    sendRsvp:async (data, id) => {
        return await Actions.post(`/api/rsvp/sendeventrsvp/${id}`, data)
    },
    mine: async () => {
        const events = await Actions.getAll('/api/me/contributors/events');
        return events
    },
    getOne: async (id) => {
        return await Actions.getOne('/api/events/', id)
    },
    editOne: async (data, id) => {
        return await Actions.edit('/api/events', data, id)
    },
    deleteOne: async (id) => {
        return await Actions.delete('/api/events/', id);
    },
};
export const UsersApi = {
    getAll: async (id) => {
        return await Actions.getAll(`/api/events/${id}/eventUsers`)
    },
    getProfile: async (id) => {
        return await Actions.getOne('/api/users/', id)
    },
    editProfile: async (data,id) => {
        return await Actions.edit('/api/users/', data, id)
    },
    findByEmail: async(email) => {
        return await Actions.getOne(`api/users/findByEmail/`,email)
    },
    mineTickets: async () => {
        return await Actions.getAll(`/api/me/eventUsers`)
    },
    mineOrdes: async (id) => {
        return await Actions.getAll(`/api/users/${id}/orders`)
    },
    createOne: async (data, id) => {
        return await Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${id}`,data)
    },
    deleteOne: async (user, id) => {
        return await Actions.delete(`/api/user/events/${id}`, user);
    }
};
export const CategoriesApi = {
    getAll: async () => {
        const resp = await Actions.getAll('api/categories');
        return handleCat(resp.data)
    }
};
export const TypesApi = {
    getAll: async () => {
        const resp = await Actions.getAll('api/eventTypes');
        return handleCat(resp.data)
    }
};
export const OrganizationApi = {
    mine: async () => {
        const resp = await Actions.getAll('api/me/organizations');
        let data = resp.data.map((item)=>{
            return {id:item._id,name:item.name}
        })
        return data
    },
    getOne: async (id) => {
        return await Actions.getOne('/api/organizations/', id)
    },
    editOne: async (data, id) => {
        return await Actions.edit('/api/organizations', data, id)
    },
    events: async (id) => {
        return await Actions.getOne(`/api/organizations/${id}/`, 'events')
    },
    getUsers: async (id) => {
        return await Actions.get(`/api/organizations/${id}/users`)
    },
    getUser: async (org,member) => {
        return await Actions.getOne(`/api/organizations/${org}/users/`,member)
    },
    saveUser: async (org,data) => {
        return await Actions.post(`/api/organizations/${org}/users`,data)
    },
    editUser: async (org,member,data) => {
        return await Actions.edit(`/api/organizations/${org}/users`,data,member)
    },
    deleteUser: async (org,member) => {
        return await Actions.delete(`/api/organizations/${org}/users/`,member)
    },
};
export const BadgeApi = {
    create: async(data) => {
        return await Actions.post(`/api/escarapelas`,data)
    },
    edit: async(data,id) => {
        return await Actions.edit('/api/escarapelas/', data, id)
    },
    get: async (id) => {
        return await Actions.getOne('/api/escarapelas/', id)
    }

};
export const HelperApi = {
    listHelper: async(id) => {
        return await Actions.getOne(`api/contributors/events/`,id)
    },
    rolesOne: async(event) => {
        return await Actions.get(`api/contributors/events/${event}/me`)
    },
    saveHelper: async(data) => {
        return await Actions.post(`api/contributors`,data)
    },
    editHelper: async(id,data) => {
        return await Actions.put(`api/contributors/${id}`,data)
    },
    removeHelper: async(id) => {
        return await Actions.delete(`api/contributors/`,id)
    }
};
const handleCat = (data) => {
    let list = [];
    data.map(item=>{
        return list.push({value:item._id,label:item.name})
    })
    return list;
};
// export const SpeakersApi = {
//     getList: async(eventId) => {
//         return await Actions.getAll(`api/events/${eventId}/speakers`);
//     },
//     createSpeaker: async(data, eventId) => {
//         console.log('data: ', data);
//         console.log("here in request", eventId);
//         return
//         return await Actions.post('api/speakers', data);
//     }
// };

export default privateInstance;
