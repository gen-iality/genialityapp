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
            headers: ["_id", "name", "position", "company", "country", "description", "picture", "event_id", "updated_at", "created_at", "acciones"],
            urls: {
                getAll: (eventId) =>  `api/events/${eventId}/speakers`,
                create: (eventId) =>  `api/events/${eventId}/speakers`,
                getOne: (eventId) =>  `api/events/${eventId}/speakers`,
                edit : (eventId) =>  `api/events/${eventId}/speakers`,
                delete: (eventId) =>  `api/events/${eventId}/speakers`,
            },
        },
        UpdateAndCreate: {

        }
    },


    programme: {
        
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
            headers: ["_id", "name", "position", "company", "country", "description", "picture", "event_id", "updated_at", "created_at"],
            urls: {
                getAll: (eventId) =>  `api/events/${eventId}/sessions`,
                create: (eventId) =>  `api/events/${eventId}/sessions`,
                getOne: (eventId) =>  `api/events/${eventId}/sessions`,
                edit : (eventId) =>  `api/events/${eventId}/sessions`,
                delete: (eventId) =>  `api/events/${eventId}/sessions`,
            },
        },
        UpdateAndCreate: {

        }
    }

}
export default configCrud;