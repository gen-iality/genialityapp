export const ApiUrl  = 'https://master-7rqtwti-xltfrs52r6yyg.us-2.platformsh.site/';
//export const ApiUrl  = 'https://dev.mocionsoft.com/evius/eviusapilaravel/public';
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
export const states = [
    {_id:"5b0efc411d18160bce9bc706",name:"DRAFT"},
    {_id:"5b859ed02039276ce2b996f0",name:"BOOKED"},
    {_id:"5ba8d200aac5b12a5a8ce748",name:"RESERVED"},
    {_id:"5ba8d213aac5b12a5a8ce749",name:"INVITED"}
];
export const roles = [
    {_id:"5af21f366ccde22b0776929d",name:"administrator"},
    {_id:"5afaf644500a7104f77189cd",name:"Attendee"},
    {_id:"5afaf657500a7104f77189ce",name:"checki-in"},
    {_id:"5afb0efc500a7104f77189cf",name:"Super Admin"}
];