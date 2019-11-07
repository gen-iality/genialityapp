//Función para generar UUID
import Swal from "sweetalert2";
import {Actions} from "./request";

export function uniqueID(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}
//Función para organizar las opciones de las listas desplegables (Organizado,Tipo,Categoría)
export function fieldsSelect(options,list){
    if(Array.isArray(options))
        return options.map(option=> list.find(({value})=> value === option));
    else
        return list.find(({value})=> value === options);
}

export function handleSelect(data) {
    let list = [];
    data.map(item=>{
        return list.push({value:item._id,label:item.name,item})
    });
    return list;
}

export function loadImage(src,cb){
    const i = new Image();
    i.onload = () => {
        let reader = new FileReader();
        reader.readAsDataURL(src);
        reader.onload = () => cb(reader.result)
    };
    i.src = src.preview
}

export function uploadImage(file){
    return new Promise((resolve, reject) => {
        let data = new FormData();
        data.append('file',file);
        Actions.post("/api/files/upload", data)
            .then((image) => resolve(image))
            .catch(e => reject(e));
    })
}

export function handleRequestError(error) {
    const info = {};
    if (error.response) {
        info.status = error.response.status;
        info.message = error.response.data.message ? error.response.data.message : JSON.stringify(error.response.data);
    } else if (error.request) {
        info.status = 700;
        info.message = 'Network Error';
    } else {
        info.status = 800;
        info.message = error.message;
    }
    console.log(error);
    return info;
}

export const sweetAlert = {
    showLoading : (title,text) => Swal.fire({title, text, onBeforeOpen: () => {Swal.showLoading()}}),
    hideLoading : () => Swal.close(),
    twoButton   : (title,type,showCancelButton,confirmButtonText,cb) => Swal.fire({title,type,showCancelButton,confirmButtonText}).then((result)=>cb(result)),
    showSuccess : (title, text) => Swal.fire({title, text, type: "success"}),
    showError   : (error) => Swal.fire({title:error.status, text:error.message, type: "error"}),
}
