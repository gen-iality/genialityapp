const configCrud = {

    speakers: {
        
        //Configuracion de las urls para realizar las peticiones para realiazar las peticiones 
      
        fieldsTable: {

        },
        fieldsModal:[
            {
                name: "Nombre",
                edit: false,
                mandatory: true,
                type: "text",
                unique: false
            },
            {
                name: "Cargo",
                edit: false,
                mandatory: false,
                type: "text",
                unique: false
            },
            {
                name: "Empresa/Organización",
                edit: false,
                mandatory: false,
                type: "text",
                unique: false
            },
            {
                name: "País",
                edit: false,
                manadatory: false,
                type: "text",
                unique: false
            },
            {
                name: "Descripción",
                edit: false,
                mandatory: false,
                type: "text",
                unique: false
            }
        ],
        ListCrud:{
            headers: ["_id", "name", "updated_at", "created_at"],
            urls: {
                getAll: (eventId) =>  `api/events/${eventId}/speakers`,
                create: (eventId) =>  `api/events/${eventId}/speakers`,
                post: 'jdlj',
                update: 'kfjdj',
                delete: 'delete'
            },
        },
        UpdateAndCreate: {

        }
    }



}
export default configCrud;