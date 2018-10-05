import axios from 'axios';
import { ApiUrl, AuthUrl } from './constants';
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
privateInstance.interceptors.response.use(function(response) {
    // Do something with response data
    console.log(response);
    if (
        response &&
        response.data &&
        typeof response.data === 'string' &&
        response.data.indexOf(401) !== -1
    ) {
        Cookie.remove('evius_token');
        window.location.replace(`${AuthUrl}/logout`);
        return [];
    } else {
        return response;
    }
}, ( err ) => {
    console.log(err.response);
    return err.response;
    /*const { data } = err.response;
    console.log(data);
    window.location.replace(`${AuthUrl}/logout`);*/
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
        if(unsafe) return publicInstance.put(`${url}${id}`, data).then(data);
        return privateInstance.put(`${url}${id}`, data).then(data);
    },
    post: (url, data, unsafe) => {
        if(unsafe) return publicInstance.post(url,data).then(({data})=>data);
        return privateInstance.post(url,data).then(({data})=>data);
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
    getAll: async () => {
        return await Actions.getAll('/api/user/events')
    },
    getOne: async (id) => {
        return await Actions.getOne('/api/user/events/', id)
    },
    editOne: async (data, id) => {
        return await Actions.edit('/api/user/events/', data, id)
    },
    deleteOne: async (id) => {
        return await Actions.delete('/api/user/events/', id);
    },
};
export const UsersApi = {
    getAll: async (id) => {
        return await Actions.getAll(`/api/events/${id}/eventUsers`)
    },
    editOne: async (data, id) => {
        return await Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${id}`,data)
    },
    deleteOne: async (user, id) => {
        return await Actions.delete(`/api/user/events/${id}`, user);
    }
};
export const CategoriesApi = {
    getAll: async () => {
        const resp = await Actions.getAll('api/category');
        return handleCat(resp.data)
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