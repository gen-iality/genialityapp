//Función para generar UUID
export function uniqueID(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}
//Función para organizar las opciones de las listas desplegables (Organizado,Tipo,Categoría)
export function fieldsSelect(options,list){
    if(Array.isArray(options))
        return options.map(option=> list.find(({value})=> value === option._id));
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
