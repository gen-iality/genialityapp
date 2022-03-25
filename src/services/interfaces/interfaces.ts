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
  key: string;
}

export interface isError {
  status: boolean;
  message: string;
}

export interface EventInterface {
  _id: string;
}

export interface multipleRequest {
  keys: string[];
  methods: string[];
  requests: string[];
  withCredentials: boolean[];
  payloads: any[];
}
