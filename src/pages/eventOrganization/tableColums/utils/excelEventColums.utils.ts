import { ExcelEventColumn } from "../interfaces/ExcelEvent.interface";

export const EventExcelColums:ExcelEventColumn[] =[
    {
        title:'Codigo',
        dataIndex:'_id'
    },
    {
        title:'Nombre',
        dataIndex:'name'
    },
    {
        title:'Fecha Inicio',
        dataIndex:'startDate'
    },
    {
        title:'Conferencista',
        dataIndex:'speaker',
    },
    {
        title:'Usuarios inscritos',
        dataIndex:'count',
    },
    {
        title:'Documentos',
        dataIndex:'documentsUrls',
    },
    {
        title:'Url de videos',
        dataIndex:'videoUrls',
    },
]