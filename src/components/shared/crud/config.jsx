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
                type: "htmlEditor",
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
            //El numero de elementos de header y fieldsTable deben de ser los mismo , tienen un relacion por la posicion de cada uno
            headers:     [ "Imagen",  "Nombre", "Posicion", "Compañia", "Pais", "acciones"],
            fieldsTable: [ "picture", "name",   "position", "company", "country", "acciones"],
         
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
                name: "date",
                edit: false,
                label: "Fecha",
                mandatory: true,
                type: "date",
                unique: false
            },
            {
                name: "timeStart",
                edit: false,
                label: "Hora inicio",
                mandatory: true,
                type: "time",
                unique: false
            },
            {
                name: "timeEnd",
                edit: false,
                label: "Hora final",
                mandatory: true,
                type: "time",
                unique: false
            },
            {
                name: "description",
                edit: false,
                label: "Descripción",
                mandatory: false,
                type: "htmlEditor",
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
             //El numero de elementos de header y fieldsTable deben de ser los mismo , tienen un relacion por la posicion de cada uno
             headers:     [ "Imagen",  "Nombre",  'Fecha','Hora',"acciones"],
             fieldsTable: [ "picture", "name",  'date', 'time',"acciones"],
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