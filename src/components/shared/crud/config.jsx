const configCrud = {

    speakers: {
        
        //Configuracion de las urls para realizar las peticiones para realiazar las peticiones 
      
        fieldsTable: {

        },
        fieldsModal:[
            {
                name: "name",
                edit: false,
                label: "Nombre",
                mandatory: true,
                type: "text",
                unique: false
            },
            {
                name: "position",
                edit: false,
                label: "Cargo",
                mandatory: false,
                type: "text",
                unique: false
            },
            {
                name: "company",
                edit: false,
                label: "Empresa/Organización",
                mandatory: false,
                type: "text",
                unique: false
            },
            {
                name: "country",
                edit: false,
                label: "País",
                manadatory: false,
                type: "text",
                unique: false
            },
            {
                name: "description",
                edit: false,
                label: "Descripción",
                mandatory: false,
                type: "text",
                unique: false
            },
            {
                name: "picture",
                edit: false,
                label: "Imagen",
                mandatory: false,
                type: "image",
                unique: false
            }

        ],
        ListCrud:{
            headers: ["_id", "name", "updated_at", "created_at","actions"],
            urls: {
                getAll: (eventId) =>  `api/events/${eventId}/speakers`,
                create: (eventId) =>  `api/events/${eventId}/speakers`,
                getOne: (eventId) =>  `api/events/${eventId}/speakers`,
                update: 'kfjdj',
                delete: (eventId) =>  `api/events/${eventId}/speakers`,
            },
        },
        UpdateAndCreate: {

        }
    }



}
export default configCrud;