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

export const Actions = {
    create: (url, data, unsafe) => {
        if(unsafe) return publicInstance.post(url, data).then(({data})=>data);
        return privateInstance.post(url, data).then(({data})=>data);
    },
    delete: (url, id, unsafe) => {
        if(unsafe) return publicInstance.delete(`${url}${id}`);
        return privateInstance.delete(`${url}${id}`);
    },
    edit: (url, data, id, unsafe) => {
        if(unsafe) return publicInstance.put(`${url}${id}`, data).then(({data})=>data);
        return privateInstance.put(`${url}${id}`, data).then(({data})=>data);
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
    getPublic: async() => {
      return await Actions.getAll('/api/events',true)
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
        return await Actions.getAll('/api/me/events')
    },
    getOne: async (id) => {
        return await Actions.getOne('/api/events/', id)
    },
    editOne: async (data, id) => {
        return await Actions.edit('/api/events/', data, id)
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
    editOne: async (data, id) => {
        return await Actions.edit(`/api/eventUsers/${id}/`,data,'withStatus')
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
    events: async (id) => {
        return await Actions.getOne(`/api/organizations/${id}/`, 'events')
    }
};
const handleCat = (data) => {
    let list = [];
    data.map(item=>{
        return list.push({value:item._id,label:item.name})
    })
    return list;
};

export default privateInstance;