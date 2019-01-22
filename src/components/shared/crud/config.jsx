const configCrud = {

    speakers: {
        
        //Configuracion de las urls para realizar las peticiones para realiazar las peticiones 
        urls: {
            get: 'youo',
            post: 'jdlj',
            update: 'kfjdj',
            delete: 'delete'
        },
        fieldsTable: {

        },
        fieldsModal:[
            {
                name: "Nombres",
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
        UpdateAndCreate: {

        }
    }



}
export default configCrud;