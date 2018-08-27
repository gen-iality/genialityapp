import axios from 'axios';
import { ApiUrl } from './constants';
import * as Cookie from 'js-cookie';

axios.defaults.baseURL = ApiUrl;
axios.defaults.withCredentials = true;
/*axios.interceptors.response.use(function(response) {
    // Do something with response data
    console.log(response);
    if (
        response &&
        response.data &&
        typeof response.data === 'string' &&
        response.data.indexOf(401) !== -1
    ) {
        Cookie.remove('token');
        window.location.replace(`${AuthUrl}/logout`);
        return [];
    } else {
        return response;
    }
}, ( err ) => {
    const { data } = err.response;
    console.log(data);
});*/
let evius_token = Cookie.get('evius_token');
console.log("evius_token");
if (evius_token){
    axios.defaults.params = {}
    axios.defaults.params['evius_token'] = evius_token;
}

export const Actions = {
    create: function(url, data) {
        return axios.post(url, data).then(({data})=>data);
    },
    delete: (url, id) => {
        return axios.delete(`${url}${id}`);
    },
    edit: (url, data, id) => {
        return axios.put(`${url}${id}`, data).then(data);
    },
    post: (url, data) => {
        return axios.post(url,data).then(({data})=>data);
    },
    getOne: (url, id) => {
        return axios.get(`${url}${id}`).then(({data})=>data);
    },
    getAll: (url) => {
        return axios.get(`${url}`).then(({data})=>data);
    }
};