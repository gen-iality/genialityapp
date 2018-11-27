import React from "react";

export const ApiUrl  = 'https://api.evius.co';
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
export const networks = [
    {name:'Facebook',path:'facebook',icon: <i className="fab fa-facebook"></i>},
    {name:'Twitter',path:'twitter',icon:<i className="fab fa-twitter"></i>},
    {name:'Instagram',path:'instagram',icon:<i className="fab fa-instagram"></i>},
    {name:'LinkedIn',path:'linkedIn',icon:<i className="fab fa-linkedin"></i>},
];