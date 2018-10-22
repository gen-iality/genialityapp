export const ApiUrl  = 'https://master-7rqtwti-xltfrs52r6yyg.us-2.platformsh.site/';
export const AuthUrl = process.env.REACT_APP_AUTH_URL;
export const BaseUrl = process.env.REACT_APP_BASE_URL;

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