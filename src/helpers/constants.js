// export const ApiUrl = 'http://localhost:8000'
export const ApiUrl  = 'http://dev.mocionsoft.com/evius/eviusapilaravel/public';
//export const AuthUrl = 'http://dev.mocionsoft.com:3010';
export const AuthUrl = 'http://localhost:3010';

export const parseUrl = (url) => {
    try {
        let temporal = {};
        ((url.split("?")[1]).split("&")).map((obj)=>{
            return temporal[obj.split("=")[0]]=obj.split("=")[1];
        })
        return temporal;
    } catch (error) {
        return {};
    }
}
export const parseCookies = (cookies) => {
    let temporal = [];
    (cookies.split("&")).map((obj)=>{
        return temporal.push({ [obj.split("=")[0]]:obj.split("=")[1] })
    })
    return temporal;
}