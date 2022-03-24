export interface PublicInstance {
  url: string;
  baseURL: string;
  pushURL: string;
}

export interface PrivateInstance {
  url: string;
  baseURL: string;
  withCredentials: boolean;
}

export interface ApiService {
  withCredentials: boolean;
  payload: any;
  method: 'get' | 'post' | 'put' | 'delete';
  request: any;
}
